
import { useState, useEffect, useRef } from 'react';
import { Persona, Conversation, Message, AppState } from '../types';
import { INITIAL_PERSONAS, GENAI_MODELS } from '../constants';
import { geminiService, decode, decodeAudioData, encode } from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

export const useDominiChat = (initialContext?: string) => {
    const [personas, setPersonas] = useState<Persona[]>(() => {
        const saved = localStorage.getItem('buddy_personas');
        if (!saved) return INITIAL_PERSONAS;
        const savedPersonas: Persona[] = JSON.parse(saved);
        const userPersonas = savedPersonas.filter(p => !p.id.startsWith('default-'));
        return [...INITIAL_PERSONAS, ...userPersonas];
    });

    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const saved = localStorage.getItem('buddy_conversations');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [view, setView] = useState<AppState>('home');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLiveActive, setIsLiveActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isPTTActive, setIsPTTActive] = useState(false);

    const liveSessionRef = useRef<any>(null);
    const cleanupLiveRef = useRef<(() => void) | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    const isListeningRef = useRef(false);
    const isPTTActiveRef = useRef(false);
    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    useEffect(() => {
        isPTTActiveRef.current = isPTTActive;
    }, [isPTTActive]);

    useEffect(() => {
        localStorage.setItem('buddy_personas', JSON.stringify(personas));
    }, [personas]);

    useEffect(() => {
        localStorage.setItem('buddy_conversations', JSON.stringify(conversations));
    }, [conversations]);

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activePersona = activeConversation
        ? personas.find(p => p.id === activeConversation.personaId)
        : null;

    const resetToDefaults = () => {
        if (confirm('Czy na pewno chcesz zresetować wszystkie persony do ustawień domyślnych? Twoje własne persony zostaną zachowane, ale domyślne zostaną nadpisane.')) {
            const userPersonas = personas.filter(p => !p.id.startsWith('default-'));
            setPersonas([...INITIAL_PERSONAS, ...userPersonas]);
        }
    };

    const handleCreatePersona = (newPersona: Omit<Persona, 'id'>) => {
        const persona: Persona = { ...newPersona, id: Date.now().toString() };
        setPersonas([...personas, persona]);
        setView('persona-config');
    };

    const handleDeletePersona = (id: string) => {
        setPersonas(personas.filter(p => p.id !== id));
    };

    const startNewConversation = (personaId: string) => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            personaId,
            messages: [],
            createdAt: Date.now(),
        };
        setConversations([newConv, ...conversations]);
        setActiveConversationId(newConv.id);
        setView('chat');
        setIsNewChatModalOpen(false);
    };

    const startLiveSession = async (autoListen = false) => {
        if (!activePersona || !activeConversation) return;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const ai = new GoogleGenAI({ apiKey });
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = outputCtx;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const sessionPromise = ai.live.connect({
                model: GENAI_MODELS.LIVE,
                callbacks: {
                    onopen: () => {
                        setIsLiveActive(true);
                        if (autoListen) setIsListening(true);

                        const source = inputCtx.createMediaStreamSource(stream);
                        const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);

                        scriptProcessor.onaudioprocess = (e) => {
                            if (!isListeningRef.current && !isPTTActiveRef.current) return;
                            const inputData = e.inputBuffer.getChannelData(0);
                            const int16 = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };

                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputCtx.destination);

                        cleanupLiveRef.current = () => {
                            source.disconnect();
                            scriptProcessor.disconnect();
                            stream.getTracks().forEach(t => t.stop());
                            inputCtx.close();
                        };
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const uText = currentInputTranscription.current.trim();
                            const mText = currentOutputTranscription.current.trim();

                            if (uText || mText) {
                                setConversations(prev => prev.map(c => {
                                    if (c.id !== activeConversationId) return c;
                                    const newMsgs = [...c.messages];
                                    if (uText) newMsgs.push({ id: `live-u-${Date.now()}`, role: 'user', text: uText, isLive: true });
                                    if (mText) newMsgs.push({ id: `live-m-${Date.now()}`, role: 'model', text: mText, isLive: true });
                                    return { ...c, messages: newMsgs };
                                }));
                            }
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                            source.onended = () => sourcesRef.current.delete(source);
                        }

                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => s.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onclose: () => {
                        setIsLiveActive(false);
                        setIsListening(false);
                        setIsPTTActive(false);
                    },
                    onerror: (e) => console.error("Live API Error", e),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: activePersona.voiceName } },
                    },
                    systemInstruction: `Jesteś ${activePersona.firstName}, asystentem AI w czacie Domini AI. Zainteresowania: ${activePersona.interests.join(', ')}. Osobowość: ${activePersona.psychologicalTraits}. Ton: ${activePersona.toneDescription}. WAŻNE: Jesteś w rozmowie w czasie rzeczywistym. Odpowiadaj krótko, naturalnie i ZAWSZE PO POLSKU.${initialContext ? `\n\nKONTEKST DODATKOWY:\n${initialContext}` : ''}`,
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                }
            });

            liveSessionRef.current = await sessionPromise;
        } catch (e) {
            console.error("Failed to connect to Live API", e);
        }
    };

    const stopLiveSession = () => {
        if (cleanupLiveRef.current) {
            cleanupLiveRef.current();
            cleanupLiveRef.current = null;
        }
        if (liveSessionRef.current) {
            liveSessionRef.current.close();
            liveSessionRef.current = null;
        }
        setIsLiveActive(false);
        setIsListening(false);
        setIsPTTActive(false);
    };

    const handleToggleListening = () => {
        if (!isLiveActive) {
            startLiveSession(true);
        } else {
            setIsListening(!isListening);
        }
    };

    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputMessage.trim() || !activeConversation || !activePersona || isLoading) return;

        const msgText = inputMessage.trim();
        setInputMessage('');

        if (isLiveActive && liveSessionRef.current) {
            liveSessionRef.current.sendRealtimeInput({
                text: msgText
            });
            return;
        }

        const userMessage: Message = { id: Date.now().toString(), role: 'user', text: msgText };
        const updatedConversation = { ...activeConversation, messages: [...activeConversation.messages, userMessage] };
        setConversations(conversations.map(c => c.id === activeConversation.id ? updatedConversation : c));
        setIsLoading(true);

        try {
            const history = updatedConversation.messages.map(m => ({ role: m.role, text: m.text }));
            const response = await geminiService.chatWithPersona(
                activePersona,
                msgText,
                history.slice(0, -1),
                { useSearch: true, initialContext }
            );

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text,
                groundingUrls: response.groundingUrls,
            };

            setConversations(conversations.map(c =>
                c.id === activeConversation.id
                    ? { ...updatedConversation, messages: [...updatedConversation.messages, aiMessage] }
                    : c
            ));

            playTTS(response.text, activePersona);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const playTTS = async (text: string, persona: Persona) => {
        try {
            setIsSpeaking(true);
            const base64Audio = await geminiService.generateTTS(text, persona);
            if (!base64Audio) return;
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ctx = audioContextRef.current;
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => setIsSpeaking(false);
            source.start();
        } catch (e) {
            console.error("TTS failed", e);
            setIsSpeaking(false);
        }
    };

    return {
        personas,
        conversations,
        activeConversation,
        activePersona,
        activeConversationId,
        setActiveConversationId,
        view,
        setView,
        isNewChatModalOpen,
        setIsNewChatModalOpen,
        inputMessage,
        setInputMessage,
        isLoading,
        isSpeaking,
        isLiveActive,
        isListening,
        isPTTActive,
        setIsPTTActive,
        resetToDefaults,
        handleCreatePersona,
        handleDeletePersona,
        startNewConversation,
        startLiveSession,
        stopLiveSession,
        handleToggleListening,
        sendMessage,
        playTTS
    };
};

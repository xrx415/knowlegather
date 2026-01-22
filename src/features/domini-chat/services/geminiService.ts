
import { GoogleGenAI, Modality } from "@google/genai";
import { GENAI_MODELS } from "../constants";
import { Persona } from "../types";

// Helper functions for base64 and audio
export function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const geminiService = {
    async chatWithPersona(
        persona: Persona,
        prompt: string,
        history: { role: 'user' | 'model'; text: string }[],
        options: { useSearch?: boolean; imageBase64?: string; initialContext?: string } = {}
    ) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("VITE_GEMINI_API_KEY is not defined");
        }
        const ai = new GoogleGenAI({ apiKey });
        // Use gemini-3-flash-preview for general tasks and search support
        const model = GENAI_MODELS.SEARCH;

        let systemInstruction = `
      Jesteś ${persona.firstName} ${persona.lastName}. 
      Jesteś asystentem AI w czacie Domini AI. Twoim zadaniem jest prowadzenie normalnej, zwykłej rozmowy.
      Zainteresowania: ${persona.interests.join(', ')}.
      Profil Psychologiczny: ${persona.psychologicalTraits}.
      Twój Ton/Sposób Mówienia: ${persona.toneDescription}.
      
      ZACHOWANIE:
      1. Prowadź swobodną, naturalną rozmowę.
      2. Jeśli użytkownik prosi o pomoc, staraj się pomóc w sposób bezpośredni i pomocny.
      3. Odpowiedzi powinny być zwięzłe i konwersacyjne.
      4. ZAWSZE ODPOWIADAJ PO POLSKU.
    `.trim();

        if (options.initialContext) {
            systemInstruction += `\n\nKONTEKST DODATKOWY (Zasoby Knowlegather):\n${options.initialContext}`;
        }

        const contents = history.map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }));

        const currentPart: any[] = [{ text: prompt }];
        if (options.imageBase64) {
            currentPart.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: options.imageBase64.split(',')[1]
                }
            });
        }

        contents.push({
            role: 'user',
            parts: currentPart
        });

        const config: any = {
            systemInstruction,
        };

        if (options.useSearch) {
            config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
            model,
            contents,
            config
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const urls = groundingChunks?.map((chunk: any) => ({
            title: chunk.web?.title || 'Źródło',
            uri: chunk.web?.uri || ''
        })).filter((c: any) => c.uri) || [];

        return {
            text: response.text || "Ups, zawiesiłem się. O czym to mówiliśmy?",
            groundingUrls: urls
        };
    },

    async generateTTS(text: string, persona: Persona) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("VITE_GEMINI_API_KEY is not defined");
        }
        const ai = new GoogleGenAI({ apiKey });

        // We try to guide the TTS with text cues
        const prompt = `Powiedz to dokładnie tak, jak zrobiłby to ${persona.firstName}, tonem: ${persona.toneDescription}: ${text}`;

        const response = await ai.models.generateContent({
            model: GENAI_MODELS.TTS,
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: persona.voiceName },
                    },
                },
            },
        });

        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    }
};

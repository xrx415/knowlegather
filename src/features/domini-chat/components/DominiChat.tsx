
import React, { useEffect } from 'react';
import {
    Plus,
    MessageSquare,
    Users,
    Volume2,
    Trash2,
    ArrowRight,
    Globe,
    GraduationCap,
    Mic,
    PhoneOff,
    Pause,
    Play,
    Info,
    RotateCcw,
    X
} from 'lucide-react';
import { useDominiChat } from '../hooks/useDominiChat';
import { VOICES } from '../constants';
import { Persona, VoiceName, ChatMode } from '../types';

interface DominiChatProps {
    initialContext?: string;
}

const DominiChat: React.FC<DominiChatProps> = ({ initialContext }) => {
    const {
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
    } = useDominiChat(initialContext);

    useEffect(() => {
        const el = document.getElementById('message-container');
        if (el) el.scrollTop = el.scrollHeight;
    }, [conversations, isLoading]);

    return (
        <div className="flex h-full bg-gray-50 text-gray-900 overflow-hidden rounded-xl border border-gray-200 shadow-inner">
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-800">Domini AI</h1>
                    </div>
                    <button
                        onClick={() => setIsNewChatModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 mb-6"
                    >
                        <Plus className="w-5 h-5" />
                        Nowa Rozmowa
                    </button>
                    <nav className="space-y-1">
                        <button
                            onClick={() => { setView('persona-config'); stopLiveSession(); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'persona-config' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Moje Persony</span>
                        </button>
                    </nav>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">Ostatnie Czaty</p>
                    <div className="space-y-1">
                        {conversations.map(conv => {
                            const p = personas.find(pers => pers.id === conv.personaId);
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => {
                                        setActiveConversationId(conv.id);
                                        setView('chat');
                                        stopLiveSession();
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all truncate group flex items-center gap-3 ${activeConversationId === conv.id && view === 'chat' ? 'bg-white border border-gray-200 shadow-sm text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                    <span className="flex-1 truncate">{p ? `${p.firstName} i Ty` : 'Usunięta Persona'}</span>
                                    <Trash2
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle delete conversation logic if needed, or just use the hook's state
                                        }}
                                        className="w-4 h-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                {view === 'persona-config' && (
                    <div className="p-8 max-w-4xl mx-auto w-full overflow-y-auto h-full scrollbar-hide">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Moje Persony</h2>
                                <p className="text-gray-500">Czyli wytwory mojej wyobraźni.</p>
                            </div>
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all text-sm font-medium"
                                title="Przywróć domyślne persony"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Resetuj Domyślne
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {personas.map(p => (
                                <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl uppercase">{p.firstName[0]}{p.lastName[0]}</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{p.firstName} {p.lastName}</h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-indigo-500 font-medium uppercase tracking-tighter">Głos {p.voiceName}</p>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${p.chatMode === 'live' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {p.chatMode === 'live' ? 'Na Żywo' : 'Standard'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeletePersona(p.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">Zainteresowania</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {p.interests.map(i => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{i}</span>)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">Cechy</span>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.psychologicalTraits}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => startNewConversation(p.id)} className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 font-semibold rounded-xl transition-all border border-gray-100 hover:border-indigo-200 flex items-center justify-center gap-2">
                                        Zacznij Rozmowę <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition-all gap-3 h-[280px]"
                                onClick={() => { const m = document.getElementById('new-persona-modal'); if (m) m.style.display = 'flex'; }}
                            >
                                <Plus className="w-10 h-10" />
                                <span className="font-semibold">Stwórz Nową Personę</span>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'chat' && activeConversation && activePersona && (
                    <div className="flex flex-col h-full bg-white">
                        <header className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase shadow-lg shadow-indigo-100">{activePersona.firstName[0]}</div>
                                <div>
                                    <h2 className="font-bold text-gray-900 leading-tight">{activePersona.firstName} {activePersona.lastName}</h2>
                                    <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                                        <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-orange-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                                        {isLiveActive ? 'Tryb Na Żywo - Szybki Głos' : 'Dostępny'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {activePersona.chatMode === 'live' && (
                                    <>
                                        <button onClick={handleToggleListening} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all shadow-sm ${isListening ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            {isListening ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            {isListening ? 'Słuchanie WŁ' : 'Auto-Słuchanie'}
                                        </button>
                                        {isLiveActive ? (
                                            <button onMouseDown={() => setIsPTTActive(true)} onMouseUp={() => setIsPTTActive(false)} onTouchStart={() => setIsPTTActive(true)} onTouchEnd={() => setIsPTTActive(false)} className={`p-3 rounded-full transition-all shadow-lg active:scale-90 ${isPTTActive ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
                                                <Mic className="w-6 h-6" />
                                            </button>
                                        ) : (
                                            <button onClick={() => startLiveSession(false)} className="p-3 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all"><Mic className="w-6 h-6" /></button>
                                        )}
                                        {isLiveActive && <button onClick={stopLiveSession} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><PhoneOff className="w-6 h-6" /></button>}
                                    </>
                                )}
                                {activePersona.chatMode === 'standard' && <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Volume2 className={`w-6 h-6 ${isSpeaking ? 'animate-bounce text-indigo-600' : ''}`} /></button>}
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth" id="message-container">
                            {activeConversation.messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div className="bg-indigo-50 p-6 rounded-3xl mb-6"><MessageSquare className="w-12 h-12 text-indigo-600" /></div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Czat Gotowy!</h3>
                                    <p className="text-gray-500">Przywitaj się z {activePersona.firstName} i zacznij rozmowę.</p>
                                </div>
                            )}
                            {activeConversation.messages.map((m) => (
                                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm relative group ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                                        {m.isLive && <span className="absolute -top-2 -right-2 text-[8px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded font-black uppercase tracking-tighter shadow-sm border border-orange-200">Na Żywo</span>}
                                        {m.groundingUrls && m.groundingUrls.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200/50">
                                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1 opacity-70"><Globe className="w-3 h-3" /> Źródła</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {m.groundingUrls.map((u, i) => <a key={i} href={u.uri} target="_blank" rel="noreferrer" className="text-[11px] px-2 py-1 bg-white/50 rounded-lg hover:bg-white transition-colors border border-black/5 truncate max-w-[200px]">{u.title}</a>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-2xl px-6 py-4 flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-4 relative">
                                <input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder={isLiveActive ? "Wyślij szybką wiadomość..." : `Napisz do ${activePersona.firstName}...`}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex-shrink-0"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </form>
                        </footer>
                    </div>
                )}

                {view === 'home' && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12 max-w-2xl mx-auto">
                        <div className="mb-10 relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                            <GraduationCap className="w-24 h-24 text-indigo-600 relative z-10" />
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
                            Domini AI
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 font-medium">
                            Jest to normalny, zwykły czat jakich wiele.
                        </p>

                        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 mb-12 max-w-lg mx-auto relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <div className="flex gap-4 items-start text-left">
                                <div className="bg-indigo-50 p-2 rounded-xl">
                                    <Info className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ważna Informacja</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                        "Przed użyciem zapoznaj się z ulotką dołączoną do polityki prywatności bądź skonsultuj się z psychiatrą lub terapeutą."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-12">
                            <button onClick={() => setIsNewChatModalOpen(true)} className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0">Zacznij Nowy Czat</button>
                            <button onClick={() => setView('persona-config')} className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-50 font-bold rounded-2xl hover:bg-indigo-50 transition-all">Zarządzaj Personami</button>
                        </div>
                        <div className="mt-auto pt-12 border-t border-gray-100 w-full opacity-50">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                Domini AI &copy; 2026
                            </p>
                        </div>
                    </div>
                )}
            </main>

            {isNewChatModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-gray-900">Wybierz swoją Personę</h2>
                                <button onClick={() => setIsNewChatModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                                {personas.map(p => (
                                    <button key={p.id} onClick={() => startNewConversation(p.id)} className="flex flex-col items-start p-6 rounded-3xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{p.firstName[0]}</div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{p.firstName} {p.lastName}</h3>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${p.chatMode === 'live' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{p.chatMode === 'live' ? 'Na Żywo' : 'Standard'}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{p.psychologicalTraits}</p>
                                        <div className="mt-4 flex flex-wrap gap-1">
                                            {p.interests.slice(0, 2).map(i => <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-gray-100 rounded-full text-gray-400 uppercase font-bold tracking-widest">{i}</span>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-center">
                                <button onClick={() => { setIsNewChatModalOpen(false); setView('persona-config'); }} className="text-indigo-600 font-bold hover:underline">+ Stwórz nową personę</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div id="new-persona-modal" className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] hidden items-center justify-center p-6">
                <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Stwórz Personę</h2>
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleCreatePersona({
                            firstName: formData.get('firstName') as string,
                            lastName: formData.get('lastName') as string,
                            interests: (formData.get('interests') as string).split(',').map(s => s.trim()),
                            psychologicalTraits: formData.get('traits') as string,
                            voiceName: formData.get('voice') as VoiceName,
                            toneDescription: formData.get('tone') as string,
                            chatMode: formData.get('chatMode') as ChatMode,
                        });
                        const m = document.getElementById('new-persona-modal'); if (m) m.style.display = 'none';
                    }}>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="firstName" placeholder="Imię" required className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input name="lastName" placeholder="Nazwisko" required className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tryb Interakcji</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                                    <input type="radio" name="chatMode" value="standard" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
                                    <div className="flex flex-col"><span className="text-sm font-bold">Standard</span><span className="text-[10px] text-gray-400">Czat + Czytanie Głosem AI</span></div>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                                    <input type="radio" name="chatMode" value="live" className="text-orange-600 focus:ring-orange-500" />
                                    <div className="flex flex-col"><span className="text-sm font-bold text-orange-600">Tryb Na Żywo</span><span className="text-[10px] text-gray-400">Głos i Tekst w Czasie Rzeczywistym</span></div>
                                </label>
                            </div>
                        </div>
                        <input name="interests" placeholder="Zainteresowania (oddzielone przecinkami)" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <textarea name="traits" placeholder="Profil psychologiczny, osobowość..." required className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <select name="voice" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                            </select>
                            <input name="tone" placeholder="Ton (np. Wyluzowana osoba)" required className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => { const m = document.getElementById('new-persona-modal'); if (m) m.style.display = 'none'; }} className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">Anuluj</button>
                            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all">Zapisz Personę</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DominiChat;

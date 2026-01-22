
export type VoiceName =
    | 'Achernar'
    | 'Achird'
    | 'Algenib'
    | 'Algieba'
    | 'Alnilam'
    | 'Aoede'
    | 'Autonoe'
    | 'Callirrhoe'
    | 'Charon'
    | 'Despina'
    | 'Enceladus'
    | 'Erinome'
    | 'Fenrir'
    | 'Gacrux'
    | 'Iapetus'
    | 'Kore'
    | 'Laomedeia'
    | 'Leda'
    | 'Orus'
    | 'Puck'
    | 'Pulcherrima'
    | 'Rasalgethi'
    | 'Sadachbia'
    | 'Sadaltager'
    | 'Schedar'
    | 'Sulafat'
    | 'Umbriel'
    | 'Vindemiatrix'
    | 'Zephyr'
    | 'Zubenelgenubi';

export type ChatMode = 'standard' | 'live';

export interface Persona {
    id: string;
    firstName: string;
    lastName: string;
    interests: string[];
    psychologicalTraits: string;
    voiceName: VoiceName;
    toneDescription: string;
    chatMode: ChatMode;
}

export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    imageUrl?: string;
    groundingUrls?: { title: string; uri: string }[];
    isThinking?: boolean;
    isLive?: boolean;
}

export interface Conversation {
    id: string;
    personaId: string;
    messages: Message[];
    createdAt: number;
}

export type AppState = 'home' | 'chat' | 'persona-config';

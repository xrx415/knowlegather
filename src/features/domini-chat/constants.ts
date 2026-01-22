
import { Persona, VoiceName } from './types';

export interface VoiceData {
    name: VoiceName;
    ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
    style: string;
}

export const ALL_VOICES: VoiceData[] = [
    {
        "name": "Achernar",
        "ssmlGender": "FEMALE",
        "style": "Soft"
    },
    {
        "name": "Achird",
        "ssmlGender": "MALE",
        "style": "Friendly"
    },
    {
        "name": "Algenib",
        "ssmlGender": "MALE",
        "style": "Gravelly"
    },
    {
        "name": "Algieba",
        "ssmlGender": "MALE",
        "style": "Smooth"
    },
    {
        "name": "Alnilam",
        "ssmlGender": "MALE",
        "style": "Firm"
    },
    {
        "name": "Aoede",
        "ssmlGender": "FEMALE",
        "style": "Breezy"
    },
    {
        "name": "Autonoe",
        "ssmlGender": "FEMALE",
        "style": "Bright"
    },
    {
        "name": "Callirrhoe",
        "ssmlGender": "FEMALE",
        "style": "Easy-going"
    },
    {
        "name": "Charon",
        "ssmlGender": "MALE",
        "style": "Informative"
    },
    {
        "name": "Despina",
        "ssmlGender": "FEMALE",
        "style": "Smooth"
    },
    {
        "name": "Enceladus",
        "ssmlGender": "MALE",
        "style": "Breathy"
    },
    {
        "name": "Erinome",
        "ssmlGender": "FEMALE",
        "style": "Clear"
    },
    {
        "name": "Fenrir",
        "ssmlGender": "MALE",
        "style": "Excitable"
    },
    {
        "name": "Gacrux",
        "ssmlGender": "FEMALE",
        "style": "Mature"
    },
    {
        "name": "Iapetus",
        "ssmlGender": "MALE",
        "style": "Clear"
    },
    {
        "name": "Kore",
        "ssmlGender": "FEMALE",
        "style": "Firm"
    },
    {
        "name": "Laomedeia",
        "ssmlGender": "FEMALE",
        "style": "Upbeat"
    },
    {
        "name": "Leda",
        "ssmlGender": "FEMALE",
        "style": "Youthful"
    },
    {
        "name": "Orus",
        "ssmlGender": "MALE",
        "style": "Firm"
    },
    {
        "name": "Puck",
        "ssmlGender": "MALE",
        "style": "Upbeat"
    },
    {
        "name": "Pulcherrima",
        "ssmlGender": "FEMALE",
        "style": "Forward"
    },
    {
        "name": "Rasalgethi",
        "ssmlGender": "MALE",
        "style": "Informative"
    },
    {
        "name": "Sadachbia",
        "ssmlGender": "MALE",
        "style": "Lively"
    },
    {
        "name": "Sadaltager",
        "ssmlGender": "MALE",
        "style": "Knowledgeable"
    },
    {
        "name": "Schedar",
        "ssmlGender": "MALE",
        "style": "Even"
    },
    {
        "name": "Sulafat",
        "ssmlGender": "FEMALE",
        "style": "Warm"
    },
    {
        "name": "Umbriel",
        "ssmlGender": "MALE",
        "style": "Easy-going"
    },
    {
        "name": "Vindemiatrix",
        "ssmlGender": "FEMALE",
        "style": "Gentle"
    },
    {
        "name": "Zephyr",
        "ssmlGender": "FEMALE",
        "style": "Bright"
    },
    {
        "name": "Zubenelgenubi",
        "ssmlGender": "MALE",
        "style": "Casual"
    }
];

export const VOICES: { value: VoiceName; label: string }[] = ALL_VOICES.map(v => ({
    value: v.name,
    label: `${v.name} (${v.style})`
}));


const personaModules = import.meta.glob('./personas/*.ts', { eager: true });

export const INITIAL_PERSONAS: Persona[] = Object.values(personaModules).map((mod: any) => mod.default);

export const GENAI_MODELS = {
    FAST: 'gemini-2.5-flash-lite',
    SEARCH: 'gemini-3-flash-preview',
    COMPLEX: 'gemini-3-pro-preview',
    IMAGE_GEN: 'gemini-3-pro-image-preview',
    IMAGE_EDIT: 'gemini-2.5-flash-image',
    TTS: 'gemini-2.5-flash-preview-tts',
    LIVE: 'gemini-2.5-flash-native-audio-preview-12-2025',
};

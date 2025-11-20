import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const BASE_URL_OPENROUTER = process.env.BASE_URL_OPENROUTER;
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
export const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
export const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
export const URL_META_WHATSAPP = process.env.URL_META_WHATSAPP;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_MODEL = process.env.OPENAI_MODEL;
export const OPTIONS_ENUM = {
    "1": "Desarrollo de software o Aplicaciones Móviles",
    "2": "Fábrica de software",
    "3": "Ciberseguridad",
    "4": "Inteligencia Artificial",
    "5": "Consultoria TI",
};
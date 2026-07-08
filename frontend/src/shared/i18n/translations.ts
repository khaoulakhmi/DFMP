import en from "./locales/en.json"
import fr from "./locales/fr.json"
import ar from "./locales/ar.json"

export const translations = {
    en,
    fr,
    ar,
} as const

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof fr & string

export const languages = {
    en: "English",
    fr: "Français",
    ar: "العربية",
} as const satisfies Record<Language, string>

export const defaultLanguage = "fr" satisfies Language

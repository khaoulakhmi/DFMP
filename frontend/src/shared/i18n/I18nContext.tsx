import { createContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { defaultLanguage, translations, type Language, type TranslationKey } from "./translations"

type TranslateParams = Record<string, string | number>

type I18nContextValue = {
    language: Language
    setLanguage: (language: Language) => void
    t: (key: TranslationKey, params?: TranslateParams) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

const storageKey = "language"

const isLanguage = (value: string | null): value is Language => (
    value === "en" || value === "fr" || value === "ar"
)

const getInitialLanguage = (): Language => {
    if (typeof window === "undefined") return defaultLanguage

    const savedLanguage = localStorage.getItem(storageKey)
    if (isLanguage(savedLanguage)) return savedLanguage

    const browserLanguage = navigator.language.slice(0, 2)
    return isLanguage(browserLanguage) ? browserLanguage : defaultLanguage
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage)

    useEffect(() => {
        localStorage.setItem(storageKey, language)
        document.documentElement.lang = language
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    }, [language])

    const value = useMemo<I18nContextValue>(() => ({
        language,
        setLanguage: setLanguageState,
        t: (key, params = {}) => {
            const template: string = translations[language][key] ?? translations[defaultLanguage][key] ?? key

            return Object.entries(params).reduce<string>(
                (text, [paramKey, paramValue]) => text.replaceAll(`{{${paramKey}}}`, String(paramValue)),
                template,
            )
        },
    }), [language])

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    )
}

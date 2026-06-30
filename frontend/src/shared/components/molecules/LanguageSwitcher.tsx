import Select from "@/shared/components/atoms/select"
import { useI18n } from "@/shared/i18n/useI18n"
import { languages, type Language } from "@/shared/i18n/translations"

const LanguageSwitcher = () => {
    const { language, setLanguage, t } = useI18n()

    return (
        <Select
            aria-label={t("common.language")}
            value={language}
            size="sm"
            variant="filled"
            bg="white"
            color="neutral.900"
            onChange={(event) => setLanguage(event.target.value as Language)}
        >
            {Object.entries(languages).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </Select>
    )
}

export default LanguageSwitcher

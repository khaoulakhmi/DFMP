


import { useI18n } from "@/shared/i18n/useI18n"

const FinanceDashboard = () => {
    const { t } = useI18n()
    return (
        <div>
            <h1>{t("finance")} {t("dashboard")}</h1>
            <p>{t("common.welcome")}, {t("roles.FINANCE")}!</p>
        </div>
    )
}


export default FinanceDashboard

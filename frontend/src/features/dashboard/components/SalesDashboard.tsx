



import { useI18n } from "@/shared/i18n/useI18n"

const SalesDashboard = () => {
    const { t } = useI18n()
    return (
        <div>
            <h1>{t("sales")} {t("dashboard")}</h1>
            <p>{t("common.welcome")}, {t("roles.SALES")}!</p>
        </div>
    )
}



export default SalesDashboard

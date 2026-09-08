


import { useI18n } from "@/shared/i18n/useI18n"

const AccountantDashboard = () => {
    const { t } = useI18n()
    return (
        <div>
            <h1>{t("roles.ACCOUNTANT")} {t("dashboard")}</h1>
            <p>{t("common.welcome")}, {t("roles.ACCOUNTANT")}!</p>
        </div>
    )
}


export default AccountantDashboard

// shared/config/navigation.tsx  <-- rename to .tsx (it contains JSX icons)
import { Role } from "@/shared/types/user.type"
import { BiSolidReport } from "react-icons/bi"
import { FaUsers, FaBoxOpen } from "react-icons/fa6"
import { FcBusinessman, FcSalesPerformance } from "react-icons/fc"
import { FaLayerGroup } from "react-icons/fa"
import { HiDocumentText } from "react-icons/hi2"
import { MdBusinessCenter, MdCategory } from "react-icons/md"
import { RiDashboardFill } from "react-icons/ri"
import { useI18n } from "@/shared/i18n/useI18n"

export const useNavItems = () => {
  const { t } = useI18n()

  return [
    {
      label: t("dashboard"),
      icon: <RiDashboardFill />,
      path: "/",
      allowedRoles: [Role.ADMIN, Role.SALES, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
      label: t("users"),
      icon: <FaUsers />,
      path: "/users",
      allowedRoles: [Role.ADMIN],
    },
    {
      label: t("providers"),
      icon: <FcBusinessman />,
      path: "/providers",
      allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
      label: t("designations"),
      icon: <MdCategory />,
      path: "/designations",
      allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
      label: t("lots"),
      icon: <FaLayerGroup />,
      path: "/lots",
      allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
      label: t("products"),
      icon: <FaBoxOpen />,
      path: "/products",
      allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
      label: t("specifications"),
      icon: <HiDocumentText />,
      path: "/specifications",
      allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
    {
      label: t("sales"),
      icon: <FcSalesPerformance />,
      path: "/sales",
      allowedRoles: [Role.ADMIN, Role.SALES],
    },
    {
      label: t("finance"),
      icon: <MdBusinessCenter />,
      path: "/finance",
      allowedRoles: [Role.ADMIN, Role.FINANCE],
    },
    {
      label: t("reports"),
      icon: <BiSolidReport />,
      path: "/reports",
      allowedRoles: [Role.ADMIN, Role.FINANCE, Role.ACCOUNTANT],
    },
  ]
}
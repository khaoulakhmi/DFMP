import { Prisma } from "../../generated/prisma/browser";

// `satisfies` keeps the exact shape, so query results are typed without the password.
export const userSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export default userSelect

import { Prisma } from "../../generated/prisma/browser";

export const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}

export default userSelect

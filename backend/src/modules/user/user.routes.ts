import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";


const userRouter = Router();

userRouter.get("/", authenticate, authorize(Role.ADMIN), UserController.getAllUsers);
userRouter.get("/username/:username", authenticate, UserController.getUserByUsername);
userRouter.get("/:id", authenticate, UserController.getUserById);
userRouter.post("/", authenticate, UserController.createUser);
userRouter.put("/:id", authenticate, UserController.updateUser);
userRouter.delete("/:id", authenticate, UserController.deleteUser);

export default userRouter;
import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";


const userRouter = Router();

userRouter.get("/", authenticate, authorize(Role.ADMIN), UserController.getAllUsers);
userRouter.get("/:username", UserController.getUserByUsername);
userRouter.get("/id/:id", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.put("/:id", UserController.updateUser);
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;
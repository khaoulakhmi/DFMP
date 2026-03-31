import { Router } from "express";
import { UserController } from "./user.controller";


const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:username", UserController.getUserByUsername);
userRouter.get("/id/:id", UserController.getUserById);
userRouter.post("/", UserController.createUser);
userRouter.put("/:id", UserController.updateUser);
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;
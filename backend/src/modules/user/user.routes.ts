import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize, authorizeSelfOrAdmin } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { Role } from "../../generated/prisma/enums";
import { createUserSchema, updateUserSchema, userIdSchema } from "./user.validation";


const userRouter = Router();

userRouter.get("/", authenticate, authorize(Role.ADMIN), UserController.getAllUsers);
userRouter.get("/username/:username", authenticate, UserController.getUserByUsername);
userRouter.get("/:id", authenticate, authorizeSelfOrAdmin, validate(userIdSchema), UserController.getUserById);


userRouter.post(
    "/",
    authenticate,
    authorize(Role.ADMIN),
    validate(createUserSchema),
    UserController.createUser,
);


userRouter.put(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validate(updateUserSchema),
    UserController.updateUser,
);


userRouter.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validate(userIdSchema),
    UserController.deleteUser,
);

export default userRouter;

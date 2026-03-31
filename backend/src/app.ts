import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import userRouter from "./modules/user/user.routes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("hello khaoula, API is running...");
});

export default app;
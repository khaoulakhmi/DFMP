import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import providerRouter from "./modules/provider/provider.routes";
import designationRouter from "./modules/designation/designation.routes";
import { ProductRouter } from "./modules/product/product.routes";
import LotRouter from "./modules/lot/lot.routes";
import SpecificationRouter from "./modules/specification/specification.routes";
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use('/api/auth', authRouter)
app.use("/api/providers", providerRouter);
app.use("/api/designations", designationRouter);
app.use("/api/products", ProductRouter);
app.use("/api/lots", LotRouter);
app.use("/api/specifications", SpecificationRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("hello khaoula, API is running...");
});

export default app;

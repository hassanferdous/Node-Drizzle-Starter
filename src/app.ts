import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import dotenv from "dotenv";
import "@/config/db"; // Just import to ensure DB is connected
import cookieParser from "cookie-parser";
import { errorHandler } from "@middlewares/error.middleware";
import "@/config/passport";
import router from "./routes";

const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
// Mount router
app.use("/api/v1", router);
app.use(errorHandler);

export { app };

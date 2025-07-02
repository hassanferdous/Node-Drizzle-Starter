import express from "express";
import cors from "cors";
import morgan from "morgan";
import { route } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import dotenv from "dotenv";
import "./config/db"; // Just import to ensure DB is connected
import "./config/passport";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use("/api", route);
app.use(errorHandler);

export { app };

import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import dotenv from "dotenv";
import "@/config/db"; // Just import to ensure DB is connected
import cookieParser from "cookie-parser";
import {
	entityParseHandler,
	errorHandler
} from "@middlewares/error.middleware";
import "@/config/passport";
import router from "./routes";
import { safeJsonParser } from "@middlewares/safe-parse.middleware";

const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(safeJsonParser);
app.use(morgan("dev"));
app.use(passport.initialize());
// Mount router
app.use("/api/v1", router);

app.use(entityParseHandler);

// global error handler
app.use(errorHandler);

export { app };

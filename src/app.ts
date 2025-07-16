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
import router from "./routes";
import { safeJsonParser } from "@middlewares/safe-parse.middleware";

/******** Passport strategies ********/
import "@domains/v1/auth/passport";

/******** Initialize Express App ********/
const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(safeJsonParser);
app.use(morgan("dev"));
app.use(passport.initialize());

/******** Mount app router ********/
app.use("/api/v1", router);

/******** Global entity parse error handler ********/
app.use(entityParseHandler);

/******** Global error handler ********/
app.use(errorHandler);

export { app };

import "@/config/db"; // Just import to ensure DB is connected
import {
	entityParseHandler,
	errorHandler
} from "@middlewares/error.middleware";
import { safeJsonParser } from "@middlewares/safe-parse.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import passport from "passport";
import router from "./routes";
import viewsRouter from "./routes/view-routes";

/******** Passport strategies ********/
import "@domains/v1/auth/passport";
import path from "node:path";
import swaggerRouter from "./swagger";
import csrf from "./middlewares/csrf.middleware";

/******** Initialize Express App ********/
const app = express();

dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(safeJsonParser);
app.use(morgan("dev"));
app.use(passport.initialize());

/******** Template engine ********/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname) + "/views");

/******** Mount API router ********/
app.use("/api/v1", router);

/******* Mount swagger docs router  ********/
app.use("/api-docs", swaggerRouter);

/******* Mount views router  ********/
app.use("/", viewsRouter);

/******** Global entity parse error handler ********/
app.use(entityParseHandler);

/******** Global error handler ********/
app.use(errorHandler);

export { app };

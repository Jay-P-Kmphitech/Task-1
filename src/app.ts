import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware";
import router from "./routes/routes";
import { errorHandler } from "./utils/errorHandler";

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

app.use("/api/v1", router);

app.use(errorHandler);

export default app;

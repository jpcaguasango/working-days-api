import express from "express";
import workingDateRouter from "./routes/workingDate.routes";

const app = express();

app.use("/", workingDateRouter);

export default app;

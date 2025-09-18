import express from "express";
import workingDateRouter from "./routes/workingDate.routes";

const app = express();

app.use("/working-date", workingDateRouter);

export default app;

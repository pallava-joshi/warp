import "./lib/env.js";
import express from "express";
import promptRouter from "./routes/prompt.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/prompt", promptRouter);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

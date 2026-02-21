import "./lib/env.js";
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

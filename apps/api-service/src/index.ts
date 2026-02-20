import "./lib/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "@repo/prisma";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(503).json({ status: "error", db: "disconnected", error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

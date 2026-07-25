import express from "express";

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "TruthLens AI"
  });
});

export default app;
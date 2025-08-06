import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket";
import { config } from "./config";

const app = express();
const server = http.createServer(app);

// Configuration CORS
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());

// Route de santé
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// Initialiser Socket.io
const io = initSocket(server);

// Démarrer le serveur
server.listen(config.PORT, () => {
  console.log(`🚀 Socket server listening on port ${config.PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Symfony API: ${config.SYMFONY_API_URL}`);
});

// Gestion gracieuse des arrêts
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM reçu, arrêt gracieux...");
  server.close(() => {
    console.log("✅ Serveur fermé proprement");
    process.exit(0);
  });
});

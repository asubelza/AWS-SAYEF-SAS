import app from "./app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import websocket from "./websocket.js";
import connectDB from "./config/db.config.js";
import { logger } from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    // Conexión a MongoDB
    await connectDB();
    logger.info("MongoDB conectado correctamente ✔️");

    // Servidor HTTP
    const httpServer = createServer(app);

    // WebSockets
    const io = new Server(httpServer, {
      cors: { origin: "*" },
    });

    websocket(io);

    // Arranque: escuchar en 0.0.0.0 para Docker
    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    logger.fatal("❌ Error al iniciar el servidor");
    logger.error(error);
    process.exit(1);
  }
}

start();

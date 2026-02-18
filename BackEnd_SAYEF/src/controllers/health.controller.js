import mongoose from "mongoose";

class HealthController {
  async check(req, res) {
    const mongoState = mongoose.connection.readyState;

    /*
      readyState:
      0 = disconnected
      1 = connected
      2 = connecting
      3 = disconnecting
    */

    const mongoStatus =
      mongoState === 1 ? "connected" :
      mongoState === 2 ? "connecting" :
      mongoState === 3 ? "disconnecting" :
      "disconnected";

    return res.status(200).json({
      status: "ok",
      uptime: process.uptime(),          // segundos
      timestamp: new Date().toISOString(),
      service: "SAYEF API",
      environment: process.env.NODE_ENV || "development",
      database: {
        mongo: mongoStatus,
      },
    });
  }
}

export default new HealthController();

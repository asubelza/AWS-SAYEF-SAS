// src/config/db.config.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL; // USAR MONGO_URL CORRECTAMENTE

    if (!uri) {
      throw new Error("MONGO_URL no está definido en las variables de entorno");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;

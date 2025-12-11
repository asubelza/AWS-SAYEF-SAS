// src/dao/models/order.model.js
import mongoose from "mongoose";

// 👇 Subdocumento para los ítems de la orden
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // id del producto (string, para no romper nada viejo)
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    code: { type: String }, // opcional, solo informativo
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      nombre: { type: String, required: true },
      apellido: { type: String, required: true },
      email: { type: String, required: true },
    },

    // 👉 al menos 1 item
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    total: { type: Number, required: true },

    // 🔗 usuario (si existe cuenta con ese mail)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 🏷 estado de la orden
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// 👇 NO definimos ningún índice único extraño acá
orderSchema.index({});

const Order = mongoose.model("Order", orderSchema);
export default Order;

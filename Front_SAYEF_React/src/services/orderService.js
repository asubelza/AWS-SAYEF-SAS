// src/services/orderService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const createOrderWithStockCheck = async (orderData) => {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // por si backend no manda JSON válido
  }

  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "Error creando la orden");
  }

  const order = data.payload || data.order || {};
  return order._id || order.id;
};

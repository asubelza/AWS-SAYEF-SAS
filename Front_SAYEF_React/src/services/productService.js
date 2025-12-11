// FRONT: src/services/productService.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PRODUCTS_URL = `${API_BASE}/api/products`;

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const res = await fetch(PRODUCTS_URL);
    if (!res.ok) throw new Error("Error al obtener productos");

    const data = await res.json();

    // tu back responde: { status: "success", payload: [...] }
    return data.payload || [];
  } catch (error) {
    console.error("getProducts ERROR:", error);
    throw error;
  }
};

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const res = await fetch(`${PRODUCTS_URL}/${id}`);
    if (!res.ok) throw new Error("Error al obtener el producto");

    const data = await res.json();
    return data.payload;
  } catch (error) {
    console.error("getProductById ERROR:", error);
    throw error;
  }
};

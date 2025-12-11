// /public/js/index.js

async function addToCart(pid) {
  try {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const res = await fetch("/api/carts", { method: "POST" });
      const data = await res.json();
      cartId = data.payload._id;
      localStorage.setItem("cartId", cartId);
    }

    const response = await fetch(`/api/carts/${cartId}/product/${pid}`, {
      method: "POST",
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Producto agregado al carrito");
    } else {
      alert(`⚠️ ${result.message || "Error al agregar producto"}`);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ No se pudo agregar el producto al carrito.");
  }
}

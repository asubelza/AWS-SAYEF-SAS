// /public/js/cart.js

// ✅ Crea o recupera el carrito del usuario autenticado (guardado en localStorage)
async function getOrCreateCart() {
  let cartId = localStorage.getItem("cartId");

  if (!cartId) {
    const response = await fetch("/api/carts", { method: "POST" });
    if (!response.ok) throw new Error("Error al crear el carrito");

    const data = await response.json();
    cartId = data.payload._id;
    localStorage.setItem("cartId", cartId);
  }

  return cartId;
}

// 🛒 Agregar producto al carrito
async function addToCart(productId) {
  try {
    const cartId = await getOrCreateCart();
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
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
    alert("⚠️ No se pudo agregar el producto.");
  }
}

// 🗑️ Eliminar producto del carrito
async function removeFromCart(productId) {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return alert("No hay carrito activo.");

  const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("🗑️ Producto eliminado");
    location.reload();
  } else {
    alert("⚠️ Error al eliminar producto");
  }
}

// 🔄 Actualizar cantidad de producto
async function updateQuantity(productId) {
  const cartId = localStorage.getItem("cartId");
  if (!cartId) return alert("No hay carrito activo.");

  const quantity = prompt("Ingrese la nueva cantidad:");
  if (!quantity || isNaN(quantity) || quantity <= 0)
    return alert("Cantidad inválida.");

  const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: parseInt(quantity) }),
  });

  if (response.ok) {
    alert("✅ Cantidad actualizada");
    location.reload();
  } else {
    alert("⚠️ Error al actualizar cantidad");
  }
}

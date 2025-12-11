// /public/js/ecommerce.js

const socket = io();

function $(selector) {
  return document.querySelector(selector);
}

// 🚨 Errores del servidor
socket.on("statusError", (data) => {
  console.error(data);
  alert(`⚠️ ${data}`);
});

// 🧩 Actualiza los productos en vivo
socket.on("publishProducts", (data) => {
  const container = $(".products-box");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  let html = "";
  data.forEach((product) => {
    html += `
      <div class="product-card">
        <h3>${product.title}</h3>
        <hr>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p>${product.description}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <button class="delete-btn" onclick="deleteProduct('${product._id}')">🗑️ Eliminar</button>
      </div>`;
  });

  container.innerHTML = html;
});

// ➕ Crear producto nuevo
function createProduct(event) {
  event.preventDefault();

  const newProduct = {
    title: $("#title").value,
    description: $("#description").value,
    code: $("#code").value,
    price: parseFloat($("#price").value),
    stock: parseInt($("#stock").value),
    category: $("#category").value,
    thumbnails: [],
  };

  if (
    !newProduct.title ||
    !newProduct.description ||
    !newProduct.code ||
    isNaN(newProduct.price) ||
    isNaN(newProduct.stock) ||
    !newProduct.category
  ) {
    alert("Por favor completa todos los campos obligatorios correctamente.");
    return;
  }

  socket.emit("createProduct", newProduct);
  cleanForm();
}

// 🗑️ Eliminar producto
function deleteProduct(pid) {
  socket.emit("deleteProduct", { pid });
}

// 🧹 Limpiar formulario
function cleanForm() {
  $("#title").value = "";
  $("#description").value = "";
  $("#code").value = "";
  $("#price").value = "";
  $("#stock").value = "";
  $("#category").value = "";
}

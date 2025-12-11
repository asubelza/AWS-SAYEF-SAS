import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifyError, notifySuccess } from "../services/toast";
import "./Admin.css";

const initialFormState = {
  title: "",
  description: "",
  code: "",
  price: "",
  stock: "",
  category: "",
  offer: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 buscador
  const [importFile, setImportFile] = useState(null); // 📥 archivo Excel

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Redirecciones según auth / rol
  useEffect(() => {
    if (user === null) return; // todavía cargando

    if (!user) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    if (user.role !== "admin") {
      notifyError("No tenés permisos para acceder al panel de administración");
      navigate("/", { replace: true });
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      setProducts(data.payload || data);
    } catch (err) {
      console.error(err);
      notifyError("No se pudieron cargar los productos");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 📝 Manejo del formulario de alta/edición
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      notifyError("Sesión no válida. Volvé a iniciar sesión.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/api/products/${editingId}`
      : `${API_BASE}/api/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Error al guardar el producto");
      }

      notifySuccess(
        editingId ? "Producto actualizado correctamente" : "Producto agregado"
      );

      setForm(initialFormState);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Error al guardar el producto");
    }
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      offer: !!product.offer,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!token) {
      notifyError("Sesión no válida. Volvé a iniciar sesión.");
      return;
    }

    if (!confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Error al eliminar el producto");
      }

      notifySuccess("Producto eliminado");
      fetchProducts();
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Error al eliminar el producto");
    }
  };

  const handleCancelEdit = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  // 📥 Manejo del archivo de importación
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImportFile(file || null);
  };

  const handleImport = async () => {
    if (!importFile) {
      notifyError("Seleccioná un archivo Excel primero");
      return;
    }

    if (!token) {
      notifyError("Sesión no válida. Volvé a iniciar sesión.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const res = await fetch(`${API_BASE}/api/products/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 NADA de Content-Type acá
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al importar productos");
      }

      notifySuccess(
        `Importación OK. Creados: ${data.created || 0}, Actualizados: ${
          data.updated || 0
        }`
      );

      setImportFile(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Error al importar productos");
    }
  };

  // 🔍 Filtrado de productos por nombre o código
  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = (p.title || "").toLowerCase();
    const code = (p.code || "").toLowerCase();
    return title.includes(term) || code.includes(term);
  });

  return (
    <div className="admin-container">
      <h1>Administrador - Productos</h1>

      {/* 📥 Importación desde Excel */}
      <div className="admin-import">
        <h2>Importar productos desde Excel</h2>
        <p className="admin-import-help">
          Formato esperado: columnas NOMBRE, Descripcion, CÓDIGO, PRECIO, Stock,
          Categoria, Oferta.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="secondary"
          onClick={handleImport}
          style={{ marginLeft: "0.5rem" }}
        >
          Importar Excel
        </button>
      </div>

      {/* 🔍 Buscador */}
      <div className="admin-search">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📝 Formulario de alta / edición */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="code"
          placeholder="Código"
          value={form.code}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Categoría"
          value={form.category}
          onChange={handleChange}
          required
        />

        <label className="offer-checkbox">
          <input
            type="checkbox"
            name="offer"
            checked={form.offer}
            onChange={handleChange}
          />
          Producto en oferta
        </label>

        <div className="admin-form-actions">
          <button type="submit">
            {editingId ? "Guardar cambios" : "Agregar producto"}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={handleCancelEdit}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* 📋 Listado de productos */}
      <section className="admin-products">
        {filteredProducts.length === 0 ? (
          <p>No hay productos que coincidan con la búsqueda.</p>
        ) : (
          filteredProducts.map((p) => (
            <div key={p._id} className="admin-product-card card">
              <h3>{p.title}</h3>
              <p>
                <strong>Código:</strong> {p.code}
              </p>
              <p>
                <strong>Categoría:</strong> {p.category}
              </p>
              <p>
                <strong>Precio:</strong> ${p.price}
              </p>
              <p>
                <strong>Stock:</strong> {p.stock}
              </p>
              {p.offer && <span className="badge-offer">EN OFERTA</span>}
              <div className="admin-product-actions">
                <button type="button" onClick={() => handleEdit(p)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => handleDelete(p._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AdminProducts;

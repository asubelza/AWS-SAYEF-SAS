import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { notifyError, notifySuccess } from "../services/toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Profile = () => {
  const { user, loading } = useAuth();

  // Copia editable de los datos del usuario
  const [userData, setUserData] = useState(null);

  // Órdenes del usuario
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Sincronizar user → userData cuando llega del contexto
  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  // Traer órdenes del usuario
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        // OJO: acá usamos el endpoint /api/orders/me/list
        const res = await fetch(`${API_BASE}/api/orders/me/list`, {
          credentials: "include", // manda la cookie JWT
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data.status !== "success") {
          throw new Error(data.message || "Error al obtener tus órdenes");
        }

        setOrders(data.payload || []);
      } catch (error) {
        console.error(error);
        notifyError(error.message || "Error al obtener tus órdenes");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Manejo de cambios en el formulario de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios de perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userData) return;

    setSavingProfile(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al actualizar el perfil");
      }

      // Actualizamos userData con lo que devuelve el backend
      if (data.payload) {
        setUserData((prev) => ({
          ...prev,
          first_name: data.payload.first_name || prev.first_name,
          last_name: data.payload.last_name || prev.last_name,
          email: data.payload.email || prev.email,
        }));
      }

      notifySuccess("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      notifyError(error.message || "Error al actualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  // Cancelar una orden
  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;

    const confirmCancel = window.confirm(
      "¿Seguro que querés cancelar esta orden?"
    );
    if (!confirmCancel) return;

    setCancellingOrderId(orderId);

    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al cancelar la orden");
      }

      // Actualizamos la orden en el estado
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );

      notifySuccess("Orden cancelada correctamente");
    } catch (error) {
      console.error("Error al cancelar orden:", error);
      notifyError(error.message || "Error al cancelar la orden");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Loading global (auth)
  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="profile-page">
        <h1>Mi Perfil</h1>
        <p>Tenés que iniciar sesión para ver tu perfil y tus órdenes.</p>
      </div>
    );
  }

  return (
    <div
      className="profile-page"
      style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}
    >
      <h1>Mi Perfil</h1>

      {/* 📋 Datos del usuario + formulario de edición */}
      <div
        className="profile-box card"
        style={{ padding: "1.5rem", marginBottom: "2rem" }}
      >
        <h2>Datos personales</h2>

        <form onSubmit={handleSaveProfile} style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label>
                Nombre
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleProfileChange}
                  style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                />
              </label>
            </div>

            <div>
              <label>
                Apellido
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleProfileChange}
                  style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                />
              </label>
            </div>

            <div>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleProfileChange}
                  style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                />
              </label>
            </div>

            <div>
              <label>
                Rol
                <input
                  type="text"
                  value={userData.role}
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    marginTop: "0.2rem",
                    backgroundColor: "#f3f4f6",
                  }}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            style={{
              padding: "0.5rem 1.2rem",
              borderRadius: "0.5rem",
              border: "none",
              backgroundColor: "#0d9488",
              color: "white",
              cursor: savingProfile ? "not-allowed" : "pointer",
            }}
          >
            {savingProfile ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>

      {/* 📦 Órdenes */}
      <h2>Mis órdenes</h2>

      {loadingOrders ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      ) : orders.length === 0 ? (
        <p>No tenés órdenes registradas todavía.</p>
      ) : (
        <div className="orders-list" style={{ marginTop: "1rem" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card card"
              style={{
                padding: "1rem 1.5rem",
                marginBottom: "1rem",
                borderLeft: "4px solid #0d9488",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <strong>Orden:</strong> {order._id}
                  <br />
                  <strong>Fecha:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("es-AR")
                    : "-"}
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>Total:</strong> ${order.total}
                  <br />
                  <strong>Estado:</strong> {order.status || "pending"}
                </div>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.title} — {item.quantity} x ${item.price}
                    </li>
                  ))}
                </ul>
              )}

              {/* Botón cancelar si la orden está pendiente */}
              {order.status === "pending" && (
                <button
                  type="button"
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={cancellingOrderId === order._id}
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.4rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #dc2626",
                    backgroundColor: "white",
                    color: "#dc2626",
                    cursor:
                      cancellingOrderId === order._id ? "not-allowed" : "pointer",
                  }}
                >
                  {cancellingOrderId === order._id
                    ? "Cancelando..."
                    : "Cancelar orden"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

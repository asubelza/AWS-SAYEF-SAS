import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { notifyError, notifySuccess } from "../services/toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Profile = () => {
  const { user, loading, updateProfile } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // edición perfil
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
  });

  // detalle expandible por orden
  const [expanded, setExpanded] = useState({}); // { [orderId]: true/false }

  const canFetch = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
  }, [user]);

  const fetchOrders = async () => {
    if (!canFetch) return;

    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/me/list`, {
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al obtener tus órdenes");
      }

      setOrders(Array.isArray(data.payload) ? data.payload : []);
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Error al obtener tus órdenes");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (canFetch) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch]);

  const cancelOrder = async (oid) => {
    if (!confirm("¿Cancelar esta orden?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/orders/${oid}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "No se pudo cancelar la orden");
      }

      notifySuccess("Orden cancelada");
      fetchOrders();
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Error al cancelar la orden");
    }
  };

  const toggleExpanded = (orderId) => {
    setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    const result = await updateProfile(profileForm);

    if (!result.ok) {
      notifyError(result.message || "No se pudo actualizar el perfil");
      setSavingProfile(false);
      return;
    }

    notifySuccess("Perfil actualizado");
    setSavingProfile(false);
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: 300 }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>Mi Perfil</h1>
        <p>Tenés que iniciar sesión para ver tu perfil y tus órdenes.</p>
      </div>
    );
  }

  return (
    <div className="profile-page" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Mi Perfil</h1>

      {/* ✅ Editar datos */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ marginTop: 0 }}>Mis datos</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>

        <form onSubmit={handleSaveProfile} style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <label style={{ display: "block", marginBottom: 6 }}>Nombre</label>
              <input
                value={profileForm.first_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, first_name: e.target.value }))
                }
                placeholder="Nombre"
                style={{ width: "100%", padding: "10px", borderRadius: 8 }}
              />
            </div>

            <div style={{ flex: "1 1 240px" }}>
              <label style={{ display: "block", marginBottom: 6 }}>Apellido</label>
              <input
                value={profileForm.last_name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, last_name: e.target.value }))
                }
                placeholder="Apellido"
                style={{ width: "100%", padding: "10px", borderRadius: 8 }}
              />
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <Button
              type="submit"
              label={savingProfile ? "Guardando..." : "Guardar cambios"}
              icon="pi pi-check"
              disabled={savingProfile}
            />
          </div>
        </form>
      </div>

      {/* ✅ Órdenes */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Mis órdenes</h2>
        <Button
          label={loadingOrders ? "Actualizando..." : "Actualizar"}
          icon="pi pi-refresh"
          severity="secondary"
          onClick={fetchOrders}
          disabled={loadingOrders}
        />
      </div>

      {loadingOrders ? (
        <div className="flex justify-content-center align-items-center" style={{ height: 200 }}>
          <ProgressSpinner />
        </div>
      ) : orders.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No tenés órdenes registradas todavía.</p>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {orders.map((order) => {
            const isOpen = !!expanded[order._id];

            return (
              <div
                key={order._id}
                className="card"
                style={{
                  padding: "1rem 1.25rem",
                  marginBottom: "1rem",
                  borderLeft: "4px solid #0d9488",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <strong>Orden:</strong> {order._id}
                    <br />
                    <strong>Fecha:</strong>{" "}
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("es-AR") : "-"}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong>Total:</strong> ${order.total}
                    <br />
                    <strong>Estado:</strong> {order.status || "pending"}
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Button
                    label={isOpen ? "Ocultar detalle" : "Ver detalle"}
                    icon={isOpen ? "pi pi-chevron-up" : "pi pi-chevron-down"}
                    severity="secondary"
                    onClick={() => toggleExpanded(order._id)}
                  />

                  {order.status === "pending" ? (
                    <Button
                      label="Cancelar"
                      icon="pi pi-times"
                      severity="danger"
                      onClick={() => cancelOrder(order._id)}
                    />
                  ) : null}
                </div>

                {isOpen && Array.isArray(order.items) && order.items.length > 0 && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.title} — {item.quantity} x ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;

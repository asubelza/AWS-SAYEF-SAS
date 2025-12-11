import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifyError, notifySuccess } from "../services/toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithToken } = useAuth();   // 👈 ahora también loginWithToken

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // a dónde volver después de loguearse
  const from = location.state?.from?.pathname || "/";

  // ================== Google Auth ==================
  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        }
      );

      const data = await res.json();
      console.log("GOOGLE LOGIN DATA:", data);

      if (!res.ok || data.status !== "success") {
        notifyError(data.message || "Error al iniciar sesión con Google");
        return;
      }

      // 👉 actualizar AuthContext (user + token)
      const result = loginWithToken(data);
      if (!result.ok) {
        notifyError(result.message || "Error al iniciar sesión con Google");
        return;
      }

      notifySuccess("Sesión iniciada con Google");
      navigate(from, { replace: true }); // misma lógica que login normal
    } catch (err) {
      console.error(err);
      notifyError("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleLoginBtn"),
      { theme: "outline", size: "large" }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ================== Login normal ==================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(form); // usa el contexto

    if (!result.ok) {
      notifyError(result.message || "Error al iniciar sesión");
      return;
    }

    notifySuccess("¡Bienvenido!");
    navigate(from, { replace: true }); // 👈 sacamos el navigate duplicado
  };

  return (
    <div className="auth-container">
      <h1>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Ingresar</button>

        {/* Botón de Google */}
        <div id="googleLoginBtn" style={{ marginTop: "1rem" }}></div>
      </form>

      <p>
        ¿No tenés cuenta?{" "}
        <Link to="/register">Registrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;

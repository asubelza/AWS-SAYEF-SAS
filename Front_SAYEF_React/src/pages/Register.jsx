import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { notifyError, notifySuccess } from "../services/toast";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiBase = import.meta.env.VITE_API_URL;
      console.log("VITE_API_URL en Register:", apiBase);

      const res = await fetch(`${apiBase}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // si después usás cookies / sesiones
        body: JSON.stringify(form),
      });

      console.log("Respuesta Register:", res.status);

      if (!res.ok) {
        let errorMsg = "Error al registrar usuario";
        try {
          const error = await res.json();
          console.log("Body de error register:", error);
          if (error?.message) errorMsg = error.message;
        } catch (_) {
          // si no viene JSON, dejamos el genérico
        }
        notifyError(errorMsg);
        return;
      }

      notifySuccess("Usuario registrado correctamente");
      navigate("/login");
    } catch (err) {
      console.error("Error de conexión en Register:", err);
      notifyError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <h1>Registrarse</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={form.last_name}
          onChange={handleChange}
          required
        />

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

        <button type="submit">Crear cuenta</button>
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
};

export default Register;

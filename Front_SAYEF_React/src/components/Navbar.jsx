import React, { useState } from 'react';
import CartWidget from './CartWidget';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   // 👈 IMPORTANTE

const Navbar = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();           // 👈 viene del contexto

  const categories = [
    { name: 'Todos',                     code: 'todos' },
    { name: 'Cables y conductores',      code: 'cables' },
    { name: 'Porteros y Timbres' ,       code: 'porterostimbres' },
    { name: 'Iluminación interior',      code: 'iluminacioninterior' },
    { name: 'Iluminación exterior',      code: 'iluminacionexterior' },
    { name: 'Tableros y protección',     code: 'tableros-proteccion' },
    { name: 'Tomas y mecanismos',        code: 'tomasmecanismos' },
    { name: 'Canalización y cañería',    code: 'canalizacioncaneria' },
    { name: 'Pilares y puesta a tierra', code: 'pilarespuestatierra' },
    { name: 'Accesorios y herramientas', code: 'accesoriosherramientas' },
    { name: 'En oferta',                 code: 'offers' }   // 👈 clave para ofertas
  ];

  const handleCategoryChange = (e) => {
    const selected = e.value;
    setSelectedCategory(selected);

    if (!selected || selected.code === 'todos') {
      // 🏠 volver al home
      navigate('/');
    } else {
      // 🔗 usamos el code en la URL
      navigate(`/category/${selected.code}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="store-name">
        <Link to={'/'}>
          <h1>SAYEF Productos Eléctricos e Insumos</h1>
        </Link>
      </div>

      <div className="nav-controls">
        <div className="dropdown-container">
          <Dropdown
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categories}
            optionLabel="name"
            placeholder="Categorías de productos"
            className="w-full md:w-14rem"
          />
        </div>

        <Link to="/cart">
          <CartWidget />
        </Link>

        {/* 🔑 SECCIÓN USUARIO: login / registro / perfil / admin / logout */}
        <div className="auth-section">
          {user ? (
            <>
              <span className="welcome-text">
                Hola, {user.first_name}
              </span>

              <Link to="/profile" className="nav-link">
                Mi Perfil
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin/products" className="nav-link">
                  Admin
                </Link>
              )}

              <button
                type="button"
                className="nav-button logout-button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

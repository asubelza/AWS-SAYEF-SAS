import React, { useState } from 'react';
import CartWidget from './CartWidget';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    { name: 'En oferta',                 code: 'offers' }
  ];

  const handleCategoryChange = (e) => {
    const selected = e.value;
    setSelectedCategory(selected);
    setMobileMenuOpen(false);

    if (!selected || selected.code === 'todos') {
      navigate('/');
    } else {
      navigate(`/category/${selected.code}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={'/'} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center shadow-lg shadow-electric-500/30">
                <span className="text-dark-800 font-bold text-xl">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-electric-400 to-electric-300 bg-clip-text text-transparent">
                  SAYEF
                </h1>
                <p className="text-xs text-dark-300 -mt-1">Productos Eléctricos</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Category Dropdown */}
            <div className="w-64">
              <Dropdown
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories}
                optionLabel="name"
                placeholder="Categorías"
                className="w-full bg-dark-700/50"
              />
            </div>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <CartWidget />
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-dark-300">
                  Hola, <span className="text-electric-400 font-medium">{user.first_name}</span>
                </span>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 text-sm text-dark-200 hover:text-electric-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  Mi Perfil
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/products" 
                    className="px-4 py-2 text-sm bg-electric-500/10 text-electric-400 hover:bg-electric-500/20 rounded-lg transition-all"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm text-dark-200 hover:text-electric-400 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm bg-gradient-to-r from-electric-500 to-electric-400 text-dark-800 font-medium rounded-lg hover:shadow-lg hover:shadow-electric-500/25 transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="p-2">
              <CartWidget />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-6 h-6 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 animate-slide-up">
          <div className="px-4 py-4 space-y-4">
            <div className="w-full">
              <Dropdown
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories}
                optionLabel="name"
                placeholder="Categorías"
                className="w-full"
              />
            </div>

            {user ? (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-sm text-dark-300 px-2">
                  Hola, <span className="text-electric-400 font-medium">{user.first_name}</span>
                </p>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-dark-200 hover:text-electric-400 hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/products" 
                    className="block px-4 py-2 text-electric-400 bg-electric-500/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <Link 
                  to="/login" 
                  className="flex-1 px-4 py-2 text-center text-dark-200 hover:text-electric-400 border border-dark-300/20 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 px-4 py-2 text-center bg-gradient-to-r from-electric-500 to-electric-400 text-dark-800 font-medium rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

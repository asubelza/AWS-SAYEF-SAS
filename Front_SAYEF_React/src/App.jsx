import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { PrimeReactProvider } from 'primereact/api'
import ItemListContainer from './components/ItemListContainer'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ItemDetailContainer from './components/ItemDetailContainer'
import Loading from './components/Loading'
import { ShoppingCartProvider } from './context/ShoppingCartContext'
import AdminProducts from "./pages/AdminProducts"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import PrivateRoute from "./components/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  },[]) 

  if (loading) {
    return <Loading />
  }

  return (
    <PrimeReactProvider>
      <AuthProvider>
        <ShoppingCartProvider>
          <div className="app-shell">
            <BrowserRouter>
              <Navbar />
                <main className="app-main">
                  <Routes>
                    {/* Públicas */}
                    <Route path="/" element={<ItemListContainer />} />
                    <Route path="/item/:id" element={<ItemDetailContainer />} />
                    <Route path="/category/:category" element={<ItemListContainer />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Privadas: requieren usuario logueado */}
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />

                    {/* Solo rol admin */}
                    <Route
                      path="/admin/products"
                      element={
                        <PrivateRoute roles={["admin"]}>
                          <AdminProducts />
                        </PrivateRoute>
                      }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
          
            </BrowserRouter>

            <ToastContainer position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark" 
            />
          </div>
        </ShoppingCartProvider>  
      </AuthProvider>
    </PrimeReactProvider> 
  )
}

export default App

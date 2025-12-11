import React, { useContext, useState } from 'react'
import { CartContext } from '../context/ShoppingCartContext'
import { createOrderWithStockCheck } from '../services/orderService'       
import { toast } from 'react-toastify'

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext)
  const [buyerData, setBuyerData] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setBuyerData({ ...buyerData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const orderData = {
      buyer: buyerData,
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    }

    try {
      const orderId = await createOrderWithStockCheck(orderData)
      toast.success(`Orden creada con éxito. ID: ${orderId}`)
      clearCart()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" onChange={handleInputChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required />
      <input name="phone" placeholder="Teléfono" onChange={handleInputChange} required />
      <button type="submit" disabled={loading || cart.length === 0}>
        {loading ? 'Procesando...' : 'Finalizar compra'}
      </button>
    </form>
  )
}

export default Checkout

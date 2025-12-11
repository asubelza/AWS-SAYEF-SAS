import { createContext, useState } from 'react'

export const CartContext = createContext(null)

export const ShoppingCartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    let result = { success: true, message: '' }

    setCart((currentCart) => {
      const existingItem = currentCart.find(item => item.id === product.id)
      const currentQuantity = existingItem ? existingItem.quantity : 0
      const newQuantity = currentQuantity + product.quantity

      if (newQuantity > product.stock) {
        result = {
          success: false,
          message: `Solo hay ${product.stock} unidades disponibles.`
        }
        return currentCart
      }

      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      }

      return [...currentCart, { ...product }]
    })

    return result
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    let result = { success: true, message: '' }

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            result = {
              success: false,
              message: `Solo hay ${item.stock} unidades disponibles.`
            }
            return item
          }

          return {
            ...item,
            quantity: Math.max(1, quantity)
          }
        }
        return item
      })
    )

    return result
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalQuantity
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default ShoppingCartProvider

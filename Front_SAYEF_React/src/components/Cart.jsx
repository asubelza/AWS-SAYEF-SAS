import React, { useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext";
import ContactForm from "./ContactForm";
import { notifyError, notifySuccess } from "../services/toast";
import "./Cart.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  const handleQuantityChange = (productId, quantity) => {
    const result = updateQuantity(productId, quantity);
    if (!result.success) {
      notifyError(result.message || "No se pudo actualizar la cantidad");
    }
  };

  const handleRemove = (productId, title) => {
    removeFromCart(productId);
    notifySuccess(`"${title}" fue eliminado del carrito`);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Carrito</h1>

      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="cart-item-title">{item.title}</span>

                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(
                      item.id,
                      parseInt(e.target.value || "1", 10)
                    )
                  }
                  className="cart-qty-input"
                />

                <span className="cart-item-subtotal">
                  ${item.price * item.quantity}
                </span>

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => handleRemove(item.id, item.title)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>

          <p className="total">
            <strong>Total:</strong> ${total}
          </p>

          <h2>Datos del comprador</h2>
          <ContactForm />
        </>
      )}
    </div>
  );
};

export default Cart;

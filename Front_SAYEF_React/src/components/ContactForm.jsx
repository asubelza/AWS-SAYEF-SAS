import { useState, useContext } from "react";
import { CartContext } from "../context/ShoppingCartContext";
import { createOrderWithStockCheck } from "../services/orderService";
import { Link } from "react-router-dom";
import { notifyError, notifySuccess } from "../services/toast";
import styles from "./ContactForm.module.css";
import OrderConfirmation from "./OrderConfirmation";

const ContactForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState(null);

  const { cart, clearCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombre === "" || apellido === "" || email === "") {
      notifyError("Todos los campos son obligatorios");
      return;
    }

    if (cart.length === 0) {
      notifyError("El carrito está vacío");
      return;
    }

    try {
      const orderData = {
        buyer: { nombre, apellido, email },
        items: cart.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: calculateTotal(),
      };

      const id = await createOrderWithStockCheck(orderData);
      setOrderId(id);
      clearCart();
      notifySuccess("¡Compra realizada con éxito!");
    } catch (error) {
      notifyError(error.message || "Hubo un error al crear tu orden");
    }
  };

  if (orderId) {
    return (
      <div className={styles.formContainer}>
        <OrderConfirmation orderId={orderId} />
        <Link to="/">
          <button className={styles.button}>Volver a la tienda</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Nombre"
            className={styles.input}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Apellido"
            className={styles.input}
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={cart.length === 0}
        >
          Enviar y Comprar
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

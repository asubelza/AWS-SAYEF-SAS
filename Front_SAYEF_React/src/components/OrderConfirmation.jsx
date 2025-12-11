import React from "react";
import styles from "./OrderConfirmation.module.css";

const OrderConfirmation = ({ orderId }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>⚡</div>

        <h2 className={styles.title}>¡Gracias por tu compra!</h2>

        <p className={styles.subtitle}>
          Tu orden fue generada correctamente.
        </p>

        <p className={styles.label}>Número de orden:</p>
        <p className={styles.orderId}>{orderId}</p>

        <p className={styles.info}>
          Vas a recibir un correo con los detalles de tu compra.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;

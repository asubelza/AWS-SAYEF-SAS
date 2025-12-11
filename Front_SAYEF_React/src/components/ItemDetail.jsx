import React, { useState, useContext } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import ItemCount from './ItemCount';
import './ItemDetail.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/ShoppingCartContext';
import { toast } from 'react-toastify'

const ItemDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    const normalizedProduct = {
      ...product,
      id: product._id || product.id,   // 👈 clave para que el carrito funcione bien
      quantity,
    };

    const result = addToCart(normalizedProduct);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success('Producto agregado al carrito');
    }
  };

  return (
    <Card className="item-detail-card">
      <div className="item-detail-content">
        <div className="item-detail-image">
          <img
            src={product.image || "https://placehold.co/200x300?text=Sin+Imagen"}
            alt={product.title}
          />
        </div>
        <div className="item-detail-info">
          <h1 className="item-detail-title">{product.title}</h1>
          <p className="item-detail-description">{product.description}</p>
          <div className="item-detail-price">${product.price}</div>
          <div className="item-detail-actions">
            <ItemCount
              quantity={quantity}
              setQuantity={setQuantity}
              max={product.stock}
            />
            <Button
              label="Agregar al carrito"
              severity="success"
              raised
              className="p-button-rounded"
              onClick={handleAddToCart}
            />
            <Link to="..">
              <Button
                label="Volver"
                severity="secondary"
                outlined
              />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemDetail;

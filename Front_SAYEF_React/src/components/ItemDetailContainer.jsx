import React, { useState, useEffect } from 'react';
import ItemDetail from './ItemDetail';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { ProgressSpinner } from 'primereact/progressspinner';

const ItemDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Producto inválido");
      setLoading(false);
      return;
    }

    getProductById(id)
      .then(productData => {
        if (!productData) {
          setError("Producto no encontrado");
        } else {
          setProduct(productData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error al cargar el producto");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <ItemDetail product={product} />
    </div>
  );
};

export default ItemDetailContainer;

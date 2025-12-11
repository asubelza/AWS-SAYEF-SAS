import React, { useState, useEffect } from "react";
import ItemList from "./ItemList";
import { getProducts } from "../services/productService";
import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";

// Función para normalizar strings (sin acentos, en minúsculas)
const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca acentos

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams(); // puede ser undefined, 'offers', o un code tipo 'cables'

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProducts()
      .then((products) => {
        console.log("Categorias reales que vienen del backend:", 
        [...new Set(products.map(p => p.category))]);
        let filtered = products;

        if (category) {
          const catNorm = normalize(category);

          if (catNorm === "offers") {
            // 🔥 modo ofertas (aceptamos varios formatos)
            filtered = products.filter((p) => {
              const v = p.offer;
              return (
                v === true ||
                v === 1 ||
                v === "true" ||
                v === "TRUE"
              );
            });
          } else {
            // 🔎 modo categoría "flexible"
            filtered = products.filter((product) => {
              const prodCatNorm = normalize(product.category || "");

              // Ejemplos:
              // - URL: 'cables'       / BD: 'Cables y conductores'  -> matchea
              // - URL: 'iluminacion-interior' / BD: 'Iluminación interior' -> matchea
              // Usamos includes en ambas direcciones para ser tolerantes
              return (
                prodCatNorm.includes(catNorm) ||
                catNorm.includes(prodCatNorm)
              );
            });
          }
        }

        setProducts(filtered);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(
          "Error al cargar los productos. Por favor, intente más tarde."
        );
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;

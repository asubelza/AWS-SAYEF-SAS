import React from 'react'
import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'

const Item = ({ product }) => {
  const productId = product._id || product.id

  return (
    <div className="group bg-dark-600/50 backdrop-blur-sm border border-dark-300/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-electric-500/30 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-dark-700/50">
        <img
          src={product.thumbnails?.[0] || product.image || "https://placehold.co/400x300/151b3a/00d4e6?text=Sin+Imagen"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.offer && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded-full uppercase tracking-wider">
            Oferta
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
            Sin Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <span className="inline-block px-2 py-1 text-xs text-electric-400/80 bg-electric-500/10 rounded-md">
          {product.category}
        </span>
        
        <h3 className="text-lg font-semibold text-dark-100 line-clamp-2 group-hover:text-electric-400 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-sm text-dark-300 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-electric-400 to-electric-300 bg-clip-text text-transparent">
              ${product.price?.toLocaleString('es-AR')}
            </span>
            <p className="text-xs text-dark-400">
              Stock: {product.stock}
            </p>
          </div>

          {productId && (
            <Link to={`/item/${productId}`}>
              <Button
                label="Ver"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="p-button-rounded p-button-sm bg-electric-500 border-electric-500 hover:bg-electric-400 hover:border-electric-400"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Item

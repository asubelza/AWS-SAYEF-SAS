import React from 'react'
import Item from './Item'

const ItemList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-dark-600/50 flex items-center justify-center">
          <svg className="w-12 h-12 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-dark-200 mb-2">No se encontraron productos</h3>
        <p className="text-dark-400">Intenta con otra categoría o revisa más tarde</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const productId = product._id || product.id;
        return (
          <Item
            key={productId}
            product={product}
          />
        )
      })}
    </div>
  )
}

export default React.memo(ItemList)

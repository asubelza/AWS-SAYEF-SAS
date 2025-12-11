import React from 'react'
import Item from './Item'
import './ItemList.css'

const ItemList = ({ products }) => {
  return (
    <div className="item-list-container">
      {products.map((product) => {
        const productId = product._id || product.id; // 👈 usar _id

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

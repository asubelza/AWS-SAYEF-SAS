import React, { useContext } from 'react'
import { Badge } from 'primereact/badge'
import { CartContext } from '../context/ShoppingCartContext'
import 'primeicons/primeicons.css'
import { Link } from 'react-router-dom'

const CartWidget = () => {
    const { getTotalQuantity } = useContext(CartContext)

    const totalItems = getTotalQuantity()
    const isCartEmpty = totalItems === 0

    return (
        <Link
            to={isCartEmpty ? "#" : "/cart"}
            className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-dark-600 border border-dark-300/20 shadow-lg hover:shadow-electric-500/20 hover:border-electric-400/50 hover:scale-110 transition-all duration-300 ${isCartEmpty ? 'opacity-40 pointer-events-none' : ''}`}
            onClick={(e) => isCartEmpty && e.preventDefault()}
        >
            <i className="pi pi-shopping-cart text-lg text-dark-100" />
            {totalItems > 0 && (
                <Badge value={totalItems} severity="danger" className="absolute -top-1 -right-1" />
            )}
        </Link>
    )
}

export default CartWidget

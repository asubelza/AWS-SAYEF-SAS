import { Button } from 'primereact/button';
import './ItemCount.css'

const ItemCount = ({ quantity, setQuantity, max }) => {
    const increment = () => {
      if (!max || quantity < max) {
        setQuantity(quantity + 1);
      }
    }
  
    const decrement = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  
    return (
      <div className="item-count-container">
        <div className="counter-buttons">
          <Button
            icon="pi pi-minus"
            severity="info"
            rounded
            text
            onClick={decrement}
            disabled={quantity <= 1}
          />
          <span className="counter-value">             {quantity}            </span>
          <Button
            icon="pi pi-plus"
            severity="info"
            rounded
            text
            onClick={increment}
            disabled={max ? quantity >= max : false}
          />
        </div>
      </div>
    )
  }
  export default ItemCount;

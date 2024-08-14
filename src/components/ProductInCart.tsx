import minus from '../assets/img/minus.png';
import plus from '../assets/img/plus.png';
import Button from './Button';

interface ProductInCartProps {
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

const ProductInCart: React.FC<ProductInCartProps> = ({ quantity, onAdd, onRemove }) => {

    return (
        <>
            <div className="cart-item_btn">
                <Button imgSrc={minus} width="50px" height="50px" onClick={onRemove} aria-label="Remove one item from cart"></Button>
                <p>{quantity}</p>
                <Button imgSrc={plus} width="50px" height="50px" onClick={onAdd} aria-label="Add one item to cart"></Button>
            </div>

        </>
    )
}
export default ProductInCart;
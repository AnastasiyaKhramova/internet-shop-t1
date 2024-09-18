import React from 'react';
import { Link } from 'react-router-dom';
import ProductInCart from './ProductInCart';
import Button from '../components/Button';
import basket from '../assets/img/cart.png';
import { CartProduct } from '../slice/cartSlice';
import useCart from '../hooks/useCart';

export interface ProductCardProps {
    product: CartProduct;
    isInCart: boolean;
    onAdd: () => void;
    onRemove: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { cart, addToCart, removeFromCart } = useCart();
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);
    const quantityInCart = cart?.products?.find((item) => item.id === product.id)?.quantity || 0;


    return (
        <div className="card">
            <Link to={`/product/${product.id}`}>
                <div className="img__card">
                    <img src={product.thumbnail} alt={`card ${product.id}`} />
                    <div className="card__hover">
                        <span>Show Details</span>
                    </div>
                </div>
            </Link>
            <div className='card__desc'>
                <div className="text__Card">
                    <Link to={`/product/${product.id}`}>
                        <h4>{product.title}</h4>
                    </Link>
                    <p>${discountedPrice.toFixed(2)}</p>
                </div>

                {quantityInCart > 0 ? (
                    <ProductInCart
                        quantity={quantityInCart}
                        onAdd={() => addToCart(product)}
                        onRemove={() => removeFromCart(product.id)}
                    />
                ) : (
                    <Button
                        imgSrc={basket}
                        altText="basket"
                        width='50px'
                        height='50px'
                        aria-label={`Add ${product.title} to cart`}
                        onClick={() => addToCart(product)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductCard;

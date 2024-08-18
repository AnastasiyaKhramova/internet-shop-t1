import React from 'react';
import { Link } from 'react-router-dom';
import ProductInCart from './ProductInCart';
import Button from '../components/Button';
import basket from '../assets/img/cart.png';
import { CartProduct } from '../slice/cartSlice';

export interface ProductCardProps {
    product: CartProduct;
    isInCart: boolean;
    onAddToCart: () => void;
    onRemoveFromCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart, onAddToCart, onRemoveFromCart }) => {
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

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

                {isInCart ? (
                    <ProductInCart
                        quantity={product.quantity}
                        onAdd={onAddToCart}
                        onRemove={onRemoveFromCart} 
                    />
                ) : (
                    <Button
                        imgSrc={basket}
                        altText="basket"
                        width='50px'
                        height='50px'
                        aria-label={`Add ${product.title} to cart`}
                        onClick={onAddToCart}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductCard;
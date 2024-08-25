import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductInCart from './ProductInCart';
import Button from '../components/Button';
import basket from '../assets/img/cart.png';
import { CartProduct } from '../slice/cartSlice';

export interface ProductCardProps {
    product: CartProduct;
    isInCart: boolean;
    onAdd: () => void;
    onRemove: () => void;
    onUpdateQuantity: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onRemove, onUpdateQuantity }) => {
    const [cartCount, setCartCount] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartCount(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartCount));
    }, [cartCount]);

    const handleAddToCart = () => {
        setCartCount(prevCart => {
            const newCount = { ...prevCart, [product.id]: (prevCart[product.id] || 0) + 1 };
            onUpdateQuantity(newCount[product.id]);
            return newCount;
        });
        onAdd();
    };

    const handleRemoveFromCart = () => {
        setCartCount(prevCart => {
            const newQuantity = (prevCart[product.id] || 0) - 1;
            if (newQuantity <= 0) {
                const { [product.id]: _, ...rest } = prevCart;
                onUpdateQuantity(0);
                return rest;
            }
            const newCount = { ...prevCart, [product.id]: newQuantity };
            onUpdateQuantity(newQuantity);
            return newCount;
        });
        onRemove();
    };

    const discountedPrice = product.price * (1 - product.discountPercentage / 100);
    const quantityInCart = cartCount[product.id] || 0;

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
                        onAdd={handleAddToCart}
                        onRemove={handleRemoveFromCart}
                    />
                ) : (
                    <Button
                        imgSrc={basket}
                        altText="basket"
                        width='50px'
                        height='50px'
                        aria-label={`Add ${product.title} to cart`}
                        onClick={handleAddToCart}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductCard;

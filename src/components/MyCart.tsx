import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { updateCart } from '../slice/cartSlice';
import ProductInCart from './ProductInCart';
import Button from './Button';
import basket from '../assets/img/cart.png';
import { getToken } from '../utils/auth'; 
import { useCartContext } from '../contexts/CartContext';

const MyCart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { cart, cartStatus, cartError, reloadCart } = useCartContext();
    const [isUpdating, setIsUpdating] = useState(false);
    const token = getToken();
    const cartId = localStorage.getItem('cartId') || '';

    const handleAddToCart = async (productId: number) => {
        if (isUpdating || !token || !cartId) return;
        setIsUpdating(true);

        try {
            const product = cart?.products.find(p => p.id === productId);
            const newQuantity = product ? product.quantity + 1 : 1;
            await dispatch(updateCart({
                cartId,
                products: [{ id: productId, quantity: newQuantity }],
                merge: false,
                headers: {
                    Authorization: `Bearer ${token}`, 
                }
            })).unwrap();

            reloadCart(); 
        } catch (error) {
            console.error('Failed to add product to cart', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveFromCart = async (productId: number, removeAll = false) => {
        if (isUpdating || !token || !cartId) return;
        setIsUpdating(true);

        try {
            const product = cart?.products.find(p => p.id === productId);
            if (product) {
                const newQuantity = removeAll ? 0 : product.quantity - 1;
                const updatedProducts = newQuantity > 0 
                    ? [{ id: productId, quantity: newQuantity }] 
                    : cart?.products?.filter(p => p.id !== productId) ?? [];

                await dispatch(updateCart({
                    cartId,
                    products: updatedProducts,
                    merge: false,
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }
                })).unwrap();

                reloadCart(); 
            }
        } catch (error) {
            console.error('Failed to remove product from cart', error);
        } finally {
            setIsUpdating(false);
        }
    };

    let totalProducts = 0;
    let totalPriceWithoutDiscount = 0;
    let totalDiscount = 0;

    const cartProducts = cart?.products || [];

    cartProducts.forEach((product) => {
        const discountedPrice = product.price * (1 - product.discountPercentage / 100);
        totalProducts += product.quantity;
        totalPriceWithoutDiscount += product.price * product.quantity;
        totalDiscount += (product.price - discountedPrice) * product.quantity;
    });

    const totalPriceWithDiscount = (totalPriceWithoutDiscount - totalDiscount);

    if (cartStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (cartStatus === 'failed') {
        return <div>Error: {cartError}</div>;
    }

    return (
        <section className="second-container cart">
            <h1 className="cart__title">My cart</h1>
            {cartProducts.length > 0 ? (
                <div className="cart__items">
                    <div className="cart__items_count">
                        {cartProducts.map((product) => (
                            <div className="cart-item" key={product.id}>
                                <div className={`cart-item_buy ${product.quantity < 1 ? 'cart-item_buy--dimmed' : ''}`}>
                                    <img className="cart-item_img" src={product.thumbnail} alt={`cartItem ${product.id}`} />
                                    <div className="cart-item_price">
                                        <h3>{product.title}</h3>
                                        <p>${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</p>
                                    </div>
                                </div>
                                {product.quantity > 0 ? (
                                    <>
                                        <div className="cart-item_btn">
                                            <ProductInCart
                                                quantity={product.quantity}
                                                onAdd={() => handleAddToCart(product.id)}
                                                onRemove={() => handleRemoveFromCart(product.id)}
                                            />
                                        </div>
                                        <button className="cart-item_del" onClick={() => handleRemoveFromCart(product.id, true)}>Delete</button>
                                    </>
                                ) : (
                                    <Button
                                        imgSrc={basket}
                                        altText='basket'
                                        width='50px'
                                        height='50px'
                                        aria-label={`Add ${product.title} to cart`}
                                        onClick={() => handleAddToCart(product.id)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="cart__items_costs">
                            <h4 className="cart__items_total">Total count</h4>
                            <p className="cart__items_total-count">{totalProducts} items</p>
                        </div>
                        <div className="cart__items_costs">
                            <h3 className="cart__items_out-discont">Price without discount</h3>
                            <p className="cart__items_out-discont-price">${totalPriceWithoutDiscount.toFixed(2)}</p>
                        </div>
                        <div className="cart__items_costs">
                            <h2 className="cart__items_total-title">Total price</h2>
                            <p className="cart__items_total-price">${totalPriceWithDiscount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <h2 className='cart__noItems'>No items</h2>
            )}
        </section>
    );
};

export default MyCart;

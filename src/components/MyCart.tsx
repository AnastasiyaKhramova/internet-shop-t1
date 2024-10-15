import React, { useState } from 'react';
import ProductInCart from './ProductInCart';
import useCart from '../hooks/useCart';
import Button from './Button';
import basket from '../assets/img/cart.png';

const MyCart: React.FC = () => {
    const [isLoading] = useState(false);
    const [error] = useState<string | null>(null);
    const { cart, addToCart, removeFromCart, removeAllFromCart } = useCart();

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

    const totalPriceWithDiscount = totalPriceWithoutDiscount - totalDiscount;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading cart: {error}</div>;
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
                                                onAdd={() => addToCart(product)}
                                                onRemove={() => removeFromCart(product.id)}
                                            />
                                        </div>
                                        <button className="cart-item_del" onClick={() => removeAllFromCart(product.id)}>Delete</button>
                                    </>
                                ) : (
                                    <Button
                                        imgSrc={basket}
                                        altText="basket"
                                        width="50px"
                                        height="50px"
                                        aria-label={`Add ${product.title} to cart`}
                                        onClick={() => addToCart(product)}
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
                <h2 className="cart__noItems">No items</h2>
            )}
        </section>
    );
};

export default MyCart;
import { useEffect } from 'react';
import { AppDispatch } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartByUser, selectCart, selectCartStatus, selectCartError, CartProduct } from '../slice/cartSlice';
import ProductInCart from "./ProductInCart";
import useCart from "../hooks/useCart";
import Button from './Button';
import basket from '../assets/img/cart.png'

function MyCart() {

    const dispatch: AppDispatch = useDispatch();
    const cart = useSelector(selectCart);
    const cartStatus = useSelector(selectCartStatus);
    const cartError = useSelector(selectCartError);
    const { cartCount, addToCart, removeFromCart } = useCart();

    let totalProducts = 0;
    let totalPriceWithoutDiscount = 0;
    let totalDiscount = 0;

    const cartProducts = cart?.products || [];

    cartProducts.forEach((product: CartProduct) => {
        const discountedPrice = product.price * (1 - product.discountPercentage / 100);
        totalProducts += product.quantity;
        totalPriceWithoutDiscount += product.price * product.quantity;
        totalDiscount += (product.price - discountedPrice) * product.quantity;
    });

    const totalPriceWithDiscount = (totalPriceWithoutDiscount - totalDiscount).toFixed(2);

    useEffect(() => {
        const userId = 6;
        dispatch(fetchCartByUser(userId));
    }, [dispatch]);

    if (cartStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (cartStatus === 'failed') {
        return <div>Error: {cartError}</div>;
    }

    return (
        <>
            <section className="second-container cart">
                <h1 className="cart__title">My cart</h1>
                <div className="cart__items">
                    <div className="cart__items_count">
                        {cart?.products.map((product) => (
                            <div className="cart-item" key={product.id}>
                                <div className="cart-item_buy">
                                    <img className="cart-item_img" src={product.thumbnail} alt={`cartItem ${product.id}`} />
                                    <div className="cart-item_price">
                                        <h3>{product.title}</h3>
                                        <p>${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</p>
                                    </div>
                                </div>
                                {product.quantity > 0 ? (
                                    <>
                                    <div className="cart-item_btn">
                                    <ProductInCart quantity={product.quantity}
                                        onAdd={() => addToCart(product.id)}
                                        onRemove={() => removeFromCart(product.id)} />
                                </div>
                                <button className="cart-item_del" onClick={() => removeFromCart(product.id)}>Delete</button>
                                    </>
                                ): (
                                    <Button 
                                    imgSrc={basket} 
                                    altText='basket'
                                    width='50px'
                                    height='50px'
                                    aria-label={`Add ${product.title} to cart`}
                                    onClick={() => addToCart(product.id)}/>
                                )

                                }
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
                            <p className="cart__items_out-discont-price">${totalPriceWithoutDiscount}</p>
                        </div>
                        <div className="cart__items_costs">
                            <h2 className="cart__items_total-title">Total price</h2>
                            <p className="cart__items_total-price">${totalPriceWithDiscount}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyCart

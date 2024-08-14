import cartItem from "../assets/img/productItem.jpg";
import cart from '../assets/img/cart.png';
import Button from "./Button";
import ProductInCart from "./ProductInCart";
import useCart from "../hooks/useCart";

function MyCart() {

    const { cartCount, addToCart, removeFromCart } = useCart();
    
    const cartItems = [
        {
            id: 1,
            img: cartItem,
            title: 'Essence Mascara Lash Princess',
            price: 110,
            count: '1 item',
            delete: 'Delete'
        },
        {
            id: 2,
            img: cartItem,
            title: 'Essence Mascara Lash Princess',
            price: 110,
            count: '1 item',
            delete: 'Delete'
        },
        {
            id: 3,
            img: cartItem,
            title: 'Essence Mascara Lash Princess',
            price: 110,
            count: '5 items',
            delete: 'Delete'
        },
    ]
    return (
        <>
            <section className="second-container cart">
                <h1 className="cart__title">My cart</h1>
                <div className="cart__items">
                    <div className="cart__items_count">
                        {cartItems.map(cartItem => (
                            <div className="cart-item" key={cartItem.id}>
                                <div className="cart-item_buy">
                                    <img className="cart-item_img" src={cartItem.img} alt={`cartItem ${cartItem.id}`} />
                                    <div className="cart-item_price">
                                        <h3>{cartItem.title}</h3>
                                        <p>${cartItem.price}</p>
                                    </div>
                                </div>
                                <div className="cart-item_btn">
                                    <ProductInCart  quantity={isInCart} 
                                            onAdd={()=> addToCart(product.id)} 
                                            onRemove={()=> removeFromCart(product.id)}/>
                                </div>
                                <p className="cart-item_del">{cartItem.delete}</p>
                            </div>
                        ))}
                        <div className="cart-item">
                            <div className="cart-item_buy">
                                <img className="cart-item_img" src={cartItem} alt='cartItem' />
                                <div className="cart-item_price">
                                    <h3>Essence Mascara Lash Princess</h3>
                                    <p>$110</p>
                                </div>
                            </div>
                            <div className="cart-item_btn cart-item_btn-buy">
                                <Button imgSrc={cart} width="50px" height="50px" altText="cart"></Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="cart__items_costs">
                            <h4 className="cart__items_total">Total count</h4>
                            <p className="cart__items_total-count">3 items</p>
                        </div>
                        <div className="cart__items_costs">
                        <h3 className="cart__items_out-discont">Price without discount</h3>
                        <p className="cart__items_out-discont-price">$700</p>
                        </div>
                        <div className="cart__items_costs">
                            <h2 className="cart__items_total-title">Total price</h2>
                            <p className="cart__items_total-price">$590</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyCart

import cartItem from "../assets/img/productItem.jpg";
import cart from '../assets/img/cart.png';
import Button from "./Button";

function MyCart() {
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
            count: '5 item',
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
                            <>
                                <img key={cartItem.id} src={cartItem.img} alt={`cartItem ${cartItem.id}`} />
                                <div>
                                    <h3>{cartItem.title}</h3>
                                    <p>${cartItem.price}</p>
                                </div>
                                <Button btnName='-'></Button>
                                <p>{cartItem.count}</p>
                                <Button btnName='+'></Button>
                                <p>{cartItem.delete}</p>

                            </>
                        ))}
                        <img src={cartItem} alt='cartItem' />
                        <div>
                            <h3>Essence Mascara Lash Princess</h3>
                            <p>$ 110</p>
                        </div>
                        <Button imgSrc={cart} altText="cart"></Button>
                    </div>
                    <div className="cart__items_costs"></div>
                </div>
            </section>
        </>
    )
}

export default MyCart

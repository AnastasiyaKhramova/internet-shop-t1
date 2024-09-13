import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import cartImage from '../assets/img/cart.png';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchCartByUser, selectCart, selectCartStatus, selectCartError } from '../slice/cartSlice';

const Header = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const userID = 6;
    const userName = "Johnson Smith";

    const cart = useAppSelector(selectCart);
    const cartStatus = useAppSelector(selectCartStatus);
    const cartError = useAppSelector(selectCartError);

    useEffect(() => {
        if (cartStatus === 'idle') {
            dispatch(fetchCartByUser(userID));
        }
    }, [dispatch, cartStatus, userID]);

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    if (cartStatus === 'loading') return <div>Loading...</div>;
    if (cartStatus === 'failed') return <div>Error loading cart: {cartError}</div>;

    return (
        <>
            <header className='container'>
                <div className='second-container headding'>
                    <div><Link className='headding-logo' to="/">Goods4you</Link></div>
                    <div className='menu'>
                        <Link to="/#catalog" aria-label="Catalog">Catalog</Link>
                        <Link to="/#faq" aria-label="FAQ">FAQ</Link>
                        <nav className='menu__cart' aria-label="Navigation">
                            <Link to='/cart' aria-label="Cart">Cart</Link>
                            <img src={cartImage} alt="cart" />
                            {cart && cart.totalQuantity > 0 && (
                                <div className='menu__cart_count'>{cart.totalQuantity}</div>
                            )}
                        </nav>
                        <a href="#">{userName}</a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;
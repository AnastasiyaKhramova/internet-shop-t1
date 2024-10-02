import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import cartImage from '../assets/img/cart.png';
import  cartStatus  from '../contexts/CartContext';
import { selectCart } from '../slice/cartSlice';
import useUser from '../hooks/useUser';

interface HiddenProps {
    isHidden?: boolean;
}

const Header: React.FC<HiddenProps> = ({ isHidden }) => {
    const location = useLocation();
    const { user, loading: userLoading } = useUser();
    const cart = useSelector(selectCart);

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    useEffect(() => {
        console.log('Cart updated:', cart);
    }, [cart]);

    // if (userLoading || cartStatus === 'loading') return <div>Loading user data...</div>;
    // if (!cart) return <div>Loading cart...</div>;
    // if (cartStatus === 'failed') return <div>Error loading cart</div>;

    return (
        <header className='container'>
            <div className='second-container headding'>
                <div><Link className='headding-logo' to="/">Goods4you</Link></div>
                <div className={isHidden ? 'menu menu__hidden' : 'menu'}>
                    <Link to="/#catalog" aria-label="Catalog">Catalog</Link>
                    <Link to="/#faq" aria-label="FAQ">FAQ</Link>
                    <nav className='menu__cart' aria-label="Navigation">
                        <Link to='/cart' aria-label="Cart">Cart</Link>
                        <img src={cartImage} alt="cart" />
                        {cart?.totalProducts !== undefined && cart.totalProducts > 0 && (
                            <div className='menu__cart_count'>{cart.totalProducts}</div>
                        )}
                    </nav>
                    <Link to="/login" aria-label='To login'>{user ? `${user.firstName} ${user.lastName}` : 'Login'}</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

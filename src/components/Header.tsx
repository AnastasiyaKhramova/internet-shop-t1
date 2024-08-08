import {Link, useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import cartImage from '../assets/img/cart.png';

const Header = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
          const element = document.querySelector(location.hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, [location]);
    return (
        <>
            <header className='container'>
                <div className='second-container headding'>
                    <div><Link className='headding-logo' to="/">Goods4you</Link></div>
                    <div className='menu'>
                        <Link to="/#catalog">Catalog</Link>
                        <Link to="/#faq">FAQ</Link>
                        <div className='menu__cart'>
                            <Link to='/cart'>Cart</Link>
                            <img src={cartImage} alt="cart" />
                            <div className='menu__cart_count'>1</div>
                        </div>
                        <a href="#">Johnson Smith</a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header

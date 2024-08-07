import {Link, useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import cartImage from '../assets/img/cart.png';

const Header = () => {
    const location
    return (
        <>
            <header className='container'>
                <div className='second-container headding'>
                    <div><Link className='headding-logo' to="/">Goods4you</Link></div>
                    <div className='menu'>
                        <a href="#catalog"><Link to="/">Catalog</Link></a>
                        <a href="#faq"><Link to="/">FAQ</Link></a>
                        <div className='menu__cart'>
                            <Link to='/cart'>Cart</Link>
                            <img src={cartImage} alt="cart" />
                        </div>
                        <a href="#">Johnson Smith</a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header

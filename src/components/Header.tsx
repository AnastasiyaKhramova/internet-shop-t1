import {Link} from 'react-router-dom'

const Header = () => {
    return (
        <>
            <header className='container'>
                <div className='second-container'>
                    <div><Link to="/">Goods4you</Link></div>
                    <div>
                        <a href="">Catalog</a>
                        <a href="">FAQ</a>
                        <div>
                            <Link to='/cart'>Cart</Link>
                            <img src="../assets/img/cart.jpg" alt="cart" />
                        </div>
                        <a href="#">Johnson Smith</a>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header

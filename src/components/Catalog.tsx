import imgSnickers from '../assets/img/snickers.jpg';
import cart from '../assets/img/cart.png';
import Button from './Button';
import { Link } from 'react-router-dom';

function Catalog() {
    const products = [
        {
            id: 1,
            img: imgSnickers, name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 2,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 3,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 4,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 5,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 6,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 7,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 8,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 9,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 10,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 11,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },
        {
            id: 12,
            img: imgSnickers,
            name: "Essence Mascara Lash Princess",
            price: 110,
        },


    ]
    return (
        <>
            <section id='catalog' className='second-container'>
                <div className='catalog'>
                    <h2 className='catalog__title'>Catalog</h2>
                    <input className='catalog__find' type="text" placeholder='Search by title' />
                    <div className='catalog__card'>
                        {products.map(product => (
                            <div className="card" key={product.id}>
                                <div className="img__card">
                                    <img src={product.img} alt={`card ${product.id}`} />
                                    <div className="card__hover">
                                        <span>Show Details</span>
                                    </div>
                                </div>
                                <div className='card__desc'>
                                    <div className="text__Card">
                                    <Link to={`/product/${product.id}`}><h4>{product.name}</h4></Link>
                                        <p>${product.price}</p>
                                    </div>
                                    <button className="btn"><img src={cart} alt="basket" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="button-container">
                    <Button btnName='Show more' />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Catalog

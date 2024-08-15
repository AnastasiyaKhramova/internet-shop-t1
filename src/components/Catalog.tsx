import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import ProductInCart from './ProductInCart';
import useCart from '../hooks/useCart';
import cart from '../assets/img/cart.png';
import { useSearchProductsQuery } from '../api/productApi';
import debounce from 'debounce';

interface Product {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
}

interface SearchProductsResponse {
    products: Product[];
    total: number;
}

const Catalog = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const limit = 12;

    const { data, error, isLoading } = useSearchProductsQuery({ q: searchTerm, limit, skip });
    const { cartCount, addToCart, removeFromCart } = useCart();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        setSkip(0);
        setProducts([]);

        if (data && data.products) {
            const filteredProducts = data.products.filter((product: Product) =>
                product.title.toLowerCase().includes(search)
            );
            setProducts(filteredProducts);
        }
    };

    const debouncedHandleSearchChange = useCallback(debounce(handleSearchChange, 500), []);

    const handleShowMore = () => {
        setSkip(prevSkip => prevSkip + limit);
    };

    useEffect(() => {
        if (data) {
            setProducts(prevProducts => [...prevProducts, ...data.products]);
        }
    }, [data]);

    return (
        <section id='catalog' className='second-container'>
            <div className='catalog'>
                <h2 className='catalog__title'>Catalog</h2>
                <input
                    className='catalog__find'
                    type="text"
                    placeholder='Search by title'
                    aria-label="Find product"
                    onChange={debouncedHandleSearchChange}
                />
                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error loading products</div>
                ) : (
                    <div className='catalog__card'>
                        {products.map(product => {
                            const discountedPrice = product.price * (1 - product.discountPercentage / 100);
                            const isInCart = cartCount[product.id] || 0;
                            return (
                                <div className="card" key={product.id}>
                                    <Link to={`/product/${product.id}`}>
                                        <div className="img__card">

                                            <img src={product.thumbnail} alt={`card ${product.id}`} />
                                            <div className="card__hover">
                                                <span>Show Details</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className='card__desc'>
                                        <div className="text__Card">
                                            <Link to={`/product/${product.id}`}>
                                                <h4>{product.title}</h4>
                                            </Link>
                                            <p>${discountedPrice.toFixed(2)}</p>
                                        </div>

                                        {isInCart > 0 ? (
                                            <ProductInCart
                                                quantity={isInCart}
                                                onAdd={() => addToCart(product.id)}
                                                onRemove={() => removeFromCart(product.id)} />
                                        ) : <Button
                                            imgSrc={cart}
                                            altText="basket"
                                            width='50px'
                                            height='50px'
                                            aria-label={`Add ${product.title} to cart`}
                                            onClick={() => addToCart(product.id)}
                                        />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {data && products.length < data.total && (
                    <div className="button-container">
                        <Button btnName='Show more' onClick={handleShowMore} />
                    </div>
                )}
            </div>
        </section>
    );
};
export default Catalog;
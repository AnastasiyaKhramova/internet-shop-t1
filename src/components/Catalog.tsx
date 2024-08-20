import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'debounce';
import { useSearchProductsQuery } from '../api/productApi';
import { useDispatch, useSelector } from 'react-redux';
import { CartProduct, addToCart, removeFromCart, selectCartCount } from '../slice/cartSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Catalog: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<CartProduct[]>([]);
    const limit = 12;

    const { data, error, isLoading } = useSearchProductsQuery({ q: searchTerm, limit, skip });

    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount); 

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        setSkip(0);
        setProducts([]);
        if (data && data.products) {
            const filteredProducts = data.products.filter((product: CartProduct) =>
                product.title.toLowerCase().includes(search)
            );
            setProducts(filteredProducts);
        }
    };

    const debouncedHandleSearchChange = useCallback(debounce(handleSearchChange, 1000), []);

    const handleShowMore = () => {
        setSkip(prevSkip => prevSkip + limit);
    };

    useEffect(() => {
        if (data && data.products) {
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
                            const isInCart = cartCount[product.id] > 0;
                            const cartProduct: CartProduct = {
                                ...product,
                                quantity: cartCount[product.id] || 0,
                            };
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={cartProduct}
                                    isInCart={isInCart}
                                    onAdd={() => dispatch(addToCart(product.id))}
                                    onRemove={() => dispatch(removeFromCart(product.id))}
                                />
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

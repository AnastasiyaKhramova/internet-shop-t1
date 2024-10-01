import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'debounce';
import { useSearchProductsQuery } from '../api/productApi';
import useCart from '../hooks/useCart';
import { CartProduct } from '../slice/cartSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Catalog: React.FC = () => {
    const { cart, addToCart, removeFromCart } = useCart();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const limit = 12;

    const createQueryParams = (params: Record<string, string | number | undefined>) => {
        const searchParams = new URLSearchParams();

        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== undefined) {
                searchParams.append(key, String(value));
            }
        });

        return searchParams.toString();
    };

    const queryParamsString = createQueryParams({ q: searchTerm, limit, skip });
    const queryParams = Object.fromEntries(new URLSearchParams(queryParamsString));
    const { data, error: queryError, isLoading } = useSearchProductsQuery(queryParams);

    useEffect(() => {
        if (data) {
            if (skip === 0) {
                setProducts(data.products);
            } else {
                setProducts(prevProducts => [...prevProducts, ...data.products]);
            }
            setTotalProducts(data.total);
            setError(null);
        }
    }, [data, queryError, skip]);

    const getProductQuantityInCart = (productId: number) => {
        const product = cart?.products.find(p => p.id === productId);
        return product ? product.quantity : 0;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        setSkip(0);
    };

    const debouncedHandleSearchChange = useCallback(debounce(handleSearchChange, 1000), []);

    const handleShowMore = () => {
        setSkip(prevSkip => prevSkip + limit);
    };

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
                            const quantityInCart = getProductQuantityInCart(product.id);
                            const isInCart = quantityInCart > 0;
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isInCart={isInCart}
                                    onAdd={() => addToCart(product)}
                                    onRemove={() => removeFromCart(product.id)}
                                />
                            );
                        })}

                    </div>
                )}

                {data && products.length < totalProducts && (
                    <div className="button-container">
                        <Button btnName='Show more' onClick={handleShowMore} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Catalog;

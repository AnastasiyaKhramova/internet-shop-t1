import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'debounce';
import { useSearchProductsQuery } from '../api/productApi';
import { useDispatch, useSelector } from 'react-redux';
import { CartProduct, addToCart, removeFromCart, updateQuantity, selectCart } from '../slice/cartSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Catalog: React.FC = () => {
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

    const dispatch = useDispatch();
    const cart = useSelector(selectCart);

    useEffect(() => {
        if (data && data.total) {
            setTotalProducts(data.total);
        }
    }, [data]);

    const getProductQuantityInCart = (productId: number) => {
        const product = cart?.products.find(p => p.id === productId);
        return product ? product.quantity : 0;
    };

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

    const debouncedHandleSearchChange = useCallback(debounce(handleSearchChange, 1000), [data]);

    const handleShowMore = () => {
        setSkip(prevSkip => prevSkip + limit);
    };

    useEffect(() => {
        if (queryError) {
            setError('Failed to load products. Please try again later.');
        } else if (data && data.products) {
            setError(null);
            setProducts(prevProducts => [...prevProducts, ...data.products]);
        }
    }, [data, queryError]);

    const handleAddToCart = (product: CartProduct) => {
        dispatch(addToCart(product));
    };

    const handleRemoveFromCart = (productId: number) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        if (quantity > 0) {
            dispatch(updateQuantity({ id: productId, quantity }));
        } else {
            handleRemoveFromCart(productId); 
        }
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
                                    onAdd={() => handleAddToCart(product)}
                                    onRemove={() => handleRemoveFromCart(product.id)}
                                    onUpdateQuantity={(quantity) => handleUpdateQuantity(product.id, quantity)}
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

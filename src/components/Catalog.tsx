import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'debounce';
import { useSearchProductsQuery } from '../api/productApi';
import useCart from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

export interface Product {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
}

export interface CartProduct extends Product {
    quantity: number;
}

const Catalog: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const limit = 12;

    // Запрос на получение продуктов с учетом поиска
    const { data, error, isLoading } = useSearchProductsQuery({ q: searchTerm, limit, skip });

    // Хук для управления корзиной
    const { cartCount, addToCart, removeFromCart } = useCart();

    // Функция для обработки изменений в строке поиска
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        setSearchTerm(search);
        setSkip(0);
        setProducts([]);
    };

    // Декорируем обработчик поиска функцией debounce
    const debouncedHandleSearchChange = useCallback(debounce(handleSearchChange, 500), []);

    // Функция для загрузки дополнительных продуктов при клике на "Show More"
    const handleShowMore = () => {
        setSkip(prevSkip => prevSkip + limit);
    };

    // Обновление состояния продуктов при изменении данных из запроса
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
                                    onAddToCart={() => addToCart(product.id)}
                                    onRemoveFromCart={() => removeFromCart(product.id)}
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

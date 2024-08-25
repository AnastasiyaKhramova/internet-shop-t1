import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from '../api/productApi';
import useCart from '../hooks/useCart';
import Button from './Button';
import ProductInCart from './ProductInCart';
import ErrorPage from '../pages/ErrorPage';
import { getCartFromLocalStorage } from '../utils/localstorage'; 

const ProductItems: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, error, isLoading } = useGetProductQuery(id);
  const [mainImage, setMainImage] = useState<string>('');
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const { cartCount, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Goods4you`;
      setMainImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    const savedCart = getCartFromLocalStorage();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <ErrorPage />;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const ratingStars = Math.round(product.rating);
  const isInCart = cartCount[product.id] || 0;

  const handleAddToCart = () => {
    const newCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    setCart(newCart);
    addToCart(product.id);
  };

  const handleRemoveFromCart = () => {
    const newCart = { ...cart };
    if (newCart[product.id]) {
      newCart[product.id]--;
      if (newCart[product.id] <= 0) {
        delete newCart[product.id];
      }
      setCart(newCart);
      removeFromCart(product.id);
    }
  };

  return (
    <section className='second-container product'>
      <div>
        <img className='big-img' src={mainImage} alt={product.title} />
        {product.images.length > 1 && (
          <div className='slider'>
            {product.images.map((item: string, index: number) => (
              <img className='small-img' key={index} src={item} alt={`product ${index}`} onClick={() => setMainImage(item)} />
            ))}
          </div>
        )}
      </div>
      <div className='product__desc'>
        <div>
          <h1 className='product__desc_title'>{product.title}</h1>
          <div className='product__desc_raiting'>
            <div className='product__desc_star'>
              {[...Array(5)].map((_, index) => (
                <svg key={index} width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.04894 0.92705C7.3483 0.00573921 8.6517 0.00573969 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58778 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z" fill={index < ratingStars ? '#F14F4F' : '#D5D5D5'} />
                </svg>
              ))}
            </div>
            <p className='product__desc_category'>{product.tags.join(', ')}</p>
          </div>
        </div>
        <h2 className='product__desc_subtitle'>{product.stock > 0 ? `In Stock - Only ${product.stock} left!` : 'Out of Stock'}</h2>
        <h3 className='product__desc_specification'>{product.description}</h3>
        <div className='product__desc_info'>
          <p>{product.warrantyInformation}</p>
          <p>{product.shippingInformation}</p>
        </div>
        <div className='product__desc_discount'>
          <div className='product__desc_disk'>
            <div className='product__desc_price'>
              <p className='product__desc_price-disc'>${discountedPrice.toFixed(2)}</p>
              <p className='product__desc_price-nondisc'>${product.price.toFixed(2)}</p>
            </div>
            <h4 className='product__desc_persent'>Your discount: <span>{product.discountPercentage}%</span></h4>
          </div>
          {isInCart > 0 ? (
            <ProductInCart
              quantity={isInCart}
              onAdd={handleAddToCart}
              onRemove={handleRemoveFromCart}
            />
          ) : (
            <Button
              btnName='Add to cart'
              aria-label={`Add ${product.title} to cart`}
              onClick={handleAddToCart}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductItems;

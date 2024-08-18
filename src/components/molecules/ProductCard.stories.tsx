import { Meta, StoryFn } from '@storybook/react';
import ProductCard, { ProductCardProps } from '../ProductCard';
import { CartProduct } from '../../slice/cartSlice';

export default {
    title: 'Molecules/ProductCard',
    component: ProductCard,
} as Meta;

const sampleProduct: CartProduct = {
    id: 1,
    title: 'Sample Product',
    price: 100,
    discountPercentage: 20,
    thumbnail: 'https://via.placeholder.com/150',
    quantity: 1,
};

const Template: StoryFn<ProductCardProps> = (args) => <ProductCard {...args} />;

export const Default = Template.bind({});
Default.args = {
    product: sampleProduct,
    isInCart: false,
    onAddToCart: () => alert('Added to cart'),
    onRemoveFromCart: () => alert('Removed from cart'),
};

export const InCart = Template.bind({});
InCart.args = {
    ...Default.args,
    isInCart: true,
};
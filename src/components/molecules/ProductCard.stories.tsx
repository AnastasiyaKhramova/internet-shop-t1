import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; 
import ProductCard, { ProductCardProps } from '../ProductCard';

const sampleProduct: ProductCardProps['product'] = {
  id: 1,
  title: 'Sample Product',
  price: 100,
  discountPercentage: 20,
  thumbnail: 'https://via.placeholder.com/150',
  quantity: 1,
};

export default {
  title: 'Molecules/ProductCard',
  component: ProductCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn<ProductCardProps> = (args) => <ProductCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  product: sampleProduct,
  isInCart: false,
  onAddToCart: () => alert('Added to cart'),
};

export const InCart = Template.bind({});
InCart.args = {
  product: { ...sampleProduct, quantity: 2 }, 
  isInCart: true,
  onAddToCart: () => alert('Added to cart'),
  onRemoveFromCart: () => alert('Removed from cart'),
};

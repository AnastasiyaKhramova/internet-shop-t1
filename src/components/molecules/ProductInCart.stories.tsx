import { Meta, StoryFn } from '@storybook/react';
import ProductInCart, { ProductInCartProps } from '../ProductInCart';

export default {
    title: 'Molecules/ProductInCart',
    component: ProductInCart,
} as Meta;

const Template: StoryFn<ProductInCartProps> = (args) => <ProductInCart {...args} />;

export const Default = Template.bind({});
Default.args = {
    quantity: 1,
    onAdd: () => alert('Added to cart'),
    onRemove: () => alert('Removed from cart'),
};
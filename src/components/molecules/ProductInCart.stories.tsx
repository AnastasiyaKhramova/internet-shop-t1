import { Meta, StoryFn } from '@storybook/react';
import ProductInCart, { ProductInCartProps } from '../ProductInCart';

export default {
  title: 'Molecules/ProductInCart',
  component: ProductInCart,
} as Meta;

const Template: StoryFn<ProductInCartProps> = (args) => <ProductInCart {...args} />;

export const SingleItem = Template.bind({});
SingleItem.args = {
  quantity: 1,
  onAdd: () => alert('Added one more item to cart'),
  onRemove: () => alert('Removed one item from cart'),
};

export const MultipleItems = Template.bind({});
MultipleItems.args = {
  quantity: 5,
  onAdd: () => alert('Added one more item to cart'),
  onRemove: () => alert('Removed one item from cart'),
};

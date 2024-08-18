import { Meta, StoryFn } from '@storybook/react';
import ProductThumbnail from '../ProductThumbnail';

export default {
    title: 'Atoms/ProductThumbnail',
    component: ProductThumbnail,
} as Meta;

const Template: StoryFn<{ src: string, alt: string }> = (args) => <ProductThumbnail {...args} />;

export const Default = Template.bind({});
Default.args = {
    src: 'https://via.placeholder.com/150',
    alt: 'Placeholder image',
};
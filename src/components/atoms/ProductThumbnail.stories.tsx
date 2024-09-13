import { Meta, StoryFn } from '@storybook/react';
import ProductThumbnail, { ProductThumbnailProps } from '../ProductThumbnail';

export default {
  title: 'Atoms/ProductThumbnail',
  component: ProductThumbnail,
} as Meta;

const Template: StoryFn<ProductThumbnailProps> = (args) => <ProductThumbnail {...args} />;

export const Default = Template.bind({});
Default.args = {
  src: 'https://via.placeholder.com/150',
  alt: 'Default Thumbnail',
};

export const WithDifferentImage = Template.bind({});
WithDifferentImage.args = {
  src: 'https://via.placeholder.com/200',
  alt: 'Different Thumbnail',
};

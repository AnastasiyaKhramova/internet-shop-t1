import { Meta, StoryFn } from '@storybook/react';
import Button, { ButtonProps } from '../Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    btnName: { control: 'text' },
    imgSrc: { control: 'text' },
    altText: { control: 'text' },
    width: { control: 'text' },
    height: { control: 'text' },
    href: { control: 'text' },
    onClick: { action: 'clicked' }, 
  },
} as Meta;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  btnName: 'Click Me',
};

export const WithImage = Template.bind({});
WithImage.args = {
  imgSrc: 'https://via.placeholder.com/18',
  altText: 'Sample image',
};

export const WithLink = Template.bind({});
WithLink.args = {
  btnName: 'Go to Google',
  href: 'https://www.google.com',
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  btnName: 'Custom Size',
  width: '200px',
  height: '100px',
};

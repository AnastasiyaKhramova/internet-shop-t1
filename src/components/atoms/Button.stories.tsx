import { Meta, StoryFn } from '@storybook/react';
import Button, { ButtonProps } from '../Button';

export default {
    title: 'Atoms/Button',
    component: Button,
} as Meta;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    btnName: 'Click me',
    width: '100px',
    height: '40px',
};

export const WithImage = Template.bind({});
WithImage.args = {
    imgSrc: 'https://via.placeholder.com/20',
    altText: 'Placeholder',
    btnName: 'Image Button',
    width: '120px',
    height: '40px',
};
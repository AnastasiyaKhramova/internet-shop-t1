import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import Button from '../components/Button'; 

describe('Button Component', () => {
  it('should render a button with text when imgSrc is not provided', () => {
    render(
      <Button btnName="Click Me" />
    );

    expect(screen.queryByText('Click Me')).not.toBeNull();
    
    const img = screen.queryByAltText(/Sample Image/i);
    expect(img).toBeNull();
  });

  it('should render a button with an image when imgSrc is provided', () => {
    render(
      <Button imgSrc="path/to/image.jpg" altText="Sample Image" />
    );

    const img = screen.queryByAltText('Sample Image');
    expect(img).not.toBeNull();
    
    const text = screen.queryByText(/Click Me/i);
    expect(text).toBeNull();
  });
});

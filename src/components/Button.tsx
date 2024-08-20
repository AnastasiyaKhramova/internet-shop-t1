import React from 'react';

export interface ButtonProps {
  btnName?: string;
  imgSrc?: string;
  altText?: string;
  width?: string;
  height?: string;
  href?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ btnName, imgSrc, altText, href, onClick, width = '177px', height = '62px' }) => {
  const buttonStyle = {
    width,
    height,
  };

  return (
    href ? (
      <a href={href} className="main__btn" style={buttonStyle}>
        {btnName}
      </a>
    ) : (
      <button onClick={onClick} className="main__btn" style={buttonStyle}>
        {imgSrc ? <img style={{ maxWidth: '18px', maxHeight: '18px' }} src={imgSrc} alt={altText} /> : btnName}
      </button>
    ));
};

export default Button;
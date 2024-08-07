import React from 'react';

interface ButtonProps {
  btnName: string;
  width?: string;
  height?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;}

const Button: React.FC<ButtonProps> = ({ btnName, href, onClick, width = '177px', height = '62px'}) => {
  const buttonStyle = {
    width,
    height,
    href,
    onClick,
  };

  return (
    href ? (
      <a href={href} className="main__btn" style={buttonStyle}>
        {btnName}
      </a>
    ) : (
      <button onClick={onClick} className="main__btn" style={buttonStyle}>
        {btnName}
      </button>
  ));
};

export default Button;
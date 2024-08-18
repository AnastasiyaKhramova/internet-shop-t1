import React from 'react';

interface ProductThumbnailProps {
    src: string;
    alt: string;
}

const ProductThumbnail: React.FC<ProductThumbnailProps> = ({ src, alt }) => {
    return (
        <div className="img__card">
            <img src={src} alt={alt} />
            <div className="card__hover">
                <span>Show Details</span>
            </div>
        </div>
    );
};

export default ProductThumbnail;
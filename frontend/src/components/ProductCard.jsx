import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
    };
    return (
        <div className="group relative bg-gray-100 w-full p-4">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100 lg:aspect-none lg:h-80">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <div className="mt-4 text-left">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <Link to={`/product/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                    
                </div>
                <p className="text-sm text-gray-900">{formatPrice(product.price)}</p>            </div>
        </div>
    );
};

export default ProductCard; 
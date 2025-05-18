// frontend/src/pages/ProductsPage.jsx
import React from 'react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css'; // Import the CSS for the grid

function ProductsPage({ products, isLoading, onAddToCartRequest }) {
  const handleAddToCart = (product, quantity) => {
    if (onAddToCartRequest) {
      onAddToCartRequest(product, quantity);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-xl">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-xl">No products available at the moment.</div>;
  }

  return (
    <div> {/* Main container for the page content */}
      <h1 className="products-page-title">Our Products</h1>
      <div className="products-grid"> {/* Apply the grid class */}
        {products.map((product) => (
          <ProductCard
            key={product.id} // Assuming product object has a unique 'id'
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
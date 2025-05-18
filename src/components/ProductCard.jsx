// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import './ProductCard.css'; // Make sure this CSS file is imported

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1;
      if (product.inventory !== undefined && newQuantity > product.inventory) {
        return product.inventory;
      }
      return newQuantity;
    });
  };

  const handleAddToCartClick = () => {
    if (quantity > 0 && (product.inventory === undefined || product.inventory > 0)) {
      onAddToCart(product, quantity);
    } else if (product.inventory !== undefined && product.inventory <= 0) {
      // Optionally, provide user feedback here if alerts are removed from App.jsx
      // e.g., set a local error message state for this card
      console.warn(`${product.name} is out of stock!`);
    }
  };

  const isOutOfStock = product.inventory !== undefined && product.inventory <= 0;
  const canAddToCart = !isOutOfStock || product.inventory === undefined; // Can add if not explicitly out of stock

  return (
    <div className="product-card">
      {/* NEW WRAPPER for the image */}
      <div className="product-card-image-container"> 
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name || 'Product Image'}
          className="product-card-image"
        />
      </div>
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name || 'Product Name'}</h3>
        
        <p className="product-card-description">
          {product.description || 'No description available.'}
        </p>
        
        <p className="product-card-price">
          ${product.price !== undefined ? parseFloat(product.price).toFixed(2) : 'N/A'}
          {product.unit && <span className="unit"> / {product.unit}</span>}
        </p>

        {isOutOfStock && (
          <p className="product-card-out-of-stock">Out of Stock</p>
        )}

        {!isOutOfStock && (
          <>
            <div className="quantity-control">
              <span className="quantity-control-label">Qty:</span> {/* Shortened label */}
              <div className="quantity-adjuster">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-display" aria-live="polite">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  disabled={product.inventory !== undefined && quantity >= product.inventory}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <button 
              onClick={handleAddToCartClick} 
              className="add-to-cart-button"
              disabled={!canAddToCart} 
            >
              Add to Selection
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
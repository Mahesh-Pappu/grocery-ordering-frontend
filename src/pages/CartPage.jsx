import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css'

function CartPage({ cartItems, onUpdateQuantity, onRemoveItem }) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Selection is Empty</h1>
        <p className="text-gray-600 mb-6">Browse our products to add items.</p>
        <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Current Selection</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between py-4 border-b last:border-b-0">
            <div className="flex items-center mb-4 sm:mb-0 flex-grow">
              <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-l"
                  disabled={item.quantity <= 1}
                > - </button>
                <span className="px-3 py-1 text-center w-10 sm:w-12 tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r"
                  disabled={item.inventory && item.quantity >= item.inventory}
                > + </button>
              </div>
              <p className="text-md sm:text-lg font-semibold w-20 sm:w-24 text-right tabular-nums">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold px-2"
              > Remove </button>
            </div>
          </div>
        ))}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-end items-center mb-6">
            <span className="text-xl font-semibold text-gray-800">Subtotal:</span>
            <span className="text-2xl font-bold text-green-600 ml-4 tabular-nums">${calculateTotal()}</span>
          </div>
          <div className="text-right">
            <Link
              to="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded text-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CartPage;
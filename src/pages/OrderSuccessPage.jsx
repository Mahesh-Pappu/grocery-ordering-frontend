// frontend/src/pages/OrderSuccessPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center"> {/* Added flex for centering */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 md:p-10 rounded-lg shadow-lg inline-block max-w-lg w-full"> {/* Added w-full for better centering on smaller screens within max-w-lg */}
        {/* ---- MODIFIED SVG SIZE HERE ---- */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 md:h-14 md:w-14 text-green-500 mx-auto mb-5" // Reduced size (e.g., to h-12 w-12 or h-10 w-10)
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-4">Order Placed Successfully!</h1> {/* Slightly adjusted heading size */}
        <p className="text-md md:text-lg text-gray-700 mb-3">Thank you for shopping with FreshGrocer.</p>
        {orderId && (
          <p className="text-sm md:text-md text-gray-700 mb-6">
            Your Order ID is: <strong className="text-green-900 font-semibold text-md md:text-lg">{orderId}</strong>
          </p>
        )}
        <p className="text-sm md:text-md text-gray-600 mb-8">
          We've received your order and it's being processed.
        </p>
        <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
          <Link
            to="/products"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md transition duration-150 ease-in-out text-md md:text-lg" // Adjusted padding/text
          >
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" // Link to the new "My Orders" page
            className="w-full sm:w-auto border border-green-600 text-green-700 hover:bg-green-100 font-semibold py-2.5 px-6 rounded-md transition duration-150 ease-in-out text-md md:text-lg" // Adjusted padding/text
          >
            View My Orders
          </Link> 
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
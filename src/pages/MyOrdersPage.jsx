// frontend/src/pages/MyOrdersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrdersAPI, cancelOrderAPI } from '../services/api';
import './MyOrdersPage.css'; // Assuming you have this CSS file

function MyOrdersPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setError("You must be logged in to view your orders. Please login again.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const fetchedOrders = await fetchMyOrdersAPI(token);
      setOrders(fetchedOrders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Could not load your orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancelOrder = async (orderIdToCancel) => {
    if (!window.confirm(`Are you sure you want to cancel order ID: ${orderIdToCancel}? This action cannot be undone.`)) {
        return;
    }
    setCancelingOrderId(orderIdToCancel);
    setError('');
    try {
      const response = await cancelOrderAPI(orderIdToCancel, token);
      console.log(response.message); 
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.order_id === orderIdToCancel ? { ...order, status: 'Canceled' } : order
        )
      );
    } catch (err) {
      console.error(`Error canceling order ${orderIdToCancel}:`, err);
      setError(`Failed to cancel order ${orderIdToCancel}: ${err.message || "Please try again."}`);
    } finally {
      setCancelingOrderId(null);
    }
  };

  const canCancelOrder = (orderStatus) => {
    if (!orderStatus) return true; 
    const cancellableStatuses = ['pending', 'processing'];
    return cancellableStatuses.includes(orderStatus.toLowerCase());
  };

  if (isLoading && orders.length === 0) {
    return <div className="text-center py-10 text-xl">Loading your orders...</div>;
  }

  if (error && !cancelingOrderId && orders.length === 0) { 
    return <div className="container mx-auto px-4 py-8 text-center alert-error">{error}</div>;
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 my-orders-empty-container">
        <h1 className="my-orders-page-title">My Orders</h1>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet.</p>
        <Link
          to="/products"
          className="btn btn-primary px-6 py-3 text-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8"> {/* Ensure .container provides horizontal padding */}
      <h1 className="my-orders-page-title">My Orders</h1>
      {error && !cancelingOrderId && <div className="alert-error mb-6">{error}</div>}

      <div className="orders-list-container">
        {orders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="order-card-header">
              <div className="order-card-header-info">
                <h2>Order ID: {order.order_id}</h2>
                <p>
                  Placed: {new Date(order.order_date).toLocaleDateString()} at {new Date(order.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="order-card-header-summary">
                <p className="total">Total: ${parseFloat(order.total).toFixed(2)}</p>
                <p className="status">
                  Status: <span className={`font-semibold ${
                                order.status && order.status.toLowerCase() === 'canceled' ? 'text-red-600' : 
                                order.status && order.status.toLowerCase() === 'delivered' ? 'text-green-600' :
                                'text-yellow-600'
                              }`}>
                            {order.status || 'Pending'}
                         </span>
                </p>
              </div>
            </div>
            
            <h3 className="order-items-title">Items Ordered:</h3>
            <div className="order-items-list">
              {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                <div key={`${item.product_id}-${index}`} className="order-item-detail">
                  <div className="order-item-image-container">
                      <img 
                          src={item.image_url || 'https://via.placeholder.com/60x60?text=NoImg'} 
                          alt={item.product_name || 'Product'} 
                          className="order-item-image"
                      />
                  </div>
                  <div className="order-item-info">
                      <h3>{item.product_name || 'Product Name Unavailable'}</h3>
                      <p>Qty: {item.quantity} × ${parseFloat(item.price_at_purchase).toFixed(2)}</p>
                  </div>
                  <p className="order-item-subtotal">${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</p>
                </div>
              )) : <p className="text-sm text-gray-500">No item details available for this order.</p>}
            </div>

            {order.shipping_address && ( // Conditionally render shipping if available
                <div className="order-shipping-details">
                    <h4>Shipping To:</h4>
                    <p>
                        {order.shipping_name || ''}<br/>
                        {order.shipping_address}<br/>
                        {order.shipping_phone || ''}
                     </p>
                </div>
            )}

            {canCancelOrder(order.status) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                <button
                  onClick={() => handleCancelOrder(order.order_id)}
                  disabled={cancelingOrderId === order.order_id}
                  className={`btn btn-danger px-4 py-2 text-sm ${ // Using global button styles
                    cancelingOrderId === order.order_id ? 'opacity-50 cursor-wait' : ''
                  }`}
                >
                  {cancelingOrderId === order.order_id ? 'Canceling...' : 'Cancel Order'}
                </button>
              </div>
            )}
            {order.status && order.status.toLowerCase() === 'canceled' && (
                 <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                    <p className="text-sm text-red-600 font-semibold">This order has been canceled.</p>
                 </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
 // frontend/src/pages/CheckoutPage.jsx
 import React, { useState, useEffect } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { createOrderAPI } from '../services/api';

 function CheckoutPage({ cartItems, token, currentUser, onOrderPlaced }) {
   const navigate = useNavigate();
   const [isPlacingOrder, setIsPlacingOrder] = useState(false);
   const [error, setError] = useState('');
   const [shippingDetails, setShippingDetails] = useState({
     name: '', email: '', address: '', phone: ''
   });

   useEffect(() => {
     if (currentUser) {
       setShippingDetails(prev => ({
         ...prev,
         name: currentUser.name || '',
         email: currentUser.email || '',
       }));
     }
   }, [currentUser]);

   const calculateTotal = () => {
     if (!cartItems || cartItems.length === 0) return 0.00;
     return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
   };
   const totalAmount = calculateTotal();

   const handleShippingChange = (e) => {
     const { name, value } = e.target;
     setShippingDetails(prev => ({ ...prev, [name]: value }));
   };
   
   const validateShippingDetails = () => {
     if (!shippingDetails.name.trim() || !shippingDetails.email.trim() || !shippingDetails.address.trim() || !shippingDetails.phone.trim()) {
       setError("Please fill in all shipping details.");
       return false;
     }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(shippingDetails.email.trim())) {
         setError("Please enter a valid email address.");
         return false;
     }
     const phoneRegex = /^\d{10,}$/; // Simple 10-digit check
     if (!phoneRegex.test(shippingDetails.phone.trim().replace(/\D/g, ''))) {
         setError("Please enter a valid 10-digit phone number.");
         return false;
     }
     setError('');
     return true;
   };

   const handlePlaceOrder = async () => {
     if (!validateShippingDetails()) return;
     if (!cartItems || cartItems.length === 0) { setError("Your cart is empty."); return; }

     setIsPlacingOrder(true);
     setError('');

     const orderPayload = {
       items: cartItems.map(item => ({
         product_id: item.id, // Assuming 'id' on frontend cart item is product_id
         quantity: item.quantity,
       })),
       total_amount: totalAmount, // Send the calculated total
       shipping_details: shippingDetails,
       payment_details: { method: "Cash on Delivery", status: "pending" }
     };

     try {
       console.log("Placing order (Mock COD) with payload:", orderPayload);
       const response = await createOrderAPI(orderPayload, token);
       
       alert(response.message || "Order placed successfully!");
       onOrderPlaced(); 
       navigate(`/order-success/${response.order_id}`);
     } catch (err) {
       console.error("Error placing order:", err);
       setError(err.message || "Failed to place order. Please try again.");
     } finally {
       setIsPlacingOrder(false);
     }
   };

   if (!cartItems || cartItems.length === 0) {
     return (
         <div className="container mx-auto px-4 py-8 text-center">
             <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
             <p className="text-gray-600 mb-6">Your cart is empty.</p>
             <Link 
                 to="/products" 
                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition duration-150 ease-in-out"
             > Shop Products </Link>
         </div>
     );
   }

   const isButtonDisabled = isPlacingOrder || cartItems.length === 0;

   return (
     <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Checkout</h1>
       {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded relative mb-6 text-center" role="alert">
         <strong className="font-bold">Error: </strong>
         <span className="block sm:inline">{error}</span>
       </div>}

       <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
         <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 order-2 md:order-1">
           <h2 className="text-2xl font-semibold mb-6 text-gray-700">Shipping Details</h2>
           <form onSubmit={(e) => e.preventDefault()}>
             <div className="mb-5">
               <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-name">Full Name</label>
               <input id="checkout-name" name="name" type="text" value={shippingDetails.name} onChange={handleShippingChange} required disabled={isPlacingOrder} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100" />
             </div>
             <div className="mb-5">
               <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-email">Email</label>
               <input id="checkout-email" name="email" type="email" value={shippingDetails.email} onChange={handleShippingChange} required disabled={isPlacingOrder} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100" />
             </div>
             <div className="mb-5">
               <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-address">Full Address</label>
               <textarea id="checkout-address" name="address" rows="3" value={shippingDetails.address} onChange={handleShippingChange} required disabled={isPlacingOrder} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100" placeholder="Street, City, State, Zip Code"></textarea>
             </div>
             <div className="mb-5">
               <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-phone">Phone Number</label>
               <input id="checkout-phone" name="phone" type="tel" value={shippingDetails.phone} onChange={handleShippingChange} required disabled={isPlacingOrder} className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100" placeholder="10-digit mobile number"></input>
             </div>
           </form>
         </div>

         <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 order-1 md:order-2">
           <h2 className="text-2xl font-semibold mb-6 text-gray-700">Order Summary</h2>
           {cartItems.map(item => (
             <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
               <div><p className="font-medium text-gray-800">{item.name} <span className="text-sm text-gray-500">x {item.quantity}</span></p></div>
               <p className="tabular-nums font-medium text-gray-700">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
             </div>
           ))}
           <div className="flex justify-between items-center mt-6 pt-4 border-t">
             <p className="text-xl font-bold text-gray-800">Total:</p>
             <p className="text-xl font-bold text-green-600 tabular-nums">${totalAmount.toFixed(2)}</p>
           </div>
           <button
             onClick={handlePlaceOrder}
             className={`mt-8 w-full font-bold py-3.5 px-4 rounded-md text-lg transition-colors duration-150 ease-in-out ${
               isButtonDisabled
                 ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                 : 'bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
             }`}
             disabled={isButtonDisabled}
           >
             {isPlacingOrder ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
           </button>
         </div>
       </div>
     </div>
   );
 }
 export default CheckoutPage;
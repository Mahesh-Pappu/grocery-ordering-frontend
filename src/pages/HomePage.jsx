import React from 'react';
import { Link } from 'react-router-dom'; // Import Link if you use it for internal navigation

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-100 py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-green-800">Fresh groceries, delivered fast.</h1>
        <p className="mt-4 text-lg text-green-700">Order from your local stores with ease and comfort.</p>
        {/* Assuming /shop will be an internal route for your products page */}
        <Link to="/products" className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700">
          Start Shopping
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-green-700">1. Browse</h3>
            <p>Select from a wide range of fresh groceries.</p>
          </div>
          <div>
            <h3 className="font-bold text-green-700">2. Add to Cart</h3>
            <p>Pick what you need and place your order.</p>
          </div>
          <div>
            <h3 className="font-bold text-green-700">3. Get Delivered</h3>
            <p>Your groceries are delivered right to your door.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
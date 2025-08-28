import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-blue-100 min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-900">Welcome to Our Store</h1>
      <p className="text-lg mb-6 text-gray-700">Find the best products tailored just for you</p>
      <Link to="/products">
        <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition">
          Browse Products
        </button>
      </Link>
    </div>
  );
};

export default Hero;

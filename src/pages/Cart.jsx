import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity, removeFromCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-black">Shopping Bag ({items.length})</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 border-b pb-4"
            >
              <img
                src={item.images?.[0] || item.thumbnail || 'https://placehold.co/100x140?text=No+Image'}
                alt={item.title}
                className="w-28 h-36 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <p className="text-pink-600 font-bold mt-2">₹{item.price} × {item.quantity}</p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => dispatch(decrementQuantity(item.id))}
                    className="px-2 py-1 border rounded"
                  >-</button>
                  <span className='text-black'>{item.quantity}</span>
                  <button
                    onClick={() => dispatch(incrementQuantity(item.id))}
                    className="px-2 py-1 border rounded"
                  >+</button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="ml-4 text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-xl font-bold text-right text-black mb-4">
            Total: ₹{total}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
            >
              Add More Items
            </button>

            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Cart;

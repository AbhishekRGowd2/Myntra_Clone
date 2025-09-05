import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCartAPI, removeFromCartAPI } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // fetch cart on mount if user exists
  useEffect(() => {
    if (user?.id || user?.uid) {
      dispatch(fetchCart(user.id || user.uid));
    } else {
      navigate("/login"); // redirect if not logged in
    }
  }, [user, dispatch, navigate]);

  if (!items || items.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const handleUpdate = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartAPI({ userId: user.id || user.uid, productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCartAPI({ userId: user.id || user.uid, productId }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-black">
          Shopping Bag ({items.length})
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div
                key={product.id || product._id || index}
                className="flex items-start gap-4 border-b pb-4"
              >
                <img
                  src={product.images?.[0] || product.thumbnail || "https://placehold.co/100x140?text=No+Image"}
                  alt={product.title}
                  className="w-28 h-36 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-pink-600 font-bold mt-2">
                    ₹{product.price} × {item.quantity}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleUpdate(product.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-black">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(product.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="ml-4 text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="text-xl font-bold text-right text-black mb-4">
            Total: ₹{(total || items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)).toFixed(2)}
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
            >
              Add More Items
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

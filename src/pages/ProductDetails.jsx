import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductById } from "../features/products/productSlice";
import {
  fetchCart,
  addToCartAPI,
  updateCartAPI,
  removeFromCartAPI,
  addToCartLocal,
  updateCartLocal,
  removeFromCartLocal
} from "../features/cart/cartSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, status } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const cartItem = useSelector((state) =>
  state.cart.items.find((item) => item.product.id === parseInt(id))
);


  // Fetch product on mount
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Fetch cart if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.uid));
    }
  }, [user, dispatch]);

  if (status === "loading" || !product) {
    return <p className="p-10 text-center text-lg">Loading...</p>;
  }

  const handleIncrement = async () => {
    if (!user) return navigate("/login");

    if (cartItem) {
      await dispatch(updateCartAPI({
        userId: user.uid,
        productId: product.id,
        quantity: cartItem.quantity + 1,
      }));
      dispatch(updateCartLocal({ productId: product.id, quantity: cartItem.quantity + 1 }));
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = async () => {
    if (!user) return navigate("/login");

    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      await dispatch(updateCartAPI({
        userId: user.uid,
        productId: product.id,
        quantity: cartItem.quantity - 1,
      }));
      dispatch(updateCartLocal({ productId: product.id, quantity: cartItem.quantity - 1 }));
    } else {
      await dispatch(removeFromCartAPI({ userId: user.uid, productId: product.id }));
      dispatch(removeFromCartLocal(product.id));
    }
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
  
    // Only call the API; the fulfilled case in slice will update the state
    await dispatch(addToCartAPI({ userId: user.uid, product }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-6 mb-10 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-10">
          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={product.images?.[0] || product.thumbnail || "https://placehold.co/500x600?text=No+Image"}
              alt={product.title}
              className="w-full h-auto object-contain rounded border p-4 bg-white"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
              <p className="text-md text-gray-500 mt-1">by {product.brand}</p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-bold text-pink-600">₹{product.price}</span>
                {product.discountPercentage && (
                  <span className="text-green-600 font-semibold">{product.discountPercentage}% off</span>
                )}
              </div>

              <p className="mt-6 text-gray-700">{product.description}</p>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Barcode:</strong> {product.meta?.barcode}</p>
                <p><strong>Stock:</strong> {product.stock} units</p>
                <p><strong>Minimum Order Qty:</strong> {product.minimumOrderQuantity}</p>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Dimensions:</strong> {product.dimensions?.width}W × {product.dimensions?.height}H × {product.dimensions?.depth}D</p>
                <p><strong>Weight:</strong> {product.weight}g</p>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
                <p><strong>Shipping:</strong> {product.shippingInformation}</p>
                <p><strong>Availability:</strong> {product.availabilityStatus}</p>
                <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
              </div>

              {product.meta?.qrCode && (
                <div className="mt-4">
                  <img src={product.meta.qrCode} alt="QR Code" className="w-24" />
                </div>
              )}
            </div>

            {/* Add to Cart */}
            {cartItem ? (
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-bold">Added</span>
                  <button onClick={handleDecrement} className="px-2 py-1 bg-gray-200 text-black rounded">-</button>
                  <span className="text-black">{cartItem.quantity}</span>
                  <button onClick={handleIncrement} className="px-2 py-1 bg-gray-200 text-black rounded">+</button>
                </div>
                <button
                  className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded transition"
                  onClick={() => navigate("/cart")}
                >
                  Go to Cart
                </button>
              </div>
            ) : (
              <button
                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded w-full transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={idx} className="border-b py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">{review.reviewerName}</p>
                  <span className="text-yellow-500">Rating: {review.rating}/5</span>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
                <p className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;

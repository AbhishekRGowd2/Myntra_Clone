import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setPage, setSort } from "../features/products/productSlice";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { X } from "lucide-react";

const Products = () => {
    const dispatch = useDispatch();
    const { products, page, limit, sort } = useSelector((state) => state.product);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts({ page, limit, sort }));
    }, [dispatch, page, limit, sort]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
            setShowSuggestions(false);
            return;
        }

        const filtered = products.filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredProducts(filtered);
        setShowSuggestions(true);
    }, [searchTerm, products]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-blue-50 text-black flex flex-col w-full">
            <Navbar />

            {/* Search bar */}
            <div className="max-w-6xl mx-auto w-full mt-6 px-4" ref={searchRef}>
                <div className="relative w-full">
                    <input
                        type="text"
                        className="w-full p-3 pr-10 rounded bg-pink-400 text-white placeholder-white border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => {
                            if (searchTerm.trim()) setShowSuggestions(true);
                        }}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                            onClick={() => {
                                setSearchTerm("");
                                setShowSuggestions(false);
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {showSuggestions && filteredProducts.length > 0 && (
                    <ul className="bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-md">
                        {filteredProducts.slice(0, 10).map((product) => (
                            <li
                                key={product.id}
                                className="px-4 py-2 cursor-pointer hover:bg-pink-100"
                                onClick={() => {
                                    setSearchTerm(product.title);
                                    setShowSuggestions(false);
                                }}
                            >
                                <Link to={`/product/${product.id}`}>
                                    <span className="font-semibold">{product.title}</span> -{" "}
                                    <span className="text-pink-600">₹{product.price}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {showSuggestions && filteredProducts.length === 0 && (
                    <div className="bg-white border border-gray-300 rounded mt-1 p-2 text-gray-500">
                        No products found.
                    </div>
                )}
            </div>

            {/* Products grid */}
            <div className="max-w-6xl mx-auto mt-8 px-4 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={
                                        product.images?.[0] ||
                                        product.thumbnail ||
                                        "https://placehold.co/300x400?text=No+Image"
                                    }
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-3 flex flex-col gap-1">
                                <h3 className="text-sm font-bold text-gray-800 truncate">{product.brand || "Brand"}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.title}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm line-through text-gray-400">₹{product.originalPrice}</span>
                                    )}
                                    {product.discountPercentage && (
                                        <span className="text-sm text-pink-600 font-medium">{product.discountPercentage}% off</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="max-w-6xl mx-auto m-6 flex justify-center gap-3">
                <button
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    disabled={page <= 1}
                    onClick={() => dispatch(setPage(page - 1))}
                >
                    Previous
                </button>
                <span className="px-4 py-2 bg-white border rounded">{page}</span>
                <button
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    onClick={() => dispatch(setPage(page + 1))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Products;

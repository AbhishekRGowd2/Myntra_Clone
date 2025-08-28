// src/pages/ProductDetails.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProductDetails from "./ProductDetails";
import { addToCart } from "../features/cart/cartSlice";

// Mock react-router hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate,
}));

// Mock Navbar and Footer
jest.mock("../Components/Navbar", () => () => <div>Navbar</div>);
jest.mock("../Components/Footer", () => () => <div>Footer</div>);

// Mock cart actions
jest.mock("../features/cart/cartSlice", () => ({
  addToCart: jest.fn(() => ({ type: "ADD_TO_CART" })),
  incrementQuantity: jest.fn(() => ({ type: "INCREMENT_QUANTITY" })),
  decrementQuantity: jest.fn(() => ({ type: "DECREMENT_QUANTITY" })),
}));

describe("ProductDetails Component", () => {
  const mockStore = configureStore([]);
  let store;
  
  const mockProduct = {
    id: 1,
    title: "Test Product",
    brand: "Brand X",
    price: 999,
    description: "Test description",
    sku: "SKU123",
    category: "Category1",
    meta: { barcode: "1234567890" },
    stock: 10,
    minimumOrderQuantity: 1,
    dimensions: { width: 10, height: 20, depth: 5 },
    weight: 500,
    warrantyInformation: "1 Year",
    shippingInformation: "Ships in 2 days",
    availabilityStatus: "In Stock",
    returnPolicy: "30 Days",
    images: ["test-image.jpg"],
    reviews: []
  };

  beforeEach(() => {
    store = mockStore({
      product: {
        products: [mockProduct]
      },
      auth: {
        user: { id: 1, name: "Test User" }
      },
      cart: {
        items: []
      }
    });
    
    jest.clearAllMocks();
  });

  test("renders product details", () => {
    render(
      <Provider store={store}>
        <ProductDetails />
      </Provider>
    );
    
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(/Brand X/i)).toBeInTheDocument();
    expect(screen.getByText(/₹999/i)).toBeInTheDocument();
  });

  test("clicking Add to Cart dispatches action", () => {
    render(
      <Provider store={store}>
        <ProductDetails />
      </Provider>
    );
    
    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(addToCartButton);

    expect(addToCart).toHaveBeenCalledWith(mockProduct);
  });

  test("redirects to login if no user", () => {
    // Create a new store with no user
    const storeWithoutUser = mockStore({
      product: {
        products: [mockProduct]
      },
      auth: {
        user: null
      },
      cart: {
        items: []
      }
    });
    
    render(
      <Provider store={storeWithoutUser}>
        <ProductDetails />
      </Provider>
    );
    
    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(addToCartButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(addToCart).not.toHaveBeenCalled();
  });

  test("shows quantity controls when product is in cart", () => {
    // Create a store with the product in cart
    const storeWithCartItem = mockStore({
      product: {
        products: [mockProduct]
      },
      auth: {
        user: { id: 1, name: "Test User" }
      },
      cart: {
        items: [{ id: 1, quantity: 2 }]
      }
    });
    
    render(
      <Provider store={storeWithCartItem}>
        <ProductDetails />
      </Provider>
    );
    
    expect(screen.getByText("Added")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
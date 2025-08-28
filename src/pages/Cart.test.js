// src/pages/Cart.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./Cart";

// Mock react-redux
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Cart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders empty cart message", () => {
    const { useSelector } = require("react-redux");
    useSelector.mockReturnValue({ items: [] });

    render(<Cart />);
    // specifically match the h2 element to avoid multiple matches
    expect(screen.getByRole("heading", { name: /Your Cart/i })).toBeInTheDocument();
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items and total", () => {
    const { useSelector } = require("react-redux");
    useSelector.mockReturnValue({
      items: [
        { id: 1, title: "Product A", price: 100, quantity: 2, brand: "BrandX" },
        { id: 2, title: "Product B", price: 200, quantity: 1, brand: "BrandY" },
      ],
    });

    render(<Cart />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();

    // Match total using regex to handle React splitting nodes
    expect(screen.getByText(/Total:\s*₹\s*400/)).toBeInTheDocument();
  });

  test("increment, decrement, remove buttons call dispatch", () => {
    const { useSelector } = require("react-redux");
    useSelector.mockReturnValue({
      items: [
        { id: 1, title: "Product A", price: 100, quantity: 2 },
      ],
    });

    render(<Cart />);

    fireEvent.click(screen.getByText("-"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText(/Remove/i));

    expect(mockDispatch).toHaveBeenCalledTimes(3);
  });

  test("navigates when Add More Items button clicked", () => {
    const { useSelector } = require("react-redux");
    useSelector.mockReturnValue({
      items: [{ id: 1, title: "Product A", price: 100, quantity: 1 }],
    });

    render(<Cart />);
    fireEvent.click(screen.getByText(/Add More Items/i));
    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });
});

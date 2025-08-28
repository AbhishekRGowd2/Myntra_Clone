// src/pages/Products.test.js
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Products from "./Products";

// Mock Redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn().mockReturnValue({
    products: [
      { id: 1, title: "Product A", price: 100 },
      { id: 2, title: "Product B", price: 200 },
    ],
  }),
  useDispatch: () => jest.fn(),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock Navbar component
jest.mock("../Components/Navbar", () => () => <div>Navbar</div>);

// Mock lucide-react X icon
jest.mock("lucide-react", () => ({
  X: () => <span>XIcon</span>,
}));

describe("Products Component", () => {
  test("renders products and search input", () => {
    render(<Products />);
    
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  test("filters products in suggestions when typing in search", () => {
    render(<Products />);
    
    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "Product A" } });

    // Suggestion dropdown container
    const suggestionList = screen.getByRole("list");
    const { getByText, queryByText } = within(suggestionList);

    expect(getByText("Product A")).toBeInTheDocument();
    expect(queryByText("Product B")).toBeNull();
  });

  test("clears search when X button is clicked", () => {
    render(<Products />);

    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "Product A" } });

    const xButton = screen.getByText("XIcon");
    fireEvent.click(xButton);

    expect(input.value).toBe("");
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });
});

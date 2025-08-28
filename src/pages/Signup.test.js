// src/pages/Signup.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./Signup";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock Firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})), // required if firebase.js uses getAuth
  signInWithPhoneNumber: jest.fn(),
  RecaptchaVerifier: jest.fn(),
}));

// Mock firebase.js to avoid real initialization
jest.mock("../firebase", () => ({
  auth: {}, // fake auth object
}));

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders phone input and button", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/Phone Number/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send OTP/i })).toBeInTheDocument();
  });

  test("sends OTP when phone entered", async () => {
    signInWithPhoneNumber.mockResolvedValue({ confirm: jest.fn() });
    RecaptchaVerifier.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "+919876543210" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send OTP/i }));

    await waitFor(() => {
      expect(signInWithPhoneNumber).toHaveBeenCalled();
    });
  });

  test("verifies OTP after it is sent", async () => {
    const confirmMock = jest.fn().mockResolvedValue({ user: { uid: "123" } });
    signInWithPhoneNumber.mockResolvedValue({ confirm: confirmMock });
    RecaptchaVerifier.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Send OTP step
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "+919876543210" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send OTP/i }));

    // Wait for OTP input
    await screen.findByPlaceholderText(/Enter OTP/i);

    // Verify OTP step
    fireEvent.change(screen.getByPlaceholderText(/Enter OTP/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Verify OTP/i }));

    await waitFor(() => {
      expect(confirmMock).toHaveBeenCalledWith("123456");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});

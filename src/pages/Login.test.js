// src/pages/Login.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { MemoryRouter } from "react-router-dom";

// 🔹 Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// 🔹 Mock Firebase auth functions
jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({})),  // return a dummy auth object
    signInWithPhoneNumber: jest.fn(),
    RecaptchaVerifier: jest.fn(),
  }));
  

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders phone input and send OTP button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send OTP/i })).toBeInTheDocument();
  });

  test("sends OTP when phone number entered", async () => {
    // mock Firebase OTP sending
    signInWithPhoneNumber.mockResolvedValue({ confirm: jest.fn() });
    RecaptchaVerifier.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const phoneInput = screen.getByPlaceholderText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: "+919876543210" } });

    const sendButton = screen.getByRole("button", { name: /Send OTP/i });
    fireEvent.click(sendButton);

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
        <Login />
      </MemoryRouter>
    );

    // Step 1: Send OTP
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "+919876543210" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send OTP/i }));

    // Wait until OTP input appears
    await screen.findByPlaceholderText(/Enter OTP/i);

    // Step 2: Verify OTP
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

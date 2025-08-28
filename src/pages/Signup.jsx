import React, { useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const configureCaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("Recaptcha verified"),
      });
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    configureCaptcha();
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      alert("OTP sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Check phone number format.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("User signed up successfully", user);
      navigate("/"); // redirect after signup
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Sign Up</h2>

        <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-4">
          {!otpSent && (
            <input
              type="tel"
              placeholder="Phone Number (e.g. +919876543210)"
              className="border border-gray-300 p-3 w-full rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}

          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-300 p-3 w-full rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="bg-pink-600 text-white w-full py-3 rounded hover:bg-pink-700 transition"
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>

          {/* Required for Firebase Recaptcha */}
          <div id="recaptcha-container" />
        </form>
      </div>
    </div>
  );
};

export default Signup;

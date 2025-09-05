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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-6xl h-[700px] overflow-hidden bg-pink-100 border">
        {/* Left image 65% */}
        <div className="hidden md:block md:w-2/3 p-4 border-4 border-transparent">
          <img
            src="/myntra-banner2.jpg"
            alt="Signup Visual"
            className="object-contain h-full w-full rounded-lg"
          />
        </div>

        {/* Right form 35% */}
        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center items-center md:items-start bg-pink-100">
          <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center md:text-left">
            Sign Up
          </h2>

          <form onSubmit={otpSent ? verifyOtp : sendOtp} className="space-y-4 w-full">
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
    </div>
  );
};

export default Signup;

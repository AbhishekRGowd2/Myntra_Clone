import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import Footer from "../Components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col w-full border-4">
        <Navbar />
        <main className="flex-grow w-full border-4">
          <Hero />
        </main>
        <Footer />
      </div>
      
    );
  };
  
  

export default Home;

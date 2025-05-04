// src/components/HeroWrapper.jsx
import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import "./HeroWrapper.css";

const HeroWrapper = () => {
  return (
    <div className="hero-wrapper">
      <div className="overlay"></div>
      <Navbar />
      <Hero />
    </div>
  );
};

export default HeroWrapper;

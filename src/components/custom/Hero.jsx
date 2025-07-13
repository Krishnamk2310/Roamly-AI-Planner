import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col justify-center items-center text-center px-4 md:px-56 py-16">
      {/* Heading */}
      <h1 className="font-extrabold text-3xl md:text-[48px] leading-tight">
        <span className="text-[#f56551] block">
          Discover Your Next Adventure with AI:
        </span>
        <span className="text-black block py-3">
          Personalized Itineraries at Your Fingertips
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl">
        Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget.
      </p>

      {/* Button */}
      <Link to={'/create-trip'}>
        <Button className="mt-6 !bg-black !text-white px-6 py-3 text-sm font-semibold hover:!bg-[#1a1a1a] transition-all duration-200">
        Get Started, It's Free
        </Button>
      </Link>
      
      {/* <img src="" className='-mt-20' alt="" /> */}

    </div>
  );
}

export default Hero;

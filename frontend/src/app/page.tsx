"use client"; // This marks this component as a Client Component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set mounted to true once the component is hydrated
    // Dynamically modify attributes only after client-side rendering
    document.documentElement.setAttribute("data-darkreader-mode", "dynamic");
    document.documentElement.setAttribute("data-darkreader-scheme", "dark");
  }, []);

  // Return null if the component isn't mounted yet (to avoid hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Our App</h1>
        <p className="text-lg text-gray-600">Your one-stop solution for all your needs.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
        <p className="text-lg text-gray-600">Logo Placeholder</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">Get Started</h2>
        <p className="text-lg text-gray-600">Sign up or log in to access all features.</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Link href="/auth">Sign Up / Log In</Link>
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Learn More</button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-600">
          <li>Feature 1: Description of feature 1</li>
          <li>Feature 2: Description of feature 2</li>
          <li>Feature 3: Description of feature 3</li>
          <li>Feature 4: Description of feature 4</li>
          <li>Feature 5: Description of feature 5</li>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p className="text-lg text-gray-600">If you have any questions or feedback, feel free to reach out!</p>
        <footer className="text-sm text-gray-500">&copy; 2023 Your Company. All rights reserved.</footer>
      </div>
    </div>
  );
}

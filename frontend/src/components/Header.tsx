"use client";
import Link from 'next/link'; 
import React, { useState } from 'react';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 sm:px-5 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl sm:text-2xl font-bold">
                    Quiz App
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex space-x-2 sm:space-x-4">
                    <Link href="/create-quiz" className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 transition">
                        Create Quiz
                    </Link>
                    <Link href="/join-quiz" className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-600 transition">
                        Join Quiz
                    </Link>
                    <Link href="/admin" className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-600 transition">
                        Admin
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
                        {isMenuOpen ? (
                            // Close icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger icon
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col space-y-2 p-4 bg-white shadow-md">
                    <Link href="/create-quiz" className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition">
                        Create Quiz
                    </Link>
                    <Link href="/join-quiz" className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition">
                        Join Quiz
                    </Link>
                    <Link href="/admin" className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition">
                        Admin
                    </Link>
                </div>
            )}
        </header>
    );
}

export default Header;

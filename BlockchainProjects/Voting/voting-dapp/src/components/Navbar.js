// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
                🗳 Voting DApp
            </Link>
            <div className="flex space-x-6">
                <Link to="/" className="hover:text-blue-300 transition duration-200">
                    Home
                </Link>
                <Link to="/vote" className="hover:text-blue-300 transition duration-200">
                    Vote
                </Link>
                <Link to="/results" className="hover:text-blue-300 transition duration-200">
                    Results
                </Link>
                <Link to="/admin" className="hover:text-blue-300 transition duration-200">
                    Admin
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
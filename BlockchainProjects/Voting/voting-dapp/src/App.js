// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './Web3Context';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vote from './pages/Vote';
import Results from './pages/Results';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Web3Provider>
            <Router>
                <div className="min-h-screen bg-gray-100 text-gray-900">
                    <Navbar />
                    <main className="p-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/vote" element={<Vote />} />
                            <Route path="/results" element={<Results />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </Web3Provider>
    );
};

export default App;
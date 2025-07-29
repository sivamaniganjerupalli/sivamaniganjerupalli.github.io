// src/pages/Home.js

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserCircle, FaShieldAlt, FaVoteYea,
    FaUserCog, FaChartLine, FaGlobe
} from 'react-icons/fa';
import { RiWallet3Line } from 'react-icons/ri';
import { Web3Context } from '../Web3Context';

const Home = () => {
    const { account, error } = useContext(Web3Context);
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (err) {
                console.error("Wallet connection error:", err);
            }
        } else {
            alert("Please install MetaMask to use this DApp.");
        }
    };

    const featureCards = [
        {
            icon: <FaShieldAlt className="text-green-500 text-2xl" />,
            title: "Unmatched Security & Immutability",
            description: "Every vote is a transaction recorded on the Ethereum blockchain. Once cast, it is cryptographically secured and cannot be altered, deleted, or censored by anyone, ensuring the ultimate integrity of the election results.",
            borderColor: "border-green-500"
        },
        {
            icon: <FaVoteYea className="text-blue-500 text-2xl" />,
            title: "Complete Transparency",
            description: "The entire voting process, from candidate registration to the final tally, is publicly verifiable on the blockchain. This radical transparency builds trust and eliminates any possibility of hidden manipulation.",
            borderColor: "border-blue-500"
        },
        {
            icon: <FaUserCog className="text-red-500 text-2xl" />,
            title: "Centralized Admin Control",
            description: "A designated administrator has the sole authority to manage the election lifecycle. The admin is responsible for adding verified candidates and setting the start and end times, providing structure and preventing unauthorized changes.",
            borderColor: "border-red-500"
        },
        {
            icon: <FaChartLine className="text-purple-500 text-2xl" />,
            title: "Real-Time, Trustless Results",
            description: "Witness the results unfold in real-time. As each vote is cast, the tally is updated instantly and displayed for all to see. No need to trust a central authority to count the votes; the smart contract does it automatically.",
            borderColor: "border-purple-500"
        },
        {
            icon: <FaGlobe className="text-yellow-500 text-2xl" />,
            title: "Accessible & Fair Voting",
            description: "Participate from anywhere in the world. Our system prevents double-voting by ensuring each address can only vote once, guaranteeing a fair 'one wallet, one vote' process for your community.",
            borderColor: "border-yellow-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 py-10 px-6 lg:px-20">
            <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-purple-700">🗳 Welcome to VoteChain</h1>
                {!account ? (
                    <button
                        onClick={connectWallet}
                        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mt-4 lg:mt-0"
                    >
                        <RiWallet3Line className="text-xl" />
                        Connect Wallet
                    </button>
                ) : (
                    <div className="flex items-center bg-white border border-gray-200 shadow p-3 rounded-lg mt-4 lg:mt-0">
                        <FaUserCircle className="text-2xl text-purple-600 mr-3" />
                        <div>
                            <p className="text-gray-500 text-sm">Connected Account</p>
                            <p className="text-gray-800 font-mono text-sm truncate max-w-xs">{account}</p>
                        </div>
                    </div>
                )}
            </div>
            
            {error && <p className="text-center text-red-500 font-semibold mb-6 bg-red-100 p-3 rounded-lg">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                {/* --- UPDATED & EXPANDED INTRODUCTORY TEXT --- */}
                <div className="lg:col-span-2 space-y-4">
                    <p className="text-gray-700 text-lg">
                        Welcome to VoteChain, a revolutionary decentralized voting platform built on the robust Ethereum blockchain. We are dedicated to ushering in a new era of elections defined by absolute transparency, cryptographic security, and unwavering integrity. By leveraging the power of smart contracts, VoteChain eliminates the need for trusted intermediaries, placing the power of a fair and open election directly into the hands of the community.
                    </p>
                    <p className="text-gray-700 text-lg">
                        At the heart of VoteChain is a simple yet powerful principle: every vote is a secure transaction. When you cast your vote, it is broadcasted to the network, permanently recorded on an immutable public ledger, and secured by the same cryptographic principles that protect digital assets. This makes the results completely tamper-proof—they cannot be altered, censored, or deleted by any single entity.
                    </p>
                     <p className="text-gray-700 text-lg">
                        We offer a unique balance of public auditability and voter privacy. While the voting process is entirely transparent—allowing anyone to independently verify the results in real-time—your vote is tied to your pseudonymous Ethereum address, not your personal identity. This ensures that while the process is auditable, your individual choice remains private. The system also guarantees fairness by programmatically enforcing a 'one wallet, one vote' rule, making double-voting a thing of the past.
                    </p>
                </div>
                <div className="flex justify-center">
                    <img src="https://www.europeanbusinessreview.com/wp-content/uploads/2022/11/blockchain-voting-system-1024x670.jpeg" alt="Voting Illustration" className="w-full max-w-xs rounded-xl shadow-xl"/>
                </div>
            </div>

            <div className="flex justify-center my-12">
                <button
                    onClick={() => navigate('/vote')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-xl font-semibold transition shadow-lg disabled:bg-gray-400"
                    disabled={!account}
                >
                    🗳 Cast Your Vote
                </button>
            </div>

            {/* --- Feature Cards Section --- */}
            <div className="max-w-4xl mx-auto mt-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose VoteChain?</h2>
                <div className="flex flex-col gap-6">
                    {featureCards.map((card, index) => (
                        <div key={index} className={`bg-white shadow-lg rounded-xl p-6 border-l-4 ${card.borderColor} flex items-start space-x-4 transition hover:shadow-2xl hover:scale-105`}>
                            <div className="flex-shrink-0 mt-1">{card.icon}</div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                                <p className="text-gray-600 mt-1">{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default Home;
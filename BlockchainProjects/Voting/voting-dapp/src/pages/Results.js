// src/pages/Results.js

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Web3Context } from '../Web3Context';
import { FaVoteYea, FaTrophy } from 'react-icons/fa';

const Results = () => {
    const { contract, loading: contextLoading, error: contextError } = useContext(Web3Context);
    const [candidates, setCandidates] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [winner, setWinner] = useState(null);
    const [isEnded, setIsEnded] = useState(false);

    const fetchResultsData = useCallback(async () => {
        if (!contract) return;
        setPageLoading(true);
        try {
            const count = await contract.methods.getTotalCandidates().call();
            const list = [];
            for (let i = 0; i < count; i++) {
                const c = await contract.methods.getCandidate(i).call();
                list.push({
                    id: parseInt(c[0]), name: c[1], party: c[2], constituency: c[3], logo: c[4], voteCount: parseInt(c[5])
                });
            }
            // Sort by vote count descending
            list.sort((a, b) => b.voteCount - a.voteCount);
            setCandidates(list);

            const ended = await contract.methods.isElectionEnded().call();
            setIsEnded(ended);
            if (ended && list.length > 0) {
                setWinner(list[0]);
            }
        } catch (err) {
            console.error('Error loading results:', err);
        } finally {
            setPageLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        fetchResultsData();
    }, [fetchResultsData]);

    if (contextLoading) return <p className="text-center text-gray-500">⏳ Connecting to blockchain...</p>;
    if (contextError) return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{contextError}</p>;
    if (pageLoading) return <p className="text-center text-gray-500">⏳ Loading results...</p>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">🗳️ Voting Results</h1>

            {isEnded && winner && (
                <div className="max-w-2xl mx-auto bg-gradient-to-r from-yellow-300 to-yellow-500 p-6 rounded-2xl shadow-lg mb-8 text-center border-2 border-yellow-600">
                    <h2 className="text-2xl font-bold text-yellow-900 flex items-center justify-center gap-2"><FaTrophy /> Election Winner</h2>
                    <img src={winner.logo} alt={winner.name} className="w-24 h-24 rounded-full mx-auto my-4 border-4 border-white shadow-md"/>
                    <p className="text-3xl font-bold text-gray-800">{winner.name}</p>
                    <p className="text-xl text-gray-700">{winner.party}</p>
                    <p className="text-2xl font-semibold text-gray-800 mt-2">{winner.voteCount} Votes</p>
                </div>
            )}
            
            {!isEnded && <p className="text-center text-blue-600 font-semibold mb-6">ℹ️ Results are live. The final winner will be declared after the election ends.</p>}

            <div className="flex flex-col items-center space-y-6">
                {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-200 px-6 py-5 flex justify-between items-center hover:shadow-lg transition">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-gray-400 w-10 text-center">{index + 1}</span>
                            <div>
                                <h2 className="text-2xl font-semibold text-indigo-700">{candidate.name || 'Unnamed Candidate'}</h2>
                                <div className="flex items-center mt-2 text-gray-700 text-lg">
                                    <FaVoteYea className="text-green-500 mr-2" />
                                    <span className="font-medium">{candidate.voteCount} vote{candidate.voteCount !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                        <img src={candidate.logo} alt={`Logo of ${candidate.name}`} className="ml-6 w-20 h-20 rounded-full object-contain border-2 border-purple-500 shadow-md" onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=No+Logo" }}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
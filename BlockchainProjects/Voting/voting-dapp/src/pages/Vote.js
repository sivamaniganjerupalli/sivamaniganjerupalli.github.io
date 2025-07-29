// src/pages/Vote.js

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Web3Context } from '../Web3Context';

const Vote = () => {
    const { account, contract, loading: contextLoading, error: contextError, refresh } = useContext(Web3Context);
    const [candidates, setCandidates] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [isElectionActive, setIsElectionActive] = useState(false);

    const fetchVoteData = useCallback(async () => {
        if (!contract || !account) return;
        setPageLoading(true);
        try {
            const count = await contract.methods.getTotalCandidates().call();
            const list = [];
            for (let i = 0; i < count; i++) {
                const c = await contract.methods.getCandidate(i).call();
                // Only show active candidates on the voting page
                if (c[6]) { // c[6] is the 'active' flag
                    list.push({
                        id: c[0], name: c[1], party: c[2], constituency: c[3], logo: c[4], voteCount: c[5],
                    });
                }
            }
            setCandidates(list);

            const voted = await contract.methods.checkIfVoted(account).call();
            setHasVoted(voted);

            const remainingTime = await contract.methods.getRemainingTime().call();
            setIsElectionActive(parseInt(remainingTime) > 0);

        } catch (err) {
            console.error("Error fetching vote data:", err);
        } finally {
            setPageLoading(false);
        }
    }, [contract, account]);

    useEffect(() => {
        fetchVoteData();
    }, [fetchVoteData]);
    
    const handleVote = async (id) => {
        if (!contract || !account || hasVoted) return;
        try {
            await contract.methods.vote(id).send({ from: account });
            alert("✅ Vote cast successfully!");
            setHasVoted(true);
            fetchVoteData(); // Refresh vote counts
            refresh(); // Refresh context if needed
        } catch (err) {
            console.error("Vote error:", err);
            alert("⚠️ Vote failed. Check the console for details.");
        }
    };

    if (contextLoading) return <p className="text-center text-gray-500">⏳ Connecting to blockchain...</p>;
    if (contextError) return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{contextError}</p>;
    if (pageLoading) return <p className="text-center text-gray-500">⏳ Loading voting session...</p>;
    if (!isElectionActive) return <p className="text-center text-blue-600 font-semibold mb-6">ℹ️ The election is not currently active.</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
            <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">🗳 Vote for Your Candidate</h1>
            
            <div className="flex flex-col space-y-6">
                {candidates.length === 0 ? (
                    <p className="text-center text-gray-500">No active candidates found.</p>
                ) : (
                    candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition-all duration-300">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                                <p className="text-sm text-gray-600">🏛 Party: {candidate.party}</p>
                                <p className="text-sm text-gray-600 mb-4">📍 Constituency: {candidate.constituency}</p>
                                <button
                                    onClick={() => handleVote(candidate.id)}
                                    disabled={hasVoted}
                                    className="px-5 py-2 rounded-md font-semibold transition bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {hasVoted ? "✅ Voted" : "Vote"}
                                </button>
                            </div>
                            <img src={candidate.logo} alt={`Logo of ${candidate.name}`} className="ml-6 w-20 h-20 rounded-full object-contain border-2 border-purple-500 shadow-md" onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=No+Logo" }}/>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Vote;
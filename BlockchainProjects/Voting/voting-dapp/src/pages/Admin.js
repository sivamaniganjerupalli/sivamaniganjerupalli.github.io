// src/pages/Admin.js

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Web3Context } from '../Web3Context';

const Admin = () => {
    const { account, contract, isAdmin, loading: contextLoading, error: contextError, refresh } = useContext(Web3Context);
    const [candidates, setCandidates] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');
    
    const [formOpen, setFormOpen] = useState(false);
    const [candidateName, setCandidateName] = useState('');
    const [partyName, setPartyName] = useState('');
    const [constituency, setConstituency] = useState('');
    const [logoURL, setLogoURL] = useState('');

    const fetchAdminData = useCallback(async () => {
        if (!contract) return;
        setPageLoading(true);
        try {
            const count = await contract.methods.getTotalCandidates().call();
            const candidatesList = [];
            for (let i = 0; i < count; i++) {
                const c = await contract.methods.getCandidate(i).call();
                candidatesList.push({
                    id: c[0], name: c[1], party: c[2], constituency: c[3], logo: c[4], voteCount: c[5], active: c[6],
                });
            }
            setCandidates(candidatesList);

            const remaining = await contract.methods.getRemainingTime().call();
            setTimeLeft(parseInt(remaining));
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setPageLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        if (contract) {
            fetchAdminData();
        }
    }, [contract, fetchAdminData]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        if (seconds <= 0) return "Election ended";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!contract || !candidateName || !partyName || !constituency || !logoURL) return;
        try {
            await contract.methods.addCandidate(candidateName, partyName, constituency, logoURL).send({ from: account });
            setFormOpen(false);
            setCandidateName(''); setPartyName(''); setConstituency(''); setLogoURL('');
            fetchAdminData(); // Refresh data
            refresh(); // Refresh context
        } catch (err) {
            console.error("Add candidate failed:", err);
        }
    };

    const handleDeactivateCandidate = async (id) => {
        if (!contract) return;
        try {
            await contract.methods.deactivateCandidate(id).send({ from: account });
            fetchAdminData(); // Refresh data
        } catch (err) {
            console.error("Deactivate candidate failed:", err);
        }
    };
    
    const handleStartElection = async () => {
        if (!contract) return;
        const duration = 24 * 60 * 60; // 24 hours in seconds
        try {
            await contract.methods.startElection(duration).send({ from: account });
            fetchAdminData();
            refresh();
        } catch (err) {
            console.error("Start election failed:", err);
        }
    };
    
    const handleEndElection = async () => {
        if (!contract) return;
        try {
            await contract.methods.endElection().send({ from: account });
            fetchAdminData();
            refresh();
        } catch (err) {
            console.error("End election failed:", err);
        }
    };

    if (contextLoading) return <p className="text-center text-gray-500">⏳ Connecting to blockchain...</p>;
    if (contextError) return <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{contextError}</p>;
    if (!isAdmin) return <p className="text-center text-red-600 font-semibold mb-6">🚫 You are not the admin.</p>;
    if (pageLoading) return <p className="text-center text-gray-500">⏳ Loading admin data...</p>;
    
    return (
        <div className="max-w-4xl mx-auto p-6 font-sans">
            <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">🛠 Admin Dashboard</h1>
            <div className="bg-white shadow rounded-lg p-4 mb-6 border">
                <p className="text-sm text-gray-500">Admin Account:</p>
                <p className="text-lg font-mono text-gray-800">{account}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
                <button onClick={handleStartElection} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">✅ Start Election (24h)</button>
                <button onClick={handleEndElection} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">🛑 End Election</button>
            </div>

            {timeLeft > 0 && (
                <div className="text-center text-2xl font-bold text-blue-600 mb-4">
                    ⏰ Time Left: {formatTime(timeLeft)}
                </div>
            )}

            <button onClick={() => setFormOpen(!formOpen)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-4">
                {formOpen ? "➖ Close Form" : "➕ Add Candidate"}
            </button>

            {formOpen && (
                <form onSubmit={handleAddCandidate} className="bg-white shadow p-4 rounded-lg space-y-4 mb-6">
                    <input type="text" placeholder="Candidate Name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full border px-4 py-2 rounded-md" required />
                    <input type="text" placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="w-full border px-4 py-2 rounded-md" required />
                    <input type="text" placeholder="Constituency" value={constituency} onChange={(e) => setConstituency(e.target.value)} className="w-full border px-4 py-2 rounded-md" required />
                    <input type="url" placeholder="Logo Image URL" value={logoURL} onChange={(e) => setLogoURL(e.target.value)} className="w-full border px-4 py-2 rounded-md" required />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md">Submit Candidate</button>
                </form>
            )}

            <h2 className="text-xl font-semibold mb-4">📋 Candidates List</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map((c) => (
                    <div key={c.id} className={`p-4 rounded-lg shadow-md flex items-center space-x-4 ${c.active ? 'bg-gray-100' : 'bg-red-100 opacity-60'}`}>
                        <img src={c.logo} alt={`${c.name} logo`} className="w-16 h-16 object-contain rounded-full border bg-white" onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=No+Logo" }}/>
                        <div className="flex-1">
                            <p className="font-bold text-lg">{c.name} {c.active ? '' : '(Deactivated)'}</p>
                            <p className="text-sm text-gray-500">Votes: {c.voteCount}</p>
                        </div>
                        {c.active && <button onClick={() => handleDeactivateCandidate(c.id)} className="text-red-500 hover:text-red-700 text-sm">🗑 Deactivate</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
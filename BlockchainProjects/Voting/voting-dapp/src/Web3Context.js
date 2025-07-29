// src/Web3Context.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';
import { contractAddress } from './config';
import config from './config';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadBlockchainData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (!window.ethereum) {
                setError('🦊 Please install MetaMask to use this app.');
                setLoading(false);
                return;
            }

            const web3 = new Web3(window.ethereum);
            
            // Check for correct network
            const chainId = await web3.eth.getChainId();
            if (parseInt(chainId) !== parseInt(config.network.chainId, 16)) {
                setError(`❌ Please connect to the correct network (Chain ID: ${parseInt(config.network.chainId, 16)}).`);
                setLoading(false);
                return;
            }

            // Get accounts
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                 await window.ethereum.request({ method: 'eth_requestAccounts' });
                 const newAccounts = await web3.eth.getAccounts();
                 setAccount(newAccounts[0]);
            } else {
                setAccount(accounts[0]);
            }
            
            // Instantiate contract
            const instance = new web3.eth.Contract(VotingContract.abi, contractAddress);
            setContract(instance);

            // Check if user is admin
            if (accounts.length > 0) {
                const adminAddr = await instance.methods.admin().call();
                setIsAdmin(accounts[0].toLowerCase() === adminAddr.toLowerCase());
            }

        } catch (err) {
            console.error('Blockchain load error:', err);
            setError('⚠️ Failed to load blockchain data. Check console for details.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBlockchainData();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    loadBlockchainData(); // Reload data on account change
                } else {
                    setAccount('');
                    setIsAdmin(false);
                }
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload(); // Reload page on network change
            });
        }
    }, [loadBlockchainData]);

    const value = {
        account,
        contract,
        isAdmin,
        loading,
        error,
        refresh: loadBlockchainData,
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};
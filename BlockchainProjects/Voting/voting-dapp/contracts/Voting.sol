// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public electionStarted;
    bool public electionEnded;
    uint public startTime;
    uint public duration; // Duration will be set when the election starts

    struct Candidate {
        uint id;
        string name;
        string party;
        string constituency;
        string logo;
        uint voteCount;
        bool active; // Flag to manage candidate status
    }

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint id, string name, string party, string constituency, string logo);
    event Voted(address voter, uint candidateId);
    event ElectionStarted(uint startTime, uint duration);
    event ElectionEnded();
    event CandidateStatusChanged(uint id, bool active);
    event WinnerDeclared(uint winnerId, string name, string party, uint voteCount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier electionActive() {
        require(
            electionStarted && !electionEnded && block.timestamp < startTime + duration,
            "Election is not active"
        );
        _;
    }

    modifier electionInactive() {
        require(
            !electionStarted || electionEnded || block.timestamp >= startTime + duration,
            "Election is currently active"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Add a new candidate (admin only)
    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _constituency,
        string memory _logo
    ) public onlyAdmin electionInactive {
        candidates[candidatesCount] = Candidate(
            candidatesCount,
            _name,
            _party,
            _constituency,
            _logo,
            0,
            true // Candidate is active by default
        );
        emit CandidateAdded(candidatesCount, _name, _party, _constituency, _logo);
        candidatesCount++;
    }

    // Deactivate a candidate (admin only)
    function deactivateCandidate(uint _id) public onlyAdmin electionInactive {
        require(_id < candidatesCount, "Candidate does not exist");
        candidates[_id].active = false;
        emit CandidateStatusChanged(_id, false);
    }

    // Start election with a specific duration (admin only)
    function startElection(uint _durationInSeconds) public onlyAdmin electionInactive {
        require(candidatesCount > 0, "No candidates available");
        require(_durationInSeconds > 0, "Duration must be positive");

        electionStarted = true;
        electionEnded = false;
        startTime = block.timestamp;
        duration = _durationInSeconds;

        emit ElectionStarted(startTime, duration);
    }

    // End the election manually (admin only)
    function endElection() public onlyAdmin {
        require(electionStarted && !electionEnded, "Election not running");
        electionEnded = true;
        emit ElectionEnded();
    }

    // Vote for a candidate
    function vote(uint _candidateId) public electionActive {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId < candidatesCount, "Invalid candidate ID");
        require(candidates[_candidateId].active, "Candidate is not active");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, _candidateId);
    }

    // Get a candidate's full details
    function getCandidate(uint _id) public view returns (
        uint id,
        string memory name,
        string memory party,
        string memory constituency,
        string memory logo,
        uint voteCount,
        bool active
    ) {
        require(_id < candidatesCount, "Candidate does not exist");
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.party, c.constituency, c.logo, c.voteCount, c.active);
    }

    // Return total number of candidates
    function getTotalCandidates() public view returns (uint) {
        return candidatesCount;
    }

    // Check if a user has voted
    function checkIfVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }

    // Election state
    function isElectionEnded() public view returns (bool) {
        if (electionEnded) return true;
        if (electionStarted && block.timestamp >= startTime + duration) return true;
        return false;
    }

    // Time remaining
    function getRemainingTime() public view returns (uint) {
        if (!electionStarted || isElectionEnded()) {
            return 0;
        }
        return (startTime + duration) - block.timestamp;
    }

    // Get winner (after election ends)
    function getWinner() public view returns (
        uint winnerId,
        string memory name,
        string memory party,
        uint voteCount
    ) {
        require(isElectionEnded(), "Election not ended yet");

        uint maxVotes = 0;
        uint winner = 0;

        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winner = i;
            }
        }

        Candidate memory c = candidates[winner];
        return (c.id, c.name, c.party, c.voteCount);
    }
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:2000/candidates');
        if (Array.isArray(response.data.data)) {
          setCandidates(response.data.data);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        setMessage('Error fetching candidates');
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const voteForCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:2000/vote', { candidateId }, {
        headers: { Authorization: token }
      });
      setMessage(response.data.message);

      setCandidates(prevCandidates =>
        prevCandidates.map(candidate =>
          candidate._id === candidateId
            ? { ...candidate, votes: candidate.votes + 1 }
            : candidate
        )
      );
    } catch (error) {
      setMessage(error.response?.data.message || 'Error voting for candidate');
    }
  };

  return (
    <div className="container">
      <h1>Vote for Your Candidate</h1>
      {message && <p className="message">{message}</p>}
      <ul>
        {candidates.map(candidate => (
          <li key={candidate._id}>
            <span>{candidate.name}</span>
            <button onClick={() => voteForCandidate(candidate._id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotePage;

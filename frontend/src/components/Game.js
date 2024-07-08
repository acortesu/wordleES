import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const Game = () => {
  const [word, setWord] = useState('');
  const { data, error, fetchData } = useApi('/api/guess', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ candidate: word }),
  });

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={handleChange}
          placeholder="Enter your guess"
        />
        <button type="submit">Guess</button>
      </form>
      {data && (
        <div>
          <p>Word: {data.word}</p>
          <p>Correct letter and index: {JSON.stringify(data.correct_letter_and_index)}</p>
          <p>Correct letter wrong index: {JSON.stringify(data.correct_letter_wrong_index)}</p>
          <p>Incorrect letter: {JSON.stringify(data.incorrect_letter)}</p>
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Game;
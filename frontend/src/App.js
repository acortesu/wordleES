import React from 'react';
import useApi from './hooks/useApi';

function App() {
  const { data, error } = useApi('/api/connect');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="App text-3xl font-bold underline">
      <h1>Wordle Game</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
}

export default App;

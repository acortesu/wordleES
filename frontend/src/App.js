import React from 'react';
import Game from './components/Game';

function App() {
  return (
      <div className="bg-[#f6f5fd] min-h-screen pt-10">
        <div className="App">
          <h1 className="text-5xl text-[#d85dc8] font-bold text-center">WORDLE EN ESPAÑOL</h1>
          <Game />
        </div>
      </div>
  );
}

export default App;
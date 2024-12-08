// client/src/components/Home.js
import React, { useState } from 'react';
const Home = ({ onUserInitialization }) => {
  const [nameInput, setNameInput] = useState('');
  const [goal, setGoal] = useState(null);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim().length >= 2 && goal) {
      onUserInitialization(nameInput.trim(), goal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-xl font-bold mb-4">Welcome to Meal Planner</h2>
        
        {!goal ? (
          <div>
            <h3 className="text-lg mb-4">Choose Your Goal</h3>
            <button
              onClick={() => setGoal(1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
            >
              Muscle Building
            </button>
            <button
              onClick={() => setGoal(2)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Heart Healthy
            </button>
          </div>
        ) : (
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              minLength={2}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={nameInput.trim().length < 2}
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => setGoal(null)}
              className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Change Goal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
// client/src/App.js
import React, { useState } from 'react';
import MealPlan from './components/MealPlan';
import RatingForm from './components/RatingForm';

function App() {
  const [userId, setUserId] = useState('');
  const [goal, setGoal] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [day, setDay] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const initializeUser = async (selectedGoal) => {
    // const response = await fetch('http://localhost:8000/api/initialize', {
    const response = await fetch('http://192.168.49.2:30007/api/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, goal: selectedGoal }),
    });
    // const response = await fetch('/api/initialize', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, goal: selectedGoal }),
    // });
    if (response.ok) {
      setGoal(selectedGoal);
      setIsInitialized(true);
      fetchMealPlan(selectedGoal);
    }
  };

  const fetchMealPlan = async (currentGoal) => {
    // const response = await fetch('http://localhost:5001/api/getMealPlan', {
    const response = await fetch('http://192.168.49.2:30007/api/getMealPlan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, goal: currentGoal }),
    });
    const data = await response.json();
    setMealPlan(data);
  };

  const handleRatingSubmit = async (ratings) => {
    // const response = await fetch('http://localhost:5001/api/updateRatings', {
    const response = await fetch('http://192.168.49.2:30007/api/updateRatings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ratings }),
    });
    
    if (response.ok) {
      setDay(prev => prev + 1);
      fetchMealPlan(goal);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim().length >= 2) {
      setUserId(nameInput.trim());
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
          <h2 className="text-xl font-bold mb-4">Welcome to Meal Planner</h2>
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
          </form>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
          <h2 className="text-xl font-bold mb-4">Choose Your Goal</h2>
          <button
            onClick={() => initializeUser(1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
          >
            Muscle Building
          </button>
          <button
            onClick={() => initializeUser(2)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Heart Healthy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Day {day}</h1>
        {mealPlan && (
          <>
            <MealPlan mealPlan={mealPlan} />
            <RatingForm mealPlan={mealPlan} onSubmitRatings={handleRatingSubmit} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
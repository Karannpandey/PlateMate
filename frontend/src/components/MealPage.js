// client/src/components/MealPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MealPlan from '../components/MealPlan';
import RatingForm from '../components/RatingForm';

const MealPage = ({ userId, goal, onLogout }) => {
  const [mealPlan, setMealPlan] = useState(null);
  const [day, setDay] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeMealPlan();
  }, []);

  const initializeMealPlan = async () => {
    try {
      const response = await fetch('http://192.168.58.2:30007/api/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goal }),
      });

      if (response.ok) {
        setIsInitialized(true);
        fetchMealPlan();
      }
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  };

const fetchMealPlan = async () => {
    try {
      const response = await fetch('http://192.168.58.2:30007/api/getMealPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goal }),
      });
      const data = await response.json();
      console.log(data);  // Debugging the structure of data
      setMealPlan(data);
    } catch (error) {
      console.error('Failed to fetch meal plan:', error);
    }
  };
  

  const handleRatingSubmit = async (ratings) => {
    try {
      const response = await fetch('http://192.168.58.2:30007/api/updateRatings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ratings }),
      });
      
      if (response.ok) {
        setDay(prev => prev + 1);
        fetchMealPlan();
      }
    } catch (error) {
      console.error('Failed to submit ratings:', error);
    }
  };

  // If not initialized, show goal selection
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
          <h2 className="text-xl font-bold mb-4">Initializing Meal Plan</h2>
          <p className="text-gray-600 mb-4">Please wait while we prepare your personalized meal plan...</p>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Day {day}</h1>
        <div className="flex space-x-4">
          <Link 
            to="/nutrition" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Nutrition Analysis
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {mealPlan && (
          <>
            <MealPlan mealPlan={mealPlan} />
            <RatingForm mealPlan={mealPlan} onSubmitRatings={handleRatingSubmit} />
          </>
        )}
      </div>
    </div>
  );
};

export default MealPage;

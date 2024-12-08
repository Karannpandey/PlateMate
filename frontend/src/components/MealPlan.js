// client/src/components/MealPlan.js
import React from 'react';

const MealPlan = ({ mealPlan }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Today's Meal Plan</h2>
      {Object.entries(mealPlan).map(([meal, { name, url }]) => (
        <div key={meal} className="mb-4 pb-2 border-b flex items-center justify-between">
          <div>
          <h3 className="font-bold text-gray-700">
            {meal.charAt(0).toUpperCase() + meal.slice(1)}:
          </h3>
          <p className="text-gray-600">{name}</p>
          </div>
          {/* This part now renders the URL as a clickable link */}
          {url && (
            <button 
              className="mt-2 px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => window.open(url, '_blank', 'noopener noreferrer')}
            >
              View Recipe
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MealPlan;

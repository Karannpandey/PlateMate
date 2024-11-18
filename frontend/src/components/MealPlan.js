// client/src/components/MealPlan.js
import React from 'react';

const MealPlan = ({ mealPlan }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Today's Meal Plan</h2>
      {Object.entries(mealPlan).map(([meal, { recipe }]) => (
        <div key={meal} className="mb-4 pb-2 border-b">
          <h3 className="font-bold text-gray-700">
            {meal.charAt(0).toUpperCase() + meal.slice(1)}:
          </h3>
          <p className="text-gray-600">{recipe}</p>
        </div>
      ))}
    </div>
  );
};

export default MealPlan;
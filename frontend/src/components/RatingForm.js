// client/src/components/RatingForm.js
import React, { useState, useEffect } from 'react';

const RatingForm = ({ mealPlan, onSubmitRatings }) => {
  // Default ratings state
  const defaultRatings = {
    breakfast: { rating: '', cluster: mealPlan.breakfast.cluster },
    lunch: { rating: '', cluster: mealPlan.lunch.cluster },
    dinner: { rating: '', cluster: mealPlan.dinner.cluster }
  };

  const [ratings, setRatings] = useState(defaultRatings);
  
  // Reset ratings when mealPlan changes
  useEffect(() => {
    setRatings({
      breakfast: { rating: '', cluster: mealPlan.breakfast.cluster },
      lunch: { rating: '', cluster: mealPlan.lunch.cluster },
      dinner: { rating: '', cluster: mealPlan.dinner.cluster }
    });
  }, [mealPlan]);

  const handleRatingChange = (meal, value) => {
    // Validate rating is between 0 and 5
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 5)) {
      setRatings(prev => ({
        ...prev,
        [meal]: { ...prev[meal], rating: value }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all ratings are filled and within range
    const isValid = Object.values(ratings).every(
      ({ rating }) => rating !== '' && parseFloat(rating) >= 0 && parseFloat(rating) <= 5
    );

    if (isValid) {
      // Convert ratings to numbers before submitting
      const formattedRatings = Object.entries(ratings).reduce((acc, [meal, data]) => ({
        ...acc,
        [meal]: { ...data, rating: parseFloat(data.rating) }
      }), {});
      
      onSubmitRatings(formattedRatings);
    }
  };

return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Rate Today's Meals</h2>
      {['breakfast', 'lunch', 'dinner'].map((meal) => (
        <div key={meal} className="mb-4">
          <label 
            htmlFor={`${meal}-rating`} 
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {meal.charAt(0).toUpperCase() + meal.slice(1)} Rating (0-5):
          </label>
          <input
            id={`${meal}-rating`}
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={ratings[meal].rating}
            onChange={(e) => handleRatingChange(meal, e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Submit Ratings
      </button>
    </form>
  );
};

export default RatingForm;
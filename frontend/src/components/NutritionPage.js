// client/src/components/NutritionPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NutritionPage = ({ userId, onLogout }) => {
  const [ingredients, setIngredients] = useState('');
  const [nutritionResult, setNutritionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

//   const appId='10b0f16c';
//   const apiKey='76203dfb700e4d6f9ca20f226c985512';
  const appId=process.env.REACT_APP_API_APP_ID;
  const apiKey=process.env.REACT_APP_API_KEY;

  const handleIngredientChange = (value) => {
    setIngredients(value);
  };

  const getSafeNutrientValue = (nutrients, key, defaultValue = 0) => {
    return nutrients && nutrients[key] 
      ? Math.round(nutrients[key].quantity) 
      : defaultValue;
  };

  const fetchNutritionData = async () => {
    // Reset state
    setIsLoading(true);
    setNutritionResult(null);
    setError(null);

    // Process ingredients
    const processedIngredients = ingredients
      .split('\n')
      .map(ing => ing.trim())
      .filter(ing => ing !== '');

    const url = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${apiKey}`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ingr: processedIngredients })
    };

    try {
      console.log('Ingredients:', processedIngredients);

      const response = await fetch(url, options);

      if (response.status === 401) {
        console.error('Authentication Error:', response);
        throw new Error('API Authentication Failed. Please check your RapidAPI key.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Request Failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!result.calories || !result.totalNutrients) {
        throw new Error('Incomplete nutrition data received');
      }

      setNutritionResult(result);
    } catch (error) {
      console.error('Fetch Error:', error);
      setError(error.message || 'Failed to analyze nutrition');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nutrition Analysis</h1>
        <div className="flex space-x-4">
          <Link 
            to="/recommend" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Meal Recommendations
          </Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className=" mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4">
          <textarea
            value={ingredients}
            onChange={(e) => handleIngredientChange(e.target.value)}
            placeholder="Enter ingredients (one per line)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-48"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={fetchNutritionData}
            disabled={isLoading || ingredients.trim() === ''}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Nutrition'}
          </button>
        </div>

        {nutritionResult && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Nutrition Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Total Calories:</strong> {Math.round(nutritionResult.calories || 0)}</p>
                <p><strong>Total Fat:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'FAT')} g</p>
                <p><strong>Total Protein:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'PROCNT')} g</p>
                <p><strong>Total Carbohydrates:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'CHOCDF')} g</p>
              </div>
              <div>
                <p><strong>Cholesterol:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'CHOLE')} mg</p>
                <p><strong>Sodium:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'NA')} mg</p>
                <p><strong>Sugar:</strong> {getSafeNutrientValue(nutritionResult.totalNutrients, 'SUGAR')} g</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage;

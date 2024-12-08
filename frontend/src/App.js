// client/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import MealPage from './components/MealPage';
import NutritionPage from './components/NutritionPage';

function App() {
  const [userId, setUserId] = useState('');
  const [goal, setGoal] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedGoal = localStorage.getItem('goal');

    if (storedUserId && storedGoal) {
      setUserId(storedUserId);
      setGoal(parseInt(storedGoal));
    }
  }, []);

  const handleUserInitialization = (name, selectedGoal) => {
    // Save user data to localStorage
    localStorage.setItem('userId', name);
    localStorage.setItem('goal', selectedGoal);

    setUserId(name);
    setGoal(selectedGoal);
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('goal');

    setUserId('');
    setGoal(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            userId ? (
              <Navigate to="/recommend" replace />
            ) : (
              <Home onUserInitialization={handleUserInitialization} />
            )
          } 
        />
        <Route 
          path="/recommend" 
          element={
            userId ? (
              <MealPage 
                userId={userId} 
                goal={goal} 
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/nutrition" 
          element={
            userId ? (
              <NutritionPage 
                userId={userId} 
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
import { useState, useEffect } from 'react';

export default function useGoals() {
  const [goals, setGoals] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('goals');
      if (saved) {
        const parsedGoals = JSON.parse(saved);
        setGoals(parsedGoals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const updateGoal = (subject: string, hours: number) => {
    setGoals(prevGoals => ({
      ...prevGoals,
      [subject]: hours
    }));
  };

  return { goals, updateGoal };
}
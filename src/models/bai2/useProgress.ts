import { useEffect, useState } from "react";

interface Progress {
  id: number;
  subject: string;
  date: string;
  duration: number;
  content?: string;
  notes?: string;
}

export default function useProgress() {
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('progress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
  }, [progress]);

  const addProgress = (newProgress: Progress) => {
    setProgress([...progress, { ...newProgress, id: Date.now() }]);
  };

  const deleteProgress = (id: number) => {
    setProgress(progress.filter(p => p.id !== id));
  };

  const updateProgress = (id: number, updatedProgress: Partial<Progress>) => {
    setProgress(progress.map(p => 
      p.id === id ? { ...p, ...updatedProgress } : p
    ));
  };

  const calculateMonthlyHours = (subject: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return progress
      .filter(p => {
        const progressDate = new Date(p.date);
        return p.subject === subject &&
               progressDate.getMonth() === currentMonth &&
               progressDate.getFullYear() === currentYear;
      })
      .reduce((total, p) => total + p.duration, 0);
  };

  return { 
    progress, 
    addProgress, 
    deleteProgress, 
    updateProgress, 
    calculateMonthlyHours 
  };
}
import { useState, useEffect } from 'react';

export default function useSubjects() {
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('subjects');
    if (saved) setSubjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (subject: string) => {
    setSubjects([...subjects, subject]);
  };

  const updateSubject = (oldSubject: string, newSubject: string) => {
    setSubjects(subjects.map(s => s === oldSubject ? newSubject : s));
  };

  const deleteSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  return { subjects, addSubject, updateSubject, deleteSubject, setSubjects };
}


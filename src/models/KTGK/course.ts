import { useState } from 'react';
import { Course, CourseStatus } from './types';

const STORAGE_KEY = 'courses';

export default function useCourseManager() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const addCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    // Check duplicate name
    if (courses.some(c => c.name === course.name)) {
      throw new Error('Tên khóa học đã tồn tại');
    }

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
    return newCourse;
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    // Check duplicate name
    if (data.name && courses.some(c => c.name === data.name && c.id !== id)) {
      throw new Error('Tên khóa học đã tồn tại');
    }

    const updatedCourses = courses.map(course => 
      course.id === id ? { ...course, ...data } : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  };

  const deleteCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }

    if (course.studentCount > 0) {
      throw new Error('Không thể xóa khóa học đã có học viên');
    }

    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  };

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
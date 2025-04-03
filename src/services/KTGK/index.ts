import { Course } from './types';

const STORAGE_KEY = 'courses';

export const loadCourses = (): Course[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = loadCourses();
  return courses.find(course => course.id === id);
};

export const createCourse = (course: Omit<Course, 'id' | 'createdAt'>): Course => {
  const courses = loadCourses();
  
  // Check duplicate name
  if (courses.some(c => c.name === course.name)) {
    throw new Error('Tên khóa học đã tồn tại');
  }

  const newCourse: Course = {
    ...course,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

export const updateCourse = (id: string, data: Partial<Course>): Course => {
  const courses = loadCourses();
  const index = courses.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Không tìm thấy khóa học');
  }

  // Check duplicate name
  if (data.name && 
      courses.some(c => c.name === data.name && c.id !== id)) {
    throw new Error('Tên khóa học đã tồn tại');  
  }

  const updatedCourse = {
    ...courses[index],
    ...data
  };

  courses[index] = updatedCourse;
  saveCourses(courses);
  return updatedCourse;
};

export const deleteCourse = (id: string): boolean => {
  const courses = loadCourses();
  const course = courses.find(c => c.id === id);
  
  if (!course) {
    throw new Error('Không tìm thấy khóa học');
  }

  if (course.studentCount > 0) {
    throw new Error('Không thể xóa khóa học đã có học viên');
  }

  const newCourses = courses.filter(c => c.id !== id);
  saveCourses(newCourses);
  return true;
};
export enum CourseStatus {
  ACTIVE = 'Đang mở',
  COMPLETED = 'Đã kết thúc',
  PAUSED = 'Tạm dừng'
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: CourseStatus;
  description: string;
  createdAt: string;
}
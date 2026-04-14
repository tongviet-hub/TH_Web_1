import { useMemo, useState } from 'react';

export type CourseStatus = 'OPEN' | 'CLOSED' | 'PAUSED';

export interface CourseItem {
  id: number;
  name: string;
  lecturer: string;
  studentCount: number;
  description: string;
  status: CourseStatus;
}

export const COURSE_STATUS_OPTIONS: { label: string; value: CourseStatus }[] = [
  { label: 'Đang mở', value: 'OPEN' },
  { label: 'Đã kết thúc', value: 'CLOSED' },
  { label: 'Tạm dừng', value: 'PAUSED' },
];

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 1,
    name: 'React TypeScript Cơ Bản',
    lecturer: 'Nguyễn Văn An',
    studentCount: 28,
    description: '<p>Khóa học nhập môn React kết hợp TypeScript.</p>',
    status: 'OPEN',
  },
  {
    id: 2,
    name: 'Node.js Thực Chiến',
    lecturer: 'Trần Thị Bình',
    studentCount: 0,
    description: '<p>Học xây dựng REST API với Node.js và Express.</p>',
    status: 'PAUSED',
  },
  {
    id: 3,
    name: 'Thiết Kế Cơ Sở Dữ Liệu',
    lecturer: 'Lê Hoàng Minh',
    studentCount: 34,
    description: '<p>Chuẩn hóa dữ liệu và tối ưu truy vấn SQL.</p>',
    status: 'CLOSED',
  },
  {
    id: 4,
    name: 'Ant Design Với UmiJS',
    lecturer: 'Phạm Thu Hà',
    studentCount: 12,
    description: '<p>Xây dựng giao diện quản trị bằng Ant Design.</p>',
    status: 'OPEN',
  },
];

export default function useCourseModel() {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);

  const lecturers = useMemo(
    () => ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Minh', 'Phạm Thu Hà'],
    [],
  );

  const isCourseNameDuplicated = (name: string, editingId?: number) => {
    const normalizedName = name.trim().toLowerCase();
    return courses.some(
      (course) => course.id !== editingId && course.name.trim().toLowerCase() === normalizedName,
    );
  };

  const addCourse = (payload: Omit<CourseItem, 'id'>) => {
    const nextId = courses.length > 0 ? Math.max(...courses.map((course) => course.id)) + 1 : 1;
    setCourses((prev) => [...prev, { ...payload, id: nextId }]);
  };

  const updateCourse = (id: number, payload: Omit<CourseItem, 'id'>) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? { ...course, ...payload } : course)),
    );
  };

  const removeCourse = (id: number) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return {
    courses,
    lecturers,
    statusOptions: COURSE_STATUS_OPTIONS,
    addCourse,
    updateCourse,
    removeCourse,
    isCourseNameDuplicated,
  };
}

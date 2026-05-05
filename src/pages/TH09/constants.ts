import { TaskPriority, TaskStatus } from './types';

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang làm',
  DONE: 'Hoàn thành',
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: 'Cao',
  MEDIUM: 'Trung bình',
  LOW: 'Thấp',
};

export const PRIORITY_COLOR: Record<TaskPriority, string> = {
  HIGH: 'red',
  MEDIUM: 'gold',
  LOW: 'blue',
};

export const BOARD_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

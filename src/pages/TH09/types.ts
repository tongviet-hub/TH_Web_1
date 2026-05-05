import { TaskItem, TaskPriority, TaskStatus } from '@/models/th09';

export type { TaskItem, TaskPriority, TaskStatus };

export type TaskFormPayload = {
  title: string;
  description?: string;
  deadline: string;
  priority: TaskPriority;
  tags: string[];
};

import { useMemo, useState } from 'react';
import moment from 'moment';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: TaskPriority;
  tags: string[];
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

type TaskFormValues = {
  title: string;
  description?: string;
  deadline: string;
  priority: TaskPriority;
  tags: string[];
};

const STORAGE_KEY = 'th09.kanban.tasks';

const readLocalTasks = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    return [];
  }
};

const writeLocalTasks = (tasks: TaskItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const buildTaskId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => readLocalTasks());

  const persistTasks = (nextTasks: TaskItem[]) => {
    setTasks(nextTasks);
    writeLocalTasks(nextTasks);
  };

  const addTask = (payload: TaskFormValues) => {
    const now = new Date().toISOString();
    const nextTask: TaskItem = {
      id: buildTaskId(),
      title: payload.title.trim(),
      description: payload.description?.trim(),
      deadline: payload.deadline,
      priority: payload.priority,
      tags: payload.tags || [],
      status: 'TODO',
      createdAt: now,
      updatedAt: now,
    };
    persistTasks([nextTask, ...tasks]);
  };

  const updateTask = (taskId: string, payload: TaskFormValues) => {
    const now = new Date().toISOString();
    const nextTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        title: payload.title.trim(),
        description: payload.description?.trim(),
        deadline: payload.deadline,
        priority: payload.priority,
        tags: payload.tags || [],
        updatedAt: now,
      };
    });
    persistTasks(nextTasks);
  };

  const deleteTask = (taskId: string) => {
    persistTasks(tasks.filter((task) => task.id !== taskId));
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    const now = new Date().toISOString();
    const nextTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        status,
        updatedAt: now,
      };
    });
    persistTasks(nextTasks);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'DONE').length;
    const overdue = tasks.filter(
      (task) => task.status !== 'DONE' && moment(task.deadline).isBefore(moment(), 'day'),
    ).length;

    return {
      total,
      completed,
      overdue,
    };
  }, [tasks]);

  return {
    tasks,
    setTasks: persistTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    stats,
  };
};

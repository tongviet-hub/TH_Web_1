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

const getFromStorage = (): TaskItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (list: TaskItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => getFromStorage());

  const save = (list: TaskItem[]) => {
    setTasks(list);
    saveToStorage(list);
  };

  const addTask = (payload: TaskFormValues) => {
    const now = new Date().toISOString();
    const task: TaskItem = {
      id: genId(),
      title: payload.title.trim(),
      description: payload.description?.trim(),
      deadline: payload.deadline,
      priority: payload.priority,
      tags: payload.tags || [],
      status: 'TODO',
      createdAt: now,
      updatedAt: now,
    };
    save([task, ...tasks]);
  };

  const updateTask = (taskId: string, payload: TaskFormValues) => {
    const now = new Date().toISOString();
    const updated = tasks.map((task) => {
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
    save(updated);
  };

  const deleteTask = (taskId: string) => {
    save(tasks.filter((task) => task.id !== taskId));
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    const now = new Date().toISOString();
    const moved = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        status,
        updatedAt: now,
      };
    });
    save(moved);
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
    setTasks: save,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    stats,
  };
};

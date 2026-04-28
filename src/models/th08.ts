import { useState } from 'react';
import moment from 'moment';

export type Workout = {
  id: string;
  date: string; // ISO
  name: string;
  type: string;
  duration: number;
  calories: number;
  note?: string;
  status: 'Completed' | 'Missed';
};

export type HealthLog = {
  id: string;
  date: string; // ISO
  weight: number; // kg
  height: number; // cm
  restingHr?: number;
  sleepTime?: string;
};

export type Goal = {
  id: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  status: 'Active' | 'Achieved' | 'Cancelled';
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  caloriesPerHour?: number;
};

const key = (k: string) => `th08.${k}`;

const read = (k: string) => {
  try {
    return JSON.parse(localStorage.getItem(key(k)) || 'null');
  } catch (e) {
    return null;
  }
};

const write = (k: string, v: any) => {
  localStorage.setItem(key(k), JSON.stringify(v));
};

export default () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => read('workouts') || []);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>(() => read('healthLogs') || []);
  const [goals, setGoals] = useState<Goal[]>(() => read('goals') || []);
  const [exercises, setExercises] = useState<Exercise[]>(() => read('exercises') || []);

  const saveWorkouts = (list: Workout[]) => {
    setWorkouts(list);
    write('workouts', list);
  };
  const saveHealthLogs = (list: HealthLog[]) => {
    setHealthLogs(list);
    write('healthLogs', list);
  };
  const saveGoals = (list: Goal[]) => {
    setGoals(list);
    write('goals', list);
  };
  const saveExercises = (list: Exercise[]) => {
    setExercises(list);
    write('exercises', list);
  };

  const addWorkout = (w: Workout) => saveWorkouts([w, ...workouts]);
  const updateWorkout = (w: Workout) => saveWorkouts(workouts.map(x => x.id === w.id ? w : x));
  const deleteWorkout = (id: string) => saveWorkouts(workouts.filter(w => w.id !== id));

  const addHealth = (h: HealthLog) => saveHealthLogs([h, ...healthLogs]);
  const updateHealth = (h: HealthLog) => saveHealthLogs(healthLogs.map(x => x.id === h.id ? h : x));
  const deleteHealth = (id: string) => saveHealthLogs(healthLogs.filter(x => x.id !== id));

  const addGoal = (g: Goal) => saveGoals([g, ...goals]);
  const updateGoal = (g: Goal) => saveGoals(goals.map(x => x.id === g.id ? g : x));
  const deleteGoal = (id: string) => saveGoals(goals.filter(x => x.id !== id));

  const addExercise = (e: Exercise) => saveExercises([e, ...exercises]);
  const updateExercise = (e: Exercise) => saveExercises(exercises.map(x => x.id === e.id ? e : x));
  const deleteExercise = (id: string) => saveExercises(exercises.filter(x => x.id !== id));

  const getThisMonthWorkouts = () => {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    return workouts.filter(w => moment(w.date).isBetween(start, end, 'day', '[]'));
  };

  const getTotalCaloriesThisMonth = () => getThisMonthWorkouts().reduce((s, w) => s + (w.calories || 0), 0);

  const getStreak = () => {
    // count consecutive days ending today with at least one completed workout
    const days = new Set(workouts.filter(w => w.status === 'Completed').map(w => moment(w.date).format('YYYY-MM-DD')));
    let streak = 0;
    let d = moment();
    while (days.has(d.format('YYYY-MM-DD'))) {
      streak++;
      d = d.subtract(1, 'day');
    }
    return streak;
  };

  return {
    workouts,
    setWorkouts: saveWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,

    healthLogs,
    setHealthLogs: saveHealthLogs,
    addHealth,
    updateHealth,
    deleteHealth,

    goals,
    setGoals: saveGoals,
    addGoal,
    updateGoal,
    deleteGoal,

    exercises,
    setExercises: saveExercises,
    addExercise,
    updateExercise,
    deleteExercise,

    getThisMonthWorkouts,
    getTotalCaloriesThisMonth,
    getStreak,
  };
};

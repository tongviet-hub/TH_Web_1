import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import type { Exercise, FitnessData, Goal, HealthLog, Workout } from '@/pages/TH08/types';
import { buildDashboardSummary, calculateGoalProgress, normalizeFitnessData } from '@/pages/TH08/utils';

const STORAGE_KEY = 'th08-fitness-data';

const createSeedData = (): FitnessData => ({
  workouts: [
    { id: 1, name: 'Morning Run', date: moment().subtract(1, 'day').hour(6).toISOString(), type: 'Cardio', duration: 35, calories: 320, note: 'Pace ổn định 6:10/km', status: 'Completed' },
    { id: 2, name: 'Upper Body Strength', date: moment().subtract(2, 'day').hour(18).toISOString(), type: 'Strength', duration: 50, calories: 410, note: 'Tăng tạ bench press', status: 'Completed' },
    { id: 3, name: 'Yoga Recovery', date: moment().subtract(4, 'day').hour(20).toISOString(), type: 'Yoga', duration: 40, calories: 180, note: 'Giãn cơ sau tuần nặng', status: 'Completed' },
    { id: 4, name: 'HIIT Circuit', date: moment().subtract(6, 'day').hour(17).toISOString(), type: 'HIIT', duration: 25, calories: 350, note: 'Cường độ cao, 5 rounds', status: 'Completed' },
    { id: 5, name: 'Leg Day', date: moment().subtract(8, 'day').hour(18).toISOString(), type: 'Strength', duration: 60, calories: 480, note: 'Squat + Romanian deadlift', status: 'Missed' },
    { id: 6, name: 'Core Session', date: moment().startOf('month').add(3, 'day').hour(7).toISOString(), type: 'Other', duration: 20, calories: 140, note: 'Plank and mobility', status: 'Completed' },
  ],
  healthLogs: [
    { id: 1, date: moment().subtract(28, 'day').toISOString(), weight: 72.4, height: 170, restingHeartRate: 72, sleepHours: 6.8 },
    { id: 2, date: moment().subtract(21, 'day').toISOString(), weight: 71.9, height: 170, restingHeartRate: 70, sleepHours: 7.2 },
    { id: 3, date: moment().subtract(14, 'day').toISOString(), weight: 71.3, height: 170, restingHeartRate: 69, sleepHours: 7.4 },
    { id: 4, date: moment().subtract(7, 'day').toISOString(), weight: 70.8, height: 170, restingHeartRate: 68, sleepHours: 7.0 },
    { id: 5, date: moment().toISOString(), weight: 70.5, height: 170, restingHeartRate: 67, sleepHours: 7.6 },
  ],
  goals: [
    { id: 1, name: 'Giảm 4kg trong 10 tuần', type: 'Weight Loss', targetValue: 4, currentValue: 1.9, deadline: moment().add(45, 'day').toISOString(), status: 'In Progress' },
    { id: 2, name: '20 buổi cardio/tháng', type: 'Endurance', targetValue: 20, currentValue: 12, deadline: moment().endOf('month').toISOString(), status: 'In Progress' },
    { id: 3, name: 'Tăng mức squat lên 100kg', type: 'Muscle Gain', targetValue: 100, currentValue: 100, deadline: moment().add(30, 'day').toISOString(), status: 'Achieved' },
  ],
  exercises: [
    { id: 1, name: 'Bench Press', muscleGroup: 'Chest', difficulty: 'Medium', shortDescription: 'Bài đẩy ngực nền tảng cho sức mạnh thân trên.', instructions: 'Nằm trên ghế phẳng, giữ vai siết lại, hạ tạ có kiểm soát về giữa ngực rồi đẩy lên theo đường thẳng.', caloriesPerHour: 420 },
    { id: 2, name: 'Pull Up', muscleGroup: 'Back', difficulty: 'Hard', shortDescription: 'Kéo xà tăng sức mạnh lưng và tay trước.', instructions: 'Nắm xà rộng hơn vai, siết core, kéo người lên đến khi cằm vượt xà rồi hạ xuống chậm.', caloriesPerHour: 500 },
    { id: 3, name: 'Squat', muscleGroup: 'Legs', difficulty: 'Medium', shortDescription: 'Bài compound quan trọng cho đùi và mông.', instructions: 'Đứng chân rộng bằng vai, đẩy hông ra sau, hạ đến khi đùi song song sàn rồi đứng lên mạnh mẽ.', caloriesPerHour: 520 },
    { id: 4, name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Medium', shortDescription: 'Xây dựng vai khỏe và ổn định.', instructions: 'Giữ tạ ngang vai, đẩy thẳng lên trên đầu, không võng lưng, hạ chậm về vị trí ban đầu.', caloriesPerHour: 390 },
    { id: 5, name: 'Bicep Curl', muscleGroup: 'Arms', difficulty: 'Easy', shortDescription: 'Bài cô lập tay trước phù hợp mọi cấp độ.', instructions: 'Giữ khuỷu tay cố định sát người, cuốn tạ lên bằng lực tay trước rồi hạ xuống có kiểm soát.', caloriesPerHour: 260 },
    { id: 6, name: 'Plank', muscleGroup: 'Core', difficulty: 'Easy', shortDescription: 'Tăng độ ổn định cho nhóm cơ trung tâm.', instructions: 'Giữ thân người thành một đường thẳng, siết bụng và mông, không võng lưng trong suốt bài tập.', caloriesPerHour: 220 },
    { id: 7, name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Hard', shortDescription: 'Bài toàn thân đốt calo cao.', instructions: 'Hạ người xuống plank, bật chân thu về rồi bật nhảy cao, giữ nhịp đều và tiếp đất mềm.', caloriesPerHour: 680 },
  ],
});

const getInitialState = (): FitnessData => {
  if (typeof window === 'undefined') return createSeedData();

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return createSeedData();

  try {
    const parsed = normalizeFitnessData(JSON.parse(saved));
    const seed = createSeedData();

    return {
      workouts: parsed.workouts.length ? parsed.workouts : seed.workouts,
      healthLogs: parsed.healthLogs.length ? parsed.healthLogs : seed.healthLogs,
      goals: parsed.goals.length ? parsed.goals : seed.goals,
      exercises: parsed.exercises.length ? parsed.exercises : seed.exercises,
    };
  } catch {
    return createSeedData();
  }
};

const getNextId = (items: Array<{ id: number }>) => (items.length ? Math.max(...items.map((item) => item.id)) : 0) + 1;

export default function useTh08FitnessModel() {
  const [data, setData] = useState<FitnessData>(getInitialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const addWorkout = (payload: Omit<Workout, 'id'>) => {
      setData((prev: FitnessData) => ({ ...prev, workouts: [...prev.workouts, { ...payload, id: getNextId(prev.workouts) }] }));
    };

  const updateWorkout = (id: number, payload: Omit<Workout, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, workouts: prev.workouts.map((item: Workout) => (item.id === id ? { ...item, ...payload } : item)) }));
  };

  const deleteWorkout = (id: number) => {
    setData((prev: FitnessData) => ({ ...prev, workouts: prev.workouts.filter((item: Workout) => item.id !== id) }));
  };

  const addHealthLog = (payload: Omit<HealthLog, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, healthLogs: [...prev.healthLogs, { ...payload, id: getNextId(prev.healthLogs) }] }));
  };

  const updateHealthLog = (id: number, payload: Omit<HealthLog, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, healthLogs: prev.healthLogs.map((item: HealthLog) => (item.id === id ? { ...item, ...payload } : item)) }));
  };

  const deleteHealthLog = (id: number) => {
    setData((prev: FitnessData) => ({ ...prev, healthLogs: prev.healthLogs.filter((item: HealthLog) => item.id !== id) }));
  };

  const addGoal = (payload: Omit<Goal, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, goals: [...prev.goals, { ...payload, id: getNextId(prev.goals) }] }));
  };

  const updateGoal = (id: number, payload: Omit<Goal, 'id'>) => {
    setData((prev: FitnessData) => ({
      ...prev,
      goals: prev.goals.map((item: Goal) => {
        if (item.id !== id) return item;
        const nextGoal = { ...item, ...payload };
        if (nextGoal.status === 'In Progress' && nextGoal.currentValue >= nextGoal.targetValue) {
          nextGoal.status = 'Achieved';
        }
        return nextGoal;
      }),
    }));
  };

  const updateGoalCurrentValue = (id: number, currentValue: number) => {
    setData((prev: FitnessData) => ({
      ...prev,
      goals: prev.goals.map((item: Goal) => {
        if (item.id !== id) return item;
        const status = item.status === 'Cancelled' ? 'Cancelled' : currentValue >= item.targetValue ? 'Achieved' : 'In Progress';
        return { ...item, currentValue, status };
      }),
    }));
  };

  const deleteGoal = (id: number) => {
    setData((prev: FitnessData) => ({ ...prev, goals: prev.goals.filter((item: Goal) => item.id !== id) }));
  };

  const addExercise = (payload: Omit<Exercise, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, exercises: [...prev.exercises, { ...payload, id: getNextId(prev.exercises) }] }));
  };

  const updateExercise = (id: number, payload: Omit<Exercise, 'id'>) => {
    setData((prev: FitnessData) => ({ ...prev, exercises: prev.exercises.map((item: Exercise) => (item.id === id ? { ...item, ...payload } : item)) }));
  };

  const deleteExercise = (id: number) => {
    setData((prev: FitnessData) => ({ ...prev, exercises: prev.exercises.filter((item: Exercise) => item.id !== id) }));
  };

  const dashboard = useMemo(() => buildDashboardSummary(data), [data]);
  const goals = useMemo(
    () => data.goals.map((goal) => ({ ...goal, progress: calculateGoalProgress(goal.currentValue, goal.targetValue) })),
    [data.goals],
  );

  return {
    workouts: data.workouts,
    healthLogs: data.healthLogs,
    goals,
    exercises: data.exercises,
    dashboard,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addHealthLog,
    updateHealthLog,
    deleteHealthLog,
    addGoal,
    updateGoal,
    updateGoalCurrentValue,
    deleteGoal,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}

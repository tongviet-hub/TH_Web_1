
import moment from 'moment';
import { BMI_RANGES } from './constants';
import type { DashboardSummary, Exercise, FitnessData, Goal, GoalStatus, HealthLog, Workout } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isWorkout = (value: unknown): value is Workout =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.name === 'string' &&
  typeof value.date === 'string' &&
  typeof value.type === 'string' &&
  typeof value.duration === 'number' &&
  typeof value.calories === 'number' &&
  (typeof value.note === 'string' || value.note === undefined) &&
  typeof value.status === 'string';

const isHealthLog = (value: unknown): value is HealthLog =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.date === 'string' &&
  typeof value.weight === 'number' &&
  typeof value.height === 'number' &&
  (typeof value.restingHeartRate === 'number' || value.restingHeartRate === undefined) &&
  (typeof value.sleepHours === 'number' || value.sleepHours === undefined);

const isGoal = (value: unknown): value is Goal =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.name === 'string' &&
  typeof value.type === 'string' &&
  typeof value.targetValue === 'number' &&
  typeof value.currentValue === 'number' &&
  typeof value.deadline === 'string' &&
  typeof value.status === 'string';

const isExercise = (value: unknown): value is Exercise =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.name === 'string' &&
  typeof value.muscleGroup === 'string' &&
  typeof value.difficulty === 'string' &&
  typeof value.shortDescription === 'string' &&
  typeof value.instructions === 'string' &&
  typeof value.caloriesPerHour === 'number';

const normalizeCollection = <T>(collection: unknown, predicate: (value: unknown) => value is T): T[] =>
  Array.isArray(collection) ? collection.filter(predicate) : [];

export const normalizeFitnessData = (value: unknown): FitnessData => {
  if (!isRecord(value)) {
    return { workouts: [], healthLogs: [], goals: [], exercises: [] };
  }

  return {
    workouts: normalizeCollection(value.workouts, isWorkout),
    healthLogs: normalizeCollection(value.healthLogs, isHealthLog),
    goals: normalizeCollection(value.goals, isGoal),
    exercises: normalizeCollection(value.exercises, isExercise),
  };
};

export const formatDate = (value: string) => moment(value).format('DD/MM/YYYY');

export const calculateBMI = (weight: number, heightCm: number) => {
  if (!weight || !heightCm) return 0;
  const heightMeter = heightCm / 100;
  return Number((weight / (heightMeter * heightMeter)).toFixed(1));
};

export const getBMICategory = (bmi: number) => BMI_RANGES.find((item) => bmi < item.max) ?? BMI_RANGES[BMI_RANGES.length - 1];

export const calculateGoalProgress = (currentValue: number, targetValue: number) => {
  if (!targetValue) return 0;
  return Math.max(0, Math.min(100, Math.round((currentValue / targetValue) * 100)));
};

export const calculateGoalCompletionAverage = (goals: Array<Pick<Goal, 'status' | 'currentValue' | 'targetValue'>>) => {
  const activeGoals = goals.filter((goal) => goal.status !== 'Cancelled');
  if (!activeGoals.length) return 0;
  const total = activeGoals.reduce((sum, goal) => sum + calculateGoalProgress(goal.currentValue, goal.targetValue), 0);
  return Math.round(total / activeGoals.length);
};

export const getGoalStatusColor = (status: GoalStatus) => {
  if (status === 'Achieved') return 'green';
  if (status === 'Cancelled') return 'red';
  return 'processing';
};

export const getWorkoutStatusColor = (status: Workout['status']) => (status === 'Completed' ? 'green' : 'volcano');

export const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  if (difficulty === 'Easy') return 'green';
  if (difficulty === 'Medium') return 'gold';
  return 'red';
};

export const calculateWorkoutStreak = (workouts: Array<Pick<Workout, 'date' | 'status'>>) => {
  const completedDays = Array.from(
    new Set(
      workouts.filter((item) => item.status === 'Completed').map((item) => moment(item.date).startOf('day').format('YYYY-MM-DD')),
    ),
  ).sort((a, b) => moment(b).valueOf() - moment(a).valueOf());

  if (!completedDays.length) return 0;

  const today = moment().startOf('day');
  const firstDay = moment(completedDays[0], 'YYYY-MM-DD');
  if (today.diff(firstDay, 'days') > 1) return 0;

  let streak = 0;
  let cursor = firstDay.clone();
  completedDays.forEach((day) => {
    if (moment(day, 'YYYY-MM-DD').isSame(cursor, 'day')) {
      streak += 1;
      cursor = cursor.subtract(1, 'day');
    }
  });

  return streak;
};

export const buildWeeklyWorkoutSeries = (workouts: Array<Pick<Workout, 'date' | 'status'>>) => {
  const now = moment();
  const startOfMonth = now.clone().startOf('month');
  const endOfMonth = now.clone().endOf('month');
  const weekCount = Math.ceil(endOfMonth.date() / 7);
  const series = Array.from({ length: weekCount }, () => 0);

  workouts
    .filter((item) => item.status === 'Completed' && moment(item.date).isBetween(startOfMonth, endOfMonth, 'day', '[]'))
    .forEach((item) => {
      const weekIndex = Math.ceil(moment(item.date).date() / 7) - 1;
      if (series[weekIndex] !== undefined) series[weekIndex] += 1;
    });

  return { categories: series.map((_, index) => `Tuần ${index + 1}`), series };
};

export const buildWeightChartData = (healthLogs: HealthLog[]) => {
  const sorted = [...healthLogs].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  return {
    categories: sorted.map((item) => moment(item.date).format('DD/MM')),
    series: sorted.map((item) => item.weight),
  };
};

export const getRecentWorkouts = (workouts: Workout[]) =>
  [...workouts].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()).slice(0, 5);

export const buildDashboardSummary = (data: FitnessData): DashboardSummary => {
  const monthStart = moment().startOf('month');
  const monthEnd = moment().endOf('month');
  const workoutsThisMonth = data.workouts.filter((item) => moment(item.date).isBetween(monthStart, monthEnd, 'day', '[]'));
  const completedThisMonth = workoutsThisMonth.filter((item) => item.status === 'Completed');

  return {
    totalWorkouts: completedThisMonth.length,
    totalCalories: completedThisMonth.reduce((sum, item) => sum + item.calories, 0),
    streak: calculateWorkoutStreak(data.workouts),
    goalCompletion: calculateGoalCompletionAverage(data.goals),
    weeklyChart: buildWeeklyWorkoutSeries(data.workouts),
    weightChart: buildWeightChartData(data.healthLogs),
    recentWorkouts: getRecentWorkouts(data.workouts),
  };
};

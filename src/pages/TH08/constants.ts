import type {
  Difficulty,
  GoalStatus,
  GoalType,
  MuscleGroup,
  WorkoutStatus,
  WorkoutType,
} from './types';

export const WORKOUT_TYPE_OPTIONS: WorkoutType[] = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
export const WORKOUT_STATUS_OPTIONS: WorkoutStatus[] = ['Completed', 'Missed'];
export const GOAL_TYPE_OPTIONS: GoalType[] = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Other'];
export const GOAL_STATUS_OPTIONS: GoalStatus[] = ['In Progress', 'Achieved', 'Cancelled'];
export const MUSCLE_GROUP_OPTIONS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body',
];
export const DIFFICULTY_OPTIONS: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  Cardio: 'Cardio',
  Strength: 'Strength',
  Yoga: 'Yoga',
  HIIT: 'HIIT',
  Other: 'Other',
};

export const WORKOUT_STATUS_LABELS: Record<WorkoutStatus, string> = {
  Completed: 'Hoàn thành',
  Missed: 'Bỏ lỡ',
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  'Weight Loss': 'Giảm cân',
  'Muscle Gain': 'Tăng cơ',
  Endurance: 'Cải thiện sức bền',
  Other: 'Khác',
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  'In Progress': 'Đang thực hiện',
  Achieved: 'Đã đạt',
  Cancelled: 'Đã hủy',
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  Chest: 'Chest',
  Back: 'Back',
  Legs: 'Legs',
  Shoulders: 'Shoulders',
  Arms: 'Arms',
  Core: 'Core',
  'Full Body': 'Full Body',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  Easy: 'Dễ',
  Medium: 'Trung bình',
  Hard: 'Khó',
};

export const BMI_RANGES = [
  { max: 18.5, label: 'Thiếu cân', color: 'blue' },
  { max: 25, label: 'Bình thường', color: 'green' },
  { max: 30, label: 'Thừa cân', color: 'gold' },
  { max: Number.POSITIVE_INFINITY, label: 'Béo phì', color: 'red' },
];

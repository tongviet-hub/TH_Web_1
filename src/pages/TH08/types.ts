
export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'Completed' | 'Missed';
export type GoalType = 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'Other';
export type GoalStatus = 'In Progress' | 'Achieved' | 'Cancelled';
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Workout {
  id: number;
  name: string;
  date: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  note?: string;
  status: WorkoutStatus;
}

export interface HealthLog {
  id: number;
  date: string;
  weight: number;
  height: number;
  restingHeartRate?: number;
  sleepHours?: number;
}

export interface Goal {
  id: number;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

export interface GoalView extends Goal {
  progress: number;
}

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  shortDescription: string;
  instructions: string;
  caloriesPerHour: number;
}

export interface FitnessData {
  workouts: Workout[];
  healthLogs: HealthLog[];
  goals: Goal[];
  exercises: Exercise[];
}

export interface DashboardSummary {
  totalWorkouts: number;
  totalCalories: number;
  streak: number;
  goalCompletion: number;
  weeklyChart: {
    categories: string[];
    series: number[];
  };
  weightChart: {
    categories: string[];
    series: number[];
  };
  recentWorkouts: Array<Pick<Workout, 'id' | 'name' | 'date' | 'type' | 'duration' | 'calories' | 'status'>>;
}

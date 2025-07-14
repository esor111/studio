export interface Subtopic {
  id: string;
  title: string;
  repsCompleted: number;
  repsGoal: number;
  notes?: string;
  urls?: string[];
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  earnings: number;
  completionPercentage: number;
  notes: string;
  urls: string[];
  moneyPer5Reps: number;
  isMoneyPer5RepsLocked: boolean;
  subtopics: Subtopic[];
}

export interface DashboardData {
  globalGoal: number;
  currentEarnings: number;
  progress: number;
  topics: Pick<Topic, 'id' | 'title' | 'category' | 'earnings' | 'completionPercentage'>[];
}

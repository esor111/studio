// Activity Types for Backend Integration
export interface Activity {
  id: string; // UUID string, not number
  name: string;
  reps: number; // Backend uses "reps", not "current_reps"
  goals: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  created_at: string;
  updated_at: string;
}

// Helper interface for easier access to goals
export interface ActivityWithGoals extends Activity {
  current_reps: number; // Alias for reps
  daily_goal: number; // Alias for goals.daily
  weekly_goal: number; // Alias for goals.weekly
  monthly_goal: number; // Alias for goals.monthly
  yearly_goal: number; // Alias for goals.yearly
}

export interface ProgressData {
  daily_progress: {
    current: number;
    target: number;
    percentage: number;
    remaining: number;
  };
  weekly_progress: {
    current: number;
    target: number;
    percentage: number;
    remaining: number;
  };
  monthly_progress: {
    current: number;
    target: number;
    percentage: number;
    remaining: number;
  };
  yearly_progress: {
    current: number;
    target: number;
    percentage: number;
    remaining: number;
  };
  time_remaining_today: number;
}

export interface TimerSession {
  id: string; // UUID string
  activity_id: string; // UUID string
  session_type: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface TimerStatus {
  session: TimerSession | null;
  elapsed_minutes: number;
  is_running: boolean;
}

export interface DashboardStats {
  total_activities: number;
  total_reps_today: number;
  active_sessions: number;
  completion_rate: number;
}

export interface ActivityDashboard {
  stats: DashboardStats;
  activities: Activity[];
  progress: ProgressData[];
}

export interface ActivitySummary {
  id: string; // UUID string
  name: string;
  current_reps: number;
  daily_goal: number;
  progress_percentage: number;
}

// Legacy types (keeping for backward compatibility)
export interface Subtopic {
  id: string;
  title: string;
  repsCompleted: number;
  repsGoal: number;
  notes?: string;
  urls?: string[];
  goalAmount: number;
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

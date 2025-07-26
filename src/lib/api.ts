import {
  Activity,
  ActivityWithGoals,
  ProgressData,
  TimerStatus,
  ActivityDashboard,
  ActivitySummary,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_ACTIVITY_API_URL || "http://localhost:7001/api";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      0
    );
  }
}

// Activity Management
export const activityApi = {
  // Get all activities
  getAll: (): Promise<Activity[]> => fetchApi<Activity[]>("/activities"),

  // Get specific activity
  getById: (id: string): Promise<Activity> =>
    fetchApi<Activity>(`/activities/${id}`),

  // Increment reps
  increment: (id: string, amount: number = 1): Promise<Activity> =>
    fetchApi<Activity>(`/activities/${id}/increment`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  // Decrement reps
  decrement: (id: string, amount: number = 1): Promise<Activity> =>
    fetchApi<Activity>(`/activities/${id}/decrement`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),

  // Get progress data
  getProgress: (id: string): Promise<ProgressData> =>
    fetchApi<ProgressData>(`/activities/${id}/progress`),
};

// Timer Controls
export const timerApi = {
  // Start timer session
  start: (activityId: string): Promise<{ session: any }> =>
    fetchApi<{ session: any }>(`/activities/${activityId}/sessions/start`, {
      method: "POST",
      body: JSON.stringify({ session_type: "timer" }),
    }),

  // End timer session
  end: (activityId: string, sessionId: string): Promise<void> =>
    fetchApi<void>(`/activities/${activityId}/sessions/${sessionId}/end`, {
      method: "POST",
    }),

  // Get current timer status
  getStatus: (activityId: string): Promise<TimerStatus> =>
    fetchApi<TimerStatus>(`/activities/${activityId}/timer`),
};

// Dashboard Data
export const dashboardApi = {
  // Get comprehensive dashboard
  getActivities: (): Promise<ActivityDashboard> =>
    fetchApi<ActivityDashboard>("/dashboard/activities"),

  // Get simplified summary
  getSummary: (): Promise<ActivitySummary[]> =>
    fetchApi<ActivitySummary[]>("/dashboard/activities/summary"),
};

// Health check
export const healthApi = {
  check: (): Promise<{ status: string; timestamp: string }> => {
    // Health endpoint is at root level, not under /api
    const healthUrl = API_BASE_URL.replace("/api", "") + "/health";
    return fetch(healthUrl).then((res) => res.json());
  },
};

// Utility function to transform backend Activity to component-friendly format
export const transformActivity = (activity: Activity): ActivityWithGoals => {
  return {
    ...activity,
    current_reps: activity.reps,
    daily_goal: activity.goals.daily,
    weekly_goal: activity.goals.weekly,
    monthly_goal: activity.goals.monthly,
    yearly_goal: activity.goals.yearly,
  };
};

// Transform array of activities
export const transformActivities = (activities: Activity[]): ActivityWithGoals[] => {
  return activities.map(transformActivity);
};

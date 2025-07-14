import { type DashboardData, type Topic, type Subtopic } from './types';

// Let's use 'let' to simulate a mutable database
let globalGoal = 10000;
let topics: Topic[] = [
  {
    id: '1',
    title: 'Learn Advanced React Patterns',
    category: 'Programming',
    earnings: 250,
    completionPercentage: 50,
    notes: 'Focus on hooks, context, and performance optimization. These are crucial for building scalable and maintainable applications.',
    urls: ['https://react.dev/learn', 'https://kentcdodds.com/blog'],
    moneyPer5Reps: 50,
    subtopics: [
      { id: '1-1', title: 'Master custom hooks', repsCompleted: 5, repsGoal: 10 },
      { id: '1-2', title: 'Understand useTransition', repsCompleted: 2, repsGoal: 5 },
      { id: '1-3', title: 'Implement state machines', repsCompleted: 0, repsGoal: 5 },
    ],
  },
  {
    id: '2',
    title: 'Build a Full-Stack Next.js App',
    category: 'Programming',
    earnings: 150,
    completionPercentage: 30,
    notes: 'Create a complete application with authentication, database integration, and server-side rendering using Next.js.',
    urls: ['https://nextjs.org/docs'],
    moneyPer5Reps: 75,
    subtopics: [
      { id: '2-1', title: 'Set up NextAuth.js', repsCompleted: 5, repsGoal: 5 },
      { id: '2-2', title: 'Connect to a database', repsCompleted: 1, repsGoal: 5 },
    ],
  },
  {
    id: '3',
    title: 'Daily Fitness Routine',
    category: 'Health',
    earnings: 400,
    completionPercentage: 80,
    notes: 'Stay active and healthy with a consistent daily workout plan.',
    urls: [],
    moneyPer5Reps: 20,
    subtopics: [
      { id: '3-1', title: 'Morning Run (km)', repsCompleted: 40, repsGoal: 50 },
      { id: '3-2', title: 'Evening Workout (sets)', repsCompleted: 60, repsGoal: 75 },
    ],
  },
];

const recalculateTopic = (topic: Topic) => {
  const totalRepsCompleted = topic.subtopics.reduce((sum, st) => sum + st.repsCompleted, 0);
  const totalRepsGoal = topic.subtopics.reduce((sum, st) => sum + st.repsGoal, 0);
  
  topic.completionPercentage = totalRepsGoal > 0 ? Math.round((totalRepsCompleted / totalRepsGoal) * 100) : 0;
  
  topic.earnings = topic.subtopics.reduce((sum, st) => {
      const setsOf5 = Math.floor(st.repsCompleted / 5);
      return sum + (setsOf5 * topic.moneyPer5Reps);
  }, 0);
}

const calculateTotals = () => {
  topics.forEach(recalculateTopic);
  const currentEarnings = topics.reduce((sum, topic) => sum + topic.earnings, 0);
  const progress = globalGoal > 0 ? (currentEarnings / globalGoal) * 100 : 0;
  return { currentEarnings, progress };
};

export const getDashboardData = (): DashboardData => {
  const { currentEarnings, progress } = calculateTotals();
  return {
    globalGoal,
    currentEarnings: Math.round(currentEarnings),
    progress: Math.round(progress),
    topics: topics.map(({ id, title, category, earnings, completionPercentage }) => ({
      id,
      title,
      category,
      earnings: Math.round(earnings),
      completionPercentage: Math.round(completionPercentage),
    })),
  };
};

export const setGlobalGoal = (newGoal: number) => {
  globalGoal = newGoal;
};

export const getTopicById = (id: string): Topic | undefined => {
  const topic = topics.find(topic => topic.id === id);
  if (topic) {
    recalculateTopic(topic);
  }
  return topic;
};

export const logReps = (subtopicId: string, reps: number) => {
    for (const topic of topics) {
        const subtopic = topic.subtopics.find(st => st.id === subtopicId);
        if (subtopic) {
            subtopic.repsCompleted += reps;
            recalculateTopic(topic);
            return { updatedTopic: topic, updatedSubtopic: subtopic };
        }
    }
    return null;
};

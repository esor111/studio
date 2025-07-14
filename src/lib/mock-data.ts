import { type DashboardData, type Topic, type Subtopic } from './types';

// Let's use 'let' to simulate a mutable database
let nextTopicId = 4;
let nextSubtopicId = 100; // a separate counter for subtopics

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
    isMoneyPer5RepsLocked: false,
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
    isMoneyPer5RepsLocked: true,
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
    isMoneyPer5RepsLocked: false,
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
    // Return a deep copy to avoid direct mutation of the "database" object
    return JSON.parse(JSON.stringify(topic));
  }
  return undefined;
};

export const logReps = (subtopicId: string, reps: number) => {
    for (const topic of topics) {
        const subtopic = topic.subtopics.find(st => st.id === subtopicId);
        if (subtopic) {
            subtopic.repsCompleted += reps;
            recalculateTopic(topic);
            return { updatedTopic: getTopicById(topic.id), updatedSubtopic: subtopic };
        }
    }
    return null;
};

export const getCategories = (): string[] => {
    const categories = new Set(topics.map(t => t.category));
    return Array.from(categories);
}

export const createTopic = (data: Omit<Topic, 'id' | 'earnings' | 'completionPercentage' | 'subtopics' | 'isMoneyPer5RepsLocked'>): Topic => {
    const newTopic: Topic = {
        id: String(nextTopicId++),
        earnings: 0,
        completionPercentage: 0,
        subtopics: [],
        isMoneyPer5RepsLocked: false,
        ...data,
    };
    topics.push(newTopic);
    return newTopic;
};

export const updateTopic = (id: string, data: Partial<Topic>): Topic | null => {
    const topicIndex = topics.findIndex(t => t.id === id);
    if (topicIndex === -1) {
        return null;
    }
    topics[topicIndex] = { ...topics[topicIndex], ...data };
    recalculateTopic(topics[topicIndex]);
    return getTopicById(id) as Topic;
};

export const getSubtopicById = (subtopicId: string): Subtopic | undefined => {
    for (const topic of topics) {
        const subtopic = topic.subtopics.find(st => st.id === subtopicId);
        if (subtopic) {
            return JSON.parse(JSON.stringify(subtopic));
        }
    }
    return undefined;
}

export const addSubtopicToTopic = (topicId: string, subtopicData: Pick<Subtopic, 'title' | 'repsGoal'>): Subtopic | null => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
        return null;
    }
    const newSubtopic: Subtopic = {
        id: String(nextSubtopicId++),
        title: subtopicData.title,
        repsGoal: subtopicData.repsGoal,
        repsCompleted: 0,
    };
    topic.subtopics.push(newSubtopic);
    recalculateTopic(topic);
    return newSubtopic;
}

export const updateSubtopic = (subtopicId: string, data: Partial<Subtopic>): Subtopic | null => {
    for (const topic of topics) {
        const subtopicIndex = topic.subtopics.findIndex(st => st.id === subtopicId);
        if (subtopicIndex !== -1) {
            topic.subtopics[subtopicIndex] = { ...topic.subtopics[subtopicIndex], ...data };
            recalculateTopic(topic);
            return topic.subtopics[subtopicIndex];
        }
    }
    return null;
}

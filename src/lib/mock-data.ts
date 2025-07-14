// This file is no longer the single source of truth for API calls.
// The mock server in `server.js` now handles API logic and data persistence.
// This file is kept for type definitions and potential utility functions,
// but its data is not directly used by the Next.js API routes anymore.

import { type DashboardData, type Topic, type Subtopic } from './types';

// The data is now managed in server.js. This file can be simplified or removed later.

// Dummy functions to avoid breaking imports in pages that were using them directly.
// In a real refactor, you would remove these and the direct imports.
export const getDashboardData = (): DashboardData => {
  throw new Error("getDashboardData should not be called from the client/server page anymore. Use fetch('/api/dashboard').");
};

export const getTopicById = (id: string): Topic | undefined => {
  throw new Error("getTopicById should not be called from the client/server page anymore. Use fetch(`/api/topics/${id}`).");
};

export const getCategories = (): string[] => {
    throw new Error("getCategories should not be called from the client/server page anymore. Use fetch('/api/categories').");
}

export const getSubtopicById = (subtopicId: string): Subtopic | undefined => {
    throw new Error("getSubtopicById should not be called from the client/server page anymore. Use fetch(`/api/sub-topics/${subtopicId}`).");
}

export const getTopicBySubtopicId = (subtopicId: string): Topic | undefined => {
     throw new Error("getTopicBySubtopicId should not be called from the client/server page anymore.");
}

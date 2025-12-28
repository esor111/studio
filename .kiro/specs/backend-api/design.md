# Backend API Design Document

## Overview

This document provides the complete API specification for the backend system that supports the topic/subtopic management frontend. The API follows RESTful conventions and provides endpoints for managing dashboard data, topics, subtopics, categories, and global settings.

## Architecture

### Technology Stack
- **Runtime**: Node.js with Express.js framework
- **Data Storage**: JSON file-based persistence (can be upgraded to database later)
- **Middleware**: CORS for cross-origin requests, JSON body parsing
- **Port**: Configurable via environment variable (default: 3001)

### API Base URL
- Development: `http://localhost:3001`
- Environment variable: `NEXT_PUBLIC_API_URL`

## Components and Interfaces

### Core Data Models

```typescript
interface Subtopic {
  id: string;
  title: string;
  repsCompleted: number;
  repsGoal: number;
  notes?: string;
  urls?: string[];
  goalAmount: number;
}

interface Topic {
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

interface DashboardData {
  globalGoal: number;
  currentEarnings: number;
  progress: number;
  topics: Pick<Topic, 'id' | 'title' | 'category' | 'earnings' | 'completionPercentage'>[];
}
```

## API Endpoints Specification

### 1. Dashboard Endpoints

#### GET /api/dashboard
**Purpose**: Retrieve dashboard overview data

**Request**:
```http
GET /api/dashboard
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "globalGoal": 5000,
  "currentEarnings": 1250.50,
  "progress": 25.01,
  "topics": [
    {
      "id": "topic-1",
      "title": "JavaScript Fundamentals",
      "category": "Programming",
      "earnings": 450.00,
      "completionPercentage": 75.5
    },
    {
      "id": "topic-2", 
      "title": "React Hooks",
      "category": "Frontend",
      "earnings": 800.50,
      "completionPercentage": 60.2
    }
  ]
}
```

#### PUT /api/dashboard/global-goal
**Purpose**: Update the global earnings goal

**Request**:
```http
PUT /api/dashboard/global-goal
Content-Type: application/json

{
  "globalGoal": 6000
}
```

**Response** (200 OK):
```json
{
  "globalGoal": 6000,
  "currentEarnings": 1250.50,
  "progress": 20.84
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Invalid global goal value"
}
```

### 2. Topic Endpoints

#### GET /api/topics/:topicId
**Purpose**: Retrieve a specific topic with all subtopics

**Request**:
```http
GET /api/topics/topic-1
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "id": "topic-1",
  "title": "JavaScript Fundamentals",
  "category": "Programming",
  "earnings": 450.00,
  "completionPercentage": 75.5,
  "notes": "Focus on ES6+ features and async programming",
  "urls": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
  "moneyPer5Reps": 25.00,
  "isMoneyPer5RepsLocked": false,
  "subtopics": [
    {
      "id": "subtopic-1",
      "title": "Variables and Data Types",
      "repsCompleted": 15,
      "repsGoal": 20,
      "notes": "Practice with let, const, and var",
      "urls": ["https://example.com/variables"],
      "goalAmount": 100.00
    },
    {
      "id": "subtopic-2",
      "title": "Functions and Scope",
      "repsCompleted": 8,
      "repsGoal": 15,
      "notes": "",
      "urls": [],
      "goalAmount": 150.00
    }
  ]
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Topic not found"
}
```

#### POST /api/topics
**Purpose**: Create a new topic

**Request**:
```http
POST /api/topics
Content-Type: application/json

{
  "title": "Python Basics",
  "category": "Programming",
  "notes": "Start with syntax and basic concepts",
  "urls": ["https://python.org/docs"],
  "moneyPer5Reps": 30.00,
  "isMoneyPer5RepsLocked": false
}
```

**Response** (201 Created):
```json
{
  "id": "topic-3",
  "title": "Python Basics",
  "category": "Programming",
  "earnings": 0,
  "completionPercentage": 0,
  "notes": "Start with syntax and basic concepts",
  "urls": ["https://python.org/docs"],
  "moneyPer5Reps": 30.00,
  "isMoneyPer5RepsLocked": false,
  "subtopics": []
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Title is required"
}
```

#### PUT /api/topics/:topicId
**Purpose**: Update an existing topic

**Request**:
```http
PUT /api/topics/topic-1
Content-Type: application/json

{
  "title": "Advanced JavaScript",
  "notes": "Updated focus on advanced concepts",
  "moneyPer5Reps": 35.00
}
```

**Response** (200 OK):
```json
{
  "id": "topic-1",
  "title": "Advanced JavaScript",
  "category": "Programming",
  "earnings": 450.00,
  "completionPercentage": 75.5,
  "notes": "Updated focus on advanced concepts",
  "urls": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
  "moneyPer5Reps": 35.00,
  "isMoneyPer5RepsLocked": false,
  "subtopics": [...]
}
```

### 3. Subtopic Endpoints

#### GET /api/sub-topics/:subtopicId
**Purpose**: Retrieve a specific subtopic

**Request**:
```http
GET /api/sub-topics/subtopic-1
Content-Type: application/json
```

**Response** (200 OK):
```json
{
  "id": "subtopic-1",
  "title": "Variables and Data Types",
  "repsCompleted": 15,
  "repsGoal": 20,
  "notes": "Practice with let, const, and var",
  "urls": ["https://example.com/variables"],
  "goalAmount": 100.00
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Subtopic not found"
}
```

#### POST /api/topics/:topicId/sub-topics
**Purpose**: Create a new subtopic within a topic

**Request**:
```http
POST /api/topics/topic-1/sub-topics
Content-Type: application/json

{
  "title": "Arrow Functions",
  "repsGoal": 10,
  "notes": "Focus on syntax and use cases",
  "urls": ["https://example.com/arrow-functions"],
  "goalAmount": 75.00
}
```

**Response** (201 Created):
```json
{
  "subTopic": {
    "id": "subtopic-3",
    "title": "Arrow Functions",
    "repsCompleted": 0,
    "repsGoal": 10,
    "notes": "Focus on syntax and use cases",
    "urls": ["https://example.com/arrow-functions"],
    "goalAmount": 75.00
  },
  "updatedTopic": {
    "id": "topic-1",
    "title": "JavaScript Fundamentals",
    "category": "Programming",
    "earnings": 450.00,
    "completionPercentage": 68.2,
    "notes": "Focus on ES6+ features and async programming",
    "urls": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
    "moneyPer5Reps": 25.00,
    "isMoneyPer5RepsLocked": false,
    "subtopics": [...]
  }
}
```

#### PUT /api/sub-topics/:subtopicId
**Purpose**: Update an existing subtopic

**Request**:
```http
PUT /api/sub-topics/subtopic-1
Content-Type: application/json

{
  "notes": "Updated practice notes with more examples",
  "repsGoal": 25
}
```

**Response** (200 OK):
```json
{
  "id": "subtopic-1",
  "title": "Variables and Data Types",
  "repsCompleted": 15,
  "repsGoal": 25,
  "notes": "Updated practice notes with more examples",
  "urls": ["https://example.com/variables"],
  "goalAmount": 100.00
}
```

#### POST /api/sub-topics/:subtopicId/reps
**Purpose**: Add repetitions to a subtopic

**Request**:
```http
POST /api/sub-topics/subtopic-1/reps
Content-Type: application/json

{
  "repsToAdd": 3
}
```

**Response** (200 OK):
```json
{
  "subtopic": {
    "id": "subtopic-1",
    "title": "Variables and Data Types",
    "repsCompleted": 18,
    "repsGoal": 20,
    "notes": "Practice with let, const, and var",
    "urls": ["https://example.com/variables"],
    "goalAmount": 100.00
  },
  "updatedTopic": {
    "id": "topic-1",
    "title": "JavaScript Fundamentals",
    "category": "Programming",
    "earnings": 465.00,
    "completionPercentage": 78.8,
    "notes": "Focus on ES6+ features and async programming",
    "urls": ["https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
    "moneyPer5Reps": 25.00,
    "isMoneyPer5RepsLocked": false,
    "subtopics": [...]
  }
}
```

### 4. Categories Endpoint

#### GET /api/categories
**Purpose**: Retrieve all unique categories from existing topics

**Request**:
```http
GET /api/categories
Content-Type: application/json
```

**Response** (200 OK):
```json
[
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "DevOps"
]
```

**Response when no topics exist** (200 OK):
```json
[]
```

## Data Models

### Calculation Logic

#### Topic Earnings Calculation
```javascript
// Earnings = (total reps completed across all subtopics / 5) * moneyPer5Reps
const totalReps = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.repsCompleted, 0);
const earnings = Math.floor(totalReps / 5) * topic.moneyPer5Reps;
```

#### Topic Completion Percentage
```javascript
// Completion = (total reps completed / total reps goal) * 100
const totalCompleted = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.repsCompleted, 0);
const totalGoal = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.repsGoal, 0);
const completionPercentage = totalGoal > 0 ? (totalCompleted / totalGoal) * 100 : 0;
```

#### Dashboard Progress Calculation
```javascript
// Progress = (current earnings / global goal) * 100
const currentEarnings = topics.reduce((sum, topic) => sum + topic.earnings, 0);
const progress = globalGoal > 0 ? (currentEarnings / globalGoal) * 100 : 0;
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- **200 OK**: Successful GET/PUT requests
- **201 Created**: Successful POST requests
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

### Common Error Scenarios
1. **Missing required fields**: Return 400 with specific field error
2. **Invalid data types**: Return 400 with validation error
3. **Resource not found**: Return 404 with resource type
4. **Server errors**: Return 500 with generic error message

## Testing Strategy

### Unit Tests
- Test calculation functions (earnings, completion percentage)
- Test data validation functions
- Test CRUD operations for each model

### Integration Tests
- Test complete API endpoints with sample data
- Test error handling scenarios
- Test data persistence across requests

### API Testing
- Test all endpoints with valid and invalid data
- Test concurrent request handling
- Test data consistency after multiple operations

### Performance Considerations
- File-based storage is suitable for development and small datasets
- Consider database migration for production use
- Implement request validation and sanitization
- Add request rate limiting for production deployment
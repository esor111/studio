# Requirements Document

## Introduction

This document outlines the requirements for a backend API system that supports a topic and subtopic management application with earnings tracking functionality. The system allows users to create topics with associated subtopics, track repetitions (reps) completed, manage notes and URLs, and calculate earnings based on completion rates. The frontend is a Next.js application that expects specific API endpoints for data management and persistence.

## Requirements

### Requirement 1

**User Story:** As a user, I want to view my dashboard with global goals and topic summaries, so that I can track my overall progress and earnings.

#### Acceptance Criteria

1. WHEN a user requests dashboard data THEN the system SHALL return global goal, current earnings, progress percentage, and topic summaries
2. WHEN dashboard data is requested THEN the system SHALL include topic id, title, category, earnings, and completion percentage for each topic
3. WHEN dashboard data is calculated THEN the system SHALL aggregate earnings from all topics and calculate overall progress

### Requirement 2

**User Story:** As a user, I want to create new topics with categories and money settings, so that I can organize my learning goals and track potential earnings.

#### Acceptance Criteria

1. WHEN a user creates a topic THEN the system SHALL accept title, category, notes, URLs, and money per 5 reps settings
2. WHEN a topic is created THEN the system SHALL generate a unique ID and initialize earnings and completion percentage to zero
3. WHEN a topic is created THEN the system SHALL validate required fields and return appropriate error messages for invalid data
4. WHEN a topic is created THEN the system SHALL return the complete topic object including generated ID

### Requirement 3

**User Story:** As a user, I want to retrieve and update existing topics, so that I can modify topic details and track changes over time.

#### Acceptance Criteria

1. WHEN a user requests a specific topic THEN the system SHALL return the complete topic with all subtopics
2. WHEN a user updates a topic THEN the system SHALL accept partial updates and preserve unchanged fields
3. WHEN a topic is updated THEN the system SHALL recalculate earnings and completion percentage based on subtopic progress
4. WHEN a topic is requested that doesn't exist THEN the system SHALL return a 404 error

### Requirement 4

**User Story:** As a user, I want to manage subtopics within topics, so that I can break down larger goals into manageable tasks.

#### Acceptance Criteria

1. WHEN a user creates a subtopic THEN the system SHALL accept title, reps goal, notes, URLs, and goal amount
2. WHEN a subtopic is created THEN the system SHALL initialize reps completed to zero and generate a unique ID
3. WHEN a user updates a subtopic THEN the system SHALL accept partial updates and recalculate parent topic metrics
4. WHEN a subtopic is retrieved THEN the system SHALL return complete subtopic data including progress information

### Requirement 5

**User Story:** As a user, I want to track repetitions completed for subtopics, so that I can monitor my progress and earn money based on completion.

#### Acceptance Criteria

1. WHEN a user adds reps to a subtopic THEN the system SHALL increment the reps completed count
2. WHEN reps are added THEN the system SHALL recalculate subtopic completion percentage
3. WHEN reps are added THEN the system SHALL recalculate parent topic earnings based on money per 5 reps setting
4. WHEN reps are added THEN the system SHALL update parent topic completion percentage based on all subtopics

### Requirement 6

**User Story:** As a user, I want to manage global earnings goals, so that I can set and track overall financial targets.

#### Acceptance Criteria

1. WHEN a user updates the global goal THEN the system SHALL accept the new goal amount
2. WHEN the global goal is updated THEN the system SHALL recalculate overall progress percentage
3. WHEN global goal data is requested THEN the system SHALL return current goal and progress information

### Requirement 7

**User Story:** As a user, I want to retrieve available categories, so that I can organize topics consistently.

#### Acceptance Criteria

1. WHEN categories are requested THEN the system SHALL return a list of all unique categories from existing topics
2. WHEN no topics exist THEN the system SHALL return an empty categories array
3. WHEN categories are requested THEN the system SHALL return categories in a consistent order

### Requirement 8

**User Story:** As a system, I want to persist data reliably, so that user progress and settings are maintained across sessions.

#### Acceptance Criteria

1. WHEN any data is modified THEN the system SHALL persist changes to permanent storage
2. WHEN the system starts THEN the system SHALL load existing data from storage
3. WHEN data operations fail THEN the system SHALL return appropriate error responses with status codes
4. WHEN concurrent requests occur THEN the system SHALL handle them safely without data corruption
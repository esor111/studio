# Requirements Document

## Introduction

This feature involves removing the Genkit AI framework from the Next.js project to improve performance and reduce bundle size. The project currently has Genkit configured but unused, causing unnecessary overhead. All existing functionality for the topic/subtopic tracking system with earnings calculations must be preserved exactly as-is.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to remove unused Genkit dependencies from my project, so that the application runs faster and has a smaller bundle size.

#### Acceptance Criteria

1. WHEN Genkit dependencies are removed THEN the system SHALL maintain all existing functionality without any behavioral changes
2. WHEN the project is built THEN the system SHALL have a smaller bundle size compared to the current version
3. WHEN the development server starts THEN the system SHALL start faster than the current version
4. WHEN any existing API endpoints are called THEN the system SHALL return the same responses as before

### Requirement 2

**User Story:** As a developer, I want to clean up all Genkit-related files and configurations, so that the codebase is cleaner and easier to maintain.

#### Acceptance Criteria

1. WHEN Genkit files are removed THEN the system SHALL remove all files in the `src/ai` directory
2. WHEN Genkit configurations are cleaned THEN the system SHALL remove the `.genkit` directory and its contents
3. WHEN package.json is updated THEN the system SHALL remove all Genkit-related dependencies
4. WHEN .gitignore is updated THEN the system SHALL remove Genkit-related ignore patterns

### Requirement 3

**User Story:** As a developer, I want to ensure no imports or references to Genkit remain in the codebase, so that there are no broken imports or runtime errors.

#### Acceptance Criteria

1. WHEN the codebase is scanned THEN the system SHALL have zero references to Genkit imports or usage
2. WHEN the project is built THEN the system SHALL compile successfully without any Genkit-related errors
3. WHEN the application runs THEN the system SHALL function without any runtime errors related to missing Genkit modules
4. WHEN TypeScript checking is performed THEN the system SHALL pass type checking without Genkit-related type errors

### Requirement 4

**User Story:** As a user, I want all existing features to work exactly the same after Genkit removal, so that my workflow is not disrupted.

#### Acceptance Criteria

1. WHEN I navigate to any page THEN the system SHALL display the same content and functionality as before
2. WHEN I perform any action (add/edit topics, update reps, etc.) THEN the system SHALL behave identically to the previous version
3. WHEN I interact with the UI THEN the system SHALL maintain all animations, sounds, and visual effects
4. WHEN data is persisted THEN the system SHALL use the same data structures and storage mechanisms as before
# Implementation Plan

- [ ] 1. Set up project structure and core dependencies
  - Create backend directory structure with proper organization
  - Initialize package.json with Express, CORS, and development dependencies
  - Set up TypeScript configuration for type safety
  - Create basic server entry point with Express app setup
  - _Requirements: 8.1, 8.2_

- [ ] 2. Implement data models and validation utilities
  - Create TypeScript interfaces for Topic, Subtopic, and DashboardData
  - Implement data validation functions for all model properties
  - Create utility functions for ID generation and data sanitization
  - Write unit tests for validation functions
  - _Requirements: 2.3, 4.3, 8.3_

- [ ] 3. Create file-based data persistence layer
  - Implement data storage service with JSON file read/write operations
  - Create data initialization function for empty storage
  - Implement safe concurrent file access with proper error handling
  - Write unit tests for data persistence operations
  - _Requirements: 8.1, 8.2, 8.4_

- [ ] 4. Implement calculation engine for earnings and progress
  - Create functions to calculate topic earnings based on reps and money per 5 reps
  - Implement topic completion percentage calculation from subtopic progress
  - Create dashboard progress calculation from total earnings and global goal
  - Write comprehensive unit tests for all calculation functions
  - _Requirements: 1.3, 3.3, 5.3, 5.4_

- [ ] 5. Build dashboard API endpoints
  - Implement GET /api/dashboard endpoint with data aggregation
  - Create PUT /api/dashboard/global-goal endpoint with validation
  - Add proper error handling and HTTP status codes
  - Write integration tests for dashboard endpoints
  - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3_

- [ ] 6. Implement topic management endpoints
  - Create GET /api/topics/:topicId endpoint with subtopic inclusion
  - Implement POST /api/topics endpoint with data validation
  - Build PUT /api/topics/:topicId endpoint with partial updates
  - Add proper error responses for invalid topic IDs
  - Write integration tests for all topic endpoints
  - _Requirements: 2.1, 2.2, 2.4, 3.1, 3.2, 3.4_

- [ ] 7. Build subtopic management endpoints
  - Implement GET /api/sub-topics/:subtopicId endpoint
  - Create POST /api/topics/:topicId/sub-topics endpoint with parent topic updates
  - Build PUT /api/sub-topics/:subtopicId endpoint with recalculation triggers
  - Add POST /api/sub-topics/:subtopicId/reps endpoint for rep tracking
  - Write integration tests for all subtopic endpoints
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2_

- [ ] 8. Implement categories endpoint
  - Create GET /api/categories endpoint that extracts unique categories from topics
  - Implement proper sorting and deduplication logic
  - Handle empty topics scenario gracefully
  - Write unit tests for category extraction logic
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 9. Add comprehensive error handling middleware
  - Create global error handling middleware for Express app
  - Implement request validation middleware for all endpoints
  - Add proper HTTP status codes for different error scenarios
  - Create consistent error response format across all endpoints
  - Write tests for error handling scenarios
  - _Requirements: 8.3, 2.3, 3.4, 4.4_

- [ ] 10. Set up CORS and request parsing middleware
  - Configure CORS middleware to allow frontend requests
  - Set up JSON body parsing middleware
  - Add request logging middleware for debugging
  - Configure proper content-type handling
  - Test cross-origin requests from frontend
  - _Requirements: 8.1, 8.4_

- [ ] 11. Create server startup and configuration
  - Implement server startup script with environment variable support
  - Add graceful shutdown handling
  - Create development and production configuration options
  - Set up proper port configuration with defaults
  - Write startup integration tests
  - _Requirements: 8.1, 8.2_

- [ ] 12. Write comprehensive API integration tests
  - Create test suite that covers all API endpoints with valid data
  - Test error scenarios for each endpoint
  - Implement tests for data persistence across multiple requests
  - Test concurrent request handling and data consistency
  - Create test data fixtures and cleanup utilities
  - _Requirements: 8.4, 2.3, 3.4, 4.4, 5.4_

- [ ] 13. Add API documentation and development scripts
  - Create README with API endpoint documentation and examples
  - Add npm scripts for development, testing, and production
  - Create sample data file for development testing
  - Add TypeScript build configuration and scripts
  - Document environment variables and configuration options
  - _Requirements: 8.1, 8.2_

- [ ] 14. Implement data recalculation triggers
  - Create service functions that recalculate topic metrics when subtopics change
  - Implement dashboard data updates when topics are modified
  - Add automatic recalculation after rep additions
  - Ensure all calculations are triggered consistently across endpoints
  - Write tests to verify calculation triggers work correctly
  - _Requirements: 3.3, 5.3, 5.4, 6.2_

- [ ] 15. Final integration testing and bug fixes
  - Test complete API with frontend application
  - Verify all endpoints match frontend expectations exactly
  - Fix any data format mismatches or missing fields
  - Test error handling integration with frontend error displays
  - Validate calculation accuracy with real usage scenarios
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4_
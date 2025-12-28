# Design Document

## Overview

This design outlines the systematic removal of Genkit AI framework from the Next.js project. The approach focuses on identifying and removing all Genkit-related code, dependencies, and configurations while ensuring zero impact on existing functionality. Since Genkit is currently unused in the project, this is primarily a cleanup operation.

## Architecture

The current architecture shows Genkit configured but never utilized:

```
Current State:
- src/ai/genkit.ts (unused Genkit configuration)
- src/ai/dev.ts (empty file for Genkit flows)
- .genkit/ directory (Genkit runtime files)
- package.json (no Genkit dependencies found)
- .gitignore (Genkit ignore patterns)

Target State:
- Complete removal of src/ai/ directory
- Removal of .genkit/ directory
- Clean .gitignore without Genkit patterns
- No performance overhead from unused AI framework
```

The application's core architecture remains unchanged:
- Next.js 15.3.3 with React 18
- Topic/Subtopic tracking system
- Client-side state management
- API routes for data operations
- UI components with animations and interactions

## Components and Interfaces

### Files to Remove
1. **AI Directory**: `src/ai/genkit.ts` and `src/ai/dev.ts`
2. **Runtime Directory**: `.genkit/` and all subdirectories
3. **Configuration Cleanup**: Genkit patterns in `.gitignore`

### Files to Verify (No Changes Expected)
1. **Core Application**: All files in `src/app/`, `src/components/`, `src/hooks/`, `src/lib/`
2. **Configuration**: `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
3. **Package Management**: `package.json`, `package-lock.json`

### Dependencies Analysis
Based on package.json review, no Genkit dependencies were found in the current dependency list, which suggests they may have been removed already or were never properly installed. This simplifies the removal process.

## Data Models

No changes to existing data models are required:
- `Topic` interface remains unchanged
- `Subtopic` interface remains unchanged  
- `DashboardData` interface remains unchanged
- All type definitions in `src/lib/types.ts` remain intact

## Error Handling

### Potential Issues and Mitigations

1. **Import Errors**: 
   - Risk: Broken imports if any files reference the AI directory
   - Mitigation: Comprehensive search for any imports from `src/ai`
   - Current Status: No imports found in codebase scan

2. **Build Errors**:
   - Risk: TypeScript compilation issues
   - Mitigation: Full build test after removal
   - Verification: `npm run build` and `npm run typecheck`

3. **Runtime Errors**:
   - Risk: Missing modules at runtime
   - Mitigation: Development server testing
   - Verification: `npm run dev` and manual testing

## Testing Strategy

### Pre-Removal Verification
1. Document current build time and bundle size
2. Verify all existing functionality works correctly
3. Run full test suite (if available)

### Post-Removal Validation
1. **Build Verification**:
   - `npm run build` completes successfully
   - `npm run typecheck` passes without errors
   - Bundle size comparison shows reduction

2. **Functionality Testing**:x
   - All pages load correctly
   - Topic creation/editing works
   - Subtopic management functions
   - Rep counting and money calculations work
   - Animations and sound effects function
   - Data persistence operates correctly

3. **Performance Verification**:
   - Development server startup time improvement
   - Page load time measurements
   - Bundle size reduction confirmation

### Rollback Plan
If any issues are discovered:
1. Restore files from git history
2. Reinstall any removed dependencies
3. Verify functionality returns to previous state

## Implementation Approach

### Phase 1: Analysis and Backup
- Verify no actual Genkit usage in codebase
- Create backup of current state
- Document current performance metrics

### Phase 2: File Removal
- Remove `src/ai/` directory completely
- Remove `.genkit/` directory and contents
- Clean up `.gitignore` patterns

### Phase 3: Verification
- Build project and verify no errors
- Test all functionality manually
- Measure performance improvements

### Phase 4: Cleanup
- Remove any remaining references
- Update documentation if needed
- Commit clean state

## Success Criteria

1. **Zero Functional Impact**: All existing features work identically
2. **Performance Improvement**: Faster startup and smaller bundle
3. **Clean Codebase**: No unused files or configurations
4. **Error-Free Build**: Successful compilation and type checking
5. **Maintainability**: Cleaner project structure for future development
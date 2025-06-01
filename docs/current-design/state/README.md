# State Management

## Overview
This document outlines the state management approach used in the application. The app uses a combination of React Context, React Query, and local component state to manage application state.

## State Management Libraries

### 1. React Query
- **Purpose**: Server state management and data fetching
- **Key Features**:
  - Data fetching and caching
  - Background updates and stale-while-revalidate
  - Pagination and infinite loading
  - Optimistic updates
  - Automatic retries and error handling

### 2. React Context
- **Purpose**: Global application state
- **Key Contexts**:
  - `AuthContext`: Manages authentication state
  - `AppContext`: Global application state and settings

### 3. Local Component State
- **Purpose**: UI-specific state that doesn't need to be shared
- **Implementation**: `useState` and `useReducer` hooks

## Key State Containers

### 1. Authentication State
**File:** `src/navigation/AuthContext.tsx`

Manages the authentication state of the application:
- Current user information
- Authentication status
- Login/logout functionality

**Key Methods:**
- `handleSignIn`: Handles user login
- `handleSignOut`: Handles user logout
- `handleSignInUnverified`: Handles login for unverified users

### 2. App State
**File:** `src/navigation/AppContext.tsx`

Manages global application state:
- Theme settings
- App configuration
- Global loading states

## Data Fetching with React Query

The application uses React Query for all data fetching operations. Each service (e.g., `useAuthService`, `useUserService`) defines its own queries and mutations.

### Query Keys
Query keys are used to identify and manage query cache. They follow a hierarchical structure:
- `['users']`: Base key for user-related queries
- `['users', 'me']`: Current user's profile
- `['users', 'list']`: List of users
- `['posts']`: Posts list
- `['posts', postId]`: Single post

### Mutation Keys
- `AuthMutations`: Authentication-related mutations
- `UserMutations`: User profile mutations
- `PostMutations`: Post-related mutations

## State Persistence

### Authentication State
- JWT token is stored securely using `@react-native-async-storage/async-storage`
- Token is automatically included in API requests via axios interceptors

### Offline Support
- React Query provides built-in offline support with its cache-first approach
- Queries are automatically refetched when the app regains connectivity

## Best Practices

1. **Separation of Concerns**
   - UI components should only handle presentation
   - Data fetching and state management should be handled in custom hooks

2. **Optimistic Updates**
   - Use React Query's `onMutate`, `onError`, and `onSettled` callbacks for optimistic UI updates

3. **Error Handling**
   - Handle errors at the query/mutation level
   - Show appropriate error messages to users
   - Implement retry logic for transient failures

4. **Performance**
   - Use `select` to transform data in the query
   - Implement pagination for large datasets
   - Use `keepPreviousData` for smooth pagination

## Common Patterns

### Data Fetching
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId, // Only run query if userId exists
});
```

### Data Mutation
```typescript
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
  onError: (error) => {
    // Handle error
  },
});
```

### Authentication Flow
1. User submits login form
2. `handleSignIn` is called with credentials
3. On success, user data is stored in context
4. Token is saved to secure storage
5. User is redirected to main app
6. On app startup, token is loaded and user is automatically logged in if token is valid

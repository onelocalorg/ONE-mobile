# UI Components

## Overview
This directory contains reusable UI components used throughout the application. Components are organized by feature and functionality.

## Component Categories

### 1. Authentication Components
- `LoginForm`: Handles user login with email/password
- `SocialAuthButtons`: Provides Apple and Google sign-in buttons
- `SignUpForm`: Handles user registration
- `ForgotPasswordForm`: Handles password recovery

### 2. Common UI Elements
- `Button`: Customizable button component
- `Input`: Form input field with validation
- `Modal`: Reusable modal dialog
- `Loader`: Loading indicator
- `Avatar`: User profile picture display
- `Badge`: Status indicators and counters
- `Card`: Content container with consistent styling

### 3. Navigation
- `TabBar`: Custom tab bar with icons
- `Header`: Screen header with back button and title
- `Drawer`: Side navigation drawer
- `FloatingActionButton`: Action button that floats above content

### 4. Content Display
- `PostCard`: Displays a single post
- `Comment`: Displays a single comment
- `UserCard`: Displays user information
- `EventCard`: Displays event information
- `ImageGallery`: Displays a collection of images

### 5. Forms
- `FormInput`: Base input field with validation
- `FormSelect`: Dropdown selector
- `DatePicker`: Date selection component
- `FileUpload`: File upload control
- `FormError`: Displays form validation errors

### 6. Lists
- `FlatList`: Optimized list component
- `SectionList`: Sectioned list component
- `SwipeableItem`: Swipeable list item
- `InfiniteScrollList`: List with infinite scrolling

## Component Structure

Each component follows a consistent structure:

```
ComponentName/
  ├── index.tsx         # Main component file
  ├── style.ts          # Component styles
  ├── types.ts          # TypeScript types and interfaces
  └── __tests__/        # Component tests
      └── ComponentName.test.tsx
```

## Props Naming Conventions

- Boolean props are prefixed with `is`, `has`, or `should` (e.g., `isLoading`, `hasError`)
- Event handlers are prefixed with `on` (e.g., `onPress`, `onChangeText`)
- Style props are passed via the `style` prop
- Accessibility props are prefixed with `accessibility`

## Styling

Components are styled using a theme-based approach:

```typescript
// Example theme object
const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000',
    // ...
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // ...
};
```

## Best Practices

1. **Composition**
   - Prefer composition over inheritance
   - Keep components small and focused
   - Use container/component pattern for complex UIs

2. **Performance**
   - Memoize expensive calculations
   - Use `React.memo` for pure components
   - Implement `useCallback` and `useMemo` where appropriate

3. **Accessibility**
   - Add proper accessibility labels
   - Support keyboard navigation
   - Ensure sufficient color contrast
   - Support dynamic type sizes

4. **Testing**
   - Write unit tests for business logic
   - Add integration tests for component interactions
   - Use snapshot testing for UI consistency

## Component Library

The application uses several third-party component libraries:

- `react-native-paper`: Material Design components
- `react-native-elements`: Cross-platform UI toolkit
- `react-native-vector-icons`: Icon library
- `react-native-gesture-handler`: Gesture handling
- `react-native-reanimated`: Smooth animations

## Custom Hooks

Reusable logic is extracted into custom hooks:

- `useForm`: Form state management
- `useTheme`: Theme access and manipulation
- `useDebounce`: Debounce function calls
- `usePagination`: Pagination logic
- `useImagePicker`: Image selection and upload

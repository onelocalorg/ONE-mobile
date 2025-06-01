# Event List Component

## Overview
**File Path:** `src/components/events/EventList.tsx`

The `EventList` component is a container that displays a scrollable list of events. It handles data fetching, loading states, and empty states, and can be filtered by group or chapter.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `group` | `Group` | No | Optional group to filter events by |
| `placeholder` | `string` | No | Placeholder text for the add event button |

## Features

### 1. Data Fetching
- Uses `useEventService` to fetch events
- Automatically filters events based on:
  - `isPast: false` (upcoming events only)
  - `chapterId`: From app context
  - `groupIds`: From props or context

### 2. Group Permissions
- Checks user's role in the group (admin, editor, member, or non-member)
- Shows/hides the "Add Event" button based on permissions
- Handles nested group structures (parent-child relationships)

### 3. UI Components
- `FlatList` for efficient rendering of event cards
- `EventCard` for displaying individual events
- `AddEventView` for adding new events (conditionally rendered)
- `Loader` for loading states
- Empty state message when no events are found

## State Management

### Local State
- `isLoading`: Tracks loading state of the query

### Data Flow
1. On mount, fetches events based on current filters
2. Shows loading indicator while fetching
3. Renders events using `EventCard` components
4. Handles errors and empty states

## Styling
- Uses theme variables for consistent styling
- Responsive layout that works on different screen sizes
- Custom styles defined in `style.ts`

## Usage Example

```tsx
// Basic usage
<EventList />

// With group filter
<EventList group={selectedGroup} />

// With custom placeholder
<EventList placeholder="Create your first event" />
```

## Integration with Other Components

### Parent Components
- `EventListScreen`: Wraps the EventList component
- `GroupDetailScreen`: Shows events for a specific group

### Child Components
- `EventCard`: Displays individual events
- `AddEventView`: Form for adding new events
- `Loader`: Loading indicator

## Error Handling
- Uses `handleApiError` utility for consistent error handling
- Displays error messages to the user when API calls fail
- Gracefully handles empty states

## Performance Considerations
- Uses React Query for efficient data fetching and caching
- Implements `FlatList` for optimized rendering of long lists
- Memoizes event cards to prevent unnecessary re-renders
- Uses stable keys for list items

## Accessibility
- Implements proper accessibility labels and roles
- Supports dynamic type scaling
- Ensures sufficient color contrast
- Provides clear feedback for loading and error states

## Edge Cases
- Handles empty event lists
- Manages loading states during data fetching
- Handles network errors gracefully
- Respects user permissions for event creation

## Dependencies
- `@tanstack/react-query`: Data fetching and caching
- React Native core components
- Custom hooks and utilities from the app

## Testing Notes
- Test with various permission levels
- Verify loading and error states
- Test with empty and large datasets
- Verify accessibility features

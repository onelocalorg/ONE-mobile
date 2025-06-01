# Event List Screen

## Overview
**File Path:** `src/screens/event/EventListScreen.tsx`

Displays a list of upcoming events that users can browse and interact with. The screen can show events from all groups or filter by a specific group.

## UI Components

### Main Layout
- **Header**: Screen title with optional group name
- **Add Event Button**: Floating action button (visible to group members)
- **Event List**: Scrollable list of event cards
- **Empty State**: Message when no events are found

### Event Card
Each event is displayed as a card showing:
- Event image
- Event title
- Date and time
- Location
- Number of attendees
- Group/organizer name

## Data Flow

### Data Fetching
- Uses `useEventService` to fetch events
- Fetches events based on filters:
  - `isPast: false` (upcoming events only)
  - `chapterId`: Filters by chapter
  - `groupIds`: Filters by group(s)

### State Management
- **Loading State**: Shows a loader while fetching events
- **Error State**: Handles and displays API errors
- **Empty State**: Shows a message when no events are found

## User Interactions

### Event Actions
- **Tap Event Card**: Navigates to event details
- **Tap Join/RSVP**: Registers user for the event
- **Swipe to Refresh**: Refreshes the event list
- **Scroll to Load More**: Pagination for large event lists

### Group-Specific Features
- **Group Admins/Editors**: See additional management options
- **Group Members**: Can see and RSVP to events
- **Non-members**: May see limited event information

## Permissions
- **View Events**: Available to all users
- **Create Events**: Available to group members with appropriate permissions
- **Edit/Delete Events**: Available to event organizers and group admins

## Related Components
- `EventCard`: Displays individual event information
- `AddEventView`: Form to create new events
- `EventFilters`: Component for filtering events (if implemented)

## Styling
- Uses theme-based styling
- Responsive layout for different screen sizes
- Consistent card design with the app's design system

## Error Handling
- Displays error messages for failed API calls
- Handles offline state gracefully
- Shows appropriate empty states

## Navigation
- **From**: Home screen, Group details, or main navigation
- **To**:
  - Event details screen
  - Create event screen
  - Group details (if coming from a group)

## API Endpoints
- **GET /events**: Fetches list of events
  - Query params:
    - `isPast`: boolean
    - `chapterId`: string (optional)
    - `groupIds`: string[] (optional)
    - `limit`: number
    - `offset`: number

## Performance Considerations
- Implements pagination for large event lists
- Uses `FlatList` for efficient rendering
- Memoizes event cards to prevent unnecessary re-renders
- Optimizes image loading with placeholders

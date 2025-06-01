# Event Creation Flow

## Overview
This document outlines the complete flow for creating events in the application, including all related components, data flow, and user interactions.

## Components in the Flow

### 1. AddEventView
**File:** `src/components/events/AddEventView.tsx`
- Entry point for event creation
- Displays a button to start creating a new event
- Shows user's avatar and a placeholder text
- Handles navigation to the event creation screen

### 2. CreateEventScreen
**File:** `src/screens/createEditEvent/CreateEventScreen.tsx`
- Main container for the event creation flow
- Manages data fetching and mutations
- Handles navigation and success/error states
- Integrates with the EventEditor component

### 3. EventEditor
**File:** `src/screens/createEditEvent/EventEditor.tsx`
- Complex form component for creating/editing events
- Handles all event-related fields and validations
- Integrates with various sub-components for specific functionality
- Manages form state and submission

## Data Flow

### 1. Initialization
1. User taps the "Add Event" button in `AddEventView`
2. Navigation is triggered with optional `groupId` parameter
3. `CreateEventScreen` mounts and initializes

### 2. Data Loading
1. If `groupId` is provided, fetches group details
2. Initializes form with default values or existing event data
3. Loads any necessary reference data (locations, ticket types, etc.)

### 3. Form Interaction
1. User fills out event details in `EventEditor`
2. Form validation occurs on each field
3. Dynamic fields (dates, tickets) are managed with `useFieldArray`
4. Media uploads are handled asynchronously

### 4. Submission
1. User submits the form
2. Form data is validated
3. If valid, creates/updates the event via API
4. On success:
   - Invalidates event list queries
   - Navigates back to previous screen
   - Shows success message
5. On error:
   - Displays error message
   - Keeps form data intact

## Key Features

### 1. Rich Media Support
- Image uploads with preview
- Support for multiple images
- Image cropping and optimization

### 2. Date & Time Management
- Date/time picker integration
- Timezone handling
- Duration calculation

### 3. Location Services
- Address autocomplete
- Map integration
- Location validation

### 4. Ticket Management
- Support for multiple ticket types
- Pricing and capacity controls
- Early bird pricing options

### 5. Permissions
- Group-based access control
- Role-based field visibility
- Validation based on user permissions

## API Integration

### Endpoints
- `POST /events` - Create new event
- `GET /groups/:id` - Get group details
- `POST /media/upload` - Upload event media

### Data Structures

#### Event Creation Payload
```typescript
interface LocalEventData {
  name: string;
  description: string;
  startDate: string; // ISO 8601
  endDate?: string;   // ISO 8601
  location?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  images: Array<{
    url: string;
    width: number;
    height: number;
    file?: FileKey;
  }>;
  ticketTypes?: Array<{
    name: string;
    price: number;
    quantity: number;
    description?: string;
    salesStart?: string; // ISO 8601
    salesEnd?: string;   // ISO 8601
  }>;
  // ... other fields
}
```

## Error Handling

### Validation Errors
- Field-level validation messages
- Cross-field validation (e.g., end date after start date)
- Required field indicators

### API Errors
- Network error handling
- Server-side validation errors
- Rate limiting and authentication errors

### Recovery Flows
- Auto-save drafts
- Form persistence on navigation
- Error recovery suggestions

## Accessibility
- Form field labels and hints
- Keyboard navigation
- Screen reader support
- High contrast mode

## Performance Considerations
- Lazy loading of heavy components
- Optimistic UI updates
- Efficient re-rendering with React.memo
- Image optimization

## Testing Scenarios

### Happy Path
1. Fill all required fields
2. Submit form
3. Verify successful creation
4. Verify navigation
5. Verify new event appears in lists

### Edge Cases
1. Form validation
2. Network failures
3. Permission issues
4. Offline mode
5. Timezone handling

## Future Enhancements
1. Recurring events
2. Event templates
3. Bulk event creation
4. Advanced scheduling options
5. Integration with calendar apps

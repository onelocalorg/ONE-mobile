# Event Card Component

## Overview
**File Path:** `src/components/events/EventCard.tsx`

The `EventCard` component displays a preview of an event with essential information in a visually appealing card format. It's used throughout the app to display events in lists.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `event` | `LocalEvent` | Yes | The event object containing all event details |
| `disabled` | `boolean` | No | Disables the touch interaction |
| `style` | `StyleProp<ViewStyle>` | No | Custom styles to apply to the card |

## Event Data Structure
```typescript
interface LocalEvent {
  id: string;
  name: string;
  description: string;
  startDate: DateTime;
  endDate: DateTime;
  location?: string;
  images: Array<{
    url: string;
    // ... other image properties
  }>;
  group?: {
    id: string;
    name: string;
    images: Array<{ url: string }>;
    // ... other group properties
  };
  // ... other event properties
}
```

## UI Structure

### Main Container
- Touchable wrapper that navigates to event details on press
- Applies theme-based styling
- Supports custom styles via `style` prop

### Header Section
- Displays group information (if available)
  - Group avatar (first image from group.images)
  - Group name

### Content Section
1. **Date and Time**
   - Formatted start date (e.g., "Jun 1, 2023")
   - Start time (e.g., "2:30 PM")

2. **Event Title**
   - Event name in bold
   - Truncated if too long

3. **Location**
   - Location icon (MapPin)
   - Location text (truncated if too long)

4. **Event Image** (if available)
   - First image from event.images
   - Rounded corners
   - Fixed size

## Styling
- Uses theme variables for colors, spacing, and typography
- Responsive layout using Grid and Flexbox
- Consistent spacing and alignment
- Platform-specific styling (iOS/Android/Web)

## Accessibility
- Touch targets meet minimum size requirements
- Sufficient color contrast
- Screen reader labels for interactive elements
- Dynamic type support for text scaling

## Usage Example

```tsx
<EventCard 
  event={{
    id: '123',
    name: 'Team Meeting',
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({ hours: 1 }),
    location: 'Conference Room A',
    images: [{ url: 'https://example.com/event.jpg' }],
    group: {
      id: 'g1',
      name: 'Engineering Team',
      images: [{ url: 'https://example.com/group.jpg' }]
    }
  }} 
/>
```

## Related Components
- `EventList`: Renders a list of EventCard components
- `EventDetailScreen`: Shows detailed event information
- `GroupAvatar`: Displays group avatars (used within the card)

## Notes
- The component handles missing data gracefully (e.g., no group, no location)
- Images are loaded asynchronously with placeholder support
- Performance is optimized with React.memo and proper key props

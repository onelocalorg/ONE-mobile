# Tab Navigation

## Overview
**File Path:** `src/navigation/TabNavigator.tsx`

The `TabNavigator` component implements the bottom tab navigation for the application, providing quick access to the main sections of the app.

## Tab Structure

The bottom tab bar contains the following items (from left to right):

1. **Home**
   - Icon: Home icon
   - Screen: `HomeRoute`
   - Purpose: Main feed showing posts, groups, and people

2. **Events**
   - Icon: Calendar/event icon
   - Screen: `EventRoute`
   - Purpose: View and manage events

3. **Add Button** (Floating Action Button)
   - Icon: Plus icon in a green circle
   - Action: Opens a modal for creating new content
   - Positioned in the center of the tab bar

4. **Map**
   - Icon: Map pin icon
   - Screen: `MapRoute`
   - Purpose: Interactive map view

5. **Chat**
   - Icon: Chat/message icon
   - Screen: `ChatScreen`
   - Purpose: Messaging interface

## Implementation Details

### Navigation Setup
- Uses `@react-navigation/bottom-tabs` for tab navigation
- Custom tab bar implementation for the floating action button
- Each tab has its own stack navigator

### Tab Icons
- Icons are managed through the `TabIcon` component
- Icons change appearance based on the active tab
- Uses custom SVG icons from the assets

### Floating Action Button
- Implemented as a custom tab bar button
- Positioned absolutely in the center of the tab bar
- Opens a modal for creating new content (posts, events, etc.)
- Uses a green accent color to stand out

### Screen Configuration
- Tab bar is hidden on certain screens (e.g., when viewing post details)
- Screen-specific tab bar styles can be configured
- Tab bar automatically hides when keyboard is shown

## State Management
- Tracks the active tab using React Navigation's state
- Modal visibility is managed using a ref (`modalRef`)
- Navigation state is preserved when switching between tabs

## Styling
- Tab bar has a clean, minimal design
- Active tab is highlighted
- Icons change color based on the active state
- Custom styling for the floating action button

## Accessibility
- Each tab has an accessibility label
- Tab bar is keyboard navigable
- Sufficient color contrast for readability

## Related Components
- `TabIcon`: Renders the icon for each tab
- `ModalRefProps`: Interface for the modal ref
- Various screen components for each tab

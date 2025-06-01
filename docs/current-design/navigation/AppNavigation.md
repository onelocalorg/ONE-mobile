# App Navigation

## Overview
**File Path:** `src/navigation/AppNavigation.tsx`

The `AppNavigation` component serves as the root navigator for the application, setting up the main navigation structure and handling deep linking.

## Navigation Structure

The app uses a combination of stack and tab navigation:

1. **Root Stack Navigator**
   - Handles authentication flow
   - Contains the main tab navigator
   - Manages modal screens

2. **Tab Navigator**
   - Home tab
   - Events tab
   - Map tab
   - Chat tab
   - Add button (floating action button style)

## Key Screens

### Authentication Flow
- `LoginScreen`: User login with email/password
- `SignUpScreen`: New user registration
- `VerifyScreen`: Email verification

### Main Tabs
1. **Home**
   - `HomeScreen`: Main feed with posts, groups, and people
   - `PostDetailScreen`: Detailed view of a single post
   - `CreatePostScreen`: Create a new post
   - `EditPostScreen`: Edit an existing post

2. **Events**
   - `EventListScreen`: List of events
   - `EventDetailScreen`: Detailed view of an event
   - `CreateEventScreen`: Create a new event
   - `EditEventScreen`: Edit an existing event
   - `EventAdministrationScreen`: Admin controls for events
   - `AddEditExpenseScreen`: Manage event expenses
   - `AddEditPayoutScreen`: Handle event payouts

3. **Map**
   - `MapScreen`: Interactive map view

4. **Chat**
   - `ChatScreen`: Messaging interface

### Profile & Groups
- `MyProfileScreen`: Current user's profile
- `UserProfileScreen`: Other users' profiles
- `CreateGroupScreen`: Create a new group
- `EditGroupScreen`: Edit group details
- `GroupDetailScreen`: Detailed view of a group

## Deep Linking

The app supports deep linking with the following URL patterns:
- `onelocal://` (custom scheme)
- `https://app.onelocal.one` (web URL)

### Supported Deep Links:
- `home`: Navigate to home screen
- `posts/create`: Create a new post
- `posts/edit`: Edit a post
- `posts/:id/:reply?`: View post details (with optional reply parameter)
- `groups/create`: Create a new group
- `groups/edit`: Edit group
- `events/:id/:reply`: View event details
- `users/me`: View current user's profile
- `map`: Open map view

## Navigation Patterns

### Modal Screens
Some screens are presented as modals using `presentation: 'modal'`:
- Post creation/editing
- Group creation/editing
- Event creation/editing
- User selection dialogs

### Stack Navigation
Each tab has its own stack navigator to handle screen hierarchies within that tab.

## Navigation State Management
- Uses React Navigation's built-in state management
- Navigation state is persisted across app restarts
- Deep linking state is merged with the current navigation state

## Theming
Navigation components are styled using the app's theme system, accessible via `useAppTheme` hook.

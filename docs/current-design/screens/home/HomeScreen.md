# Home Screen

## Overview
**File Path:** `src/screens/home/HomeScreen.tsx`

The Home Screen is the main feed where users can view and interact with content. It features a tabbed interface for switching between different content types: Posts, Groups, and People.

## UI Components

### Main Layout
- **Tab Bar**: Top navigation for switching between:
  - Posts (default view)
  - Groups
  - People
- **Content Area**: Displays the selected content type

### Posts View
- **Recent Users**: Horizontal scrollable list of users with profile pictures
- **Add Post**: Button to create a new post
- **Posts List**: Vertical scrollable list of posts from the user's network

### Groups View
- **Group List**: Displays groups the user is a member of or can join

### People View
- **People Grid**: Grid layout showing user profiles

## Data Flow

### Data Sources
- **User List**: Fetched from `useUserService`
  - Endpoint: `/api/users` (filtered by same chapter)
  - Parameters: 
    - `sort=join`
    - `limit=50`
    - `picsOnly=true`
    - `chapterId=same`
- **Posts**: Fetched within the `PostsList` component
- **Groups**: Fetched within the `GroupList` component

### State Management
- **Local State**:
  - `activeScreen`: Tracks the currently selected tab ('posts', 'groups', or 'people')

## User Interactions

### Tab Navigation
- Tapping on a tab updates the `activeScreen` state
- Content area re-renders to show the selected content type

### Post Creation
- Tapping the "Add Post" button opens the post creation screen
- Implemented via the `CreatePostScreen` component

### User Interaction
- Tapping on a user's profile picture likely navigates to their profile
- Posts support actions like like, comment, and share

## Related Components

### Child Components
- `PostsList`: Renders the list of posts
- `GroupList`: Displays groups
- `PeopleGrid`: Shows user profiles in a grid
- `RecentUsers`: Displays recent users with profile pictures
- `AddPostView`: Button to create a new post
- `HomeScreenTypeChooser`: Tab navigation component

## Styling
- Uses a custom `createStyleSheet` function that accepts a theme object
- Responsive design that adapts to different screen sizes

## Error Handling
- Loading states are handled with a conditional render
- Error states are likely managed by React Query's error handling

## Navigation
- From this screen, users can navigate to:
  - Individual post details
  - User profiles
  - Group details
  - Post creation screen

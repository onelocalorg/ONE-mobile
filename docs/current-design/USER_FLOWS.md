# User Flows and Journeys

## Overview
This document outlines the key user journeys and flows within the application. Understanding these flows is crucial for maintaining a consistent user experience during the redesign process.

## Table of Contents
1. [Authentication Flows](#authentication-flows)
2. [Core User Journeys](#core-user-journeys)
3. [Navigation Flows](#navigation-flows)
4. [Edge Cases and Error Handling](#edge-cases-and-error-handling)
5. [Disabled/Unused Features](#disabledunused-features)

## Authentication Flows

### 1. New User Registration
1. **Entry Point**: "Sign Up" button on Login screen
2. **Steps**:
   - User enters email, password, and other required information
   - System validates input and creates account
   - Verification email is sent
   - User verifies email address
   - Account is activated
3. **Success Path**: Redirect to onboarding/profile setup
4. **Error Cases**:
   - Email already exists
   - Weak password
   - Network errors
   - Email verification timeout

### 2. User Login
1. **Entry Points**:
   - App launch (auto-login if token exists)
   - Manual login screen
   - Deep links requiring authentication
2. **Authentication Methods**:
   - Email/Password
   - Google Sign-In
   - Apple Sign-In
3. **Success Path**:
   - Token is stored securely
   - User data is fetched
   - Redirect to Home screen
4. **Error Cases**:
   - Invalid credentials
   - Account not verified
   - Account locked/suspended
   - Network errors

### 3. Password Recovery
1. **Entry Point**: "Forgot Password?" link on Login screen
2. **Steps**:
   - User enters email
   - System sends password reset email
   - User follows link to reset password
   - New password is set
3. **Success Path**: Redirect to Login screen with success message
4. **Error Cases**:
   - Email not found
   - Expired/invalid reset token
   - Password doesn't meet requirements

## Core User Journeys

### 1. Browsing the Feed
1. **Entry Point**: Home tab
2. **Key Actions**:
   - Scroll through posts
   - Like/comment on posts
   - Share posts
   - View user profiles
3. **Navigation**:
   - Tap post → Post Details
   - Tap user avatar → User Profile
   - Tap comment icon → Post Details with comments focused

### 2. Creating a Post
1. **Entry Points**:
   - "+" button in tab bar
   - "Create Post" button in feed
2. **Flow**:
   - Select post type (text, image, video, poll)
   - Add content and media
   - Set privacy/audience
   - Post to feed
3. **Success Path**: Post appears in feed
4. **Error Cases**:
   - Post too long
   - Media upload fails
   - Network errors

### 3. Event Management
1. **Browsing Events**:
   - View upcoming events
   - Filter by category/date/location
   - RSVP to events

2. **Creating an Event**:
   - Fill event details (title, description, date/time, location)
   - Set capacity and ticket options
   - Publish event

3. **Event Interaction**:
   - RSVP/Check-in
   - View attendees
   - Share event
   - Post updates

### 4. Group Interactions
1. **Browsing Groups**:
   - Discover public groups
   - Search for specific interests
   - View group details

2. **Group Membership**:
   - Join/Leave group
   - Request to join (for private groups)
   - View member list

3. **Group Content**:
   - View group feed
   - Post to group
   - Participate in discussions

## Navigation Flows

### 1. Main Navigation
- **Bottom Tabs**:
  1. Home (Feed)
  2. Events
  3. (Add/Create)
  4. Map
  5. Profile

### 2. Deep Linking
- **Supported Links**:
  - `onelocal://posts/:id` - View specific post
  - `onelocal://events/:id` - View specific event
  - `onelocal://users/:id` - View user profile
  - `onelocal://groups/:id` - View group

### 3. Authentication Required Flows
- Accessing protected content without authentication redirects to login
- Post-login redirects back to originally requested content

## Edge Cases and Error Handling

### 1. Offline Mode
- Cached content remains available
- Queue actions for when online
- Clear indication of offline status

### 2. Session Expiry
- Automatic token refresh
- Graceful logout when refresh fails
- Clear error messages

### 3. Data Synchronization
- Conflict resolution for offline edits
- Last-write-wins strategy
- Manual sync options

## Disabled/Unused Features

The following features exist in the codebase but may be disabled or not fully implemented:

### 1. Subscription System
- Components in `components/subcription/` suggest a subscription/membership system
- May be in development or disabled

### 2. App Update Notifications
- `app-update/` directory contains update-related components
- May be used for forced updates or update notifications

### 3. Advanced Search
- Search components exist but may have limited functionality
- Some search filters may be disabled

### 4. Analytics Events
- Analytics tracking code is present but some events may not be implemented
- May be used for feature usage tracking

## User Flow Diagrams
*(Diagrams would be added here showing the visual flow between screens for each major journey)*

## Notes for Redesign
1. **Consistency**: Maintain existing navigation patterns
2. **Accessibility**: Ensure all interactive elements are accessible
3. **Performance**: Optimize for low-end devices and slow networks
4. **Error Recovery**: Provide clear paths to recover from errors
5. **Onboarding**: Consider adding/improving first-time user experience

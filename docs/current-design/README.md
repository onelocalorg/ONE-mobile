# ONE Mobile App - Current Design Documentation

## Overview
This directory contains comprehensive documentation of the current implementation of the ONE Mobile application. This documentation serves as the "source of truth" for the app's existing functionality, structure, and components to guide the upcoming redesign process.

## Directory Structure

- `screens/`: Documentation for each screen in the application
  - `home/`: Home screen and related components
  - `login/`: Authentication flows
  - `profile/`: User profile management
  - `events/`: Event management screens
  - `groups/`: Group management screens
  - `map/`: Map functionality
  - `chat/`: Messaging interface

- `components/`: Reusable UI components
  - `common/`: Shared components used across the app
  - `forms/`: Form elements and validation
  - `navigation/`: Navigation-related components
  - `lists/`: List and grid components

- `navigation/`: App navigation structure
  - `AppNavigation.md`: Main navigation flow
  - `TabNavigation.md`: Bottom tab navigation
  - `StackNavigators.md`: Screen stack navigators

- `state/`: State management
  - `redux/`: Redux store configuration
  - `context/`: React Context providers
  - `hooks/`: Custom hooks

- `api/`: API integration
  - `endpoints.md`: List of all API endpoints
  - `services/`: API service implementations
  - `types/`: TypeScript types for API responses

## App Overview

The ONE Mobile app is a social networking application focused on local communities, events, and group interactions. The app features:

- User authentication (login/signup)
- News feed with posts and updates
- Event creation and management
- Group creation and participation
- User profiles and connections
- Location-based features
- Real-time chat functionality

## Technology Stack

- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Redux, React Query
- **Styling**: Custom styles with theming support
- **Networking**: Axios for API calls
- **Authentication**: Token-based authentication

## Getting Started

To understand the app's structure, start with:

1. `navigation/AppNavigation.md` - Main navigation flow
2. `screens/home/HomeScreen.md` - Primary user interface
3. `components/README.md` - Reusable UI components

## Conventions

- Component files are named using PascalCase
- Screen components are suffixed with 'Screen' (e.g., `HomeScreen.tsx`)
- Custom hooks are prefixed with 'use' (e.g., `useAppTheme`)
- Styles are co-located with components when possible

## Notes for Redesign

When implementing the redesign, please ensure that all existing functionality is maintained unless explicitly marked for removal or modification. Pay special attention to:

- Navigation flows and deep linking
- Form validations and error handling
- API integration points
- State management patterns
- Accessibility features
- Offline capabilities

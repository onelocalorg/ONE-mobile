# Login Screen

## Overview
**File Path:** `src/screens/login/LoginScreen.tsx`

The Login Screen is the entry point for user authentication, offering multiple sign-in methods including email/password, Apple Sign-In, and Google Sign-In.

## UI Components

### Main Layout
- **Header**: Displays app branding
- **Form Area**: Contains login form fields and action buttons
- **Social Login Buttons**: Options for Apple and Google sign-in
- **Forgot Password Link**: Navigates to password recovery
- **Sign Up Link**: Navigates to the registration screen

### Form Fields
1. **Email Input**
   - Label: "Email"
   - Validation: Required, valid email format
   - Keyboard type: Email address

2. **Password Input**
   - Label: "Password"
   - Secure text entry: Yes
   - Validation: Required
   - Show/hide password toggle

### Action Buttons
- **Login Button**: Submits the login form
- **Apple Sign-In**: Uses native Apple authentication
- **Google Sign-In**: Uses Google authentication

## Authentication Methods

### 1. Email/Password Login
- Traditional email and password authentication
- Form validation for required fields and email format
- Error handling for invalid credentials

### 2. Apple Sign-In
- Uses `@invertase/react-native-apple-authentication`
- Handles Apple's authentication flow
- Requests full name and email scopes

### 3. Google Sign-In
- Uses `@react-native-google-signin/google-signin`
- Configures Google Sign-In with client ID
- Handles authentication flow and token exchange

## State Management

### Local State
- `isForgotPasswordVisible`: Controls visibility of forgot password modal
- Form state managed by `react-hook-form`
- Loading states for each authentication method

### API Integration
- Uses React Query for API calls
- Mutations for each authentication method:
  - `logIn`: Email/password login
  - `appleLogin`: Apple Sign-In
  - `googleLogin`: Google Sign-In

## User Flows

### Successful Login
1. User enters valid credentials
2. API validates credentials
3. On success:
   - User data is stored in the app state
   - Auth context is updated
   - User is redirected to the main app

### Failed Login
1. User enters invalid credentials
2. API returns error
3. Error message is displayed to the user
4. Form remains with entered values

### Forgot Password
1. User taps "Forgot Password?"
2. Modal opens with email input
3. User enters email and submits
4. Password reset email is sent
5. User is shown confirmation message

## Navigation
- **On Successful Login**: Navigates to main app screen
- **Sign Up**: Navigates to `SignUpScreen`
- **Forgot Password**: Opens forgot password modal

## Error Handling
- Form validation errors
- API error responses
- Network errors
- Platform-specific authentication errors

## Security Considerations
- Secure text entry for password field
- Token-based authentication
- Secure storage of authentication tokens
- Error messages don't reveal sensitive information

## Dependencies
- `@invertase/react-native-apple-authentication`: Apple Sign-In
- `@react-native-google-signin/google-signin`: Google Sign-In
- `react-hook-form`: Form handling and validation
- `@tanstack/react-query`: API data fetching and caching

## Styling
- Uses theme-based styling
- Responsive layout for different screen sizes
- Platform-specific styling for iOS and Android

# API Integration

## Overview
This document outlines the API integration patterns and services used in the application. The app uses a service-based architecture to interact with the backend API.

## Base API Service

The application uses a base `ApiService` (defined in `ApiService.tsx`) that provides common HTTP methods:
- `doGet`: For GET requests
- `doPost`: For POST requests
- `doPut`: For PUT requests
- `doDelete`: For DELETE requests

## Authentication Service

**File Path:** `src/network/api/services/useAuthService.tsx`

The authentication service handles all authentication-related API calls.

### Available Mutations

#### 1. Login
- **Endpoint:** `POST /v3/auth/login`
- **Purpose:** Authenticate user with email and password
- **Request Body:**
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response:** `CurrentUser` object

#### 2. Google Login
- **Endpoint:** `POST /v3/auth/google-login`
- **Purpose:** Authenticate user using Google OAuth
- **Request Body:** Google user object from `@react-native-google-signin/google-signin`
- **Response:** `CurrentUser` object

#### 3. Apple Login
- **Endpoint:** `POST /v3/auth/apple-login`
- **Purpose:** Authenticate user using Apple Sign In
- **Request Body:** Apple authentication response
- **Response:** `CurrentUser` object

#### 4. Sign Up
- **Endpoint:** `POST /v3/auth/signup`
- **Purpose:** Register a new user
- **Request Body:** `NewUser` object
- **Response:** `UserProfile` object

#### 5. Verify Email
- **Endpoint:** `POST /v3/auth/verify-email`
- **Purpose:** Verify user's email address
- **Request Body:**
  ```typescript
  {
    email: string;
    token: string;
  }
  ```

#### 6. Forgot Password
- **Endpoint:** `POST /v3/auth/forgot-password`
- **Purpose:** Initiate password reset process
- **Request Body:** `{ email: string }`

#### 7. Verify OTP
- **Endpoint:** `POST /v3/auth/verify-otp`
- **Purpose:** Verify OTP for password reset
- **Request Body:**
  ```typescript
  {
    otp: string;
    otpKey: string;
  }
  ```

#### 8. Reset Password
- **Endpoint:** `POST /v3/auth/reset-password`
- **Purpose:** Set new password after OTP verification
- **Request Body:**
  ```typescript
  {
    password: string;
    otp: string;
    otpKey: string;
  }
  ```

## User Service

**File Path:** `src/network/api/services/useUserService.tsx`

The user service handles user-related API calls.

### Available Queries

#### 1. Get Current User
- **Endpoint:** `GET /v3/users/me`
- **Purpose:** Get current authenticated user's profile
- **Response:** `CurrentUser` object

#### 2. List Users
- **Endpoint:** `GET /v3/users`
- **Query Parameters:**
  - `sort`: Sort order (e.g., 'join')
  - `limit`: Number of users to return
  - `picsOnly`: Boolean to filter users with profile pictures
  - `chapterId`: Filter by chapter ID
- **Response:** Array of `UserProfile` objects

### Available Mutations

#### 1. Update Profile
- **Endpoint:** `PUT /v3/users/me`
- **Purpose:** Update current user's profile
- **Request Body:** Partial `UserProfile`
- **Response:** Updated `UserProfile`

## Error Handling
- API errors are handled by the base `ApiService`
- Authentication errors trigger a logout and redirect to login screen
- Network errors are displayed to the user with appropriate messages

## Authentication Flow
1. User provides credentials (email/password or social login)
2. On successful authentication, server returns JWT token
3. Token is stored securely on the device
4. Token is included in the Authorization header for subsequent requests
5. On 401 Unauthorized, user is logged out and redirected to login

## TypeScript Types
All API request and response types are defined in the `src/types` directory, including:
- `CurrentUser`: Currently authenticated user
- `UserProfile`: User profile information
- `NewUser`: Data required for user registration
- `ForgotPassword`: Password reset request data

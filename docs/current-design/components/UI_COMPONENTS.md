# UI Component Library

## Overview
This document outlines the reusable UI components built using a combination of custom components and the GlueStack UI library. The components follow a consistent design system and are used throughout the application.

## Component Categories

### 1. Layout Components

#### Box
- **Purpose**: Base layout component for creating containers
- **Props**:
  - `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`: Padding
  - `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`: Margin
  - `bg`: Background color
  - `rounded`: Border radius
  - `shadow`: Box shadow
  - `flex`: Flex properties
  - `w`, `h`: Width and height

#### VStack
- **Purpose**: Vertical stack layout
- **Props**:
  - `space`: Vertical spacing between items
  - `alignItems`: Horizontal alignment
  - `justifyContent`: Vertical alignment
  - `flex`: Flex properties

#### HStack
- **Purpose**: Horizontal stack layout
- **Props**:
  - `space`: Horizontal spacing between items
  - `alignItems`: Vertical alignment
  - `justifyContent`: Horizontal alignment
  - `flex`: Flex properties

#### Center
- **Purpose**: Centers its children both horizontally and vertically
- **Props**:
  - `w`, `h`: Width and height
  - `bg`: Background color
  - `flex`: Flex properties

### 2. Typography

#### Text
- **Purpose**: Text display component
- **Props**:
  - `fontSize`: Text size (xs, sm, md, lg, xl, 2xl, etc.)
  - `fontWeight`: Font weight (normal, medium, semibold, bold)
  - `color`: Text color
  - `textAlign`: Text alignment
  - `numberOfLines`: Maximum number of lines

#### Heading
- **Purpose**: Section headings
- **Props**:
  - `size`: Heading level (h1-h6)
  - `color`: Text color
  - `textAlign`: Text alignment

### 3. Interactive Components

#### Button
- **Purpose**: Interactive button element
- **Variants**:
  - `solid`: Filled button
  - `outline`: Outlined button
  - `link`: Text button
  - `ghost`: Transparent button
- **Props**:
  - `size`: Button size (sm, md, lg)
  - `isDisabled`: Disabled state
  - `leftIcon`, `rightIcon`: Icon components
  - `onPress`: Click handler

#### Icon
- **Purpose**: Displays icons from various icon sets
- **Props**:
  - `as`: Icon component (e.g., from react-native-vector-icons)
  - `name`: Icon name
  - `size`: Icon size
  - `color`: Icon color

### 4. Feedback Components

#### Spinner
- **Purpose**: Loading indicator
- **Props**:
  - `size`: Spinner size (sm, md, lg)
  - `color`: Spinner color

#### Alert Dialog
- **Purpose**: Modal dialog for important messages
- **Props**:
  - `isOpen`: Controls visibility
  - `onClose`: Close handler
  - `title`: Dialog title
  - `description`: Dialog content
  - `actionButtons`: Array of action buttons

### 5. Navigation Components

#### Drawer
- **Purpose**: Side navigation drawer
- **Props**:
  - `isOpen`: Controls visibility
  - `onClose`: Close handler
  - `placement`: Drawer position (left, right, top, bottom)
  - `children`: Drawer content

### 6. Overlay Components

#### Modal
- **Purpose**: Modal dialog
- **Props**:
  - `isOpen`: Controls visibility
  - `onClose`: Close handler
  - `size`: Modal size (sm, md, lg, full)
  - `closeOnOverlayClick`: Close when clicking outside
  - `isCentered`: Center the modal

### 7. Data Display

#### Card
- **Purpose**: Container for grouped content
- **Props**:
  - `variant`: Card style (elevated, outline, filled, unstyled)
  - `size`: Card size (sm, md, lg)
  - `direction`: Layout direction (row, column)

### 8. Form Components

#### Input
- **Purpose**: Text input field
- **Props**:
  - `size`: Input size (sm, md, lg)
  - `variant`: Input style (outline, filled, underlined, rounded)
  - `isDisabled`: Disabled state
  - `isInvalid`: Error state
  - `leftElement`, `rightElement`: Additional elements

### 9. Utility Components

#### SafeAreaView
- **Purpose**: Wraps content to respect safe area insets
- **Props**:
  - `edges`: Which edges to apply safe area insets to (top, right, bottom, left)
  - `bg`: Background color

## Theming

The UI components support theming through the `gluestack-ui-provider`. The theme includes:

- **Colors**: Primary, secondary, success, warning, error, and neutral colors
- **Spacing**: Consistent spacing scale
- **Typography**: Font families, sizes, and weights
- **Radii**: Border radius values
- **Shadows**: Elevation shadows

## Responsive Design

Components are responsive and adapt to different screen sizes using:
- Breakpoint-based props (e.g., `base`, `sm`, `md`, `lg`, `xl`)
- Responsive arrays for prop values
- Platform-specific styles (web, iOS, Android)

## Accessibility

Components include built-in accessibility features:
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Focus management

## Usage Guidelines

1. **Consistency**: Use the provided components instead of custom styles
2. **Composition**: Compose smaller components to build complex UIs
3. **Theming**: Use theme tokens for colors, spacing, and typography
4. **Responsiveness**: Design for all screen sizes using responsive props
5. **Accessibility**: Ensure all interactive elements are accessible

## Disabled/Deprecated Components

The following components are present in the codebase but may not be actively used:
- `subcription/`: Contains subscription-related components that might be disabled
- `app-update/`: App update components that might be conditionally rendered
- Some components in the `ui/` directory might have web-specific implementations that aren't used in the mobile app

## Component Implementation Notes

- Components use a combination of styled-components and the GlueStack styling system
- Web and native implementations are separated using `.web.tsx` and `.native.tsx` extensions
- Theme tokens are defined in the GlueStack UI provider config

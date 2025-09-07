# Dynamic Color System for Virtual App Launcher

## Overview

The RedBox virtual app launcher now features a dynamic color system that automatically adapts the splash screen background to match the colors of the app being launched. This creates a more cohesive and visually appealing user experience.

## How It Works

### 1. Color Extraction
- When a virtual app is launched, the system extracts the **dominant** and **vibrant** colors from the app's icon
- Uses Android's **Palette API** for intelligent color analysis
- Analyzes the icon bitmap to find the most representative colors

### 2. Theme Adaptation
The system automatically adapts to the current system theme:

#### Light Theme
- Extracts **light muted** colors for backgrounds
- Ensures colors are bright enough (85% brightness minimum)
- Uses **vibrant** colors for accent elements

#### Dark Theme  
- Extracts **dark muted** colors for backgrounds
- Ensures colors are dark enough (30% brightness maximum)
- Uses **light vibrant** colors for accent elements

### 3. Dynamic Gradient Generation
- Creates complementary gradient backgrounds based on the extracted colors
- Applies **hue shifting** (±15-20 degrees) for natural color transitions
- Maintains **accessibility** with proper contrast ratios

### 4. UI Element Theming
- **Background**: Dynamic gradient based on app icon colors
- **Progress Indicator**: Uses vibrant color from the icon
- **Icon Container**: Subtle tint blend with extracted colors
- **System UI**: Adapts status bar and navigation bar colors

## Technical Implementation

### Key Classes
- `LauncherActivity.java` - Main splash screen with dynamic theming
- `DynamicColorUtils.java` - Utility class for color extraction and generation

### Color Extraction Process
```java
DynamicColorUtils.extractColorsFromDrawable(iconDrawable, isDarkTheme, callback);
```

### Gradient Generation
```java
GradientDrawable gradient = DynamicColorUtils.createDynamicGradient(dominantColor, isDarkTheme);
```

## Benefits

1. **Visual Cohesion**: Each app launch feels integrated with the app's branding
2. **Automatic Adaptation**: No manual configuration required
3. **Theme Awareness**: Respects system light/dark mode preferences
4. **Performance Optimized**: Efficient color extraction with bitmap caching
5. **Accessibility**: Maintains proper contrast ratios for readability

## Examples

### Instagram (Pink/Purple Theme)
- **Light Mode**: Soft pink-to-purple gradient background
- **Dark Mode**: Deep purple-to-magenta gradient background
- **Accent**: Vibrant pink progress indicator

### WhatsApp (Green Theme)
- **Light Mode**: Light green-to-mint gradient background  
- **Dark Mode**: Dark green-to-teal gradient background
- **Accent**: Vibrant green progress indicator

### YouTube (Red Theme)
- **Light Mode**: Light red-to-orange gradient background
- **Dark Mode**: Dark red-to-burgundy gradient background
- **Accent**: Vibrant red progress indicator

## Fallback Behavior

If color extraction fails (corrupted icon, etc.), the system falls back to:
- **Light Theme**: Default blue-to-pink gradient (`#F0F4FF` to `#FFF0F4`)
- **Dark Theme**: Default purple gradient (`#1A1625` to `#251A20`)

## Configuration

The system works automatically without configuration. Color extraction parameters can be adjusted in `DynamicColorUtils.java`:

- **Brightness thresholds**: Control minimum/maximum brightness levels
- **Saturation adjustments**: Fine-tune color intensity
- **Hue shifting**: Modify gradient color relationships
- **Blend ratios**: Adjust subtle tinting effects

## Performance Considerations

- Icon bitmaps are **limited to 128x128px** for analysis
- Color extraction runs **asynchronously** to avoid UI blocking
- **Palette generation** is cached during the splash screen lifecycle
- **Memory efficient** with automatic bitmap recycling
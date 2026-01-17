## Brief overview
Guidelines for setting up Expo Router projects correctly based on official Expo documentation. These rules prevent common blank screen issues and configuration errors.

## Creating new Expo projects
- Always use the official command: `npx create-expo-app@latest`
- For projects with tab navigation, use: `npx create-expo-app@latest --template tabs`
- Never manually scaffold an Expo Router project from scratch - always start with the official template
- After creation, run `npx expo start` to verify it works before making customizations

## Required dependencies for Expo Router
- Install using `npx expo install` (not `npm install`) to ensure version compatibility:
  ```bash
  npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
  ```
- For web development, also install: `npx expo install react-native-web react-dom`

## Configuration files
- **package.json**: Must have `"main": "expo-router/entry"`
- **babel.config.js**: Should only have `presets: ['babel-preset-expo']` - do NOT add `expo-router/babel` plugin (deprecated in SDK 54+)
- **app.json**: Must include `"scheme": "your-app-scheme"` and for web: `"web": { "bundler": "metro" }`

## Troubleshooting blank screens
- Always clear cache after config changes: `npx expo start --clear`
- Delete `.expo/` folder if issues persist
- Remove any `metro`, `metro-resolver`, `react-refresh` resolutions from package.json
- Verify node_modules are fresh: delete and run `npm install`

## File structure requirements
- `app/_layout.tsx` must exist as the root layout
- Tab navigation goes in `app/(tabs)/_layout.tsx`
- Index screen for tabs is `app/(tabs)/index.tsx`

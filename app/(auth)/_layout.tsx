import { Stack } from 'expo-router';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Create Account',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

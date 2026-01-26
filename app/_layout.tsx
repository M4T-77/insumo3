
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="games/dice" options={{ headerShown: false }} />
      <Stack.Screen name="games/burger" options={{ headerShown: false }} />
    </Stack>
  );
}

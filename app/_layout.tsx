import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '@firebase/firestore: Firestore',
  'Could not reach Cloud Firestore backend'
]);

function RootLayoutInner() {
  const { colors } = useTheme();

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.success, backgroundColor: colors.surface }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: colors.textMain,
        }}
        text2Style={{
          fontSize: 14,
          color: colors.textMuted,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: colors.danger, backgroundColor: colors.surface }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: colors.textMain,
        }}
        text2Style={{
          fontSize: 14,
          color: colors.textMuted,
        }}
      />
    ),
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ presentation: "transparentModal" }} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>

      <Toast config={toastConfig} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NetworkProvider>
        <ThemeProvider>
          <RootLayoutInner />
        </ThemeProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}
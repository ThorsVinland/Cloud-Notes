import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";
import Colors from "@/assets/Colors";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.grayDark, backgroundColor: Colors.grayLight }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.black,
      }}
      text2Style={{
        fontSize: 14,
        color: Colors.black,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", backgroundColor: "#222" }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
      }}
      text2Style={{
        fontSize: 14,
        color: "#ccc",
      }}
    />
  ),
};

export default function RootLayout() {
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
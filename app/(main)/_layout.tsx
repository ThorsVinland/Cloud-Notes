import { Stack } from "expo-router";

export default function MainLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="AboutUs" />
            <Stack.Screen name="Notifications" />
            <Stack.Screen name="HelpCenter" />
            <Stack.Screen name="AccountSecurity" />
            <Stack.Screen name="(note)/Note" />
            <Stack.Screen name="(note)/NoteDetail" />
        </Stack>
    );
}
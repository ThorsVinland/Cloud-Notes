import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from '../FirebaseConfig';

export default function Index() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current User:", currentUser);
      setLoading(false);

      if (currentUser) {
        console.log('User Adnane');
        router.replace('/(main)/(tabs)/Home');
      } else {
        console.log('User not Adnane');
        router.replace('/(auth)/SignIn');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <StatusBar
          hidden
        />
        <View style={styles.container}>
          <ActivityIndicator
            size={50}
            color={colors.white}
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </>
    );
  }

  return null;
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: colors.background, // Fixed to use new colors
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textMain // Fixed to use new colors
  },
});
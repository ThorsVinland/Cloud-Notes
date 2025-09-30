import Colors from "@/assets/Colors";
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
        router.replace('/(main)/Home');
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
            color={Colors.white}
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
      </>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: Colors.black,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white
  },
});
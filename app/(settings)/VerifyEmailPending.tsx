import Colors from "@/assets/Colors";
import { auth, database } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import { ref, update } from "firebase/database";
import React, { useState, useEffect } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function VerifyEmailPending() {
    const router = useRouter();
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleResendVerification = async () => {
        if (auth.currentUser && cooldown === 0) {
            try {
                setResending(true);
                await sendEmailVerification(auth.currentUser);
                Toast.show({
                    type: "success",
                    text1: "Verification email resent",
                    text2: "Please check your inbox and spam folder.",
                });
                setCooldown(30);
            } catch (error: any) {
                console.log("❌ Error while resending verification:", error);
                Toast.show({
                    type: "error",
                    text1: "Failed to resend email",
                    text2: error.message,
                });
            } finally {
                setResending(false);
            }
        } else {
            console.log("⚠️ No current user or cooldown active");
        }
    };

    useEffect(() => {
        console.log("🔍 VerifyEmailPending mounted");
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                console.log("🚨 User signed out or token expired");
                router.replace("/(auth)/SignIn");
            } else {
                console.log(
                    "👤 User logged in:",
                    user.email,
                    "Initial emailVerified:",
                    user.emailVerified
                );
                // لا نتحقق من emailVerified هنا، نترك التحقق للـ polling
            }
        });

        return () => {
            console.log("🧹 Cleaning up onAuthStateChanged");
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        console.log("🔄 Starting polling for email verification");
        // تأخير أولي لضمان تحميل بيانات المستخدم
        const initialDelay = setTimeout(() => {
            if (auth.currentUser) {
                auth.currentUser.reload().then(() => {
                    console.log(
                        "🔍 Initial check after delay: emailVerified =",
                        auth.currentUser?.emailVerified
                    );
                    if (auth.currentUser?.emailVerified) {
                        console.log("✅ Email verified on initial check, redirecting to Profile...");
                        router.replace("/Profile");
                    }
                }).catch((err) => {
                    console.log("⚠️ Error during initial reload:", err);
                });
            } else {
                console.log("⚠️ No current user after initial delay");
                router.replace("/(auth)/SignIn");
            }
        }, 2000); // تأخير 2 ثانية

        const interval = setInterval(async () => {
            if (auth.currentUser) {
                try {
                    await auth.currentUser.reload();
                    console.log(
                        "🔄 Polling: Reloaded user, emailVerified =",
                        auth.currentUser.emailVerified
                    );

                    if (auth.currentUser.emailVerified) {
                        console.log("✅ Email verified during polling, updating DB...");
                        const userRef = ref(database, `users/${auth.currentUser.uid}`);
                        await update(userRef, { email: auth.currentUser.email });
                        clearInterval(interval);
                        router.replace("/Profile");
                    } else {
                        console.log("⏳ Email not verified yet, staying on VerifyEmailPending");
                    }
                } catch (err) {
                    console.log("⚠️ Error during polling:", err);
                    Toast.show({
                        type: "error",
                        text1: "Error checking verification status",
                        text2: "Please try again later.",
                    });
                }
            } else {
                console.log("⚠️ No current user during polling");
                clearInterval(interval);
                router.replace("/(auth)/SignIn");
            }
        }, 5000); // فاصل زمني 5 ثوانٍ

        return () => {
            console.log("🧹 Cleaning up polling interval and initial delay");
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        let timer: any;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.text}>
                A verification link has been sent to your email. Please check your inbox
                and spam folder to confirm before continuing.
            </Text>
            <Pressable
                style={styles.btn}
                onPress={handleResendVerification}
                disabled={cooldown > 0 || resending}
            >
                {resending ? (
                    <ActivityIndicator size={40} color={Colors.dark.white} />
                ) : (
                    <Text style={styles.btnText}>Resend verification email</Text>
                )}
            </Pressable>
            <View style={styles.timerView}>
                {cooldown > 0 && <Text style={styles.timerText}>{cooldown}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.primary,
        padding: 20,
    },
    title: {
        color: Colors.dark.white,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        color: Colors.dark.gray,
        textAlign: "center",
        marginBottom: 30,
    },
    btn: {
        backgroundColor: Colors.dark.grayDark,
        height: 50,
        width: 300,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    btnText: {
        color: Colors.dark.white,
        fontSize: 18,
        fontWeight: "bold",
    },
    timerView: {
        alignSelf: "center",
        marginTop: 10,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    timerText: {
        fontSize: 20,
        fontWeight: "800",
        color: Colors.dark.white,
    },
});
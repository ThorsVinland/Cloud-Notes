import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/contexts/NetworkContext';
import { auth } from '@/FirebaseConfig';

export default function AccountSecurity() {
    const { colors, isDark } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);

    const handleUpdateEmail = async () => {
        if (isOffline) {
            Toast.show({ type: 'error', text1: 'You are offline', text2: 'Please connect to the internet to update your email.' });
            return;
        }

        if (!password || !newEmail) {
            Toast.show({ type: 'error', text1: 'Please fill in all fields' });
            return;
        }

        try {
            setLoading(true);
            if (auth.currentUser && auth.currentUser.email) {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    password
                );
                await reauthenticateWithCredential(auth.currentUser, credential);
                
                await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
                
                Toast.show({
                    type: 'success',
                    text1: 'Verification sent!',
                    text2: 'Please check your new email to verify.',
                });
                router.back();
            }
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential') {
                Toast.show({ type: 'error', text1: 'Incorrect password' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to update email' });
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const styles = getStyles(colors);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
                
                <View style={styles.headerContainer}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name='arrow-back' size={24} color={colors.textMain} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Account Security</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Update Email</Text>
                        <Text style={styles.subtitle}>Enter your current password and a new email address.</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Current Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder='••••••••'
                                    placeholderTextColor={colors.textMuted}
                                    cursorColor={colors.accent}
                                    autoCapitalize='none'
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!passwordShow}
                                />
                                <Pressable
                                    onPress={() => setPasswordShow(!passwordShow)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={passwordShow ? 'eye-outline' : 'eye-off-outline'}
                                        size={22}
                                        color={colors.textMuted}
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Email Address</Text>
                            <TextInput
                                placeholder='name@example.com'
                                placeholderTextColor={colors.textMuted}
                                cursorColor={colors.accent}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                style={styles.input}
                                value={newEmail}
                                onChangeText={setNewEmail}
                            />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryButton,
                                (pressed || isOffline) && styles.primaryButtonPressed,
                                { marginTop: 10, opacity: isOffline ? 0.6 : 1 }
                            ]}
                            onPress={handleUpdateEmail}
                            disabled={loading || isOffline}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Update Email</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
        lineHeight: 22,
    },
    formContainer: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textMain,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.textMain,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: colors.textMain,
    },
    eyeIcon: {
        padding: 16,
    },
    primaryButton: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonPressed: {
        backgroundColor: colors.accentHover,
        transform: [{ scale: 0.98 }],
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

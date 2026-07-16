import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, updatePassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
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
    Platform,
    ScrollView
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/contexts/NetworkContext';
import { auth } from '@/FirebaseConfig';

export default function AccountSecurity() {
    const { colors, isDark } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
    
    // Form fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    // UI state
    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const [newPasswordShow, setNewPasswordShow] = useState(false);
    const [waitingForVerification, setWaitingForVerification] = useState(false);
    const [persistentMessage, setPersistentMessage] = useState<string | null>(null);

    const handleUpdateEmail = async () => {
        if (isOffline) {
            Toast.show({ type: 'error', text1: 'You are offline', text2: 'Please connect to the internet.' });
            return;
        }

        if (!currentPassword || !newEmail) {
            Toast.show({ type: 'error', text1: 'Please fill in all fields' });
            return;
        }

        try {
            setLoading(true);
            setPersistentMessage(null);
            if (auth.currentUser && auth.currentUser.email) {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    currentPassword
                );
                await reauthenticateWithCredential(auth.currentUser, credential);
                
                await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
                
                setPersistentMessage("We have sent a verification link to your NEW email address. Please check your inbox and your spam folder to confirm the change.");
                setWaitingForVerification(true);
                
                const checkInterval = setInterval(async () => {
                    if (auth.currentUser) {
                        try {
                            await auth.currentUser.reload();
                            if (auth.currentUser.email === newEmail) {
                                clearInterval(checkInterval);
                                setWaitingForVerification(false);
                                setLoading(false);
                                setPersistentMessage(null);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Email updated successfully!',
                                });
                                router.back();
                            }
                        } catch (err: any) {
                            if (err.code === 'auth/user-token-expired' || err.code === 'auth/invalid-user-token') {
                                clearInterval(checkInterval);
                                setWaitingForVerification(false);
                                setLoading(false);
                                setPersistentMessage(null);
                                Toast.show({
                                    type: 'success',
                                    text1: 'Email verified!',
                                    text2: 'Please sign in again with your new email.'
                                });
                                await signOut(auth);
                                router.replace('/SignIn');
                            } else {
                                console.log('Reload error:', err);
                            }
                        }
                    }
                }, 3000);
            }
        } catch (error: any) {
            setLoading(false);
            if (error.code === 'auth/invalid-credential') {
                Toast.show({ type: 'error', text1: 'Incorrect password' });
            } else if (error.code === 'auth/email-already-in-use') {
                Toast.show({ type: 'error', text1: 'Email already in use', text2: 'This email is already linked to another account.' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to update email' });
                console.error(error);
            }
        }
    };

    const handleUpdatePassword = async () => {
        if (isOffline) {
            Toast.show({ type: 'error', text1: 'You are offline' });
            return;
        }

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Toast.show({ type: 'error', text1: 'Please fill in all fields' });
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Toast.show({ type: 'error', text1: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
            return;
        }

        try {
            setLoading(true);
            setPersistentMessage(null);
            if (auth.currentUser && auth.currentUser.email) {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    currentPassword
                );
                await reauthenticateWithCredential(auth.currentUser, credential);
                
                await updatePassword(auth.currentUser, newPassword);
                
                Toast.show({ type: 'success', text1: 'Password updated successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            }
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential') {
                Toast.show({ type: 'error', text1: 'Incorrect current password' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to update password' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (isOffline) return;
        if (auth.currentUser && auth.currentUser.email) {
            try {
                setLoading(true);
                await sendPasswordResetEmail(auth, auth.currentUser.email);
                setPersistentMessage("A password reset link has been sent to your CURRENT email address. Please check your inbox and your spam folder to confirm.");
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Failed to send reset link' });
            } finally {
                setLoading(false);
            }
        }
    };

    const styles = getStyles(colors);

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            
            <View style={styles.headerContainer}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name='arrow-back' size={24} color={colors.textMain} />
                </Pressable>
                <Text style={styles.headerTitle}>Account Security</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabsContainer}>
                <Pressable 
                    style={[styles.tab, activeTab === 'email' && styles.activeTab]} 
                    onPress={() => { setActiveTab('email'); setPersistentMessage(null); }}
                >
                    <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>Change Email</Text>
                </Pressable>
                <Pressable 
                    style={[styles.tab, activeTab === 'password' && styles.activeTab]} 
                    onPress={() => { setActiveTab('password'); setPersistentMessage(null); }}
                >
                    <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>Change Password</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.formContainer}>
                        
                        {activeTab === 'email' ? (
                            <>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>Update Email</Text>
                                    <Text style={styles.subtitle}>Enter your current password and a new email address.</Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Current Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            placeholder='••••••••'
                                            placeholderTextColor={colors.textMuted}
                                            cursorColor={colors.accent}
                                            autoCapitalize='none'
                                            style={styles.passwordInput}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry={!passwordShow}
                                        />
                                        <Pressable onPress={() => setPasswordShow(!passwordShow)} style={styles.eyeIcon}>
                                            <Ionicons name={passwordShow ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.textMuted} />
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
                                    style={({ pressed }) => [styles.primaryButton, (pressed || isOffline) && styles.primaryButtonPressed, { marginTop: 10, opacity: isOffline ? 0.6 : 1 }]}
                                    onPress={handleUpdateEmail}
                                    disabled={loading || isOffline}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : waitingForVerification ? (
                                        <Text style={styles.primaryButtonText}>Waiting for verification...</Text>
                                    ) : (
                                        <Text style={styles.primaryButtonText}>Send Verification Link</Text>
                                    )}
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>Update Password</Text>
                                    <Text style={styles.subtitle}>Enter your current password and choose a new one.</Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Current Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            placeholder='••••••••'
                                            placeholderTextColor={colors.textMuted}
                                            cursorColor={colors.accent}
                                            autoCapitalize='none'
                                            style={styles.passwordInput}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry={!passwordShow}
                                        />
                                        <Pressable onPress={() => setPasswordShow(!passwordShow)} style={styles.eyeIcon}>
                                            <Ionicons name={passwordShow ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.textMuted} />
                                        </Pressable>
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>New Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            placeholder='••••••••'
                                            placeholderTextColor={colors.textMuted}
                                            cursorColor={colors.accent}
                                            autoCapitalize='none'
                                            style={styles.passwordInput}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry={!newPasswordShow}
                                        />
                                        <Pressable onPress={() => setNewPasswordShow(!newPasswordShow)} style={styles.eyeIcon}>
                                            <Ionicons name={newPasswordShow ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.textMuted} />
                                        </Pressable>
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Confirm New Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            placeholder='••••••••'
                                            placeholderTextColor={colors.textMuted}
                                            cursorColor={colors.accent}
                                            autoCapitalize='none'
                                            style={styles.passwordInput}
                                            value={confirmNewPassword}
                                            onChangeText={setConfirmNewPassword}
                                            secureTextEntry={!newPasswordShow}
                                        />
                                    </View>
                                </View>

                                <View style={styles.forgotPasswordContainer}>
                                    <Pressable onPress={handleForgotPassword} disabled={loading || isOffline}>
                                        <Text style={styles.forgotPasswordText}>Forgot Password? Send Reset Link</Text>
                                    </Pressable>
                                </View>

                                <Pressable
                                    style={({ pressed }) => [styles.primaryButton, (pressed || isOffline) && styles.primaryButtonPressed, { marginTop: 10, opacity: isOffline ? 0.6 : 1 }]}
                                    onPress={handleUpdatePassword}
                                    disabled={loading || isOffline}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.primaryButtonText}>Update Password</Text>
                                    )}
                                </Pressable>
                            </>
                        )}

                        {/* Persistent Wait Message */}
                        {persistentMessage && (
                            <View style={styles.persistentMessageCard}>
                                <Ionicons name="mail-unread-outline" size={32} color={colors.accent} style={{ marginBottom: 10 }} />
                                <Text style={styles.persistentMessageText}>{persistentMessage}</Text>
                            </View>
                        )}
                        
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
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
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.accent,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textMuted,
    },
    activeTabText: {
        color: colors.accent,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
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
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textMuted,
        lineHeight: 22,
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
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: '600',
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
    persistentMessageCard: {
        marginTop: 25,
        backgroundColor: colors.surfaceHighlight,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.accent,
        alignItems: 'center',
    },
    persistentMessageText: {
        color: colors.textMain,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
    }
});

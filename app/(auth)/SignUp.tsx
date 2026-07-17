import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useRef, useState, useEffect } from 'react';
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
    BackHandler
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/contexts/NetworkContext';
import { auth, database } from '../../FirebaseConfig';

export default function SignUp() {
    const { colors, isDark, setTheme } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);

    useEffect(() => {
        const backAction = () => {
            router.replace('/(auth)/SignIn');
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);
    
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const validate = () => {
        let valid = true;
        setNameError('');
        setEmailError('');
        setPasswordError('');

        if (!name.trim()) {
            setNameError('Name is required');
            valid = false;
        }

        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Enter a valid email');
            valid = false;
        }

        if (!password.trim()) {
            setPasswordError("Password is required");
            valid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            valid = false;
        }

        return valid;
    };

    const handleSignup = async () => {
        if (isOffline) {
            Toast.show({ type: 'error', text1: 'You are offline', text2: 'Please connect to the internet to sign up.' });
            return;
        }

        if (!validate()) return;

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                name: name.trim(),
                createdAt: new Date().toISOString(),
            });
            router.replace('/(main)/(tabs)/Home');
        } catch (error: any) {
            console.error('Error: ', error);
            if (error.code === 'auth/email-already-in-use') {
                setEmailError('Email is already in use');
            } else if (error.code === 'auth/invalid-email') {
                setEmailError('Invalid email');
            } else {
                setPasswordError('Registration failed. Try again.');
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
                    <Pressable onPress={toggleTheme} style={styles.themeToggleBtn}>
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.textMain} />
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started with Cloud Notes</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                placeholder='John Doe'
                                placeholderTextColor={colors.textMuted}
                                cursorColor={colors.accent}
                                style={[styles.input, nameError ? styles.inputError : null]}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (nameError) setNameError('');
                                }}
                                returnKeyType='next'
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                ref={emailRef}
                                placeholder='name@example.com'
                                placeholderTextColor={colors.textMuted}
                                cursorColor={colors.accent}
                                autoCapitalize='none'
                                keyboardType='email-address'
                                style={[styles.input, emailError ? styles.inputError : null]}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) setEmailError('');
                                }}
                                returnKeyType='next'
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                                <TextInput
                                    ref={passwordRef}
                                    placeholder='••••••••'
                                    placeholderTextColor={colors.textMuted}
                                    cursorColor={colors.accent}
                                    autoCapitalize='none'
                                    style={styles.passwordInput}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (passwordError) setPasswordError('');
                                    }}
                                    secureTextEntry={!passwordShow}
                                    returnKeyType='done'
                                    onSubmitEditing={handleSignup}
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
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryButton,
                                (pressed || isOffline) && styles.primaryButtonPressed,
                                { marginTop: 10, opacity: isOffline ? 0.6 : 1 }
                            ]}
                            onPress={handleSignup}
                            disabled={loading || isOffline}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Sign Up</Text>
                            )}
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Pressable onPress={() => router.replace('/(auth)/SignIn')}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </Pressable>
                        </View>
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
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    themeToggleBtn: {
        padding: 10,
        backgroundColor: colors.surfaceHighlight,
        borderRadius: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
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
        marginBottom: 16,
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
    inputError: {
        borderColor: colors.danger,
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 6,
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
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: colors.textMuted,
        fontSize: 14,
    },
    footerLink: {
        color: colors.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
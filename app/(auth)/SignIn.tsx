import Colors from '@/assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { auth } from '../../FirebaseConfig';
import styles from '../../Styles/SignIn';

export default function SignIn() {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const passwordRef = useRef<TextInput>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validate = () => {
        let valid = true;
        setEmailError('');
        setPasswordError('');

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

    const handleSignIn = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Loginned");
            router.replace('/Home');
        } catch (error: any) {
            console.error('Error: ', error);

            if (error.code === "auth/invalid-credential") {
                setPasswordError("Invalid email or password");
            } else if (error.code === "auth/user-not-found") {
                setEmailError("No user found with this email");
            } else {
                setPasswordError("Failed to sign in. Try again");
            }
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setEmailError("Please enter your email first");
            return;
        }

        try {
            setForgotLoading(true);
            await sendPasswordResetEmail(auth, email);

            Toast.show({
                type: "success",
                text1: "Password reset link sent",
                text2: "Check your inbox or spam folder",
            });

            setForgotLoading(false);
        } catch (error: any) {
            console.log('Email !!!!');

            if (error.code === "auth/invalid-email") {
                setEmailError("Invalid email address");
            } else if (error.code === "auth/user-not-found") {
                setEmailError("No account exists with this email");
            } else {
                setEmailError("Something went wrong");
            }

            setForgotLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <StatusBar hidden />
                <View style={styles.header}>
                    <Text style={styles.headerText}>Cloud Note</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.bodyText}>Sign In</Text>

                    <TextInput
                        placeholder='Email'
                        placeholderTextColor={'gray'}
                        cursorColor={Colors.dark.primary}
                        autoCapitalize='none'
                        style={styles.textInout}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (emailError) setEmailError('');
                        }}
                        returnKeyType='next'
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <View style={styles.errorView}>
                        {emailError ? (
                            <Text style={{
                                color: 'red',
                            }}>{emailError}</Text>
                        ) : null}
                    </View>

                    <View style={styles.passwordView}>
                        <TextInput
                            ref={passwordRef}
                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            cursorColor={Colors.dark.primary}
                            autoCapitalize='none'
                            style={styles.textInout}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError) setPasswordError('');
                            }}
                            secureTextEntry={!passwordShow}
                            returnKeyType='done'
                            onSubmitEditing={handleSignIn}
                        />
                        <Pressable
                            onPress={() => setPasswordShow(!passwordShow)}
                            style={styles.passwordPress}
                        >
                            <Ionicons
                                name={passwordShow ? 'eye' : 'eye-off'}
                                size={30}
                                color={Colors.dark.primary}
                            />
                        </Pressable>
                    </View>

                    <View style={styles.errorView}>
                        {passwordError ? (
                            <Text style={{
                                color: 'red',
                            }}>{passwordError}</Text>
                        ) : null}
                    </View>
                    <View style={styles.forgotView}>
                        <Pressable
                            style={({ pressed }) => [
                                pressed && styles.forgotPress
                            ]}
                            onPress={handleForgotPassword}
                        >
                            {forgotLoading ? (
                                <ActivityIndicator
                                    size={30}
                                    color={Colors.dark.primary}
                                    style={{ alignSelf: 'center' }}
                                />
                            ) : (
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            )
                            }
                        </Pressable>
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.signin,
                            pressed && styles.signinPress
                        ]}
                        onPress={handleSignIn}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size={'large'}
                                color={Colors.dark.white}
                            />
                        ) : (
                            <Text style={styles.signinText}>Sign in</Text>
                        )}
                    </Pressable>
                    <View style={styles.signupView}>
                        <Text style={styles.signupText}>You don't have an acount?</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.signup,
                                pressed && styles.signupPress
                            ]}
                            onPress={() => router.replace('/SignUp')}
                        >
                            <Text style={styles.signupPressText}>Sign up</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
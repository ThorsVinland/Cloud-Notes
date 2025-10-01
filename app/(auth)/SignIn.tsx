import Colors from '@/assets/Colors';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { auth } from '../../FirebaseConfig';
import styles from '../../Styles/SignIn';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignIn() {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const passwordRef = useRef<TextInput>(null);

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Loginned");
            router.replace('/Home');
        } catch (error: any) {
            console.error('Error: ', error);
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert(
                'Missing Email',
                'Pleas enter your email first.'
            );
            return;
        }

        try {
            setForgotLoading(true);
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Password Reset',
                'A password reset link has been sent to your email.\nCheck spam'
            );
            setForgotLoading(false);
        } catch (error: any) {
            console.log('Email !!!!');

            switch (error.code) {
                case "auth/invalid-email":
                    Alert.alert("Invalid Email", "Please enter a valid email address.");
                    break;

                case "auth/user-not-found":
                    Alert.alert("User Not Found", "No account exists with this email.");
                    break;

                case "auth/missing-email":
                    Alert.alert("Missing Email", "Please enter your email first.");
                    break;

                default:
                    Alert.alert("Error", error.message);
                    break;
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
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        autoCapitalize='none'
                        style={styles.textInout}
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType='next'
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    <View style={styles.passwordView}>
                        <TextInput
                            ref={passwordRef}
                            placeholder='Password'
                            placeholderTextColor={Colors.grayDark}
                            cursorColor={Colors.black}
                            autoCapitalize='none'
                            style={styles.textInout}
                            value={password}
                            onChangeText={setPassword}
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
                                color={Colors.black}
                            />
                        </Pressable>
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
                                    color={Colors.black}
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
                                color={Colors.white}
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
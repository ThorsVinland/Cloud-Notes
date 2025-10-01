import Colors from '@/assets/Colors';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState, useRef } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { auth, database } from '../../FirebaseConfig';
import styles from '../../Styles/SignUp';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignUp() {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordShow, setPasswordShow] = useState(false);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleSignup = async () => {
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
                name: name,
                createdAt: new Date().toISOString(),
            });
            router.replace('/Home');
        } catch (error: any) {
            console.error('Error: ', error);
            setLoading(false);
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
                    <Text style={styles.bodyText}>Sign Up</Text>
                    <TextInput
                        placeholder='Name'
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        style={[styles.textInout, { marginBottom: 30, }]}
                        value={name}
                        onChangeText={setName}
                        returnKeyType='next'
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />
                    <TextInput
                        ref={emailRef}
                        placeholder='Email'
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        autoCapitalize='none'
                        style={[styles.textInout, { marginBottom: 30, }]}
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
                            returnKeyType='done'
                            onSubmitEditing={handleSignup}
                            secureTextEntry={!passwordShow}
                        />
                        <Pressable
                            onPress={() => setPasswordShow(!passwordShow)}
                            style={styles.passwordPress}
                        >
                            <Ionicons name={
                                passwordShow ? 'eye' : 'eye-off'
                            }
                            size={30}
                            color={Colors.black}
                        />
                        </Pressable>
                    </View>
                    <Pressable
                        style={({ pressed }) => [
                            styles.signup,
                            pressed && styles.signupPress
                        ]}
                        onPress={handleSignup}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size={'large'}
                                color={Colors.white}
                            />
                        ) : (
                            <Text style={styles.signupText}>Sign up</Text>
                        )}
                    </Pressable>
                    <View style={styles.signinView}>
                        <Text style={styles.signinText}>You have an acount?</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.signin,
                                pressed && styles.signinPress
                            ]}
                            onPress={() => router.replace('/(auth)/SignIn')}
                        >
                            <Text style={styles.signinPressText}>Sign in</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
import Colors from '@/assets/Colors';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    View,
} from 'react-native';
import { auth, database } from '../../FirebaseConfig';
import styles from '../../Styles/SignUp';

export default function SignUp() {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

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
        <>
            <StatusBar hidden />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Cloud Note</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.bodyText}>Sign Up</Text>
                    <TextInput
                        placeholder='Name'
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        style={styles.textInout}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        placeholder='Email'
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        autoCapitalize='none'
                        style={styles.textInout}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder='Password'
                        placeholderTextColor={Colors.grayDark}
                        cursorColor={Colors.black}
                        autoCapitalize='none'
                        style={styles.textInout}
                        value={password}
                        onChangeText={setPassword}
                    />
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
        </>
    );
}
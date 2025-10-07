import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { auth } from '@/FirebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import Colors from '@/assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Reauthenticate() {

    const router = useRouter();
    const [password, setPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const handleReauth = async () => {
        try {
            setVerifyLoading(true);
            if (auth.currentUser && auth.currentUser.email) {
                const credential = EmailAuthProvider.credential(
                    auth.currentUser.email,
                    password
                );
                await reauthenticateWithCredential(auth.currentUser, credential);

                Toast.show({
                    type: 'success',
                    text1: 'Verified!'
                });

                router.replace({
                    pathname: '/ChangeEmail',
                    params: { verified: 'true' }
                });

            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Wrong password'
            });
            setVerifyLoading(false);
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <View style={styles.container}>
                <View style={styles.textInputView}>
                    <TextInput
                        placeholder='Password'
                        placeholderTextColor={Colors.dark.gray}
                        style={styles.textInput}
                        value={password}
                        autoCapitalize='none'
                        cursorColor={Colors.dark.gray}
                        onChangeText={setPassword}
                        onSubmitEditing={handleReauth}
                        secureTextEntry={!passwordShow}
                    />
                    <Pressable
                        onPress={() => setPasswordShow(!passwordShow)}
                        style={styles.eyePress}
                    >
                        <Ionicons
                            name={passwordShow ? 'eye' : 'eye-off'}
                            size={30}
                            color={Colors.dark.white}
                        />
                    </Pressable>
                </View>
                <Pressable
                    style={styles.verifyBtn}
                    onPress={handleReauth}
                >
                    {verifyLoading ? (
                        <ActivityIndicator
                            size={40}
                            color={Colors.dark.white}
                        />
                    ) : (
                        <Text style={styles.verifyBtnText}>Verify</Text>
                    )}
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textInputView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.dark.white,
        height: 60,
        borderRadius: 15,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.white,
        paddingLeft: 20,
        paddingRight: 50,
        width: '100%',
    },
    eyePress: {
        position: 'absolute',
        right: 20,
    },
    verifyBtn: {
        backgroundColor: Colors.dark.grayDark,
        marginTop: 20,
        alignSelf: 'center',
        height: 50,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    verifyBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.white,
    },
});
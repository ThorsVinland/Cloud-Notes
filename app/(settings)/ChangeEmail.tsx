import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { verifyBeforeUpdateEmail } from "firebase/auth";
import { auth, database } from "@/FirebaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import Colors from "@/assets/Colors";

export default function ChangeEmail() {

    const { verified } = useLocalSearchParams();
    const router = useRouter();
    const [newEmail, setNewEmail] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);

    React.useEffect(() => {
        if (verified !== 'true') {
            router.replace('/Reauthenticate');
        }
    }, [verified]);

    const handleChangeEmail = async () => {
        try {
            if (!newEmail || !newEmail.includes('@')) {
                Toast.show({
                    type: 'error',
                    text1: 'Enter a valid email address'
                });
                return;
            }

            setSaveLoading(true);
            
            if (auth.currentUser) {
                await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

                Toast.show({
                    type: 'success',
                    text1: 'Verification email sent',
                });

                router.replace('/VerifyEmailPending');
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to update email'
            });
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
            setSaveLoading(false);
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Enter new email</Text>
                <TextInput
                    placeholder='New email'
                    placeholderTextColor={Colors.dark.gray}
                    autoCapitalize='none'
                    style={styles.textInput}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    onSubmitEditing={handleChangeEmail}
                />
                <Pressable
                    style={styles.saveBtn}
                    onPress={handleChangeEmail}
                >
                    {saveLoading ? (
                        <ActivityIndicator
                            size={40}
                            color={Colors.dark.white}
                        />
                    ) : (
                        <Text style={styles.saveBtnText}>Send email</Text>
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
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        color: Colors.dark.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
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
    saveBtn: {
        backgroundColor: Colors.dark.grayDark,
        marginTop: 20,
        alignSelf: 'center',
        height: 50,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    saveBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.white,
    },
});
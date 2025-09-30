import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '@/Styles/NoteDetail';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/assets/Colors';
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, firestore } from '@/FirebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function noteDetail() {

    const router = useRouter();
    const { id, title: oldTitle, note: oldNote } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
    }>();

    const [title, setTitle] = useState(oldTitle || '');
    const [note, setNote] = useState(oldNote || '');
    const [loading, setLoading] = useState(false);

    const saveNote = async () => {
        if (!title.trim() || !note.trim()) {
            Alert.alert(
                'Error',
                'Pleas enter both title and note.'
            );
            return;
        }

        if (!auth.currentUser) {
            Alert.alert(
                'Error',
                'You must be logged in'
            );
            return;
        }

        try {
            setLoading(true);

            if (id) {
                const noteRef = doc(firestore, 'notes', id);
                await updateDoc(noteRef, {
                    title,
                    note,
                    updateAt: serverTimestamp(),
                });
            }
            else {
                await addDoc(collection(firestore, 'notes'), {
                    uid: auth.currentUser.uid,
                    title,
                    note,
                    createdAt: new Date(),
                });
            }
            router.replace('/(main)/Home');
            router.dismissAll();
        } catch (error: any) {
            console.error("Error adding note: ", error);
            Alert.alert(
                "Error",
                "Could not save note."
            );
        } finally {
            setLoading(false);
        }
    };

    const closePage = () => {
        Alert.alert(
            'Close page',
            'You want to close this page?',
            [
                {
                    text: 'Close',
                    onPress: () => router.back(),
                },
                {
                    text: 'Cancel',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.textInputView}>
                <TextInput
                    placeholder='Title'
                    placeholderTextColor={Colors.grayDark}
                    style={[styles.textInput, { fontWeight: '900', height: 60, }]}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    placeholder='Note'
                    placeholderTextColor={Colors.grayDark}
                    style={[styles.textInput, {
                        fontWeight: '600',
                        height: 300,
                        textAlign: 'left',
                        textAlignVertical: 'top',
                    }]}
                    value={note}
                    onChangeText={setNote}
                    multiline
                />
                <View style={styles.btnView}>
                    <Pressable
                        onPress={saveNote}
                    >
                        {({ pressed }) => (
                            <Ionicons
                                name='checkmark-circle'
                                size={60}
                                color={Colors.white}
                                style={{ opacity: pressed ? 0.6 : 1 }}
                            />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={closePage}
                    >
                        {({ pressed }) => (
                            <Ionicons
                                name='close-circle'
                                size={60}
                                color={Colors.white}
                                style={{ opacity: pressed ? 0.6 : 1 }}
                            />
                        )}
                    </Pressable>
                </View>
            </View>
            <Modal
                transparent={true}
                animationType='fade'
                visible={loading}
                onRequestClose={() => { }}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator
                        size={60}
                        color={Colors.white}
                    />
                </View>
            </Modal>
        </View>
    )
}
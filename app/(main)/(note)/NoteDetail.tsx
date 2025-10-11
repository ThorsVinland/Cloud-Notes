import {
    View,
    TextInput,
    Pressable,
    ActivityIndicator,
    Modal,
    BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '@/Styles/NoteDetail';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/assets/Colors';
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, firestore } from '@/FirebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import CustomAlert from '@/components/CustomAlert';
import Toast from 'react-native-toast-message';

export default function NoteDetail() {
    const router = useRouter();
    const { id, title: oldTitle, note: oldNote } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
    }>();

    const [title, setTitle] = useState(oldTitle || '');
    const [note, setNote] = useState(oldNote || '');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const isEditing = Boolean(id);
    const alertTitle = isEditing ? 'Discard edits?' : 'Discard new note?';
    const alertMessage = isEditing
        ? 'Are you sure you want to discard your changes?'
        : 'Are you sure you want to discard this new note?';

    const getDirection = (text: string) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? 'rtl' : 'ltr';
    };
    
    const saveNote = async () => {
        if (!title.trim() || !note.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Missing fields',
                text2: 'Please enter both title and note before saving.',
            });
            return;
        }

        if (!auth.currentUser) {
            Toast.show({
                type: 'error',
                text1: 'Not logged in',
                text2: 'You must be logged in to save notes.',
            });
            return;
        }

        try {
            setLoading(true);

            if (id) {
                const noteRef = doc(firestore, 'notes', id);
                await updateDoc(noteRef, {
                    title,
                    note,
                    updatedAt: serverTimestamp(),
                });
                Toast.show({
                    type: 'success',
                    text1: 'Note updated',
                    text2: 'Your note has been updated successfully.',
                });
            } else {
                await addDoc(collection(firestore, 'notes'), {
                    uid: auth.currentUser.uid,
                    title,
                    note,
                    createdAt: new Date(),
                });
                Toast.show({
                    type: 'success',
                    text1: 'Note saved',
                    text2: 'Your note has been added successfully.',
                });
            }

            router.replace('/(main)/Home');
            router.dismissAll();
        } catch (error: any) {
            console.error("Error saving note: ", error);
            Toast.show({
                type: 'error',
                text1: 'Save failed',
                text2: 'Something went wrong while saving your note.',
            });
        } finally {
            setLoading(false);
        }
    };

    const closePage = () => {
        router.back();
    };

    useEffect(() => {
        const backAction = () => {
            setAlertVisible(true);
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.textInputView}>
                <TextInput
                    placeholder='Title'
                    placeholderTextColor={Colors.dark.gray}
                    style={[
                        styles.textInput,
                        {
                            fontWeight: '900',
                            height: 60,
                            textAlign: getDirection(title) === 'rtl' ? 'right' : 'left',
                            writingDirection: getDirection(title),
                        }]}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    placeholder='Note'
                    placeholderTextColor={Colors.dark.gray}
                    style={[
                        styles.textInput,
                        {
                            fontWeight: '600',
                            height: 300,
                            textAlignVertical: 'top',
                            textAlign: getDirection(note) === 'rtl' ? 'right' : 'left',
                            writingDirection: getDirection(note),
                        },
                    ]}
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                <View style={styles.btnView}>
                    <Pressable onPress={saveNote}>
                        {({ pressed }) => (
                            <Ionicons
                                name='checkmark-circle'
                                size={60}
                                color={Colors.dark.white}
                                style={{ opacity: pressed ? 0.6 : 1 }}
                            />
                        )}
                    </Pressable>

                    <Pressable onPress={() => setAlertVisible(true)}>
                        {({ pressed }) => (
                            <Ionicons
                                name='close-circle'
                                size={60}
                                color={Colors.dark.white}
                                style={{ opacity: pressed ? 0.6 : 1 }}
                            />
                        )}
                    </Pressable>
                </View>
            </View>

            <Modal
                transparent
                animationType='fade'
                visible={loading}
                onRequestClose={() => { }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator size={60} color={Colors.dark.white} />
                </View>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                confirmText='Discard'
                onClose={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    closePage();
                }}
            />
        </View>
    );
}
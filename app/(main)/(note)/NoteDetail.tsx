import CustomAlert from '@/components/CustomAlert';
import { useTheme } from "@/contexts/ThemeContext";
import { auth, firestore } from '@/FirebaseConfig';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from '@/contexts/NetworkContext';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function NoteDetail() {
    const { colors, isDark } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();
    const { id, title: oldTitle, note: oldNote, createdAt, updatedAt } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
        createdAt?: string;
        updatedAt?: string;
    }>();

    const [title, setTitle] = useState(oldTitle || '');
    const [note, setNote] = useState(oldNote || '');
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    
    const noteInputRef = useRef<TextInput>(null);

    const isEditing = Boolean(id);
    const alertTitle = isEditing ? 'Discard edits?' : 'Discard new note?';
    const alertMessage = isEditing
        ? 'Are you sure you want to discard your changes?'
        : 'Are you sure you want to discard this new note?';

    const getDirection = (text: string) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? 'rtl' : 'ltr';
    };

    const hasChanges = title !== (oldTitle || '') || note !== (oldNote || '');

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
            Keyboard.dismiss();
            setLoading(true);

            if (isOffline) {
                const newId = id || Date.now().toString();
                const pending = await AsyncStorage.getItem(`pending_notes_${auth.currentUser.uid}`);
                let pendingNotes = pending ? JSON.parse(pending) : [];
                
                const existingAddIndex = pendingNotes.findIndex((p: any) => p.id === id && p.action === 'add');
                if (existingAddIndex >= 0) {
                    pendingNotes[existingAddIndex] = {
                        ...pendingNotes[existingAddIndex],
                        title: title.trim(),
                        note: note.trim(),
                        timestamp: new Date().toISOString()
                    };
                } else {
                    pendingNotes.push({
                        action: id ? 'update' : 'add',
                        id: newId,
                        title: title.trim(),
                        note: note.trim(),
                        timestamp: new Date().toISOString()
                    });
                }
                await AsyncStorage.setItem(`pending_notes_${auth.currentUser.uid}`, JSON.stringify(pendingNotes));

                const cached = await AsyncStorage.getItem(`notes_${auth.currentUser.uid}`);
                if (cached) {
                    let localNotes = JSON.parse(cached);
                    const newNoteObj: any = {
                        id: newId,
                        title: title.trim(),
                        note: note.trim(),
                        updatedAt: new Date().toISOString()
                    };
                    if (!id) {
                        newNoteObj.createdAt = new Date().toISOString();
                    }
                    if (id) {
                        localNotes = localNotes.map((n: any) => n.id === id ? { ...n, ...newNoteObj } : n);
                    } else {
                        localNotes.unshift(newNoteObj);
                    }
                    await AsyncStorage.setItem(`notes_${auth.currentUser.uid}`, JSON.stringify(localNotes));
                }

                Toast.show({ type: 'info', text1: 'Saved Offline', text2: 'Will sync when you are online.' });
                router.replace('/(main)/(tabs)/Home');
                return;
            }

            if (id) {
                const noteRef = doc(firestore, 'notes', id);
                await updateDoc(noteRef, {
                    title: title.trim(),
                    note: note.trim(),
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
                    title: title.trim(),
                    note: note.trim(),
                    createdAt: new Date(),
                });
                Toast.show({
                    type: 'success',
                    text1: 'Note saved',
                    text2: 'Your note has been added successfully.',
                });
            }

            // Immediately navigate back
            router.replace('/(main)/(tabs)/Home');
            router.dismissAll();
        } catch (error: any) {
            console.error("Error saving note: ", error);
            Toast.show({
                type: 'error',
                text1: 'Save failed',
                text2: 'Something went wrong while saving your note.',
            });
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (hasChanges) {
            setAlertVisible(true);
        } else {
            router.back();
        }
    };

    useEffect(() => {
        const backAction = () => {
            if (hasChanges) {
                setAlertVisible(true);
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [hasChanges]);

    const styles = getStyles(colors);

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </Pressable>
                
                <View style={styles.headerRight}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.accent} style={{ marginRight: 15 }} />
                    ) : (
                        <Pressable 
                            onPress={saveNote} 
                            style={({ pressed }) => [
                                styles.saveBtn,
                                (!title.trim() || !note.trim()) && styles.saveBtnDisabled,
                                pressed && styles.saveBtnPressed
                            ]}
                            disabled={!title.trim() || !note.trim()}
                        >
                            <Text style={styles.saveBtnText}>Save</Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Editor Area */}
            <ScrollView 
                style={styles.editorContainer} 
                contentContainerStyle={styles.editorContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    placeholder="Note Title"
                    placeholderTextColor={colors.textMuted}
                    style={[
                        styles.titleInput,
                        {
                            textAlign: getDirection(title) === 'rtl' ? 'right' : 'left',
                            writingDirection: getDirection(title),
                        }
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    cursorColor={colors.accent}
                    multiline
                    maxLength={100}
                    onSubmitEditing={() => noteInputRef.current?.focus()}
                    blurOnSubmit={false}
                />
                
                <TextInput
                    ref={noteInputRef}
                    placeholder="Start typing your note here..."
                    placeholderTextColor={colors.textMuted}
                    style={[
                        styles.noteInput,
                        {
                            textAlign: getDirection(note) === 'rtl' ? 'right' : 'left',
                            writingDirection: getDirection(note),
                        }
                    ]}
                    value={note}
                    onChangeText={setNote}
                    cursorColor={colors.accent}
                    multiline
                    textAlignVertical="top"
                />
            </ScrollView>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                confirmText="Discard"
                onClose={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    router.back();
                }}
            />
        </KeyboardAvoidingView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : 45,
        paddingBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        zIndex: 10,
    },
    headerBtn: {
        padding: 10,
        borderRadius: 50,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveBtn: {
        backgroundColor: colors.accent,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    saveBtnDisabled: {
        backgroundColor: colors.surfaceHighlight,
        opacity: 0.7,
    },
    saveBtnPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    editorContainer: {
        flex: 1,
    },
    editorContent: {
        padding: 24,
        paddingBottom: 450,
    },
    titleInput: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 20,
        minHeight: 40,
    },
    noteInput: {
        fontSize: 18,
        color: colors.textMain,
        lineHeight: 28,
        minHeight: 400,
    },
});
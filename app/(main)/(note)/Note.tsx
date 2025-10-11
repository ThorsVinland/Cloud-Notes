import styles from '@/Styles/Note';
import Colors from '@/assets/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    Pressable,
    Share,
    Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { firestore } from '@/FirebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import CustomAlert from '@/components/CustomAlert';

const getDirection = (text: string) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text) ? 'rtl' : 'ltr';
};

export default function Note() {
    const router = useRouter();
    const { id, title, note } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
    }>();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(String(note));
        Toast.show({
            type: 'success',
            text1: 'Note copied',
            text2: 'The note content has been copied to your clipboard.',
        });
        setModalVisible(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await deleteDoc(doc(firestore, 'notes', id));
            Toast.show({
                type: 'success',
                text1: 'Note deleted',
                text2: 'The note has been successfully deleted.',
            });
            router.back();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Delete failed',
                text2: 'Something went wrong while deleting the note.',
            });
            console.log('Error deleting note:', error);
        } finally {
            setLoading(false);
            setModalVisible(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${note}`,
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Share failed',
                text2: 'Unable to share this note.',
            });
            console.log('Error sharing:', error);
        }
        setModalVisible(false);
    };

    const handleEdit = () => {
        router.push({
            pathname: '/(main)/(note)/NoteDetail',
            params: { id, title, note },
        });
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size={60} color={Colors.dark.white} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    {title && note ? (
                        <>
                            <View style={styles.header}>
                                <Text
                                    style={styles.title}
                                >{title}</Text>
                                <Pressable
                                    onPress={() => setModalVisible(true)}
                                    style={({ pressed }) => [
                                        { padding: 8 },
                                        pressed && { opacity: 0.5 },
                                    ]}
                                >
                                    <Ionicons
                                        name="ellipsis-vertical"
                                        color={Colors.dark.white}
                                        size={28}
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.body}>
                                <ScrollView>
                                    {String(note)
                                        .split('\n')
                                        .map((line, index) => (
                                            <Text
                                                key={index}
                                                style={[
                                                    styles.note,
                                                    {
                                                        textAlign: /[\u0600-\u06FF]/.test(line) ? 'right' : 'left',
                                                        writingDirection: /[\u0600-\u06FF]/.test(line) ? 'rtl' : 'ltr',
                                                    },
                                                ]}
                                            >
                                                {line || ' '}
                                            </Text>
                                        ))}

                                </ScrollView>
                            </View>
                        </>
                    ) : (
                        <Text style={{ color: Colors.dark.text }}>Error loading note</Text>
                    )}
                </View>
            )}

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={{ flex: 1 }} onPressOut={() => setModalVisible(false)}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 70,
                            right: 16,
                            backgroundColor: Colors.dark.grayDark,
                            width: 220,
                            borderRadius: 16,
                            paddingVertical: 10,
                        }}
                    >
                        <Pressable style={styles.modalBtn} onPress={handleCopy}>
                            <Ionicons name="copy-outline" size={22} color={Colors.dark.white} />
                            <Text style={styles.modalText}>Copy</Text>
                        </Pressable>

                        <Pressable style={styles.modalBtn} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={22} color={Colors.dark.white} />
                            <Text style={styles.modalText}>Share</Text>
                        </Pressable>

                        <Pressable style={styles.modalBtn} onPress={handleEdit}>
                            <Ionicons name="create-outline" size={22} color={Colors.dark.white} />
                            <Text style={styles.modalText}>Edit</Text>
                        </Pressable>

                        <Pressable
                            style={styles.modalBtn}
                            onPress={() => {
                                setModalVisible(false);
                                setAlertVisible(true);
                            }}
                        >
                            <Ionicons name="trash-outline" size={22} color="red" />
                            <Text style={[styles.modalText, { color: 'red' }]}>Delete</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                title="Delete note"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                onClose={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    handleDelete();
                }}
            />
        </View>
    );
}
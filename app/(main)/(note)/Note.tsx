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
    Alert,
    Share,
    Modal,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { firestore } from '@/FirebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export default function Note() {
    const router = useRouter();
    const { id, title, note } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
    }>();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(String(note));
        Toast.show({
            type: 'success',
            text1: 'Copied!',
            text2: 'Note has been copied',
        });
        setModalVisible(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await deleteDoc(doc(firestore, 'notes', id));
                        router.back();
                    } catch (error: any) {
                        setLoading(false);
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Failed to delete note',
                        });
                        console.log('Error: ', error);
                    }
                },
                style: 'destructive',
            },
            { text: 'Cancel' },
        ]);
        setModalVisible(false);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${note}`,
            });
        } catch (error: any) {
            console.log('Error sharing: ', error);
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
                                <Text style={styles.title}>{title}</Text>
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
                                    <Text style={styles.note}>{note}</Text>
                                </ScrollView>
                            </View>
                        </>
                    ) : (
                        <Text>Error</Text>
                    )}
                </View>
            )}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPressOut={() => setModalVisible(false)}
                >
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
                        <Pressable style={styles.modalBtn} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={22} color="red" />
                            <Text style={[styles.modalText, { color: 'red' }]}>Delete</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
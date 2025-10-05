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

    const handleCopy = async () => {
        await Clipboard.setStringAsync(String(note));
        Toast.show({
            type: "success",
            text1: "Copied!",
            text2: "Note has been copied",
        });

    };

    const handleDelete = async () => {
        if (!id) return;
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note ?',
            [
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
                                visibilityTime: 2000,
                            });
                            console.log('Error: ', error);
                        }
                    }
                },
                {
                    text: 'Cancel',
                }
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${note}`,
            });
        } catch (error: any) {
            console.log('Error sharing: ', error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator
                        size={60}
                        color={Colors.dark.white}
                    />
                </View>
            ) : (
                <View style={{ flex: 1, }}>
                    {title && note ? (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.copy,
                                        pressed && styles.copyPress
                                    ]}
                                    onPress={handleCopy}
                                >
                                    <Ionicons name='copy' color={Colors.dark.white} size={30} />
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
            <View style={styles.bottomBar}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        onPress={handleShare}
                    >
                        <Ionicons name="share-social-outline" size={28} color={Colors.dark.white} />
                    </Pressable>
                    <Text style={styles.iconText}>Share</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={28} color="red" />
                    </Pressable>
                    <Text style={styles.iconText}>Delete</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                        onPress={() => router.push({
                            pathname: '/(main)/(note)/NoteDetail',
                            params: { id, title, note }
                        })}
                    >
                        <Ionicons name="create-outline" size={28} color={Colors.dark.white} />
                    </Pressable>
                    <Text style={styles.iconText}>Edit</Text>
                </View>
            </View>
        </View>
    )
}
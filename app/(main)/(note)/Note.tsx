import CustomAlert from '@/components/CustomAlert';
import { useTheme } from "@/contexts/ThemeContext";
import { firestore } from '@/FirebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Share,
    Text,
    View,
    StyleSheet,
    Platform,
    StatusBar,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function Note() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { id, title, note, createdAt, updatedAt } = useLocalSearchParams<{
        id?: string;
        title?: string;
        note?: string;
        createdAt?: string;
        updatedAt?: string;
    }>();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);

    const getDirection = (text: string) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text) ? 'rtl' : 'ltr';
    };

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
            });
            router.back();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Delete failed',
            });
            console.error('Error deleting note:', error);
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
            });
            console.error('Error sharing:', error);
        }
        setModalVisible(false);
    };

    const handleEdit = () => {
        router.push({
            pathname: '/(main)/(note)/NoteDetail',
            params: { id, title, note, createdAt, updatedAt },
        });
        setModalVisible(false);
    };

    const formatDateTime = (value?: string) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    const createdLabel = formatDateTime(createdAt);
    const updatedLabel = formatDateTime(updatedAt);
    const showUpdatedAt = Boolean(updatedLabel && createdAt && updatedAt && updatedAt !== createdAt);

    const styles = getStyles(colors);

    return (
        <View style={styles.container}>
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.textMain} />
                </Pressable>
                
                <View style={styles.headerRight}>
                    <Pressable onPress={handleEdit} style={styles.headerBtn}>
                        <Ionicons name="create-outline" size={24} color={colors.textMain} />
                    </Pressable>
                    <Pressable onPress={() => setModalVisible(true)} style={[styles.headerBtn, { marginLeft: 5 }]}>
                        <Ionicons name="ellipsis-vertical" size={24} color={colors.textMain} />
                    </Pressable>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={40} color={colors.accent} />
                </View>
            ) : (
                <ScrollView 
                    style={styles.content} 
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text 
                        style={[
                            styles.title,
                            {
                                textAlign: getDirection(String(title)) === 'rtl' ? 'right' : 'left',
                                writingDirection: getDirection(String(title)),
                            }
                        ]}
                    >
                        {title}
                    </Text>

                    <Text 
                        style={[
                            styles.noteBody,
                            {
                                textAlign: getDirection(String(note)) === 'rtl' ? 'right' : 'left',
                                writingDirection: getDirection(String(note)),
                            }
                        ]}
                    >
                        {note}
                    </Text>

                    <View style={styles.metadataContainer}>
                        <Text style={styles.metadataText}>Created: {createdLabel}</Text>
                        {showUpdatedAt && (
                            <Text style={styles.metadataText}>Last Edited: {updatedLabel}</Text>
                        )}
                    </View>
                </ScrollView>
            )}

            {/* Options Menu Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.menuContainer}>
                        <Pressable style={styles.menuItem} onPress={handleCopy}>
                            <Ionicons name="copy-outline" size={20} color={colors.textMain} />
                            <Text style={styles.menuText}>Copy Text</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem} onPress={handleShare}>
                            <Ionicons name="share-social-outline" size={20} color={colors.textMain} />
                            <Text style={styles.menuText}>Share</Text>
                        </Pressable>

                        <View style={styles.divider} />

                        <Pressable
                            style={styles.menuItem}
                            onPress={() => {
                                setModalVisible(false);
                                setAlertVisible(true);
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            <Text style={[styles.menuText, { color: colors.danger }]}>Delete Note</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* Delete Confirmation Alert */}
            <CustomAlert
                visible={alertVisible}
                title="Delete Note"
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

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 20,
        lineHeight: 40,
    },
    noteBody: {
        fontSize: 18,
        color: colors.textMain,
        lineHeight: 28,
        marginBottom: 40,
    },
    metadataContainer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    metadataText: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 70,
        right: 16,
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 8,
        width: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 16,
        color: colors.textMain,
        marginLeft: 12,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 4,
    },
});
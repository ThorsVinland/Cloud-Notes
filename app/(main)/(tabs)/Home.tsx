import Search from '@/components/Search';
import { useTheme } from "@/contexts/ThemeContext";
import { auth, database, firestore } from '@/FirebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import MasonryList from '@react-native-seoul/masonry-list';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { get, onValue, ref, update } from 'firebase/database';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    StatusBar,
    Text,
    View,
    StyleSheet,
    Platform
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNetwork } from '@/contexts/NetworkContext';

interface Note {
    id: string;
    title: string;
    note: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export default function Home() {
    const { colors, isDark } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();
    
    const [name, setName] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingAll, setLoadingAll] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const backPressCount = useRef(0);

    const serializeTimestamp = (value?: Timestamp | Date | string | null) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (value instanceof Date) return value.toISOString();
        if (typeof (value as Timestamp).toDate === 'function') {
            return (value as Timestamp).toDate().toISOString();
        }
        return '';
    };

    const fetchProfileData = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = ref(database, 'users/' + user.uid);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setName(data.name || '');
                    if (data.profileImage) {
                        setProfileImage(data.profileImage);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const listenToNotes = () => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
            collection(firestore, 'notes'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userNotes: Note[] = [];
            querySnapshot.forEach((doc) => {
                userNotes.push({ id: doc.id, ...doc.data() } as Note);
            });
            setNotes(userNotes);
            setLoadingAll(false);
        }, (error) => {
            console.log("Firestore snapshot error:", error);
            // Ignore permission-denied errors gracefully when token expires during email change
        });

        return unsubscribe;
    };

    useEffect(() => {
        fetchProfileData();
        const unsubscribe = listenToNotes();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const fetchNotes = async () => {
                if (auth.currentUser) {
                    const uid = auth.currentUser.uid;
                    
                    // Smart Sync: Check if Auth email changed (after clicking verify link)
                    const userRef = ref(database, `users/${uid}`);
                    get(userRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            const dbEmail = snapshot.val().email;
                            if (auth.currentUser?.email && dbEmail !== auth.currentUser.email) {
                                update(userRef, { email: auth.currentUser.email });
                            }
                        }
                    }).catch(console.error);
                }
            };
            fetchNotes();

            const backAction = () => {
                if (backPressCount.current === 0) {
                    backPressCount.current += 1;
                    Toast.show({ text1: 'Press back again to exit', visibilityTime: 2000 });
                    setTimeout(() => { backPressCount.current = 0; }, 2000);
                    return true;
                } else {
                    BackHandler.exitApp();
                    return true;
                }
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfileData();
        setRefreshing(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredNotes(notes);
        } else {
            const lowerQuery = query.toLowerCase();
            const results = notes.filter(
                (n) => n.title.toLowerCase().includes(lowerQuery) || n.note.toLowerCase().includes(lowerQuery)
            );
            setFilteredNotes(results);
        }
    };

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            const unsubscribe = onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setName(data.name || '');
                    setProfileImage(data.profileImage || null);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, []);

    const styles = getStyles(colors);

    return (
        <View style={styles.container}>
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <View style={styles.header}>
                    <View style={styles.profile}>
                        <Image
                            source={profileImage ? { uri: profileImage } : require('../../../assets/images/user.png')}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.headerText} numberOfLines={1}>{name}</Text>
                    </View>
                    <View style={[styles.networkBadge, { backgroundColor: isOffline ? '#EF4444' : '#10B981' }]}>
                        <Ionicons 
                            name={isOffline ? "cloud-offline" : "cloud-done"} 
                            size={14} 
                            color="#fff" 
                        />
                        <Text style={styles.networkBadgeText}>
                            {isOffline ? "Offline" : "Online"}
                        </Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Search value={searchQuery} onChangeText={handleSearch} />
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                ) : notes.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Ionicons name="document-text-outline" size={64} color={colors.border} />
                        <Text style={styles.emptyText}>No notes yet</Text>
                        <Text style={styles.emptySubText}>Tap the + button to create one</Text>
                    </View>
                ) : (
                    <MasonryList
                        data={filteredNotes}
                        keyExtractor={(item) => (item as Note).id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} /> as any}
                        renderItem={({ item, i }) => {
                            const note = item as Note;
                            const isEven = i % 2 === 0;
                            return (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.noteItem,
                                        { marginLeft: isEven ? 0 : 8, marginRight: isEven ? 8 : 0 },
                                        pressed && styles.noteItemPress
                                    ]}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/(main)/(note)/Note',
                                            params: {
                                                id: note.id,
                                                title: note.title,
                                                note: note.note,
                                                createdAt: serializeTimestamp(note.createdAt),
                                                updatedAt: serializeTimestamp(note.updatedAt),
                                            }
                                        });
                                    }}
                                >
                                    <Text style={styles.noteTitle} numberOfLines={2}>{note.title}</Text>
                                    <Text style={styles.noteText} numberOfLines={6}>{note.note}</Text>
                                </Pressable>
                            );
                        }}
                    />
                )}

                <Modal transparent={true} animationType="fade" visible={loadingAll} onRequestClose={() => { }}>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={styles.modalText}>Loading notes...</Text>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={({ pressed }) => [styles.addView, pressed && styles.addPress]}
                    onPress={() => router.push('/(main)/(note)/NoteDetail')}
                >
                    <Ionicons name="add" size={32} color="#ffffff" />
                </Pressable>
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
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
        paddingBottom: 20,
    },
    profile: {
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.surfaceHighlight,
    },
    profilePress: {
        opacity: 0.7,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    headerTextContainer: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 2,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    networkBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    networkBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        zIndex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textMuted,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 8,
    },
    noteItem: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    noteItemPress: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: colors.textMuted,
        lineHeight: 20,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
        color: colors.textMain,
    },
    addView: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 10,
    },
    addPress: {
        transform: [{ scale: 0.95 }],
    },
});

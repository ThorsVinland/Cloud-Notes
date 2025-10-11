import Colors from '@/assets/Colors';
import Search from '@/components/Search';
import { auth, database, firestore } from '@/FirebaseConfig';
import styles from '@/Styles/Home';
import Ionicons from '@expo/vector-icons/Ionicons';
import MasonryList from '@react-native-seoul/masonry-list';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { get, onValue, ref } from 'firebase/database';
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
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function Home() {
    interface Note {
        id: string;
        title: string;
        note: string;
        createdAt: Timestamp;
    }

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

    const ARABIC_REGEX = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    function isLineArabic(line: string) {
        const trimmed = line.trim();
        return ARABIC_REGEX.test(trimmed);
    }

    function renderTextByLine(text: string, maxLines = 5, textStyle?: any) {
        if (!text) return null;

        const lines = text.split(/\r?\n/);
        let displayLines: string[] = [];

        if (lines.length <= maxLines) {
            displayLines = lines;
        } else {
            const part = lines.slice(0, maxLines);
            const remaining = lines.slice(maxLines).join(' ');
            part[maxLines - 1] = part[maxLines - 1] + ' ' + remaining;
            displayLines = part;
        }

        return displayLines.map((ln, idx) => {
            const arabic = isLineArabic(ln);
            return (
                <Text
                    key={idx}
                    style={[
                        textStyle,
                        {
                            textAlign: arabic ? 'right' : 'left',
                            writingDirection: arabic ? 'rtl' : 'ltr',
                        },
                    ]}
                    numberOfLines={1}
                >
                    {ln}
                </Text>
            );
        });
    }

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
        });

        return unsubscribe;
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    useEffect(() => {
        const unsubscribe = listenToNotes();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                if (backPressCount.current === 0) {
                    backPressCount.current += 1;
                    Toast.show({
                        text1: 'Press back again to exit',
                        visibilityTime: 2000,
                    });

                    setTimeout(() => {
                        backPressCount.current = 0;
                    }, 2000);

                    return true;
                } else {
                    BackHandler.exitApp();
                    return true;
                }
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

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
                (n) =>
                    n.title.toLowerCase().includes(lowerQuery) ||
                    n.note.toLowerCase().includes(lowerQuery)
            );
            setFilteredNotes(results);
        }
    };

    useEffect(() => {
        if (notes.length > 0) {
            setFilteredNotes(notes);
        }
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

    return (
        <>
            <StatusBar hidden />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.profile,
                            pressed && styles.profilePress,
                        ]}
                        onPress={() =>
                            router.push({
                                pathname: '/Profile',
                                params: { name: name },
                            })
                        }
                    >
                        <Image
                            source={
                                profileImage
                                    ? { uri: profileImage }
                                    : require('../../assets/images/user.png')
                            }
                            style={styles.profileImage}
                        />
                    </Pressable>
                    <Text
                        style={styles.headerText}
                        numberOfLines={1}
                    >{name}</Text>
                </View>

                <Search value={searchQuery} onChangeText={handleSearch} />

                {loading ? (
                    <Text style={styles.noteViewText}>Loading...</Text>
                ) : notes.length === 0 ? (
                    <Text style={styles.noteViewText}>No notes yet</Text>
                ) : (
                    <MasonryList
                        data={filteredNotes}
                        keyExtractor={(item) => (item as Note).id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        style={{ gap: 10, marginBottom: 100 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> as any
                        }
                        renderItem={({ item }) => {
                            const note = item as Note;
                            return (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.noteItem,
                                        pressed && styles.noteItemPress,
                                    ]}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/(main)/(note)/Note',
                                            params: {
                                                id: note.id,
                                                title: note.title,
                                                note: note.note,
                                            },
                                        });
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.noteTitle,
                                            {
                                                writingDirection: /[\u0600-\u06FF]/.test(note.title)
                                                    ? 'rtl'
                                                    : 'ltr',
                                                textAlign: /[\u0600-\u06FF]/.test(note.title)
                                                    ? 'right'
                                                    : 'left',
                                            },
                                        ]}
                                    >
                                        {note.title}
                                    </Text>

                                    <View style={{ marginTop: 6 }}>
                                        {renderTextByLine(note.note, 5, styles.noteText)}
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                )}

                <Modal
                    transparent={true}
                    animationType="none"
                    visible={loadingAll}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalView}>
                        <ActivityIndicator size={60} color={Colors.dark.white} />
                        <Text>Loading...</Text>
                    </View>
                </Modal>
            </View>

            <Pressable
                style={({ pressed }) => [styles.addView, pressed && styles.addPress]}
                onPress={() => router.push('/(main)/(note)/NoteDetail')}
            >
                <Ionicons name="add-outline" size={65} color={'#4372ff'} />
            </Pressable>
        </>
    );
}

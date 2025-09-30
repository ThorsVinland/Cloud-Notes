import Colors from '@/assets/Colors';
import Search from '@/components/Search';
import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import {
    collection,
    orderBy,
    query,
    Timestamp,
    where,
    onSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Pressable,
    RefreshControl,
    StatusBar,
    Text,
    View,
    Modal,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import { auth, database, firestore } from '@/FirebaseConfig';
import styles from '@/Styles/Home';
import MasonryList from '@react-native-seoul/masonry-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
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

    return (
        <>
            <StatusBar hidden />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{name}</Text>
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
                        style={{ gap: 10 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> as any
                        }
                        renderItem={({ item }) => {
                            const note = item as Note;
                            return (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.noteItem,
                                        pressed && styles.noteItemPress
                                    ]}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/(main)/(note)/Note',
                                            params: {
                                                id: note.id,
                                                title: note.title,
                                                note: note.note,
                                            }
                                        });
                                    }}
                                >
                                    <Text style={styles.noteTitle}>{note.title}</Text>
                                    <Text style={styles.noteText} numberOfLines={5}>
                                        {note.note}
                                    </Text>
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
                        <ActivityIndicator size={60} color={Colors.white} />
                        <Text>Loading...</Text>
                    </View>
                </Modal>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    borderTopColor: Colors.grayLight,
                    borderTopWidth: 1,
                    backgroundColor: Colors.black,
                    height: 120,
                }}
            >
                <Pressable
                    style={({ pressed }) => [styles.addView, pressed && styles.addPress]}
                    onPress={() => router.push('/(main)/(note)/NoteDetail')}
                >
                    <Ionicons name="add-outline" size={70} color="black" />
                </Pressable>
            </View>
        </>
    );
}

import { auth, database } from '@/FirebaseConfig';
import Colors from '@/assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import styles from '../../Styles/Profile';

export default function Profile() {

    const router = useRouter();
    const { name } = useLocalSearchParams();
    const [userName, setUserName] = useState('');
    const [loadingOut, setLoadingOut] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [bottomVisible, setBottomVisible] = useState(false);

    const openChangeNameModal = () => {
        setModalVisible(true);
    };

    const handleSaveName = async () => {
        if (newName.trim() && auth.currentUser) {
            try {
                await set(
                    ref(database, 'users/' + auth.currentUser.uid + '/name'),
                    newName.trim()
                );
                setModalVisible(false);
                setNewName('');
                Toast.show({
                    type: "success",
                    text1: "Name updated successfully!",
                });
            } catch (error: any) {
                console.log('Error updating name: ', error);
                Toast.show({
                    type: "error",
                    text1: "Failed to update name.",
                });
            }
        }
    };

    const handleLogout = async () => {
        try {
            setLoadingOut(true);
            await signOut(auth);
            console.log('Log out');
            router.replace('/SignIn');
        } catch (error: any) {
            console.log('Error');
            setLoadingOut(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
            setBottomVisible(false);
        }
    };

    const handleImageOptions = () => {
        setBottomVisible(true);
    };

    useEffect(() => {
        if (auth.currentUser) {
            const userRef = ref(database, 'users/' + auth.currentUser.uid + '/profileImage');
            const unsubscribe = onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setImage(snapshot.val());
                }
            });

            return () => unsubscribe();
        }
    }, []);

    const uploadImage = async (uri: string) => {
        try {
            setUploading(true);

            const data = new FormData();
            data.append('file', {
                uri,
                type: 'image/jpeg',
                name: 'profile.jpg'
            } as any);

            data.append('upload_preset', 'Note_preset');

            let res = await fetch("https://api.cloudinary.com/v1_1/dwqzl5ukg/image/upload", {
                method: 'POST',
                body: data
            });

            let json = await res.json();
            console.log("Uploaded:", json.secure_url);
            setImage(json.secure_url);

            if (auth.currentUser) {
                await set(ref(database, 'users/' + auth.currentUser.uid + '/profileImage'), json.secure_url);
            }

            Toast.show({
                type: "success",
                text1: "Image uploaded successfully!",
            });

        } catch (error: any) {
            console.log('Upload error: ', error);

            Toast.show({
                type: "error",
                text1: "Failed to upload image.",
            });

        } finally {
            setUploading(false);
        }
    };


    useEffect(() => {
        if (auth.currentUser) {
            const nameRef = ref(database, 'users/' + auth.currentUser.uid + '/name');
            const unsubscribe = onValue(nameRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserName(snapshot.val());
                }
            });
            return () => unsubscribe();
        }
    }, []);


    return (
        <View style={styles.container}>
            <Pressable
                style={styles.imageView}
                onPress={handleImageOptions}
            >
                {uploading ? (
                    <ActivityIndicator
                        size={70}
                        color={Colors.black}
                    />
                ) : (
                    <Image
                        source={image ? { uri: image } : require('../../assets/images/user.png')}
                        style={styles.image}
                    />
                )}
            </Pressable>
            <View style={styles.nameView}>
                <Text
                    style={styles.name}
                    numberOfLines={2}
                >{userName || 'No name'}</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.editName,
                        pressed && styles.editNamePress
                    ]}
                    onPress={openChangeNameModal}
                >
                    <Ionicons
                        name='create-outline'
                        size={30}
                        color={Colors.white}
                    />
                </Pressable>
            </View>
            <Pressable
                style={({ pressed }) => [
                    styles.logoutView,
                    pressed && styles.logoutPress
                ]}
                onPress={handleLogout}
            >
                {loadingOut ? (
                    <ActivityIndicator
                        size={'large'}
                        color={Colors.white}
                    />
                ) : (
                    <Text style={styles.logoutText}>Log out</Text>
                )}
            </Pressable>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                marginBottom: 10,
                                color: Colors.white,
                                marginTop: 250,
                            }}
                        >Enter your name</Text>
                        <View style={{ justifyContent: 'center' }}>
                            <TextInput
                                placeholder='New name'
                                placeholderTextColor={Colors.gray}
                                value={newName}
                                onChangeText={setNewName}
                                style={styles.ModalTextInput}

                            />
                            <Pressable
                                style={({ pressed }) => [
                                    styles.ModalDeleteTextPress,
                                    pressed && { opacity: 0.6 }
                                ]}
                                onPress={() => setNewName('')}
                            >
                                <Ionicons
                                    name='close-circle'
                                    size={24}
                                    color={Colors.grayLight}
                                />
                            </Pressable>
                        </View>
                        <View style={styles.ModalSaveView}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.ModalSavePress,
                                    pressed && { opacity: 0.6 }
                                ]}
                                onPress={handleSaveName}
                            >
                                <Text style={styles.ModalSavePressText}>Save</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.ModalSavePress,
                                    pressed && { opacity: 0.6 }
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.ModalSavePressText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={bottomVisible}
                transparent
                animationType='slide'
                onRequestClose={() => setBottomVisible(false)}
            >
                <Pressable
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'flex-end',
                    }}
                    onPress={() => setBottomVisible(false)}
                >
                    <View
                        style={{
                            backgroundColor: Colors.white,
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                    >
                        <Pressable
                            onPress={pickImage}
                            style={{ padding: 15 }}
                        >
                            <Text style={{ fontSize: 18 }}>Change Image</Text>
                        </Pressable>
                        <Pressable
                            onPress={async () => {
                                if (auth.currentUser) {
                                    await set(ref(database, 'users/' + auth.currentUser.uid + '/profileImage'), null);
                                    setImage(null);
                                    Toast.show({
                                        type: "success",
                                        text1: "Profile image removed!",
                                    });
                                }
                                setBottomVisible(false);
                            }}
                            style={{ padding: 15 }}
                        >
                            <Text style={{
                                fontSize: 18,
                                color: 'red',
                            }}>Remove Image</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setBottomVisible(false)}
                            style={{ padding: 15 }}
                        >
                            <Text style={{
                                fontSize: 18,
                                color: "gray",
                            }}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}
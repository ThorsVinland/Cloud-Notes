import { auth, database } from '@/FirebaseConfig';
import Colors from '@/assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import styles from '../../Styles/Profile';
import CustomAlert from '@/components/CustomAlert';

export default function Profile() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loadingOut, setLoadingOut] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [bottomVisible, setBottomVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);

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
                    text1: "Name updated",
                    text2: "Your name has been updated successfully.",
                });
            } catch (error: any) {
                console.log('Error updating name: ', error);
                Toast.show({
                    type: "error",
                    text1: "Update failed",
                    text2: "Could not update your name. Please try again.",
                });
            }
        } else {
            Toast.show({
                type: "info",
                text1: "Empty field",
                text2: "Please enter a valid name before saving.",
            });
        }
    };

    const handleCopyEmail = async () => {
        await Clipboard.setStringAsync(userEmail);
        Toast.show({
            type: "success",
            text1: "Copied",
            text2: "Email address copied to clipboard.",
        });
    };

    const handleLogout = async () => {
        try {
            setLoadingOut(true);
            await signOut(auth);
            console.log('Logged out');
            router.replace('/SignIn');
            Toast.show({
                type: "success",
                text1: "Logged out",
                text2: "You have been signed out successfully.",
            });
        } catch (error: any) {
            console.log('Logout error', error);
            setLoadingOut(false);
            Toast.show({
                type: "error",
                text1: "Logout failed",
                text2: "Something went wrong. Please try again.",
            });
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
                text1: "Image uploaded",
                text2: "Your profile image has been updated successfully.",
            });
        } catch (error: any) {
            console.log('Upload error: ', error);
            Toast.show({
                type: "error",
                text1: "Upload failed",
                text2: "Could not upload image. Please try again.",
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

    useEffect(() => {
        if (auth.currentUser) {
            setUserEmail(auth.currentUser.email || '');
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.imageView}
                    onPress={handleImageOptions}
                >
                    {uploading ? (
                        <ActivityIndicator size={70} color={Colors.dark.primary} />
                    ) : (
                        <Image
                            source={image ? { uri: image } : require('../../assets/images/user.png')}
                            style={styles.image}
                        />
                    )}
                </Pressable>
            </View>

            <View style={styles.card}>
                <View style={styles.cardContent}>

                    <View style={styles.row}>
                        <Text style={styles.name}>{userName || 'No name set'}</Text>
                        <Pressable
                            style={({ pressed }) => [
                                styles.iconButton,
                                pressed && { opacity: 0.7 }
                            ]}
                            onPress={openChangeNameModal}
                        >
                            <Ionicons name="pencil" size={24} color={Colors.dark.white} />
                        </Pressable>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.email}>{userEmail || 'No email found'}</Text>
                        <View style={styles.buttonGroup}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={() => router.push('/(settings)/Reauthenticate')}
                            >
                                <Ionicons name="pencil" size={24} color={Colors.dark.white} />
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && { opacity: 0.7 }
                                ]}
                                onPress={handleCopyEmail}
                            >
                                <Ionicons name="copy" size={24} color={Colors.dark.white} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.logoutView,
                    pressed && styles.logoutPress
                ]}
                onPress={() => setAlertVisible(true)}
            >
                {loadingOut ? (
                    <ActivityIndicator size={'large'} color={Colors.dark.white} />
                ) : (
                    <Text style={styles.logoutText}>Sign out</Text>
                )}
            </Pressable>

            <Modal
                animationType='slide'
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                marginBottom: 10,
                                color: Colors.dark.white,
                                marginTop: 250,
                            }}
                        >
                            Enter your new name
                        </Text>
                        <View style={{ justifyContent: 'center' }}>
                            <TextInput
                                placeholder='New name'
                                placeholderTextColor={Colors.dark.gray}
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
                                    color={Colors.dark.grayLight}
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
                            backgroundColor: Colors.dark.white,
                            padding: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                    >
                        <Pressable onPress={pickImage} style={{ padding: 15 }}>
                            <Text style={{ fontSize: 18 }}>Change profile image</Text>
                        </Pressable>
                        <Pressable
                            onPress={async () => {
                                if (auth.currentUser) {
                                    await set(ref(database, 'users/' + auth.currentUser.uid + '/profileImage'), null);
                                    setImage(null);
                                    Toast.show({
                                        type: "success",
                                        text1: "Image removed",
                                        text2: "Your profile image has been deleted.",
                                    });
                                }
                                setBottomVisible(false);
                            }}
                            style={{ padding: 15 }}
                        >
                            <Text style={{ fontSize: 18, color: 'red' }}>Remove image</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setBottomVisible(false)}
                            style={{ padding: 15 }}
                        >
                            <Text style={{ fontSize: 18, color: "gray" }}>Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                title='Sign out'
                message='Are you sure you want to sign out of your account?'
                confirmText='Sign out'
                onClose={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    handleLogout();
                }}
            />
        </View>
    );
}
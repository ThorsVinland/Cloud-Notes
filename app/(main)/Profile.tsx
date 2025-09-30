import { auth, database } from '@/FirebaseConfig';
import Colors from '@/assets/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    View,
    Alert,
    RefreshControl,
    ScrollView,
} from 'react-native';
import styles from '../../Styles/Profile';
import { set, ref } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { onValue } from 'firebase/database';

export default function Profile() {

    const router = useRouter();
    const { name } = useLocalSearchParams();
    const [loadingOut, setLoadingOut] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
        }
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

            Alert.alert(
                'Success',
                'Image uploaded successfuly!',
            );
        } catch (error: any) {
            console.log('Upload error: ', error);
            Alert.alert(
                "Error",
                "Failed to upload image."
            );
        } finally {
            setUploading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Pressable
                style={styles.imageView}
                onPress={pickImage}
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
            <Text style={styles.name}>{String(name)}</Text>
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
        </View>
    )
}
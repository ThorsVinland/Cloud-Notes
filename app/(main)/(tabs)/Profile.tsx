import { useTheme } from "@/contexts/ThemeContext";
import { auth, database } from '@/FirebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Platform,
    Alert
} from 'react-native';
import Toast from 'react-native-toast-message';
import ThemeSelector from '@/components/ThemeSelector';
import CustomAlert from '@/components/CustomAlert';
import { useNetwork } from '@/contexts/NetworkContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MenuItem = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    value?: string;
    onPress?: () => void;
};

export default function Profile() {
    const { colors, theme } = useTheme();
    const { isOffline } = useNetwork();
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loadingOut, setLoadingOut] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Modals state
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [newName, setNewName] = useState('');

    const currentThemeLabel = theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light';

    useEffect(() => {
        if (!auth.currentUser) return;

        const nameRef = ref(database, `users/${auth.currentUser.uid}/name`);
        const unsubscribeName = onValue(nameRef, (snapshot) => {
            if (snapshot.exists()) setUserName(snapshot.val());
        });

        const imageRef = ref(database, `users/${auth.currentUser.uid}/profileImage`);
        const unsubscribeImage = onValue(imageRef, (snapshot) => {
            if (snapshot.exists()) setImage(snapshot.val());
        });

        // Load offline cached profile if available
        AsyncStorage.getItem(`profile_${auth.currentUser.uid}`).then(cached => {
            if (cached) {
                const data = JSON.parse(cached);
                if (!userName && data.name) setUserName(data.name);
                if (!image && data.profileImage) setImage(data.profileImage);
            }
        });

        return () => {
            unsubscribeName();
            unsubscribeImage();
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (auth.currentUser) {
                auth.currentUser.reload().then(() => {
                    setUserEmail(auth.currentUser?.email || 'No email');
                }).catch(() => {
                    setUserEmail(auth.currentUser?.email || 'No email');
                });
            }
        }, [])
    );

    const handleSaveName = async () => {
        if (newName.trim() && auth.currentUser) {
            try {
                if (isOffline) {
                    await AsyncStorage.setItem(`pending_profile_name_${auth.currentUser.uid}`, newName.trim());
                    // Update cache for immediate offline feedback
                    const cached = await AsyncStorage.getItem(`profile_${auth.currentUser.uid}`);
                    if (cached) {
                        const data = JSON.parse(cached);
                        await AsyncStorage.setItem(`profile_${auth.currentUser.uid}`, JSON.stringify({ ...data, name: newName.trim() }));
                    }
                    setUserName(newName.trim());
                    Toast.show({ type: 'info', text1: 'Name saved offline', text2: 'Will sync when online.' });
                    setNameModalVisible(false);
                    setNewName('');
                    return;
                }
                
                await set(ref(database, `users/${auth.currentUser.uid}/name`), newName.trim());
                setNameModalVisible(false);
                setNewName('');
                Toast.show({ type: 'success', text1: 'Name updated successfully.' });
            } catch (error: any) {
                Toast.show({ type: 'error', text1: 'Update failed', text2: error.message });
            }
        } else {
            Toast.show({ type: 'info', text1: 'Please enter a valid name' });
        }
    };

    const handleLogout = async () => {
        if (isOffline) {
            Toast.show({ type: 'error', text1: 'You are offline', text2: 'Please connect to the internet to sign out.' });
            return;
        }
        try {
            setLoadingOut(true);
            await signOut(auth);
            router.replace('/SignIn');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Logout failed' });
            setLoadingOut(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            if (isOffline && auth.currentUser) {
                await AsyncStorage.setItem(`pending_profile_image_${auth.currentUser.uid}`, uri);
                // Update cache for immediate offline feedback
                const cached = await AsyncStorage.getItem(`profile_${auth.currentUser.uid}`);
                if (cached) {
                    const data = JSON.parse(cached);
                    await AsyncStorage.setItem(`profile_${auth.currentUser.uid}`, JSON.stringify({ ...data, profileImage: uri }));
                }
                setImage(uri);
                Toast.show({ type: 'info', text1: 'Photo saved offline', text2: 'Will sync when online.' });
                setImageModalVisible(false);
            } else {
                uploadImage(uri);
                setImageModalVisible(false);
            }
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setUploading(true);
            const data = new FormData();
            data.append('file', { uri, type: 'image/jpeg', name: 'profile.jpg' } as any);
            data.append('upload_preset', 'Note_preset');

            const res = await fetch('https://api.cloudinary.com/v1_1/dwqzl5ukg/image/upload', {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            
            if (auth.currentUser) {
                await set(ref(database, `users/${auth.currentUser.uid}/profileImage`), json.secure_url);
            }
            Toast.show({ type: 'success', text1: 'Image uploaded successfully.' });
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Could not upload image.' });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async () => {
        if (auth.currentUser) {
            if (isOffline) {
                await AsyncStorage.setItem(`pending_profile_image_remove_${auth.currentUser.uid}`, 'true');
                // Update cache for immediate offline feedback
                const cached = await AsyncStorage.getItem(`profile_${auth.currentUser.uid}`);
                if (cached) {
                    const data = JSON.parse(cached);
                    await AsyncStorage.setItem(`profile_${auth.currentUser.uid}`, JSON.stringify({ ...data, profileImage: null }));
                }
                setImage(null);
                Toast.show({ type: 'info', text1: 'Photo removed offline', text2: 'Will sync when online.' });
                setImageModalVisible(false);
                return;
            }
            await set(ref(database, `users/${auth.currentUser.uid}/profileImage`), null);
            Toast.show({ type: 'success', text1: 'Image removed' });
        }
        setImageModalVisible(false);
    };

    const accountItems: MenuItem[] = [
        { title: 'Account Security', icon: 'lock-closed-outline', onPress: () => {
            if (isOffline) {
                Toast.show({ type: 'error', text1: 'You are offline', text2: 'Account Security is unavailable offline.' });
            } else {
                router.push('/(main)/AccountSecurity');
            }
        }},
    ];

    const supportItems: MenuItem[] = [
        { title: 'Help Center', icon: 'help-circle-outline', onPress: () => router.push('/(main)/HelpCenter') },
        { title: 'About Us', icon: 'information-circle-outline', onPress: () => router.push('/(main)/AboutUs') },
    ];

    const renderMenuItem = ({ title, icon, value, onPress }: MenuItem) => (
        <Pressable
            key={title}
            style={({ pressed }) => [styles.menuItem, pressed && onPress && styles.menuItemPressed]}
            disabled={!onPress}
            onPress={onPress}
        >
            <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={20} color={colors.accent} />
                </View>
                <Text style={styles.menuItemTitle}>{title}</Text>
            </View>
            <View style={styles.menuItemRight}>
                {value ? <Text style={styles.menuItemValue}>{value}</Text> : null}
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
        </Pressable>
    );

    const styles = getStyles(colors);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileInfo}>
                        <Pressable style={styles.imageContainer} onPress={() => setImageModalVisible(true)}>
                            {uploading ? (
                                <ActivityIndicator size={40} color={colors.accent} />
                            ) : (
                                <Image
                                    source={image ? { uri: image } : require('../../../assets/images/user.png')}
                                    style={styles.profileImage}
                                />
                            )}
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={12} color="#fff" />
                            </View>
                        </Pressable>
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.profileName}>{userName || 'No name set'}</Text>
                            <Text style={styles.profileEmail}>{userEmail}</Text>
                        </View>
                        <Pressable style={styles.editNameBtn} onPress={() => { setNewName(userName); setNameModalVisible(true); }}>
                            <Ionicons name="pencil" size={20} color={colors.accent} />
                        </Pressable>
                    </View>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.sectionCard}>
                    {accountItems.map(renderMenuItem)}
                </View>

                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.sectionCard}>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="color-palette-outline" size={20} color={colors.accent} />
                            </View>
                            <Text style={styles.menuItemTitle}>Theme</Text>
                        </View>
                        <View style={styles.menuItemRight}>
                            <Text style={styles.menuItemValue}>{currentThemeLabel}</Text>
                        </View>
                    </View>
                    <ThemeSelector />
                </View>

                {/* Support Section */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.sectionCard}>
                    {supportItems.map(renderMenuItem)}
                </View>

                <Pressable
                    style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutBtnPressed]}
                    onPress={() => setAlertVisible(true)}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.danger} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </Pressable>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Change Name Modal */}
            <Modal animationType="fade" transparent visible={nameModalVisible} onRequestClose={() => setNameModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Name</Text>
                        <TextInput
                            placeholder="Enter your name"
                            placeholderTextColor={colors.textMuted}
                            value={newName}
                            onChangeText={setNewName}
                            style={styles.modalInput}
                            cursorColor={colors.accent}
                        />
                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalBtnCancel} onPress={() => setNameModalVisible(false)}>
                                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalBtnSave} onPress={handleSaveName}>
                                <Text style={styles.modalBtnTextSave}>Save Changes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Image Options Modal */}
            <Modal animationType="slide" transparent visible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
                <Pressable style={styles.bottomSheetOverlay} onPress={() => setImageModalVisible(false)}>
                    <View style={styles.bottomSheetContent}>
                        <View style={styles.bottomSheetHandle} />
                        <Text style={styles.bottomSheetTitle}>Profile Photo</Text>
                        <Pressable style={styles.bottomSheetOption} onPress={pickImage}>
                            <Ionicons name="images-outline" size={24} color={colors.textMain} />
                            <Text style={styles.bottomSheetOptionText}>Choose from Gallery</Text>
                        </Pressable>
                        <Pressable style={styles.bottomSheetOption} onPress={removeImage}>
                            <Ionicons name="trash-outline" size={24} color={colors.danger} />
                            <Text style={[styles.bottomSheetOptionText, { color: colors.danger }]}>Remove Photo</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* Logout Alert */}
            <CustomAlert
                visible={alertVisible}
                title="Sign out"
                message="Are you sure you want to sign out of your account?"
                confirmText="Sign out"
                onClose={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    handleLogout();
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 30,
    },
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textMain,
    },
    profileCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.accent,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.surface,
    },
    profileTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: colors.textMuted,
    },
    editNameBtn: {
        padding: 10,
        backgroundColor: colors.surfaceHighlight,
        borderRadius: 50,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 12,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuItemPressed: {
        backgroundColor: colors.surfaceHighlight,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.surfaceHighlight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textMain,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemValue: {
        fontSize: 14,
        color: colors.textMuted,
        marginRight: 8,
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.danger,
        marginTop: 10,
    },
    logoutBtnPressed: {
        backgroundColor: colors.surfaceHighlight,
    },
    logoutText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        width: '100%',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: colors.surfaceHighlight,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.textMain,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalBtnCancel: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    modalBtnTextCancel: {
        color: colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    modalBtnSave: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    modalBtnTextSave: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomSheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheetContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    bottomSheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textMain,
        marginBottom: 20,
    },
    bottomSheetOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    bottomSheetOptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textMain,
        marginLeft: 16,
    },
});
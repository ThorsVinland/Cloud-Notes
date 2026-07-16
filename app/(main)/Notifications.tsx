import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon: keyof typeof Ionicons.glyphMap;
};

const notifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Backup completed',
        message: 'Your latest notes were synced successfully to the cloud.',
        timestamp: '2h ago',
        read: false,
        icon: 'cloud-done-outline',
    },
    {
        id: '2',
        title: 'Profile updated',
        message: 'Your profile changes were saved successfully.',
        timestamp: 'Yesterday',
        read: true,
        icon: 'person-circle-outline',
    },
    {
        id: '3',
        title: 'Security reminder',
        message: 'Review your password and account recovery settings.',
        timestamp: '3 days ago',
        read: true,
        icon: 'shield-checkmark-outline',
    },
];

export default function Notifications() {
    const { colors } = useTheme();
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }}
                ListHeaderComponent={
                    <View style={{ marginBottom: 16 }}>
                        <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, marginBottom: 10 }}>
                            <Ionicons name="chevron-back" size={26} color={colors.white} />
                        </Pressable>
                        <Text style={{ color: colors.white, fontSize: 30, fontWeight: '800' }}>Notifications</Text>
                        <Text style={{ color: colors.textL, fontSize: 15, marginTop: 8 }}>
                            Keep track of recent activity and account updates.
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
                        <Ionicons name="notifications-off-outline" size={56} color={colors.textL} />
                        <Text style={{ color: colors.white, fontSize: 20, fontWeight: '700', marginTop: 14 }}>No notifications</Text>
                        <Text style={{ color: colors.textL, fontSize: 15, textAlign: 'center', marginTop: 8 }}>
                            You are all caught up.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: colors.grayDark,
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: item.read ? 'transparent' : colors.gray,
                            opacity: item.read ? 0.86 : 1,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                            <View style={{ height: 42, width: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name={item.icon} size={20} color={colors.white} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <Text style={{ color: colors.white, fontSize: 17, fontWeight: '700', flex: 1 }}>{item.title}</Text>
                                    {!item.read ? <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#4f8cff' }} /> : null}
                                </View>
                                <Text style={{ color: colors.textL, fontSize: 14, lineHeight: 20, marginTop: 6 }}>{item.message}</Text>
                                <Text style={{ color: colors.textL, fontSize: 12, marginTop: 10 }}>{item.timestamp}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

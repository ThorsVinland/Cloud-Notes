import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View, Platform, StatusBar, Linking } from 'react-native';

export default function AboutUs() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const sections = [
        {
            title: 'Mission',
            icon: 'leaf-outline',
            text: 'Cloud Notes helps you capture ideas quickly, keep them organized, and revisit them from anywhere with a clean, distraction-free experience.',
        },
        {
            title: 'What You Can Do',
            icon: 'layers-outline',
            text: 'Create rich notes, manage your profile, personalize the interface, and keep your content accessible with a responsive mobile-first layout.',
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, marginBottom: 16, alignSelf: 'flex-start' }}>
                    <Ionicons name="chevron-back" size={28} color={colors.textMain} />
                </Pressable>

                <View style={{ backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                    <Text style={{ color: colors.textMain, fontSize: 30, fontWeight: '800' }}>About Us</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 16, lineHeight: 24, marginTop: 12 }}>
                        Cloud Notes is designed for people who want a focused note-taking app with a polished interface and smooth everyday workflows.
                    </Text>
                </View>

                {sections.map((section) => (
                    <View key={section.title} style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={22} color={colors.accent} />
                            <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700' }}>{section.title}</Text>
                        </View>
                        <Text style={{ color: colors.textMuted, fontSize: 15, lineHeight: 23 }}>{section.text}</Text>
                    </View>
                ))}

                <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Ionicons name="people-outline" size={22} color={colors.accent} />
                        <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700' }}>Developer</Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 15, lineHeight: 23 }}>
                        Built and maintained by a small product-focused engineering team committed to keeping the app fast, reliable, and easy to use.
                    </Text>
                </View>

                <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Ionicons name="mail-outline" size={22} color={colors.accent} />
                        <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700' }}>Contact Me</Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 15, lineHeight: 23, marginBottom: 16 }}>
                        Developer: Mohamed Adnane Benahmida{'\n'}Email: medadnane18@gmail.com
                    </Text>
                    <Pressable 
                        style={{ backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                        onPress={() => Linking.openURL('mailto:medadnane18@gmail.com?subject=Cloud Notes Support')}
                    >
                        <Ionicons name="send" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Send an Email</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

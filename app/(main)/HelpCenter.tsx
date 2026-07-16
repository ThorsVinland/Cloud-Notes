import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, Platform, StatusBar, Linking } from 'react-native';

type FaqItem = {
    question: string;
    answer: string;
};

const faqs: FaqItem[] = [
    {
        question: 'How do I create a note?',
        answer: 'Open the home screen and tap the add button. Enter your title and content, then save the note.',
    },
    {
        question: 'How do I change my profile picture?',
        answer: 'Go to Profile, tap your avatar, and choose Change profile image from the options sheet.',
    },
    {
        question: 'Why are my notes not syncing?',
        answer: 'Check your internet connection and sign in again if needed. If the issue continues, try refreshing the home screen.',
    },
];

export default function HelpCenter() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar hidden={false} barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <Pressable onPress={() => router.back()} style={{ paddingVertical: 8, marginBottom: 10, alignSelf: 'flex-start' }}>
                    <Ionicons name="chevron-back" size={28} color={colors.textMain} />
                </Pressable>

                <Text style={{ color: colors.textMain, fontSize: 30, fontWeight: '800' }}>Help Center</Text>
                <Text style={{ color: colors.textMuted, fontSize: 15, marginTop: 8, lineHeight: 22 }}>
                    Find quick answers, troubleshooting tips, and support contact details below.
                </Text>

                <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginTop: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                    <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Troubleshooting Tips</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 15, lineHeight: 22 }}>
                        • Restart the app if a screen looks stale.{'\n'}• Make sure you are signed in to the correct account.{'\n'}• Check your network connection when saving or syncing data.
                    </Text>
                </View>

                <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 12 }}>Frequently Asked Questions</Text>
                {faqs.map((item, index) => {
                    const expanded = openIndex === index;
                    return (
                        <View key={item.question} style={{ backgroundColor: colors.surface, borderRadius: 18, marginBottom: 12, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                            <Pressable
                                onPress={() => setOpenIndex(expanded ? null : index)}
                                style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
                            >
                                <Text style={{ color: colors.textMain, fontSize: 16, fontWeight: '700', flex: 1 }}>{item.question}</Text>
                                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
                            </Pressable>
                            {expanded ? (
                                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                                    <Text style={{ color: colors.textMuted, fontSize: 15, lineHeight: 22 }}>{item.answer}</Text>
                                </View>
                            ) : null}
                        </View>
                    );
                })}

                <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginTop: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 }}>
                    <Text style={{ color: colors.textMain, fontSize: 20, fontWeight: '700', marginBottom: 10 }}>Contact Support</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <Ionicons name="person-outline" size={20} color={colors.accent} />
                        <Text style={{ color: colors.textMuted, fontSize: 15 }}>Mohamed Adnane Benahmida</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Ionicons name="mail-outline" size={20} color={colors.accent} />
                        <Text style={{ color: colors.textMuted, fontSize: 15 }}>medadnane18@gmail.com</Text>
                    </View>
                    <Pressable 
                        style={{ backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                        onPress={() => Linking.openURL('mailto:medadnane18@gmail.com?subject=Help with Cloud Notes')}
                    >
                        <Ionicons name="send" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Send an Email</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

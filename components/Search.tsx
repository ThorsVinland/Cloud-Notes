import {
    StyleSheet,
    View,
    TextInput,
    Pressable,
} from 'react-native';
import React from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';

interface SearchProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function Search({ value, onChangeText }: SearchProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
  return (
    <View style={styles.container}>
        <View style={styles.searchIcon}>
            <Ionicons name='search' size={20} color={colors.textMuted} />
        </View>
        <TextInput
            placeholder='Search notes...'
            placeholderTextColor={colors.textMuted}
            style={styles.search}
            value={value}
            onChangeText={onChangeText}
            cursorColor={colors.accent}
        />
        {value.length > 0 &&(
            <Pressable
                style={styles.clearBtn}
                onPress={() => onChangeText('')}
            >
                <Ionicons name='close-circle' size={20} color={colors.textMuted} />
            </Pressable>
        )}
    </View>
  )
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceHighlight,
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    search: {
        flex: 1,
        fontSize: 16,
        color: colors.textMain,
    },
    clearBtn: {
        padding: 4,
    },
})
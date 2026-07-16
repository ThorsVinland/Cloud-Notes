import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "@/contexts/ThemeContext";

export default function SignIn_method() {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <Ionicons
                name={'logo-google'}
                size={30}
                color={colors.primary}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'black',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
})
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
} from 'react-native';
import React from 'react';
import Colors from '@/assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SearchProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function Search({ value, onChangeText }: SearchProps) {
  return (
    <View style={styles.container}>
        <TextInput
            placeholder='Search'
            placeholderTextColor={Colors.dark.gray}
            style={styles.search}
            value={value}
            onChangeText={onChangeText}
        />
        {value.length > 0 &&(
            <Pressable
                style={styles.clearBtn}
                onPress={() => onChangeText('')}
            >
                <Ionicons name='close-circle' size={24} color={Colors.dark.grayLight} />
            </Pressable>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
    },
    search: {
        borderWidth: 1,
        borderColor: Colors.dark.white,
        marginTop: 30,
        height: 60,
        borderRadius: 15,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.white,
        paddingLeft: 20,
        paddingRight: 50,
        marginBottom: 50,
    },
    clearBtn: {
        position: 'absolute',
        right: 15,
        top: 45,
    },
})
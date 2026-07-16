import React from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import {
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

type CustomAlertProps = {
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    onClose: () => void;
    onConfirm?: () => void;
}

export default function CustomAlert({
    visible,
    title,
    message,
    confirmText,
    onClose,
    onConfirm,
}: CustomAlertProps) {
    const { colors } = useTheme();
    return (
        <Modal
            visible={visible}
            transparent
            animationType='fade'
            onRequestClose={onClose}
        >
            <Pressable
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={onClose}
            >
                <Pressable
                    style={{
                        width: '80%',
                        backgroundColor: colors.surface,
                        padding: 20,
                        borderRadius: 12,
                        elevation: 5,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text
                        style={{
                            fontSize: 23,
                            fontWeight: 'bold',
                            marginBottom: 10,
                            color: colors.textMain,
                        }}
                    >{title}</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: colors.textMuted,
                            marginBottom: 20,
                        }}
                    >
                        {message}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}
                    >
                        <Pressable style={{
                            marginRight: 15,
                        }}
                            onPress={onClose}
                        >
                            <Text style={{
                                color: colors.danger,
                                fontWeight: '700',
                                fontSize: 16
                            }}>Cancel</Text>
                        </Pressable>

                        {onConfirm && (
                            <Pressable
                                onPress={onConfirm}
                            >
                                <Text style={{
                                    color: colors.accent,
                                    fontWeight: '700',
                                    fontSize: 16,
                                }}>{confirmText}</Text>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}
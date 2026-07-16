import { ThemeMode, useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ThemeSelector() {
  const { theme, setTheme, isDark, colors } = useTheme();

  const options: { label: string; value: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Light', value: 'light', icon: 'sunny' },
    { label: 'Dark', value: 'dark', icon: 'moon' },
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceHighlight }]}>
      {options.map((option) => {
        const isSelected = theme === option.value;
        const tintColor = isSelected ? colors.textMain : colors.textMuted;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              isSelected && { 
                  backgroundColor: colors.surface,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
              },
            ]}
            onPress={() => setTheme(option.value)}
          >
            <Ionicons
              name={option.icon}
              size={18}
              color={tintColor}
            />
            <Text
              style={[
                styles.text,
                { color: tintColor },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

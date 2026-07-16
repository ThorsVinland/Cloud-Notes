import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useTheme } from '@/contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    any,
    typeof Navigator,
    any,
    any
>(Navigator);

function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    
    const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 25 : 10);
    const tabHeight = (Platform.OS === 'ios' ? 60 : 55) + bottomPadding;
    const bgColor = isDark ? 'rgba(9, 9, 11, 0.85)' : 'rgba(255, 255, 255, 0.85)';

    return (
        <View style={[styles.tabBarContainer, { height: tabHeight }]}>
            <BlurView
                tint={isDark ? "dark" : "light"}
                intensity={80}
                style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />
            <View style={[styles.tabBarContent, { paddingBottom: bottomPadding }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.title !== undefined ? options.title : route.name;
                    
                    const isFocused = state.index === index;
                    
                    const color = isFocused ? (colors.accent || '#6366f1') : (colors.textMuted || '#a1a1aa');
                    
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let iconName: any = 'home';
                    if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
                    if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                        >
                            <Ionicons name={iconName} size={24} color={color} />
                            <Text style={[styles.tabLabel, { color }]}>{label as string}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <MaterialTopTabs
            tabBarPosition="bottom"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                swipeEnabled: true,
            }}
        >
            <MaterialTopTabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                }}
            />
            <MaterialTopTabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                }}
            />
        </MaterialTopTabs>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabBarContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    }
});

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { useNetwork } from '@/contexts/NetworkContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function OfflineBanner() {
  const { isOffline } = useNetwork();
  const [showOnline, setShowOnline] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const wasOffline = useRef(isOffline);

  useEffect(() => {
    if (isOffline) {
      // Fade in Offline
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      wasOffline.current = true;
      setShowOnline(false);
    } else {
      if (wasOffline.current) {
        // Just came back online
        setShowOnline(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Hide after 3 seconds
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            setShowOnline(false);
            wasOffline.current = false;
          });
        }, 3000);
      } else {
        // Init state online, do nothing
        fadeAnim.setValue(0);
      }
    }
  }, [isOffline]);

  if (!isOffline && !showOnline && !wasOffline.current) return null;

  const isError = isOffline;
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.pill, { backgroundColor: isError ? '#EF4444' : '#10B981' }]}>
        <Ionicons 
          name={isError ? "cloud-offline" : "cloud-done"} 
          size={14} 
          color="#fff" 
        />
        <Text style={styles.text}>
          {isError ? "Offline" : "Online"}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 35, // Below status bar
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999, // Float above everything
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import StyledText from '../../components/atoms/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HamburguesaViewer from '../../components/molecules/HamburguesaViewer';
import {
  COLORS,
  TYPOGRAPHY,
  ROLL_ANIMATION_DURATION,
} from '../../lib/core/constants';

const burgerParts = [
  { name: 'Pan Abajo', path: require('@/assets/models/hamburguesa/PanAbajo.glb') },
  { name: 'Carne', path: require('@/assets/models/hamburguesa/Carne.glb') },
  { name: 'Queso', path: require('@/assets/models/hamburguesa/Queso.glb') },
  { name: 'Lechuga', path: require('@/assets/models/hamburguesa/Lechuga.glb') },
  { name: 'Tomates', path: require('@/assets/models/hamburguesa/Tomates.glb') },
  { name: 'Cebollas', path: require('@/assets/models/hamburguesa/Cebollas.glb') },
  { name: 'Pan Arriba', path: require('@/assets/models/hamburguesa/PanArriba.glb') },
];

export default function BurgerGame() {
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();
  const rollTimeoutRef = useRef<number | null>(null);

  const handlePress = () => {
    if (isRolling) return;

    setIsRolling(true);

    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false);
    }, ROLL_ANIMATION_DURATION);
  }

  useEffect(() => {
    return () => {
      if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={TYPOGRAPHY.fontSize['5xl']}
          color={COLORS.text}
        />
      </Pressable>

      <StyledText style={styles.title}>
        Hamburguesa
      </StyledText>

      <HamburguesaViewer modelPaths={burgerParts.map(p => p.path)} isRolling={isRolling} />

      <Pressable
        style={[styles.rollButton, isRolling && styles.disabledButton]}
        onPress={handlePress}
        disabled={isRolling}
      >
        <StyledText style={styles.rollButtonText}>
          Girar
        </StyledText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: 60,
    textAlign: 'center',
    color: COLORS.text,
    height: 100, // Reserve space to prevent layout shift
  },
  rollButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  rollButtonText: {
    color: '#403925',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  disabledButton: {
    backgroundColor: COLORS.primaryDark,
    opacity: 0.7,
  },
});
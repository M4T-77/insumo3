import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import StyledText from '../../components/atoms/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DiceGLB from '../../components/molecules/DiceGLB';
import {
  COLORS,
  SHAKE_THRESHOLD,
  TYPOGRAPHY,
  MESSAGES,
  ROLL_ANIMATION_DURATION,
} from '../../lib/core/constants';
import { useAccelerometer } from '../../lib/modules/sensors/acelerometer/useAccelerometer';
import { isShaking } from '../../lib/core/logic/motion';

const createShuffledBag = () => {
  const faces = [1, 2, 3, 4, 5, 6];
  for (let i = faces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [faces[i], faces[j]] = [faces[j], faces[i]];
  }
  return faces;
};

export default function DiceGame() {
  const [diceValue, setDiceValue] = useState(1);
  // Refactor: Use a single state for game status ('ready' | 'rolling')
  const [status, setStatus] = useState<'ready' | 'rolling'>('ready');
  const [unseenFaces, setUnseenFaces] = useState(createShuffledBag());
  const { data, isAvailable, isLoading } = useAccelerometer();
  const router = useRouter();
  const lastShakeTime = useRef(Date.now());
  const rollTimeoutRef = useRef<number | null>(null);

  // Derived state for convenience
  const isRolling = status === 'rolling';
  const resultText = isRolling ? MESSAGES.rolling : MESSAGES.ready;

  const rollDice = useCallback(() => {
    if (status === 'rolling') return;

    const facesToDrawFrom = unseenFaces.length === 0 ? createShuffledBag() : [...unseenFaces];
    const nextValue = facesToDrawFrom.pop()!;
    setUnseenFaces(facesToDrawFrom);

    setStatus('rolling');

    rollTimeoutRef.current = setTimeout(() => {
      setDiceValue(nextValue);
      setStatus('ready');
    }, ROLL_ANIMATION_DURATION);
  }, [status, unseenFaces]);

  useEffect(() => {
    if (!isAvailable || !data) return;

    const now = Date.now();
    if (!isRolling && isShaking(data, SHAKE_THRESHOLD) && now - lastShakeTime.current > ROLL_ANIMATION_DURATION) {
      lastShakeTime.current = now;
      rollDice();
    }
  }, [data, isAvailable, rollDice, isRolling]);

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
        {resultText}
      </StyledText>

      <DiceGLB value={diceValue} isRolling={isRolling} color="#FFFFFF" pipsColor="#FF0000" />

      <StyledText style={styles.instruction}>
        {isLoading
          ? MESSAGES.sensorInactive
          : isAvailable
            ? MESSAGES.sensorActive
            : MESSAGES.sensorUnavailable}
      </StyledText>

      <Pressable
        style={styles.rollButton}
        onPress={rollDice}
        disabled={isRolling}
      >
        <StyledText style={styles.rollButtonText}>
          {MESSAGES.buttonLabel}
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
  instruction: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.accent,
    marginTop: 50,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  rollButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  rollButtonText: {
    color: '#403925',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});

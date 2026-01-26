import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import StyledText from '../../components/atoms/Text';
import Dice from '../../components/molecules/DiceGLB';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SHAKE_THRESHOLD, COOLDOWN_TIME, ROLL_ANIMATION_DURATION, COLORS, TYPOGRAPHY, SPACING, DIMENSIONS, DICE_MIN, DICE_MAX } from '../../lib/core/constants';
import { AccelerometerService } from '../../lib/modules/sensors/acelerometer/accelerometer.service';

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function DiceGame() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [rollId, setRollId] = useState(0);

  const lastRollTimeRef = useRef(0);
  const router = useRouter();

  const handleRoll = useCallback(() => {
    const now = Date.now();
    if (isRolling || now - lastRollTimeRef.current < COOLDOWN_TIME) return;

    lastRollTimeRef.current = now;
    setIsRolling(true);
    setRollId((id) => id + 1);

    setTimeout(() => {
      const newValue = getRandomNumber(DICE_MIN, DICE_MAX);
      setDiceValue(newValue);
      setIsRolling(false);
    }, ROLL_ANIMATION_DURATION);
  }, [isRolling]);

  useEffect(() => {
    const subscription = AccelerometerService.subscribe(({ x, y, z }) => {
      if (Math.sqrt(x * x + y * y + z * z) > SHAKE_THRESHOLD) {
        handleRoll();
      }
    });

    return () => subscription.remove();
  }, [handleRoll]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={TYPOGRAPHY.fontSize['5xl']}
          color={COLORS.text}
        />
      </Pressable>

      <View style={styles.textContainer}>
        <StyledText style={styles.result}>Dado</StyledText>
      </View>

      <Dice key={rollId} value={diceValue} isRolling={true} />

      <Pressable
        style={[styles.rollButton, isRolling && styles.disabledButton]}
        onPress={handleRoll}
        disabled={isRolling}
      >
        <StyledText style={styles.rollButtonText}>
          {isRolling ? 'Lanzando...' : 'Lanzar'}
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
    padding: SPACING.lg,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    minHeight: 100,
  },
  result: {
    fontSize: TYPOGRAPHY.fontSize['6xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
  },
  rollButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: DIMENSIONS.buttonBorderRadius,
    marginTop: SPACING['2xl'],
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
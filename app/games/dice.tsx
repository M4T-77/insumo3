import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import StyledText from '../../components/atoms/Text';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { 
  COLORS, 
  SHAKE_THRESHOLD, 
  COOLDOWN_TIME, 
  DIMENSIONS, 
  ANIMATIONS, 
  TYPOGRAPHY, 
  MESSAGES 
} from '../../lib/core/constants';
import { useAccelerometer } from '../../lib/modules/sensors/acelerometer/useAccelerometer';
import { isShaking } from '../../lib/core/logic/motion';

export default function DiceGame() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const { data, isAvailable } = useAccelerometer();
  const router = useRouter();

  const rollAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const now = Date.now();
    if (isAvailable && data && isShaking(data, SHAKE_THRESHOLD) && !isRolling && (now - lastShakeTime > COOLDOWN_TIME)) {
      setLastShakeTime(now);
      rollDice();
    }
  }, [data]);

  const rollDice = () => {
    setIsRolling(true);
    Animated.sequence([
      Animated.timing(rollAnimation, {
        toValue: 1,
        duration: ANIMATIONS.fast,
        useNativeDriver: true,
      }),
      Animated.timing(rollAnimation, {
        toValue: 0,
        duration: ANIMATIONS.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
    });
  };

  const getDiceIconName = (value: number): React.ComponentProps<typeof FontAwesome5>['name'] => {
    const names: { [key: number]: React.ComponentProps<typeof FontAwesome5>['name'] } = {
      1: 'dice-one',
      2: 'dice-two',
      3: 'dice-three',
      4: 'dice-four',
      5: 'dice-five',
      6: 'dice-six',
    };
    return names[value] || 'dice-one';
  };

  const animatedStyle = {
    transform: [
      {
        rotate: rollAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle-outline" size={TYPOGRAPHY.fontSize['5xl']} color={COLORS.text} />
      </Pressable>

      <StyledText style={styles.title}>{MESSAGES.ready}</StyledText>

      <Animated.View style={[styles.diceContainer, animatedStyle]}>
        <FontAwesome5
          name={getDiceIconName(diceValue)}
          size={DIMENSIONS.diceSize}
          color={COLORS.diceBackground}
        />
      </Animated.View>

      <StyledText style={styles.instruction}>
        {isAvailable ? MESSAGES.sensorActive : MESSAGES.sensorUnavailable}
      </StyledText>
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
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginBottom: TYPOGRAPHY.fontSize['6xl'],
    textAlign: 'center',
    color: COLORS.text,
  },
  diceContainer: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  instruction: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    color: COLORS.accent,
    marginTop: DIMENSIONS.buttonHeight,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
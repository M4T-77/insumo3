
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  onPress: () => void;
  text: string;
  subtext: string;
}

export default function Button({ onPress, text, subtext }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Ionicons name="game-controller-outline" size={64} color="white" style={styles.buttonIcon} />
      <Text style={styles.buttonText}>{text}</Text>
      <Text style={styles.buttonSubtext}>{subtext}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 250,
  },
  buttonPressed: {
    backgroundColor: '#6d28d9',
    transform: [{ scale: 0.95 }],
  },
  buttonIcon: {
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#e9d5ff',
  },
});

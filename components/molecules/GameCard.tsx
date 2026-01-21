import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StyledText from '../atoms/Text';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../lib/core/constants';

interface GameCardProps {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  link: any;
}

export default function GameCard({ title, icon, link }: GameCardProps) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => router.push(link)}
    >
      <Ionicons name={icon} size={48} color={COLORS.text} />
      <StyledText style={styles.cardText}>{title}</StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    margin: 10,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardPressed: {
    backgroundColor: COLORS.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    color: COLORS.text,
  },
});
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StyledText from '../atoms/Text';
import { Ionicons } from '@expo/vector-icons';

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
      <Ionicons name={icon} size={48} color="white" />
      <StyledText style={styles.cardText}>{title}</StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3a3a5e',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    margin: 10,
    shadowColor: '#3a3a5e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardPressed: {
    backgroundColor: '#2e2e4a',
    transform: [{ scale: 0.96 }],
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
});

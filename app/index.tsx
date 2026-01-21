import { View, StyleSheet } from 'react-native';
import GameCard from '../components/molecules/GameCard';
import StyledText from '../components/atoms/Text';
import { COLORS } from '../lib/core/constants';

const games = [
  {
    title: 'Lanzar Dado',
    icon: 'dice-outline' as const,
    link: '/games/dice',
  },
  {
    title: 'Ver Hamburguesa',
    icon: 'fast-food-outline' as const,
    link: '/games/burger',
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Insumo #3</StyledText>
        <StyledText style={styles.subtitle}>
          Juego de dado y hamburguesa
        </StyledText>
      </View>

      <View style={styles.gameList}>
        {games.map((item) => (
          <GameCard key={item.title} title={item.title} icon={item.icon} link={item.link} />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 100,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  gameList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
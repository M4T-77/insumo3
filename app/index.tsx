import { View, StyleSheet } from 'react-native';
import GameCard from '@/components/molecules/GameCard';
import StyledText from '@/components/atoms/Text';
import { COLORS } from '@/lib/core/constants';

interface Game {
  title: string;
  icon: any;
  link: string;
}

const games: Game[] = [
  {
    title: 'Lanzar Dado',
    icon: 'dice-outline',
    link: '/games/dice',
  },
  {
    title: 'Ver Hamburguesa',
    icon: 'fast-food-outline',
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
        {games.map((item, index) => (
          <GameCard
            key={index}
            title={item.title}
            icon={item.icon}
            link={item.link}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 48,
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
    flexWrap: 'wrap',
  },
});

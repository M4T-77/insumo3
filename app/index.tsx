import { View, StyleSheet, FlatList } from 'react-native';
import GameCard from '../components/molecules/GameCard';
import StyledText from '../components/atoms/Text';

const games = [
  {
    title: 'Lanzar Dado',
    icon: 'dice-outline' as const,
    link: '/games/dice',
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Dado Mágico</StyledText>
        <StyledText style={styles.subtitle}>
          App de dado 3D, con acelerómetro
        </StyledText>
      </View>

      <FlatList
        data={games}
        renderItem={({ item }) => (
          <GameCard title={item.title} icon={item.icon} link={item.link} />
        )}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.gameList}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingTop: 275,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
  },
  gameList: {
    alignItems: 'center',
  },
});
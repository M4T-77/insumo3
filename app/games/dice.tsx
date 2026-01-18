import { View, StyleSheet, Pressable } from 'react-native';
import StyledText from '../../components/atoms/Text';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DiceGame() {
  const diceValue = 1;
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle-outline" size={48} color="white" />
      </Pressable>

      <StyledText style={styles.title}>Dado Mágico</StyledText>

      <View style={styles.diceContainer}>
        <FontAwesome5
          name={getDiceIconName(diceValue)}
          size={150}
          color="white"
        />
      </View>

      <StyledText style={styles.instruction}>
        Agita tu teléfono para lanzar el dado
      </StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
  diceContainer: {
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  instruction: {
    fontSize: 20,
    color: '#a78bfa',
    marginTop: 50,
    textAlign: 'center',
    fontWeight: '500',
  },
});

import { View, Text, StyleSheet } from 'react-native';

export default function DiceGame() {
  const diceValue = 1;

  const getDots = (value: number) => {
    const positions: { [key: number]: string[] } = {
      1: ['center'],
      2: ['topLeft', 'bottomRight'],
      3: ['topLeft', 'center', 'bottomRight'],
      4: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      5: ['topLeft', 'topRight', 'center', 'bottomLeft', 'bottomRight'],
      6: ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
    };
    return positions[value] || [];
  };

  const getDotStyle = (position: string) => {
    const dotPositions: { [key: string]: object } = {
      topLeft: { top: 20, left: 20 },
      topRight: { top: 20, right: 20 },
      middleLeft: { top: 65, left: 20 },
      middleRight: { top: 65, right: 20 },
      center: { top: 65, left: 65 },
      bottomLeft: { bottom: 20, left: 20 },
      bottomRight: { bottom: 20, right: 20 }
    };
    return dotPositions[position] || {};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dado Mágico</Text>

      <View style={styles.dice}>
        {getDots(diceValue).map((position, index) => (
          <View 
            key={index} 
            style={[styles.dot, getDotStyle(position)]} 
          />
        ))}
      </View>

      <Text style={styles.instruction}>
        Agita tu teléfono para lanzar el dado
      </Text>

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
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 60,
    textAlign: 'center',
  },
  dice: {
    width: 150,
    height: 150,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    position: 'relative',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    position: 'absolute',
  },
  instruction: {
    fontSize: 20,
    color: '#a78bfa',
    marginTop: 50,
    textAlign: 'center',
    fontWeight: '500',
  },

});
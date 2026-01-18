import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dado Mágico</Text>
        <Text style={styles.subtitle}>
          Aplicación de sensores móviles
        </Text>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={() => router.push('/games/dice')}
      >
        <Text style={styles.buttonText}>Lanzar Dado</Text>
        <Text style={styles.buttonSubtext}>Toca para comenzar</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Proyecto de Desarrollo Móvil Avanzado
        </Text>
        <Text style={styles.footerSubtext}>
          Semana 16 • Sensores & Física Digital
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  header: {
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
  },
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
    fontSize: 64,
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
  footer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
});
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal } from 'react-native';
import StyledText from '../../components/atoms/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HamburguesaViewer from '../../components/molecules/HamburguesaViewer';
import { COLORS,  TYPOGRAPHY } from '../../lib/core/constants';

interface BurgerPart {
  name: string;
  path: any;
  color: string;
}

const burgerParts: BurgerPart[] = [
  { name: 'Pan Abajo', path: require('@/assets/models/hamburguesa/PanAbajo.glb'), color: '#D2691E' },
  { name: 'Carne', path: require('@/assets/models/hamburguesa/Carne.glb'), color: '#8B4513' },
  { name: 'Queso', path: require('@/assets/models/hamburguesa/Queso.glb'), color: '#FFD700' },
  { name: 'Lechuga', path: require('@/assets/models/hamburguesa/Lechuga.glb'), color: '#90EE90' },
  { name: 'Tomates', path: require('@/assets/models/hamburguesa/Tomates.glb'), color: '#FF6347' },
  { name: 'Cebollas', path: require('@/assets/models/hamburguesa/Cebollas.glb'), color: '#E6E6FA' },
  { name: 'Pan Arriba', path: require('@/assets/models/hamburguesa/PanArriba.glb'), color: '#D2691E' },
];

const initialBurger: BurgerPart[] = [
  burgerParts.find(p => p.name === 'Pan Abajo'),
  burgerParts.find(p => p.name === 'Pan Arriba'),
].filter(Boolean) as BurgerPart[];

const availableIngredients = burgerParts.slice(1, -1);

interface GameButtonProps {
  onPress: () => void;
  title: string;
}

const GameButton: React.FC<GameButtonProps> = ({ onPress, title }) => (
  <Pressable style={styles.button} onPress={onPress}>
    <StyledText style={styles.buttonText}>{title}</StyledText>
  </Pressable>
);

interface IngredientModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, title, children }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <StyledText style={styles.menuTitle}>{title}</StyledText>
        {children}
        <Pressable
          style={[styles.menuItem, styles.closeButton]}
          onPress={onClose}
        >
          <StyledText style={styles.closeButtonText}>Cerrar</StyledText>
        </Pressable>
      </View>
    </View>
  </Modal>
);

export default function BurgerGame() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<BurgerPart[]>(initialBurger);
  const [isAddMenuVisible, setAddMenuVisible] = useState(false);
  const [isViewMenuVisible, setViewMenuVisible] = useState(false);

  const addIngredient = (ingredient: BurgerPart) => {
    const topBunIndex = ingredients.findIndex(ing => ing.name === 'Pan Arriba');
    if (topBunIndex !== -1) {
      const newIngredients = [
        ...ingredients.slice(0, topBunIndex),
        ingredient,
        ...ingredients.slice(topBunIndex)
      ];
      setIngredients(newIngredients);
    } else {
      setIngredients([...ingredients, ingredient]);
    }
    setAddMenuVisible(false);
  };

  const resetBurger = () => {
    setIngredients(initialBurger);
  };

  const countIngredients = () => {
    const ingredientCounts: { [key: string]: { count: number; color: string } } = {};
    ingredients.forEach(ingredient => {
      if (ingredient.name !== 'Pan Abajo' && ingredient.name !== 'Pan Arriba') {
        if (ingredientCounts[ingredient.name]) {
          ingredientCounts[ingredient.name].count++;
        } else {
          ingredientCounts[ingredient.name] = { count: 1, color: ingredient.color };
        }
      }
    });
    return ingredientCounts;
  };

  return (
    <View style={styles.container}>
      <IngredientModal
        visible={isAddMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        title="Agregar Ingrediente"
      >
        {availableIngredients.map((ingredient) => (
          <Pressable
            key={ingredient.name}
            style={styles.menuItem}
            onPress={() => addIngredient(ingredient)}
          >
            <StyledText style={[styles.menuItemText, { color: ingredient.color }]}>{ingredient.name}</StyledText>
          </Pressable>
        ))}
      </IngredientModal>

      <IngredientModal
        visible={isViewMenuVisible}
        onClose={() => setViewMenuVisible(false)}
        title="Ingredientes Actuales"
      >
        {Object.entries(countIngredients()).map(([name, { count, color }]) => (
          <StyledText key={name} style={[styles.ingredientItem, { color: color }]}>
            {name} x{count}
          </StyledText>
        ))}
      </IngredientModal>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={TYPOGRAPHY.fontSize['5xl']}
          color={COLORS.text}
        />
      </Pressable>

      <StyledText style={styles.title}>
        Hamburguesa
      </StyledText>

      <HamburguesaViewer modelPaths={ingredients.map(p => p.path)} />

      <View style={styles.buttonContainer}>
        <GameButton title="Agregar Ingredientes" onPress={() => setAddMenuVisible(true)} />
        <GameButton title="Ver Ingredientes" onPress={() => setViewMenuVisible(true)} />
        <GameButton title="Reiniciar" onPress={resetBurger} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginVertical: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#403925',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
  },
  menuItem: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  ingredientItem: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#403925',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
});
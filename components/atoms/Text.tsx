import { Text, StyleSheet } from 'react-native';

interface TextProps {
  style?: object;
  children: React.ReactNode;
}

export default function StyledText({ style, children }: TextProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
  },
});

import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}

export default function Icon({ name, color, size }: IconProps) {
  return <Ionicons name={name} color={color} size={size} />;
}

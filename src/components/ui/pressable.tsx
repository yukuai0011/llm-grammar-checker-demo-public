import { Pressable as RNPressable, type PressableProps } from 'react-native';

export type IPressableProps = PressableProps & { className?: string };

export function Pressable(props: IPressableProps) {
  return <RNPressable {...props} />;
}

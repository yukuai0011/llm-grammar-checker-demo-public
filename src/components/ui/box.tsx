import { View, type ViewProps } from 'react-native';

export type BoxProps = ViewProps & { className?: string };

export function Box(props: BoxProps) {
  return <View {...props} />;
}

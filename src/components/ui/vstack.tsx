import { View, type ViewProps } from 'react-native';

export type VStackProps = ViewProps & { className?: string };

export function VStack(props: VStackProps) {
  return <View {...props} />;
}

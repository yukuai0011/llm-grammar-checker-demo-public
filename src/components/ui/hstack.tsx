import { View, type ViewProps } from 'react-native';

export type HStackProps = ViewProps & { className?: string };

export function HStack(props: HStackProps) {
  return <View {...props} />;
}

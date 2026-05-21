import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

export type SpinnerProps = ActivityIndicatorProps & {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Spinner({ size, ...props }: SpinnerProps) {
  const sizeMap = { sm: 'small', md: 'small', lg: 'large' } as const;
  return <ActivityIndicator size={sizeMap[size ?? 'md']} {...props} />;
}

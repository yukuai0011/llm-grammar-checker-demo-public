import { Text as RNText, type TextProps } from 'react-native';

export type ITextProps = TextProps & { className?: string };

export function Text(props: ITextProps) {
  return <RNText {...props} />;
}

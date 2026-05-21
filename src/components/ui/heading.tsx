import { Text as RNText, type TextProps } from 'react-native';

export type IHeadingProps = TextProps & { className?: string };

export function Heading(props: IHeadingProps) {
  return <RNText {...props} />;
}

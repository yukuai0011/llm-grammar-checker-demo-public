import {
  Pressable as RNPressable,
  Text as RNText,
  ActivityIndicator,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from "react-native";

export type ButtonProps = PressableProps & {
  className?: string;
  isDisabled?: boolean;
};
export type ButtonTextProps = TextProps & { className?: string };
export type ButtonSpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};
export type ButtonIconProps = ViewProps & { className?: string };
export type ButtonGroupProps = ViewProps & { className?: string };

export function Button({ isDisabled, ...props }: ButtonProps) {
  return <RNPressable disabled={isDisabled} {...props} />;
}

export function ButtonText(props: ButtonTextProps) {
  return <RNText {...props} />;
}

export function ButtonSpinner({ size }: ButtonSpinnerProps) {
  const sizeMap = { sm: "small", md: "small", lg: "large" } as const;
  return <ActivityIndicator size={sizeMap[size ?? "md"]} />;
}

export function ButtonIcon(props: ButtonIconProps) {
  return <View {...props} />;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return <View {...props} />;
}

import {
  View,
  TextInput,
  Pressable,
  type ViewProps,
  type TextInputProps,
} from "react-native";

export type InputProps = ViewProps & { className?: string };
export type InputFieldProps = TextInputProps & { className?: string };
export type InputSlotProps = ViewProps & {
  className?: string;
  onPress?: () => void;
};
export type InputIconProps = ViewProps & { className?: string };

export function Input(props: InputProps) {
  return <View {...props} />;
}

export function InputField(props: InputFieldProps) {
  return <TextInput {...props} />;
}

export function InputSlot(props: InputSlotProps) {
  if (props.onPress) {
    return <Pressable onPress={props.onPress} {...(props as any)} />;
  }
  return <View {...props} />;
}

export function InputIcon(props: InputIconProps) {
  return <View {...props} />;
}

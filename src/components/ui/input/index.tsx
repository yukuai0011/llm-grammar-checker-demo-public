'use client';
import React from 'react';
import { createInput } from '@gluestack-ui/core/input/creator';
import {
  tva,
  withStyleContext,
  useStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import {
  TextInput,
  View,
  Pressable,
  Platform,
  type TextInputProps,
} from 'react-native';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';

const SCOPE = 'INPUT';

const InputWrapper = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentProps<typeof View> & { className?: string }
>(function InputWrapper({ className, ...props }, ref) {
  return (
    <View ref={ref} className={className} {...props} />
  );
});

const UIInput = createInput({
  Root: Platform.OS === 'web' ? View : withStyleContext(View, SCOPE),
  Icon: UIIcon,
  Slot: Pressable,
  Input: TextInput,
});

cssInterop(InputWrapper, { className: 'style' });
cssInterop(UIInput, { className: 'style' });
cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

const inputStyle = tva({
  base: 'rounded border-background-300 bg-background-50 data-[hover=true]:border-background-400 data-[focus=true]:border-primary-700 data-[focus=true]:data-[hover=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:bg-background-50 data-[disabled=true]:data-[hover=true]:border-background-300 flex-row overflow-hidden content-center items-center',

  variants: {
    size: {
      xl: 'h-12',
      lg: 'h-11',
      md: 'h-10',
      sm: 'h-9',
    },
    variant: {
      underlined:
        'border-b data-[hover=true]:border-b-2 data-[focus=true]:border-b-2 data-[focus=true]:data-[hover=true]:border-b-2 rounded-none border-t-0 border-r-0 border-l-0',
      outline: 'data-[focus=true]:border-2 data-[focus=true]:data-[hover=true]:border-2',
      rounded:
        'data-[focus=true]:border-2 data-[focus=true]:data-[hover=true]:border-2 rounded-full',
    },
    isDisabled: {
      true: 'data-[disabled=true]:border-background-300',
    },
    isInvalid: {
      true: 'data-[invalid=true]:border-error-700 data-[invalid=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:data-[hover=true]:border-error-700',
    },
    isReadOnly: {
      true: 'data-[readonly=true]:border-background-300 data-[readonly=true]:data-[hover=true]:border-background-300 data-[readonly=true]:data-[focus=true]:border-background-300 data-[readonly=true]:data-[focus=true]:data-[hover=true]:border-background-300',
    },
  },
});

const inputIconStyle = tva({
  base: 'justify-center items-center text-typography-500 data-[disabled=true]:opacity-40',

  variants: {
    size: {
      '2xs': 'h-3 w-3',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
  parentVariants: {
    size: {
      xl: 'h-6 w-6',
      lg: 'h-5 w-5',
      md: 'h-[18px] w-[18px]',
      sm: 'h-4 w-4',
    },
  },
});

const inputFieldStyle = tva({
  base: 'flex-1 text-typography-900 web:cursor-text web:outline-none web:outline-0 py-0 px-3 bg-transparent font-body tracking-sm web:placeholder:text-typography-400 web:placeholder:font-body web:placeholder:tracking-sm web:data-[disabled=true]:cursor-not-allowed',

  variants: {
    size: {
      xl: 'text-xl leading-6',
      lg: 'text-lg leading-6',
      md: 'text-base leading-5',
      sm: 'text-sm leading-5',
    },
    isDisabled: {
      true: 'opacity-40',
    },
  },
});

type IInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIInput>,
  'context'
> &
  VariantProps<typeof inputStyle> & { className?: string };

const Input = React.forwardRef<React.ElementRef<typeof UIInput>, IInputProps>(
  ({ className, variant = 'outline', size = 'md', ...props }, ref) => {
    return (
      <UIInput
        ref={ref}
        {...props}
        className={inputStyle({ variant, size, class: className })}
        context={{ variant, size }}
      />
    );
  }
);

type IInputSlotProps = React.ComponentPropsWithoutRef<typeof UIInput.Slot> & {
  className?: string;
};

const InputSlot = React.forwardRef<
  React.ElementRef<typeof UIInput.Slot>,
  IInputSlotProps
>(function InputSlot({ className, ...props }, ref) {
  return <UIInput.Slot ref={ref} {...props} className={className} />;
});

type IInputFieldProps = React.ComponentPropsWithoutRef<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<
  React.ElementRef<typeof UIInput.Input>,
  IInputFieldProps
>(({ className, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIInput.Input
      ref={ref}
      {...props}
      className={inputFieldStyle({
        parentVariants: { size: parentSize },
        class: className,
      })}
    />
  );
});

type IInputIconProps = React.ComponentPropsWithoutRef<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const InputIcon = React.forwardRef<
  React.ElementRef<typeof UIInput.Icon>,
  IInputIconProps
>(({ className, size, ...props }, ref) => {
  const {
    size: parentSize,
  } = useStyleContext(SCOPE);

  if (typeof size === 'number') {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIInput.Icon
        ref={ref}
        {...props}
        className={inputIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIInput.Icon
      ref={ref}
      {...props}
      className={inputIconStyle({
        parentVariants: { size: parentSize },
        size,
        class: className,
      })}
    />
  );
});

Input.displayName = 'Input';
InputSlot.displayName = 'InputSlot';
InputField.displayName = 'InputField';
InputIcon.displayName = 'InputIcon';

export { Input, InputSlot, InputField, InputIcon };

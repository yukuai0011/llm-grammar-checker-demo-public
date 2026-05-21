'use client';
import React from 'react';
import { createTextarea } from '@gluestack-ui/core/textarea/creator';
import {
  tva,
  withStyleContext,
  useStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { TextInput, View, type TextInputProps } from 'react-native';

const SCOPE = 'TEXTAREA';

const UITextarea = createTextarea({
  Root: withStyleContext(View, SCOPE),
  Input: TextInput,
});

cssInterop(UITextarea.Input, { className: 'style' });

const textareaStyle = tva({
  base: 'rounded border-background-300 bg-background-50 data-[hover=true]:border-background-400 data-[focus=true]:border-primary-700 data-[focus=true]:data-[hover=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:bg-background-50 data-[disabled=true]:data-[hover=true]:border-background-300 overflow-hidden',

  variants: {
    size: {
      xl: '',
      lg: '',
      md: '',
      sm: '',
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

const textareaInputStyle = tva({
  base: 'p-3 web:cursor-text web:outline-none web:outline-0 bg-transparent text-typography-900 font-body tracking-sm web:placeholder:text-typography-400 web:placeholder:font-body web:placeholder:tracking-sm web:data-[disabled=true]:cursor-not-allowed',

  variants: {
    size: {
      xl: 'text-xl leading-7',
      lg: 'text-lg leading-7',
      md: 'text-base leading-6',
      sm: 'text-sm leading-5',
    },
    isDisabled: {
      true: 'opacity-40',
    },
  },
});

type ITextareaProps = Omit<
  React.ComponentPropsWithoutRef<typeof UITextarea>,
  'context'
> &
  VariantProps<typeof textareaStyle> & { className?: string };

const Textarea = React.forwardRef<
  React.ElementRef<typeof UITextarea>,
  ITextareaProps
>(({ className, variant = 'outline', size = 'md', ...props }, ref) => {
  return (
    <UITextarea
      ref={ref}
      {...props}
      className={textareaStyle({ variant, size, class: className })}
      context={{ variant, size }}
    />
  );
});

type ITextareaInputProps = React.ComponentPropsWithoutRef<
  typeof UITextarea.Input
> &
  VariantProps<typeof textareaInputStyle> & { className?: string };

const TextareaInput = React.forwardRef<
  React.ElementRef<typeof UITextarea.Input>,
  ITextareaInputProps
>(({ className, ...props }, ref) => {
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  return (
    <UITextarea.Input
      ref={ref}
      {...props}
      className={textareaInputStyle({
        parentVariants: { size: parentSize },
        class: className,
      })}
    />
  );
});

Textarea.displayName = 'Textarea';
TextareaInput.displayName = 'TextareaInput';

export { Textarea, TextareaInput };

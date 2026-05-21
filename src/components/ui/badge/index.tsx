'use client';
import React from 'react';
import { createBadge } from '@gluestack-ui/core/badge/creator';
import {
  tva,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { View, Text } from 'react-native';

const UIBadge = createBadge({
  Root: View,
  Text: Text,
  Icon: View,
});

cssInterop(UIBadge, { className: 'style' });
cssInterop(UIBadge.Text, { className: 'style' });
cssInterop(UIBadge.Icon, { className: 'style' });

const badgeStyle = tva({
  base: 'flex-row items-center rounded-sm px-2 py-0.5 self-start',

  variants: {
    action: {
      primary:
        'bg-primary-100 data-[hover=true]:bg-primary-200 data-[active=true]:bg-primary-300',
      secondary:
        'bg-secondary-100 data-[hover=true]:bg-secondary-200 data-[active=true]:bg-secondary-300',
      positive:
        'bg-success-100 data-[hover=true]:bg-success-200 data-[active=true]:bg-success-300',
      negative:
        'bg-error-100 data-[hover=true]:bg-error-200 data-[active=true]:bg-error-300',
      warning:
        'bg-warning-100 data-[hover=true]:bg-warning-200 data-[active=true]:bg-warning-300',
      muted:
        'bg-background-200 data-[hover=true]:bg-background-300 data-[active=true]:bg-background-400',
    },
    size: {
      sm: 'px-1.5 py-0.5',
      md: 'px-2 py-0.5',
      lg: 'px-3 py-1',
    },
    variant: {
      solid: '',
      outline: 'bg-transparent border',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'solid',
      class:
        'bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700',
    },
    {
      action: 'secondary',
      variant: 'solid',
      class:
        'bg-secondary-500 data-[hover=true]:bg-secondary-600 data-[active=true]:bg-secondary-700',
    },
    {
      action: 'positive',
      variant: 'solid',
      class:
        'bg-success-500 data-[hover=true]:bg-success-600 data-[active=true]:bg-success-700',
    },
    {
      action: 'negative',
      variant: 'solid',
      class:
        'bg-error-500 data-[hover=true]:bg-error-600 data-[active=true]:bg-error-700',
    },
    {
      action: 'warning',
      variant: 'solid',
      class:
        'bg-warning-500 data-[hover=true]:bg-warning-600 data-[active=true]:bg-warning-700',
    },
    {
      action: 'muted',
      variant: 'solid',
      class:
        'bg-background-600 data-[hover=true]:bg-background-700 data-[active=true]:bg-background-800',
    },
    {
      action: 'primary',
      variant: 'outline',
      class:
        'border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500',
    },
    {
      action: 'secondary',
      variant: 'outline',
      class:
        'border-secondary-300 data-[hover=true]:border-secondary-400 data-[active=true]:border-secondary-500',
    },
    {
      action: 'positive',
      variant: 'outline',
      class:
        'border-success-300 data-[hover=true]:border-success-400 data-[active=true]:border-success-500',
    },
    {
      action: 'negative',
      variant: 'outline',
      class:
        'border-error-300 data-[hover=true]:border-error-400 data-[active=true]:border-error-500',
    },
    {
      action: 'warning',
      variant: 'outline',
      class:
        'border-warning-300 data-[hover=true]:border-warning-400 data-[active=true]:border-warning-500',
    },
    {
      action: 'muted',
      variant: 'outline',
      class:
        'border-background-300 data-[hover=true]:border-background-400 data-[active=true]:border-background-500',
    },
  ],
});

const badgeTextStyle = tva({
  base: 'font-body tracking-sm self-start web:select-none',

  variants: {
    action: {
      primary: 'text-primary-700 data-[hover=true]:text-primary-800 data-[active=true]:text-primary-900',
      secondary: 'text-secondary-700 data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-900',
      positive: 'text-success-700 data-[hover=true]:text-success-800 data-[active=true]:text-success-900',
      negative: 'text-error-700 data-[hover=true]:text-error-800 data-[active=true]:text-error-900',
      warning: 'text-warning-700 data-[hover=true]:text-warning-800 data-[active=true]:text-warning-900',
      muted: 'text-background-700 data-[hover=true]:text-background-800 data-[active=true]:text-background-900',
    },
    size: {
      sm: 'text-2xs',
      md: 'text-xs',
      lg: 'text-sm',
    },
    variant: {
      solid: '',
      outline: '',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'solid',
      class: 'text-primary-50 data-[hover=true]:text-primary-50 data-[active=true]:text-primary-50',
    },
    {
      action: 'secondary',
      variant: 'solid',
      class: 'text-secondary-50 data-[hover=true]:text-secondary-50 data-[active=true]:text-secondary-50',
    },
    {
      action: 'positive',
      variant: 'solid',
      class: 'text-success-50 data-[hover=true]:text-success-50 data-[active=true]:text-success-50',
    },
    {
      action: 'negative',
      variant: 'solid',
      class: 'text-error-50 data-[hover=true]:text-error-50 data-[active=true]:text-error-50',
    },
    {
      action: 'warning',
      variant: 'solid',
      class: 'text-warning-50 data-[hover=true]:text-warning-50 data-[active=true]:text-warning-50',
    },
    {
      action: 'muted',
      variant: 'solid',
      class: 'text-background-50 data-[hover=true]:text-background-50 data-[active=true]:text-background-50',
    },
  ],
});

const badgeIconStyle = tva({
  base: 'fill-none',

  variants: {
    action: {
      primary: 'text-primary-700 data-[hover=true]:text-primary-800 data-[active=true]:text-primary-900',
      secondary: 'text-secondary-700 data-[hover=true]:text-secondary-800 data-[active=true]:text-secondary-900',
      positive: 'text-success-700 data-[hover=true]:text-success-800 data-[active=true]:text-success-900',
      negative: 'text-error-700 data-[hover=true]:text-error-800 data-[active=true]:text-error-900',
      warning: 'text-warning-700 data-[hover=true]:text-warning-800 data-[active=true]:text-warning-900',
      muted: 'text-background-700 data-[hover=true]:text-background-800 data-[active=true]:text-background-900',
    },
    size: {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    },
    variant: {
      solid: '',
      outline: '',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'solid',
      class: 'text-primary-50 data-[hover=true]:text-primary-50 data-[active=true]:text-primary-50',
    },
    {
      action: 'secondary',
      variant: 'solid',
      class: 'text-secondary-50 data-[hover=true]:text-secondary-50 data-[active=true]:text-secondary-50',
    },
    {
      action: 'positive',
      variant: 'solid',
      class: 'text-success-50 data-[hover=true]:text-success-50 data-[active=true]:text-success-50',
    },
    {
      action: 'negative',
      variant: 'solid',
      class: 'text-error-50 data-[hover=true]:text-error-50 data-[active=true]:text-error-50',
    },
    {
      action: 'warning',
      variant: 'solid',
      class: 'text-warning-50 data-[hover=true]:text-warning-50 data-[active=true]:text-warning-50',
    },
    {
      action: 'muted',
      variant: 'solid',
      class: 'text-background-50 data-[hover=true]:text-background-50 data-[active=true]:text-background-50',
    },
  ],
});

type IBadgeProps = React.ComponentPropsWithoutRef<typeof UIBadge> &
  VariantProps<typeof badgeStyle> & { className?: string };

const Badge = React.forwardRef<React.ElementRef<typeof UIBadge>, IBadgeProps>(
  ({ className, variant = 'solid', size = 'md', action = 'primary', ...props }, ref) => {
    return (
      <UIBadge
        ref={ref}
        {...props}
        className={badgeStyle({ variant, size, action, class: className })}
      />
    );
  }
);

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof UIBadge.Text> &
  VariantProps<typeof badgeTextStyle> & { className?: string };

const BadgeText = React.forwardRef<
  React.ElementRef<typeof UIBadge.Text>,
  IBadgeTextProps
>(({ className, variant, size, action, ...props }, ref) => {
  return (
    <UIBadge.Text
      ref={ref}
      {...props}
      className={badgeTextStyle({ variant, size, action, class: className })}
    />
  );
});

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof UIBadge.Icon> &
  VariantProps<typeof badgeIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const BadgeIcon = React.forwardRef<
  React.ElementRef<typeof UIBadge.Icon>,
  IBadgeIconProps
>(({ className, size, ...props }, ref) => {
  if (typeof size === 'number') {
    return (
      <UIBadge.Icon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIBadge.Icon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIBadge.Icon
      ref={ref}
      {...props}
      className={badgeIconStyle({ size, class: className })}
    />
  );
});

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';
BadgeIcon.displayName = 'BadgeIcon';

export { Badge, BadgeText, BadgeIcon };

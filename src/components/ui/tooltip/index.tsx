'use client';
import React from 'react';
import { createTooltip } from '@gluestack-ui/core/tooltip/creator';
import {
  tva,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { Pressable, View, Text } from 'react-native';

const UITooltip = createTooltip({
  Root: View,
  Content: View,
  Text: Text,
  Arrow: View,
});

cssInterop(UITooltip, { className: 'style' });
cssInterop(UITooltip.Content, { className: 'style' });
cssInterop(UITooltip.Text, { className: 'style' });
cssInterop(UITooltip.Arrow, { className: 'style' });

const tooltipStyle = tva({
  base: 'group/tooltip',
});

const tooltipContentStyle = tva({
  base: 'rounded-sm bg-background-900 px-3 py-2 shadow-hard-5 web:outline-none',

  variants: {
    placement: {
      top: 'bottom-1',
      bottom: 'top-1',
      left: 'right-1',
      right: 'left-1',
      'top left': 'bottom-1',
      'top right': 'bottom-1',
      'bottom left': 'top-1',
      'bottom right': 'top-1',
      'left top': 'right-1',
      'left bottom': 'right-1',
      'right top': 'left-1',
      'right bottom': 'left-1',
    },
  },
});

const tooltipTextStyle = tva({
  base: 'font-body tracking-sm text-typography-0 web:select-none web:pointer-events-none',
});

const tooltipArrowStyle = tva({
  base: 'bg-background-900 z-10',

  variants: {
    placement: {
      top: 'bottom-0 rotate-180',
      bottom: 'top-0',
      left: 'right-0 rotate-90',
      right: 'left-0 -rotate-90',
      'top left': 'bottom-0 rotate-180',
      'top right': 'bottom-0 rotate-180',
      'bottom left': 'top-0',
      'bottom right': 'top-0',
      'left top': 'right-0 rotate-90',
      'left bottom': 'right-0 rotate-90',
      'right top': 'left-0 -rotate-90',
      'right bottom': 'left-0 -rotate-90',
    },
  },
});

type ITooltipProps = React.ComponentPropsWithoutRef<typeof UITooltip> &
  VariantProps<typeof tooltipStyle> & { className?: string };

const Tooltip = React.forwardRef<React.ElementRef<typeof UITooltip>, ITooltipProps>(
  ({ className, ...props }, ref) => {
    return (
      <UITooltip
        ref={ref}
        {...props}
        className={tooltipStyle({ class: className })}
      />
    );
  }
);

type ITooltipContentProps = React.ComponentPropsWithoutRef<
  typeof UITooltip.Content
> &
  VariantProps<typeof tooltipContentStyle> & { className?: string };

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof UITooltip.Content>,
  ITooltipContentProps
>(({ className, placement = 'bottom', ...props }, ref) => {
  return (
    <UITooltip.Content
      ref={ref}
      {...props}
      className={tooltipContentStyle({ placement, class: className })}
    />
  );
});

type ITooltipTextProps = React.ComponentPropsWithoutRef<
  typeof UITooltip.Text
> &
  VariantProps<typeof tooltipTextStyle> & { className?: string };

const TooltipText = React.forwardRef<
  React.ElementRef<typeof UITooltip.Text>,
  ITooltipTextProps
>(({ className, ...props }, ref) => {
  return (
    <UITooltip.Text
      ref={ref}
      {...props}
      className={tooltipTextStyle({ class: className })}
    />
  );
});

type ITooltipArrowProps = React.ComponentPropsWithoutRef<
  typeof UITooltip.Arrow
> &
  VariantProps<typeof tooltipArrowStyle> & { className?: string };

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof UITooltip.Arrow>,
  ITooltipArrowProps
>(({ className, placement = 'bottom', ...props }, ref) => {
  return (
    <UITooltip.Arrow
      ref={ref}
      {...props}
      className={tooltipArrowStyle({ placement, class: className })}
    />
  );
});

Tooltip.displayName = 'Tooltip';
TooltipContent.displayName = 'TooltipContent';
TooltipText.displayName = 'TooltipText';
TooltipArrow.displayName = 'TooltipArrow';

export { Tooltip, TooltipContent, TooltipText, TooltipArrow };

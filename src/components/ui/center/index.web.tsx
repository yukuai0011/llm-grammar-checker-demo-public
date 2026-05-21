import React from 'react';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { centerStyle } from './styles';

type ICenterProps = React.ComponentProps<'div'> &
  VariantProps<typeof centerStyle>;

const Center = React.forwardRef<React.ComponentRef<'div'>, ICenterProps>(
  function Center({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={centerStyle({ class: className })}
      />
    );
  }
);

Center.displayName = 'Center';
export { Center };

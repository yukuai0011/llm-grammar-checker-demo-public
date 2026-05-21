import React, { forwardRef, memo } from 'react';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { iconStyle } from './styles';

type IIconProps = React.ComponentProps<'svg'> &
  VariantProps<typeof iconStyle> & {
    as?: React.ElementType;
  };

const Icon = memo(
  forwardRef<React.ComponentRef<'svg'>, IIconProps>(function Icon(
    { className, as: AsComp, size = 'md', ...props },
    ref
  ) {
    if (AsComp) {
      return (
        <AsComp
          ref={ref}
          className={iconStyle({ size, class: className })}
          {...props}
        />
      );
    }

    return (
      <svg
        ref={ref}
        className={iconStyle({ size, class: className })}
        {...props}
      />
    );
  })
);

Icon.displayName = 'Icon';

export { Icon };

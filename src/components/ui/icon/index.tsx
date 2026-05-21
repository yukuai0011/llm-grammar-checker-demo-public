import React, { forwardRef, memo } from 'react';
import type { SvgProps } from 'react-native-svg';
import { Svg } from 'react-native-svg';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { iconStyle } from './styles';
import { cssInterop } from 'nativewind';

cssInterop(Svg, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      // @ts-expect-error : color is not a valid style prop
      color: true,
    },
  },
});

type IIconProps = SvgProps &
  VariantProps<typeof iconStyle> & {
    height?: number | string;
    width?: number | string;
    className?: string;
    as?: React.ElementType;
  };

const Icon = memo(
  forwardRef<React.ComponentRef<typeof Svg>, IIconProps>(function Icon(
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
      <Svg
        ref={ref}
        className={iconStyle({ size, class: className })}
        {...props}
      />
    );
  })
);

Icon.displayName = 'Icon';

export { Icon };

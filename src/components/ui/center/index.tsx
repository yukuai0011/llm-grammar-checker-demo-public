import React from 'react';
import { View } from 'react-native';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { centerStyle } from './styles';

type ICenterProps = React.ComponentProps<typeof View> &
  VariantProps<typeof centerStyle>;

const Center = React.forwardRef<React.ComponentRef<typeof View>, ICenterProps>(
  function Center({ className, ...props }, ref) {
    return (
      <View
        ref={ref}
        {...props}
        className={centerStyle({ class: className })}
      />
    );
  }
);

Center.displayName = 'Center';
export { Center };

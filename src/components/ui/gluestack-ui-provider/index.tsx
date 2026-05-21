import React from 'react';
import { config } from './config';
import { VariableProvider } from 'nativewind';

type Mode = 'light' | 'dark' | 'system';

interface GluestackUIProviderProps {
  mode?: Mode;
  children: React.ReactNode;
}

export function GluestackUIProvider({
  mode = 'light',
  children,
}: GluestackUIProviderProps) {
  return (
    <VariableProvider
      variables={mode === 'dark' ? config.dark : config.light}
      style={{
        flex: 1,
      }}
    >
      {children}
    </VariableProvider>
  );
}

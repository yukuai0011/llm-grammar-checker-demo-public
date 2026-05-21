import React from 'react';
import { View } from 'react-native';
import { config } from './config';

type Mode = 'light' | 'dark' | 'system';

interface GluestackUIProviderProps {
  mode?: Mode;
  children: React.ReactNode;
}

export function GluestackUIProvider({
  mode = 'light',
  children,
}: GluestackUIProviderProps) {
  const variables = mode === 'dark' ? config.dark : config.light;

  return (
    <View style={[variables, { flex: 1 }]}>
      {children}
    </View>
  );
}

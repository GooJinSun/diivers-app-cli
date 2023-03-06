import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebViewScreen } from '@screens';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <WebViewScreen />
    </SafeAreaProvider>
  );
};

export default React.memo(App);

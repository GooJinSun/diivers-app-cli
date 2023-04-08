import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEBVIEW_CONSTS } from '@constants';
import { useWebView } from '@hooks';

export type AppScreenProps = {
  url?: string;
};

const AppScreen: React.FC<AppScreenProps> = ({ url = '/home' }) => {
  const { ref, onMessage, postMessage } = useWebView();

  useEffect(() => {
    if (!url) return;
    postMessage('REDIRECT', url);
  }, [postMessage, url]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        ref={ref}
        onMessage={onMessage}
        source={{ uri: WEBVIEW_CONSTS.WEB_VIEW_URL.PROD }}
        decelerationRate="normal"
        javaScriptEnabled
        injectedJavaScript={WEBVIEW_CONSTS.WEB_VIEW_DEBUGGING_SCRIPT}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
};

export default {
  Component: AppScreen,
};

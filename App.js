import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WEB_VIEW_DEBUGGING_SCRIPT } from './src/constants/webview';
import useAppStateActiveEffect from './src/hooks/useAppStateActiveEffect';
import { useWebView, useAsyncEffect } from './src/hooks';
import { TokenStorage } from './src/tools/tokenStorage';
import BootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import { FirebaseNotification } from './src/libs';

// const WEB_VIEW_URL = 'http://192.168.0.108:3000';
const WEB_VIEW_URL = 'https://diivers.world';

const App = () => {
  const backgroundStyle = {
    backgroundColor: Colors.WebView,
    flex: 1,
  };

  const {
    ref,
    postMessage,
    onLoadProgress,
    onMessage,
    onShouldStartLoadWithRequest,
  } = useWebView();

  useAsyncEffect(
    useCallback(async () => {
      const token = await TokenStorage.getToken();
      return postMessage('SET_TOKEN', token);
    }, [postMessage]),
  );

  useAsyncEffect(
    useCallback(async () => {
      await FirebaseNotification.initialize();
      await FirebaseNotification.requestUserPermission();
    }, []),
  );

  useAppStateActiveEffect(
    useCallback(async () => {
      const token = await TokenStorage.getToken();
      if (token) {
        await BootSplash.hide({ fade: true });
        postMessage('SET_TOKEN', token);
      }
    }, [postMessage]),
    [],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <WebView
        ref={ref}
        onMessage={onMessage}
        onLoadProgress={onLoadProgress}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        source={{ uri: WEB_VIEW_URL }}
        startInLoadingState
        javaScriptEnabled
        injectedJavaScript={WEB_VIEW_DEBUGGING_SCRIPT}
        originWhitelist={['*']}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default App;

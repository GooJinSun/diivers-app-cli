import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WEB_VIEW_DEBUGGING_SCRIPT } from './src/constants/webview.constants';
import useAppStateActiveEffect from './src/hooks/useAppStateActiveEffect';
import { useAsyncEffect } from './src/hooks/useAsyncEffect';
import useWebView from './src/hooks/useWebView';
import { TokenStorage } from './src/tools/tokenStorage';
import BootSplash from 'react-native-bootsplash';

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

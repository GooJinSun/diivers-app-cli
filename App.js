import React, { useCallback, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WEB_VIEW_DEBUGGING_SCRIPT } from './src/constants/webview.constants';
import useAppStateActiveEffect from './src/hooks/useAppStateActiveEffect';
import { useAsyncEffect } from './src/hooks/useAsyncEffect';
import useWebView from './src/hooks/useWebView';
import { TokenStorage } from './src/tools/tokenStorage';

// const WEB_VIEW_URL = 'https://adoor.world';
const WEB_VIEW_URL = 'http://localhost:3000';
// const WEB_VIEW_URL = 'https://divers.world';

const App = () => {
  const backgroundStyle = {
    backgroundColor: Colors.WebView,
    flex: 1,
  };

  const [key, setKey] = useState(0);

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
      return postMessage(token);
    }, [postMessage]),
  );

  useAppStateActiveEffect(
    useCallback(async () => {
      const token = await TokenStorage.getToken();
      postMessage(token);
    }, [postMessage]),
    [],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <WebView
        ref={ref}
        key={key}
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

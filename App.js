import React, { useRef } from 'react';
import type { Node } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { useAsyncEffect } from './src/tools/useAsyncEffect';
import { WebBrowser } from 'expo-web-browser';
import useMessage from './src/tools/useMessage';

const App: () => Node = () => {
  const backgroundStyle = {
    backgroundColor: Colors.WebView,
    flex: 1,
  };
  const { getMessageFromWebview, sendMessageToWebview } = useMessage;

  let webViewRef = useRef(null);

  const handleSetRef = (ref) => {
    webViewRef = ref;
  };

  const getToken = async () => {
    const data = await AsyncStorage.getItem('TOKEN');
    return data !== null ? JSON.parse(data) : null;
  };

  useAsyncEffect(async () => {
    // 만약 token이 있으면 webview로 보내주기
    if (!webViewRef) return;
    const token = await getToken();
    if (token) sendMessageToWebview(token, webViewRef);
  }, [webViewRef]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <WebView
        onMessage={getMessageFromWebview}
        injectedJavaScript={debugging}
        ref={webViewRef}
        source={{ uri: 'http://localhost:3000' }}
        // source={{ uri: 'https://adoor.world' }}
        handleSetRef={handleSetRef}
      />
    </SafeAreaView>
  );
};

export default App;

const debugging = `
            const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': log}));
            console = {
                log: (log) => consoleLog('log', log),
                debug: (log) => consoleLog('debug', log),
                info: (log) => consoleLog('info', log),
                warn: (log) => consoleLog('warn', log),
                error: (log) => consoleLog('error', log),
              };
          `;

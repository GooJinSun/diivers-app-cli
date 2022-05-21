import React from 'react';
import type { Node } from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
import * as WebBrowser from 'expo-web-browser';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.WebView,
    flex: 1,
  };

  const handleNativeEvent = async (event: WebViewMessageEvent) => {
    // Function that is invoked when the webview calls
    const data = JSON.parse(event.nativeEvent.data);

    // 웹에서의 console.log를 앱 터미널에서도 볼 수 있도록
    if (data) {
      if (data.type === 'Console') {
        console.info(`[Console From Webview] ${JSON.stringify(data.data)}`);
      } else {
        console.log(data);
      }
    }

    switch (data.actionType) {
      // 브라우저 따로 열어야할 때 (ex. 개인정보처리방침 등)
      case 'OPEN_BROWSER':
        return WebBrowser.openBrowserAsync(data.url);
      // NOTE: 로컬 스토리지 관리
      case 'SET_ASYNC_STORAGE':
        if (typeof data.value === 'string') {
          await AsyncStorage.setItem(data.key, data.value);
        } else {
          await AsyncStorage.setItem(data.key, JSON.stringify(data.value));
        }
        break;
      default:
        return;
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WebView
        onMessage={handleNativeEvent}
        ref={(webView) => (this.webView = webView)}
        onLoadProgress={(e: WebViewMessageEvent) => {
          // Function that is invoked when the WebView is loading.
        }}
        source={{ uri: 'https://adoor.world' }}
        onContentProcessDidTerminate={() => {
          // Function that is invoked when the WebKit WebView content process gets terminated.
          try {
            this.webview.reload();
          } catch (e) {
            this._reload();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default App;

import React, { useRef } from 'react';
import type { Node } from 'react';
import { Button, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';
import * as WebBrowser from 'expo-web-browser';

const App: () => Node = () => {
  const backgroundStyle = {
    backgroundColor: Colors.WebView,
    flex: 1,
  };

  let webViewRef = useRef(null);

  const handleSetRef = (ref) => {
    webViewRef = ref;
  };

  const handleNativeEvent = async ({ nativeEvent: { data } }) => {
    console.log(data);
    // Function that is invoked when the webview calls
    const _data = JSON.parse(data);

    // 웹에서의 console.log를 앱 터미널에서도 볼 수 있도록
    if (_data) {
      console.log(_data);
      if (_data.type === 'Console') {
        console.info(`[Console From Webview] ${JSON.stringify(_data.data)}`);
      } else {
        console.log(_data);
      }
    }

    switch (_data.actionType) {
      // 브라우저 따로 열어야할 때 (ex. 개인정보처리방침 등)
      case 'OPEN_BROWSER':
        return WebBrowser.openBrowserAsync(_data.url);
      // NOTE: 로컬 스토리지 관리
      case 'SET_ASYNC_STORAGE':
        if (typeof _data.value === 'string') {
          await AsyncStorage.setItem(_data.key, _data.value);
        } else {
          await AsyncStorage.setItem(_data.key, JSON.stringify(_data.value));
        }
        break;
      default:
        return;
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar />
      <WebView
        onMessage={handleNativeEvent}
        ref={webViewRef}
        source={{ uri: 'http://localhost:3000' }}
        // source={{ uri: 'https://adoor.world' }}
        handleSetRef={handleSetRef}
      />
      <Button
        onPress={() => {
          console.log('send message');
          webViewRef.current.postMessage('RN으로부터 보내는 메시지');
        }}
        title={'버튼'}
      />
    </SafeAreaView>
  );
};

export default App;

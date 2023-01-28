import React, { useCallback } from 'react';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { WEB_VIEW_DEBUGGING_SCRIPT } from './src/constants/webview';
import useAppStateActiveEffect from './src/hooks/useAppStateActiveEffect';
import { useWebView, useAsyncEffect } from './src/hooks';
import { TokenStorage, FcmTokenStorage } from './src/tools';

import BootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import { FirebaseNotification } from './src/libs';
import { fcmApis } from './src/apis';

const WEB_VIEW_URL = 'http://192.168.0.159:3000';
// const WEB_VIEW_URL = 'https://diivers.world';

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
      //TODO(Gina): 나중에 이 부분 지우기
      await FirebaseNotification.checkToken();
    }, []),
  );

  const handleRegisterFCMToken = useCallback(async (fcmToken, isActive) => {
    if (!fcmToken) return;
    await fcmApis.registerFCMToken({
      type: Platform.OS,
      registration_id: fcmToken,
      active: isActive,
    });
    await FcmTokenStorage.setToken({
      fcmToken,
    });
  }, []);

  useAppStateActiveEffect(
    useCallback(async () => {
      const { access, refresh } = await TokenStorage.getToken();
      await BootSplash.hide({ fade: true });
      const { fcmToken } = await FcmTokenStorage.getToken();
      if (!access && !refresh) {
        return handleRegisterFCMToken(fcmToken, false);
      }
      postMessage('SET_TOKEN', {
        access,
        refresh,
      });
      await handleRegisterFCMToken(fcmToken, true);
    }, [postMessage, handleRegisterFCMToken]),
    [],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle="white-content" />
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
      />
    </SafeAreaView>
  );
};

export default App;

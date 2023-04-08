import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEBVIEW_CONSTS } from '@constants';
import { TokenStorage, FcmTokenStorage, registerFCMToken } from '@tools';
import { useAppStateEffect, useWebView } from '@hooks';

export type AppScreenProps = {
  // add props
};

const AppScreen: React.FC<AppScreenProps> = () => {
  const { ref, postMessage, onMessage } = useWebView();

  useAppStateEffect(
    useCallback(
      async (state) => {
        if (state === 'active' || state === 'unknown') {
          // 로컬 스토리지에서 토큰 확인
          const token = await TokenStorage.getToken();
          postMessage('SET_TOKEN', token);

          // 로컬 스토리지에서 FCM 토큰 확인 -> 있으면 api 등록
          const { fcmToken } = await FcmTokenStorage.getToken();
          if (!fcmToken || !token.access || !token.refresh) return;
          await registerFCMToken(fcmToken, true);
        }
      },
      [postMessage],
    ),
    [],
  );

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

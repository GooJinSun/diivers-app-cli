import { useCallback, useRef, useState } from 'react';
import { openBrowserAsync } from 'expo-web-browser';
import { WebViewMessageEvent } from 'react-native-webview';
import { WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import { TokenStorage } from '../tools/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWebView = () => {
  const [loadProgress, setLoadProgress] = useState(0);
  const ref = useRef(null);

  const postMessage = useCallback(
    (data: any) => ref.current?.postMessage(JSON.stringify(data)),
    [ref],
  );

  /**
   * 웹뷰에서 오는 요청 처리
   */
  const onMessage = useCallback(async (event: WebViewMessageEvent) => {
    const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
    if (!('actionType' in data)) return;

    console.log('[onMessage]', data);

    if (data.actionType === 'CONSOLE') console.log(data.data);

    switch (data.actionType) {
      case 'OPEN_BROWSER':
        openBrowserAsync(data.url);
        return;
      case 'SET_TOKEN': {
        console.log('[data.token]', data.token);
        const { refresh = '', access = '' } = data.token;
        console.log('[refresh]', refresh);

        await TokenStorage.setToken({
          refresh,
          access,
        });
        return;
      }
      case 'SET_ASYNC_STORAGE':
        if (typeof data.value === 'string') {
          await AsyncStorage.setItem(data.key, data.value);
        } else {
          await AsyncStorage.setItem(data.key, JSON.stringify(data.value));
        }
        break;
      case 'REMOVE_ASYNC_STORAGE':
        await AsyncStorage.removeItem(data.key);
        break;
      case 'CLEAR_ASYNC_STORAGE':
        await AsyncStorage.clear();
        break;
      default:
        return;
    }
  }, []);

  const onLoadProgress = useCallback((e: WebViewProgressEvent) => {
    setLoadProgress(e.nativeEvent.progress);
  }, []);

  return {
    ref,
    loadProgress,
    onMessage,
    onLoadProgress,
    postMessage,
  };
};

export default useWebView;

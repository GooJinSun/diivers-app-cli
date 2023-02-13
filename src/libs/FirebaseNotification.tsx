import { APP_CONSTS } from '../constants';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import LocalNotification from './LocalNotification';
import { Alert, Linking } from 'react-native';
// import { useWebView } from '../hooks';

// const NavigationHandler = ({
//   event,
// }: {
//   event: {
//     notification: any;
//     data: any;
//   };
// }) => {
//   const { postMessage } = useWebView();
//   const { notification, data } = event;
//   if (!notification) return;
//   if (!data || !data.url) return;
//   postMessage('ROUTE', { url: data.url });
// };

export default (() => {
  let isInitialized = false;
  let token: null | string = null;

  /**
   * getToken
   */
  const getToken = async () => {
    token = await messaging().getToken();
    return token;
  };

  /**
   * checkToken
   */
  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(`[FirebaseNotification] your token is ${fcmToken}`);
    }
  };

  /**
   * navigate
   * event 정보 안에 담겨있는 정보로 webview 안에서 navigate
   */
  // const navigate = (event: any) => {
  //   return NavigationHandler({ event });
  // };

  /**
   * initialize
   */
  const initialize = async () => {
    if (isInitialized) return;

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      console.log('[FirebaseNotification] registerDeviceForRemoteMessages');
      messaging().registerDeviceForRemoteMessages();
    }

    messaging().onNotificationOpenedApp((event: any) => {
      console.log('[FirebaseNotification] onNotificationOpenedApp', event);
      // navigate(event);
    });

    messaging().onMessage(handleOnMessage);

    console.log(
      '[FirebaseNotification] start listening remote notification events 👀',
    );

    isInitialized = true;
  };

  /**
   * handleOnMessage
   * IOS: foreground 상태에서도 푸시 노티가 발생함
   * Android: 발생하지 않아서 로컬 노티를 즉시 띄워줌
   */
  const handleOnMessage = async (
    event: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    console.log('[FirebaseNotification] handle on message', event);

    const { notification, data } = event;

    if (!notification) return;

    const title = notification.title || '';
    const body = notification.body || '';

    return LocalNotification.immediate({
      title,
      body,
      data,
    });

    // navigate(event);
  };

  /**
   * getInitialNotification
   */
  const getInitialNotification = () => messaging().getInitialNotification();

  /**
   * requestUserPermission
   */
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert(
        '알림 설정',
        '알림 권한 설정은 휴대폰 설정에서 변경 가능합니다.',
        [
          {
            text: '닫기',
            style: 'cancel',
          },
          {
            text: '설정으로 이동',
            onPress: () => {
              if (APP_CONSTS.IS_ANDROID) Linking.openURL('App-Prefs:root');
              else Linking.openURL('app-settings:');
            },
            style: 'default',
          },
        ],
      );
    }

    console.log(
      '[FirebaseNotification] requestPermission authStatus is ',
      authStatus,
    );

    return { enabled };
  };

  return {
    initialize,
    getToken,
    checkToken,
    // navigate,
    getInitialNotification,
    requestUserPermission,
  };
})();

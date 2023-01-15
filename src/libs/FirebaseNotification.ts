import { APP_CONSTS } from '../constants';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import LocalNotification from './LocalNotification';
import { Alert, Linking, NativeModules } from 'react-native';

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

    /**
     * IOS: 푸시를 누른 시점에 발생하는 이벤트라 바로 네비게이팅
     * Android: 푸시가 발생한 시점에 발생하는 이벤트 & 실제 푸시는 보이지 않기 때문에 로컬 노티로 복사하여 보여줌.
     * 이후 로컬 노티를 누르면 네비게이팅
     */
    if (APP_CONSTS.IS_ANDROID) {
      return LocalNotification.immediate({
        title: notification.title || '',
        body: notification.body || '',
        data,
      });
    }

    //TODO(Gina): 메시지를 누르면 어떻게 할건지 추가 function 추가 (URL 이동 등)
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
              else NativeModules.OpenExternalURLModule.linkAndroidSettings();
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
    getInitialNotification,
    requestUserPermission,
  };
})();

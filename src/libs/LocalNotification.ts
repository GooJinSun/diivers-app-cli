import { Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  Notification,
  NotificationAndroid,
} from '@notifee/react-native';
import { APP_CONSTS } from '@constants';

export default (() => {
  const androidChallengeId = Platform.select({
    android: notifee.createChannel({
      id: 'challengers',
      name: 'challengers',
      vibration: true,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    }),
    ios: undefined,
  });

  let isInitialized = false;

  const getAndroidSettings = async (): Promise<
    NotificationAndroid | undefined
  > => {
    if (APP_CONSTS.IS_IOS) return undefined;
    return {
      channelId: await androidChallengeId,
      lightUpScreen: true,
      onlyAlertOnce: true,
      showTimestamp: true,
    };
  };

  const getNotificationSettings = async (
    title: string,
    body: string,
    data?: RouteDataType,
    thumbnail?: string,
    id?: string,
  ) => {
    const settings: Notification = {
      title,
      body,
      data,
    };

    if (APP_CONSTS.IS_IOS && thumbnail) {
      Object.assign(settings, { ios: { attachments: [{ url: thumbnail }] } });
    }

    if (APP_CONSTS.IS_ANDROID) {
      Object.assign(settings, {
        android: {
          ...(await getAndroidSettings()),
          pressAction: { id: 'default', launchActivity: 'default' },
        },
      });
    }

    if (id) Object.assign(settings, { id });

    return settings;
  };

  /**
   * 로컬 알림 즉시 실행
   *
   * @param {LocalNotification} notification
   * @example
   *
   * ```ts
   *  LocalNotification.immediate({
   *    title: '테스트 입니당',
   *    body: '하하하',
   *    data: Route.navigate('CorpTab').onFallback('SignInAndUpScreen'),
   *  });
   * ```
   */
  const immediate = async (
    notification: Omit<LocalNotification, 'date'>,
    options?: RequestPermissionOption,
  ) => {
    try {
      const { title, body, data = {} } = notification;
      await requestPermission(options || {});

      await notifee.displayNotification(
        await getNotificationSettings(title, body, data),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const cancelScheduled = async (id: string) => {
    console.log('[LocalNotification] cancel id', id);
    await notifee.cancelTriggerNotification(id);
  };

  const getIsNotificationGranted = async () => {
    const { authorizationStatus } = await notifee.getNotificationSettings();
    return authorizationStatus === 2 || authorizationStatus === 1;
  };

  const cancelMultipleScheduled = async (ids: string[]) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    console.log('[LocalNotification] cancel ids', ids);
    await notifee.cancelTriggerNotifications(ids);
    await notifee.cancelDisplayedNotifications(ids);
  };

  const cancelByIds = (ids: string[]) => notifee.cancelAllNotifications(ids);

  const cancelAll = () => notifee.cancelAllNotifications();

  const cancelDisplayedNotification = (id: string) => {
    notifee.cancelDisplayedNotification(id);
  };

  /**
   * 알림 권한 요청
   * usePopUp DENIED 상태일 때 팝업을 사용할지 옵션
   */
  const requestPermission = async ({
    usePopUp = false,
  }: RequestPermissionOption) => {
    const { authorizationStatus } = await notifee.requestPermission();

    if (usePopUp && authorizationStatus === AuthorizationStatus.DENIED) {
      // ConfirmationPopUp.show({
      //   body: '알림 권한이 필요합니다.\n설정에서 알림 권한을 허용해주세요.',
      //   noText: '취소',
      //   yesText: '이동',
      //   onPressYes: () => Linking.openURL('app-settings:'),
      // });
      throw new Error('[LocalNotification] requested permission');
    }
  };

  const initialize = () => {
    if (isInitialized) return;

    notifee.onForegroundEvent((event) => {
      console.log('[LocalNotification] foreground event', event);
      if (event.type === EventType.PRESS) {
        if (!event.detail.notification) return;
        const { data } = event.detail.notification;

        // TODO: data에 해당하는 페이지로 이동
        console.log(data);
      }
    });

    console.log('[LocalNotification] start listening notification events 👀');

    isInitialized = true;
  };

  return {
    immediate,
    cancelScheduled,
    cancelByIds,
    cancelAll,
    initialize,
    requestPermission,
    cancelDisplayedNotification,
    cancelMultipleScheduled,
    getIsNotificationGranted,
  };
})();

export type LocalNotification = {
  title: string;
  body: string;
  date: Date;
  data?: RouteDataType;
  thumbnail?: string;
} & Partial<Notification>;

type RequestPermissionOption = { usePopUp?: boolean };

type RouteDataType = Record<string, any>;

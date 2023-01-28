import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import { getVersion } from 'react-native-device-info';
import { DynamicLinkType } from '@types';

class DynamicLinks {
  /**
   * 도메인 이름 필요시 변경 가능
   */
  private static domain = 'https://diivers.page.link';

  /**
   * @param param share 정보 og 정보와 shareMessage 기반으로 링크 및 공유 텍스트 생성
   * @param route Route 정보 new Route()
   * @param useMinVersion (default: true) 버전 관리를 사용할지
   *                      첫 출시 이후로 새로 생기는 스크린은 모두 true
   * @returns
   */

  public static async createShareLink(
    {
      shareMessage,
      ogTitle = 'Diivers',
      ogImage = '',
      ogDescription = 'diivers',
    }: DynamicLinkType.ShareData,
    useMinVersion = false,
  ) {
    const shortLink = await dynamicLinks().buildShortLink(
      {
        link: 'https://diivers.world',

        domainUriPrefix: DynamicLinks.domain,

        social: {
          title: ogTitle,
          descriptionText: ogDescription,
          imageUrl: ogImage,
        },

        ios: {
          bundleId: 'me.jff.flirting',
          minimumVersion: useMinVersion ? getVersion() : undefined,
        },

        android: {
          packageName: 'me.jff.flirting',
          minimumVersion: useMinVersion ? getVersion() : undefined,
        },
      },
      dynamicLinks.ShortLinkType.SHORT,
    );

    return {
      link: shortLink,
      message: shareMessage
        ? `${shareMessage}\n${shortLink}`
        : `[${ogTitle}]\n${ogDescription}\n${shortLink}`,
    };
  }

  public static getInitialLink() {
    return dynamicLinks().getInitialLink();
  }

  public static listenLinking(
    listener: (link: FirebaseDynamicLinksTypes.DynamicLink) => void,
  ) {
    dynamicLinks().onLink(listener);
  }
}

export default DynamicLinks;

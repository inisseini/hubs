import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "../room/MediaGrid";
import { MediaTile } from "../room/MediaTiles";
import { PageContainer } from "../layout/PageContainer";
import { scaledThumbnailUrlFor } from "../../utils/media-url-utils";
import { Column } from "../layout/Column";
import { Container } from "../layout/Container";
import { SocialBar } from "../home/SocialBar";
import { SignInButton } from "./SignInButton";
import { AppLogo } from "../misc/AppLogo";
import { isHmc } from "../../utils/isHmc";
import maskEmail from "../../utils/mask-email";

import GTIELogo from '../../assets/images/gtie_rgb_02.png';
import MetaCampUsLogo from '../../assets/images/metaCampUsLogo.png';
import Menu from '../../assets/images/menu.png';
import Hero from '../../assets/images/hero.png';
import Profile from '../../assets/images/mingcute_profile-fill.png';
import Friends from '../../assets/images/fa-solid_user-friends.png';
import Nortification from '../../assets/images/Vector.png';
import MyAccount from '../../assets/images/mdi_account.png';
import LogOut from '../../assets/images/clarity_logout-solid.png';
import Entry from '../../assets/images/entry.png';
import Discord from '../../assets/images/skill-icons_discord.png';
import ProducedBy from '../../assets/images/producedby.png';
import GTIEBackground from '../../assets/images/GTIE.png';
import Glass from '../../assets/images/glass.png';
import School from '../../assets/images/school.png';
import Manual from '../../assets/images/manual.png';
import Rule from '../../assets/images/rule.png';
import Mail from '../../assets/images/mail.png';

import Entrance from '../../assets/images/EntranceWorld.png';
import SideStreet from '../../assets/images/SideStreet.png';
import Proffession from '../../assets/images/ProfessorsRoom.png';
import Audio from '../../assets/images/AudiovisualRoom.png';
import Event from '../../assets/images/EventWorld.png';
import Meeting from '../../assets/images/MeetingWorld.png';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

import { Button } from "../input/Button";
import { AvatarSettingsContent } from "../room/AvatarSettingsContent";
 
import emailjs from '@emailjs/browser';

export function HomePage() {
  const store = window.APP.store;
  store.initProfile();
  const auth = useContext(AuthContext);
  const intl = useIntl();

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const sortedFavoriteRooms = Array.from(favoriteRooms).sort((a, b) => b.member_count - a.member_count);
  const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);
  const wrapInBold = chunk => <b>{chunk}</b>;
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
  const email = auth.email;

  const [isAccountMenuOpen, setAccountMenu] = useState(false);
  const [accountContent, setAccountContent] = useState({
    profile: false,
    friends: false,
    nortification: false,
    myAccount: false,
  })

  const onSignOut = () => {

    const logOutConfirm = confirm("ログアウトしますか？")
    if(logOutConfirm) {
      auth.signOut()
    } else {
      return
    }
  }

  const [mobileMenu, setMobileMenu] = useState(false);

  const [contactOpen, setContact] = useState(false);

  const [enterDetail, setEnterDetail] = useState({
    list: false,
    manual: false,
    rule: false,
    details: false
  });

  const [worldDetail, setworldDetail] = useState({
    public: 0,
    private: 0
  });

  const [worldsDetail, setWorldsDetail] = useState({
    publicOpen: true,
    privateOpen: true,
    publicChoosen: 0,
    privateChoosen: 0
  });
  
  const form = useRef();
  const sendEmail = async (event) => {
    event.preventDefault();
    if (!form.current) return;

    const xhr = new XMLHttpRequest();

    xhr.open("POST","https://vgdr5k3cwrrk4c7ehcebdsp4he0okmgj.lambda-url.ap-northeast-1.on.aws/", true);
    xhr.setRequestHeader('content-type', 'application/json');
    const request = {"name": form.current.user_name.value, "mail": form.current.user_email.value, "message": form.current.message.value}
    xhr.send(request)
    alert("メールを送信しました。")
  }

  const [progress, setProgress] = useState(0);

  const intersectionCallback = (entries) => {
    if(entries[0].isIntersecting) {
      const key = Number(entries[0].target.dataset.key);
      if(progress !== key) setProgress(key);
    }
  }

  const scrollAnchor = document.querySelectorAll(".scrollAnchor");

  const options = {
    threshold: 1.0,
    root: document.getElementsByClassName("contentContainer")[0],
    rooMargin: "0% 0% -50% 0"
  }

  let observe = new IntersectionObserver(intersectionCallback, options);
  scrollAnchor.forEach(function(value) {
    observe.observe(value);
  })
  

  return (
    
    <PageContainer className={styles.homePage}>
      
      <Container>
      <div className={styles.App}>
        <div className="bg"></div>
        <header>
          <div className='Logo'>
            <img src={MetaCampUsLogo}/>
            <img src={GTIELogo} />
          </div>
          
          <div className='Account'>
            {auth.isSignedIn ?
              <ul>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: true,
                    friends: false,
                    nortification: false,
                    myAccount: false
                  }))  
                }}>
                  <img src={Profile} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: true,
                    nortification: false,
                    myAccount: false
                  }))  
                }}>
                  <img src={Friends} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: false,
                    nortification: true,
                    myAccount: false
                  }))  
                }}>
                  <img src={Nortification} />
                </li>
              </a>
              <a>
                <li onClick={() => {
                  setAccountMenu(true);
                  setAccountContent((m) => ({
                    ...m,
                    profile: false,
                    friends: false,
                    nortification: false,
                    myAccount: true
                  }))  
                }}>
                  <img src={MyAccount} />
                </li>
              </a>
              <a href="#" onClick={onSignOut} >
                <li className='orange'>
                  <img src={LogOut} />
                </li>
              </a>
            </ul>
            :
              <Button thick preset="signin" as="a" href="/signin" className={styles.signInButton}>
                <FormattedMessage id="sign-in-button" defaultMessage="Sign in/Sign up" />
              </Button>
            }
            
            {isAccountMenuOpen ?
              <div className="accountMenu">
                <button className="accountMenuCloseButton" onClick={() => setAccountMenu(false)}>閉じる</button>
                {accountContent.profile ?
                <div className="profile popUpAccountMenu">
                  準備中です
                  {/*<AvatarSettingsContent
                    displayName={window.APP.store.state.profile.displayName}
                    profile={window.APP.store.profile}
                    pronouns={window.APP.store.state.pronouns}
                    sendDiscordMessage={window.APP.store.state.sendDiscordMessage}
                />*/}
                </div>
                : accountContent.friends ?
                <div className="friends popUpAccountMenu">
                  準備中です
                </div>
                : accountContent.nortification ?
                <div className="nortification popUpAccountMenu">
                  準備中です
                </div>
                : accountContent.myAccount ?
                <div className="myAccount popUpAccountMenu">
                  準備中です
                </div>
                : 
                undefined}
              </div>
            : undefined}
          </div>
          <a href="https://discord.gg/yKU98w9DHd" className='Discord' target="_blank" rel="noopener noreferrer">
            <img src={Discord} />
            <p>Discordサーバーに参加する →</p>
          </a>
        </header>
        <div className="contentContainer">
          <div className={mobileMenu ? 'content mobile' : 'content'}>
            <div className={mobileMenu ? 'Enter mobile' : 'Enter'}>
              <div className='enterBox'>
              <h2 className='title'>ENTER</h2>
                <div>
                <img src={Entry} />
                {auth.isSignedIn ?
                <a href="/VmdAxka/accomplished-grave-celebration"> 
                  <div className='entryButton'>
                    <p>クリックして入場</p>
                  </div>
                </a>
                : 
                
                <div className='entryButton'>
                  <p>ログインしてください</p>
                </div>
                }
                </div>

                {enterDetail.list ? 
                  <p className={mobileMenu && enterDetail.details ? 'description open' : 'description'}>
                    参加大学一覧<br/><br/>

                    東京大学<br/>
                    早稲田大学<br/>
                    東京工業大学<br/>
                    筑波大学<br/>
                    千葉大学<br/>
                    東京農工大学<br/>
                    お茶の水女子大学<br/>
                    神奈川県立保健福祉大学<br/>
                    横浜国立大学<br/>
                    横浜市立大学<br/>
                    東京医科歯科大学<br/>
                    慶應義塾大学<br/>
                    東京都立大学<br/>
                    芝浦工業大学<br/>
                    東京理科大学<br/>
                    茨城大学<br/>
                    電気通信大学<br/>
                    東海大学

                  </p>
                : enterDetail.rule ?
                  <p className={mobileMenu && enterDetail.details ? 'description open' : 'description'}>
                    MetaCampUs Japan 利用規約<br/><br/>

                    0.総則<br/><br/>

                    MetaCampUs Japan (以下「本サービス」といいます。)とは、インターネットが繋がるデバイスでご利用いただける３D空間で通信可能なサービスであり、GTIE（首都圏を中心とした大学からなる『世界を変える大学発スタートアップを育てる』プラットフォーム、Greater Tokyo Innovation Ecosystemの総称）により運営されています。本規約は、GTIEが提供する本サービスに対して適用され、本サービスの利用に関する条件を、本サービスを利用するユーザー（以下「ユーザー」といいます。）とGTIEとの間で定めるものです。なお、本規約に基づき、ユーザーとGTIEの間で成立する本サービスの利用に関するアカウント登録を以下「本登録」といいます。<br/><br/>

                    1.用語定義<br/><br/>

                    本規約では、以下の用語を使用します。<br/>
                    (1)「コンテンツ」とは、文字、記号、文章、音声、音楽、画像、動画、ソフトウェア、プログラム、コードその他の情報のことをいいます。<br/>
                    (2)「本コンテンツ」とは、本サービスを通じてアクセスすることができるコンテンツのことをいいます。<br/>
                    (3)「投稿コンテンツ」とは、ユーザーが本サービスにおいて投稿、登録、送信、受信、アップロード、その他方法を問わずGTIEに提供したコンテンツのことをいいます。<br/>
                    (4)「投稿等」とは、ユーザーが投稿コンテンツを投稿、登録、送信、アップロード、その他本サービスにおいて提供することを総称していいます。
                    (5)「送受信」とは、ユーザーが投稿コンテンツを投稿等および受信することをいいます。<br/>
                    (6)「メッセージ機能」とは、本サービスを利用するユーザーがメッセージ内容（音声メッセージ、テキストメッセージ）をGTIE及び本サービスを利用する他のユーザーとの間で通信を行うものです。<br/>
                    (7)「提携先等」とは、GTIEと提携する事業者、またはGTIEが業務を委託する事業者をいいます。<br/>
                    (8)「知的財産権等」とは、特許権、実用新案権、意匠権、商標権、著作権、肖像権、プライバシー権、パブリシティ権等の権利を総称していいます。<br/>
                    (9)「利用者情報」とは、次の各情報またはこれらの情報の総称をいいます。通信機器または接続機器（端末）の情報（機種名、製造番号等）、本サービス利用履歴（サービス利用状況、サービス利用に付随して取得した情報、音声データ等）、端末位置情報、クッキー情報・検索キーワード・ウェブビーコン等のGTIEのウェブサイト等（広告を含みます）にアクセスした際に取得される履歴情報（クリック履歴、表示履歴を含みます）。<br/>
                    (10)「ID」とは、３Ｄアバターや３Ｄ空間を作成、利用する際に、入力フォームに入力するユーザーのメールアドレスをいいます。<br/><br/>

                    2.本サービスの利用<br/><br/>

                    1.本規約の適用<br/>
                    GTIEは、本規約の他、本サービスの提供画面等に本サービスのご利用条件（以下「ご利用条件」といいます。）を定め
                    る場合があります。この場合、ご利用条件は本登録とともに本登録の内容を構成します。本規約とご利用条件の間に齟齬があるときは、ご利用条件が本規約に優先して適用されるものとします。<br/>
                    2.本サービスの利用<br/>
                    本サービスの利用にあたっては、本規約及びご利用条件（ただし、前項により定められた場合に限ります）が適用されますので、これらの内容をお読みいただいたうえでご利用ください。<br/>
                    3.未成年のご利用<br/>
                    未成年のユーザーが本サービスを利用される場合には、事前に親権者の同意を得るものとします。<br/><br/>

                    3.IDおよびご利用端末の管理<br/><br/>

                    ユーザーは、ユーザーの責任においてIDおよびご利用端末を管理しなければなりません。ユーザーのID・またはご利用端末が利用された場合は、GTIEの責めに帰すべき事由による場合を除き、ユーザーご自身が本サービスを利用されたものとみなし、ユーザーが一切の責任を負うものとします。<br/><br/>

                    4.利用料<br/><br/>

                    本サービスは、本規約で別段の定めがある場合を除き、無料でご利用できます。<br/><br/>

                    5.商用利用<br/><br/>

                    ユーザーが本サービスを利用して３Ｄ空間を活用した商取引を行う等本サービスを商用に利用する場合、GTIE指定の以下のフォームに、その主体、内容、期間その他のGTIEが求める事項について申し出て、GTIEの承認を得るものとします。<br/><br/>
                    連絡先：連絡先は要確認

                    6.個人情報等の取り扱い<br/><br/>

                    GTIEは、本サービスの提供にあたり、ユーザーから取得する個人情報を、本サービスを含むGTIEの実施する起業活動支援プログラムの情報提供、お問い合わせ対応、本サービスの改善を目的に利用する他、GTIEの主幹機関である国立大学法人東京工業大学が別に定める「国立大学法人東京工業大学個人情報保護規程」＜http://www.somuka.titech.ac.jp/reiki_int/reiki_honbun/x385RG00001579.html＞（国立大学法人東京工業大学がそのURLを変更した場合は、変更後のURLとします。）に準拠する形で、当該目的達成に必要な範囲で利用します。<br/><br/>

                    また、本サービスにおけるユーザーの利用状況を把握するために、GTIEでは下記の情報収集モジュールを利用しています。<br/>
                    情報収集モジュール名：Googleアナリティクス
                    情報収集モジュール提供者：Google LLCおよひ゛その完全子会社(以下総称して「Google等」 といいます)<br/><br/>

                    情報収集モジュールでは、GTIEが発行するクッキーをもとに、本サービスにおけるユーザーの利用情報がGoogle等の管理
                    するサーバーシステムに収集および記録され、分析がおこなわれます。<br/>GTIEは、Google等からその分析結果を受け取り、本サービスの運営改善を目的にそれらを利用いたします。<br/><br/>

                    また、Google等は、情報収集モジュールにより収集、記録、分析されたユーザーの利用情報を、Google等が定める利用目的の範囲で利用します。<br/>Google等が定める利用目的は、Google等のウェブサイトhttps://policies.google.com/technologies/partner-sites（Google等がこのURLを変更した場合は、変更後のURLとします。）をご確認ください。<br/><br/>

                    7.本コンテンツの利用<br/><br/>

                    本コンテンツについて、ユーザーは、譲渡および再許諾できず、非独占的な、本サービス上における利用を唯一の目的とする、利用権のみ行使できるものとします。<br/><br/>

                    8.投稿コンテンツの取り扱い<br/><br/>

                    本サービスに関して、投稿コンテンツの取り扱いがある場合は、以下の各号によるものとします。<br/>
                    (1)GTIEへの投稿コンテンツの利用許諾<br/>
                    投稿コンテンツに係る著作権は、投稿コンテンツを投稿等したユーザーに帰属します。ユーザーは、GTIEがGTIEのサービスを運営するために、国内外を問わず、無償、永久かつ非独占的に投稿コンテンツを利用できる権利をGTIEに許諾し、かつ、GTIEがユーザーから許諾された条件の範囲内で提携先等に対して投稿コンテンツの利用を許諾する権利をGTIEに許諾します。GTIEは、投稿コンテンツをGTIEの定めた仕様・条件等に従い、GTIE指定の配置、態様で掲載、表示するものとします。ユーザーは、投稿コンテンツに関して著作者人格権を行使しないものとします。ユーザーは、投稿コンテンツの著作権を第三者に譲渡する場合は、本条に定める条件を譲渡先に遵守させるものとします。また、本サービスの適正な運営のため、投稿コンテンツが非公開である場合も、必要に応じてGTIEがその内容を閲覧できるものとします。<br/>
                    (2)GTIE等による投稿コンテンツの削除<br/>
                    GTIEは、投稿コンテンツが違法またはその恐れがあると合理的に判断した場合、ユーザーに通知することなくこれを削除できるものとします。<br/>
                    (3)投稿コンテンツのバックアップ<br/>
                    投稿コンテンツのバックアップは、ユーザーが自らの責任で行うものとし、GTIEは、投稿コンテンツをバックアップする義務を負いません。<br/>
                    (4)ユーザーによる投稿コンテンツの変更等<br/>
                    本サービスにおいて、ユーザーが投稿コンテンツの変更または削除ができる場合におけるユーザーによる投稿コンテンツの変更または削除は、ユーザーがその投稿コンテンツを送受信した際のIDを用いてのみ行えるものとします。<br/>
                    (5)投稿コンテンツの第三者への開示<br/>
                    投稿コンテンツは、非公開の場合であっても、裁判所、行政機関およびその他の公的機関から要請された場合には開示されることがあります。<br/><br/>

                    9.メッセージ機能<br/><br/>

                    1.ユーザーは、GTIEの定める方法により、本サービス上のメッセージ機能を使用することができます。<br/>
                    2.音声メッセージは、メッセージ機能を通じてデバイスに送受信後、GTIEにおいて蓄積することなく、消去されます。<br/>
                    3.テキストメッセージは、メッセージ機能を通じてデバイスに表示した後、一定時間経過後、非表示となります。<br/><br/>

                    10.広告の掲載・送信<br/><br/>

                    GTIEは、本サービスにおいて、ユーザーに対し、GTIEもしくは第三者の広告・宣伝のために、ウェブサイト等へ掲載して、広告を掲載もしくは送信できるものとし、ユーザーはこれを予め承諾するものとします。<br/><br/>

                    11.免責事項<br/><br/>

                    1.GTIEは、本サービスおよび本サービスにおいて提供するアプリケーション、本コンテンツもしくは投稿コンテンツに関して、信頼性、正確性、的確性、適法性、安全性、完全性、権原および非侵害性、ユーザーの特定の利用目的への適合性、本サービスが停止しないこと、動作不良がないこと、常に本サービスを利用できること、本サービスが終了しないこと、セキュリティに関する欠陥がないこと、エラーおよびバグ、第三者の権利侵害がないこと等、その品質および内容、提供状況に関して、何ら保証しません。<br/>
                    2.GTIEは、ユーザーがコンピューターウィルスまたは外部からの攻撃等を受けないことを何ら保証しません。<br/>
                    3.GTIEは、本サービスを通じて送信または受信される情報が流出、消失または改ざんされないことを何ら保証しません。<br/><br/>

                    12.GTIEの賠償責任<br/><br/>

                    GTIEの責任は、その性質を問わず、当社の故意または重過失によらない場合には免責されるものとします。GTIEの重過失に起因してユーザーに損害が生じた場合、本サービスの提供に関してユーザーに発生した現実、直接かつ通常の損害（予見可能性の有無を問わず特別損害、逸失利益、データの破損・消失・使用機会の逸失を除きます）に限り、賠償責任を負うものとします。<br/><br/>

                    13.ユーザーの責任<br/><br/>

                    1.本サービス利用に必要なご利用端末・機器等の準備本サービスの利用に必要なご利用端末・機器の準備および通信料の負担は、ユーザーの責任において行うものとします。<br/>
                    2.ユーザーと第三者間の紛争等ユーザーは、本サービスの利用において、GTIEの責めに帰すべき事由によらないで、第三者と紛争等を生じた場合は、ユーザーの費用と責任において解決しなければならず、GTIEはいかなる責任も負いません。<br/><br/>

                    14.禁止行為<br/><br/>

                    ユーザーは、本サービスに関連して、以下の各号に該当する、または該当する恐れのある行為をしてはなりません。<br/>
                    (1)法令または公序良俗に反する行為、その他インターネット上で一般的に遵守されているルール等に違反する行為<br/>
                    (2)GTIEまたは第三者に不利益・迷惑・不快感または損害を与える行為<br/>
                    (3)有償、無償を問わず、GTIEの許可なく本サービスを第三者へ再提供する行為<br/>
                    (4)GTIEもしくは第三者を誹謗中傷、侮辱し、若しくはまたは差別し、名誉、信用、プライバシー等の人格的利益を毀損する行為、人権を侵害する行為またはこれらを推奨・勧誘・協力・助長・教唆する行為<br/>
                    (5)GTIEまたは第三者の知的財産権等を侵害する行為<br/>
                    (6)殺害、テロ、虐待、傷害、暴行、脅迫、窃盗、強盗、淫行その他の犯罪行為、および自殺、自傷、非行、家出等に該当し、またはこれらを推奨・勧誘・協力・助長・教唆する行為<br/>
                    (7)法人または個人を問わず自らを偽る行為、虚偽または誤解を生む情報を提供する行為、または特定の事業者等の商品・サービス等を優良と誤認させようとする行為、もしくは特定の事業者等の商品・サービス等の信頼を低下させる目的で中傷、批判する行為<br/>
                    (8)公職選挙法（昭和２５年法律第１００号）に違反する行為<br/>
                    (9)反社会的勢力（暴力団、暴力団関係企業、総会屋、社会運動標ぼうゴロその他暴力、威力、詐欺的手法を駆使して経済的利益を追求する集団または個人ないしこれらに準じる者をいいます。以下同じとします）、犯罪組織、違法な賭博・ギャンブル、違法薬物（脱法薬物、薬物等の濫用・不適切な利用もしくはこれらに準じるものを含みます）、無限連鎖講（ねずみ講）、ネットワークビジネス・マルチ商法、違法ビジネス、詐欺、公文書偽造、火器・けん銃・爆弾を含む違法な武器・兵器・爆発物・危険物等の製造・取引、その他違法な物品・情報等の作成・取引等に該当し、またはこれらについて推奨・勧誘・利益供与・協力・助長・教唆する行為<br/>
                    (10)異性もしくは同性との交際・出会い・性交渉を目的とした行為、不健全な目的による個人情報の聞き出し・送信もしくは受信、性風俗、売買春、わいせつ、アダルト・ポルノ関連のコンテンツ、児童ポルノ、児童虐待、動物虐待、残虐なコンテンツ等に該当し、またはこれらについて推奨・勧誘・利益供与・協力・助長・教唆する行為<br/>
                    (11)GTIEもしくは第三者の運用するコンピューター、ウェブサイト、電気通信設備等に不正にアクセスする行為、クラッキング行為、アタック行為、通信妨害行為、通信傍受行為、またはGTIEもしくは第三者の運用するコンピューター、ウェブサイト、電気通信設備等に支障を与える方法または態様において本サービスを利用する行為、もしくはそれらの行為を促進する情報を掲載する等の行為<br/>
                    (12)IDもしくはパスワードを不正に使用または盗用する行為、または他者になりすまして本サービスを利用する行為<br/>
                    (13)本サービスが予定している利用態様を超えて、本サービスからアクセス可能な第三者の情報を収集、複製、改竄し、または消去する行為<br/>
                    (14)コンピューターウィルス、ファイル共有ソフト等第三者の業務を妨害し、または損害を与えるコンピューター・プログラムを提供する行為<br/>
                    (15)検索エンジン・検索ツール等の表示結果における順位の操作を目的として行う行為（ソフトウェア・ツール等を利用するか否かにかかわらず、複数のアカウントを生成し、同一もしくは類似の記事を複数回にわたり投稿等する行為、または生成されたアカウントを利用して、コンテンツを投稿等し、他のウェブサイト、他のアカウント、他の投稿コンテンツに対してリンクを貼る等により誘導する行為等をいいますが、この限りではありません）<br/>
                    (16)受信者が嫌悪感を抱く電子メール等のメッセージ・コンテンツ(特定電子メール、迷惑メールを含みますがこれらに限定されません）を送信・投稿等する行為<br/>
                    (17)本人の明確な同意なく、不正に個人情報もしくはプライバシー情報を調査、収集、利用、開示、提供する行為<br/>
                    (18)本サービスの運営に過度な負担を与える行為・妨害する行為<br/>
                    (19)本サービスに含まれるプログラム・アプリケーションを分解、逆アセンブル、逆コンパイル、リバースエンジニアリングする行
                    為、またはその他の方法でソースコードを解読する行為<br/>
                    (20)本サービスの利用目的と異なる目的で本サービスを利用する行為、または本コンテンツを、本サービスが予定している利用態様を超えて利用（複製、送信、転載、改変などの行為を含みます）する行為<br/>
                    (21)その他、GTIEが合理的に不適当と判断する行為<br/><br/>

                    15.権利義務譲渡の禁止等<br/><br/>

                    ユーザーは、本サービスおよび本規約に基づくユーザーの権利義務を第三者に譲渡、承継、換金、貸与または担保の用に供することはできません。<br/><br/>

                    16.本サービスの中断・停止<br/><br/>

                    1.GTIEは、以下の各号のいずれかに該当するとGTIEが判断したときは、本サービスの全部または一部の提供を中断または停止することがあります。<br/>
                    (1)地震、火災、落雷、風水害、津波、雪害、その他の天災地変、停電、電力供給の低下、不可避的な事故、法規制、行政指導、行政処分、裁判所の命令、戦争、テロ、内乱、暴動、疫病、その他GTIEの支配を超える原因その他の不可抗力により、本サービスの提供を継続することが困難である場合<br/>
                    (2)本サービスまたは本サービスの提供に必要な設備・機器・システム・プログラム等の保守、工事等を実施する必要がある場合<br/>
                    (3)本サービスまたは本サービスの提供に必要な設備・機器・システム・プログラム等に故障、障害等が発生した場合<br/>
                    (4)その他GTIEが本サービスの全部または一部の提供を中断する必要があると判断した場合<br/>
                    2.GTIEは、前項に基づく本サービスの全部もしくは一部の提供を中断または停止する場合、ユーザーに対して、事前に通知するものとします。ただし、緊急の場合はこの限りではありません。なお、法令その他本規約において別途定める場合を除き、GTIEが本サービスの提供を中断または停止するにあたり、GTIEはユーザーその他いかなる者に対しても、何らの責任も負わないものとします。<br/><br/>

                    17.本サービスの廃止<br/><br/>

                    1.GTIEによる本サービスの廃止<br/>
                    GTIEは、以下の各号のいずれかに該当した場合または該当する恐れがあるとGTIEが合理的に判断した場合、ユーザーに通知することなく、本サービスを廃止することができるものとします。<br/>
                    (1)ユーザーが本規約のいずれかに違反した場合<br/>
                    (2)ユーザーのIDが失効している場合<br/>
                    (3)ユーザーが反社会的勢力の構成員であるもしくは構成員であったこと、またはその関係者であるもしくは関係者であったことが判明した場合<br/>
                    (4)ユーザーの利用がGTIEもしくは提携先等のサービスの運営に支障をきたす場合、GTIEまたは提携先等のサービスもしくは業務の運営を妨害する場合<br/>
                    (5)ユーザーの死亡又は会社の消滅が判明した場合<br/>
                    (6)ユーザーが連続する6ヶ月間、IDでログインされない場合<br/>
                    (7)ユーザーが、本サービスの廃止をされたことがある場合<br/>
                    (8)本サービスの登録内容等に不足または不備もしくは虚偽の内容が含まれることが判明した場合<br/>
                    (9)ユーザーが過去に本規約のいずれかに違反したことがある場合<br/>
                    (10)ユーザーが未成年である場合で、親権者の同意を得ていないことが判明した場合<br/>
                    (11)その他、ユーザーが本サービスを利用することが不適切であるとGTIEが合理的に判断した場合<br/>
                    2.ユーザーによる契約の解除<br/>
                    ユーザーは、本登録を解除しようとする場合は、GTIEに申し出て、GTIEの承諾を得なければならないものとします。<br/>
                    3.GTIEによる本サービスの終了<br/>
                    GTIEは、本サービスの提供を終了する場合、ユーザーに対して事前に周知するものとします。なお、法令その他本規約において別途定める場合を除き、GTIEが本サービスの提供を終了するにあたり、GTIEはユーザーその他いかなる者に対しても、何らの責任も負わないものとします。<br/><br/>

                    18.本サービスまたは契約の終了後等の取り扱い<br/><br/>

                    1.情報の取り扱い<br/>
                    GTIEは、本サービスの終了後または本登録の終了後（これらの終了の事由を問いません）、別段の定めのない限り、本サービスにおけるユーザーに関する投稿コンテンツ、利用者情報を削除することができ、または引き続き利用もしくは保有することができるものとします。なお、GTIEは、当該削除、利用または保有について、いずれの義務も負うものではありません。<br/>
                    2.システムへの反映<br/>
                    本サービスに関するシステムの都合上、本サービスの利用停止・終了または本登録の終了（これらの終了等の事由を問いません）の手続きが完了してから、その手続きがシステム上反映されるまでGTIE所定の時間が必要な場合があり、ユーザーはこれを予め承諾するものとします。<br/><br/>

                    19.本規約等の変更<br/><br/>

                    1.本規約の変更<br/>
                    GTIEは、本規約の変更が、以下のいずれかの要件を充足する場合には、個別にユーザーと合意することなく、本規約を変更できるものとします。この場合、GTIEは、GTIEのウェブサイトへの掲載その他相当の方法により、予め周知するものとします。<br/>
                    (1)ユーザー一般の利益に適合するとき<br/>
                    (2)契約をした目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき
                    2.本サービスに関する変更<br/>
                    GTIEは、本サービスの名称、内容および仕様をユーザーの承諾を得ることなく、いつでも任意に変更できるものとします。ただし、本規約の変更が必要な場合は、前項の定めに従うものとします。<br/>
                    3.プログラム・アプリケーション等の変更<br/>
                    GTIEは、GTIEの裁量により、本サービスに関するプログラム・アプリケーション等のバージョンアップ、機能の変更、または利用の制限等（以下「バージョンアップ等」といいます。）を行うことができるものとします。当該プログラム・アプリケーション等のバージョンアップ等が実施された場合、バージョンアップ等の実施前のプログラム・アプリケーション等に対するサポートはGTIEの裁量により終了する場合があります。ただし、本規約の変更が必要な場合は、第1項の定めに従うものとします。<br/><br/>

                    20.事業の譲渡等<br/><br/>

                    GTIEは、本規約に基づく権利義務の全部または一部を第三者に承継、売却、事業譲渡、合併、会社分割その他の方法で譲渡できるものとします。この場合、GTIEは、本サービスの利用の過程で取得した全ての情報（投稿コンテンツ、ユーザーの個人情報および利用者情報を含みます）を譲渡先に提供できるものとします。<br/><br/>

                    21.一般条項<br/><br/>

                    1.お問合せ方法<br/>
                    ユーザーがGTIEへのお問合せを希望される場合は、以下から行うものとします。<br/>
                    連絡先：連絡先は要確認<br/>
                    2.GTIEからの通知<br/>
                    GTIEからの通知（本規約に基づく周知を含みます）は、GTIEまたは本サービスの提供ウェブサイトにより行うものとします。<br/>
                    3.準拠法・裁判管轄<br/>
                    (1)本規約の解釈およびユーザーの本サービスのご利用にあたっては、日本法が適用されます。なお、本サービスにおいて物品の売買が発生する場合であっても、国際物品売買契約に関する国際連合条約の適用を排除することにユーザーは同意するものとします。<br/>
                    (2)本規約および本サービスに関連してユーザーとGTIE間で発生した紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします<br/>
                    4.制限適用<br/>
                    本規約の規定が関連法令に抵触する場合、その限りにおいて本規約は適用されないものとします。この場合であっても、その関連法令に抵触しない本規約の他の条件は有効に適用されるものとします。<br/><br/>

                    附則（2023年11月1日）<br/>
                    本規約は、2023年11月1日から実施します。
                  </p>
                : enterDetail.manual ? 
                  <p className={mobileMenu && enterDetail.details ? 'description open' : 'description'}>
                    MetaCampUs操作方法
                      <br/><br/>
                    【共通】
                      <br/><br/>
                    1. ブラウザを開く: お使いのパソコンで、Google Chromeを開きます。<br/>
                    2. MetaCampUsのウェブサイトにアクセス: ブラウザのアドレスバーにMetaCampUsのURL（https://metacampus.jp/）を入力してアクセスします。<br/>
                    3. ルームの作成または参加: 「クリックして入場」をクリックしてエントランスワールドに入室するか、URLなどから既存のルームに参加します。<br/>
                    4. プロフィールの設定:初めてルームに入る際は、アイコンや表示名、プロフィール、フレンド限定表示内容、Discord通知、ニックネームなどを設定します。<br/>
                    5. アバターの選択:自分の分身であるアバターを選択します。<br/>
                    6. マイクとスピーカーの設定:マイクとスピーカーを設定します。<br/>
                    <br/>
                    【パソコンでの操作方法】
                    <br/><br/>
                    ・移動
                    <br/><br/>
                    WASDキーで移動、マウスで視点を変更します。スペースバーを押すことで着席アイコンが表示され、クリックする事で着席できます。
                    <br/><br/>
                    ・UI説明
                    <br/><br/>
                    招待ボタンからは他の人を招待するためのURLが発行可能です。<br/><br/>

                    マイクボタンから、マイクとスピーカーの変更またはミュートが行えます。<br/><br/>

                    共有ボタンを押すと、自分のカメラまたは画面の共有が可能です。<br/><br/>

                    アイテムボタンを押すことでペンやカメラ、アバターの変更、シーンの変更や画像・動画・PDF等のアップロードが可能です。<br/><br/>

                    リアクションボタンから、空間上に飛び出すリアクションスタンプを呼び出すことが可能です。<br/><br/>

                    チャットボタンから、チャットを行う事も可能です。またその際にDiscordにも送信する欄にチェックを入れる事で、Discordにも同時に送信可能です。<br/><br/>

                    退室ボタンから、ルームからの退室が可能です。ブラウザを閉じる事でも退室が可能です。<br/><br/>

                    画面右下にあるメニューボタンから、新規ルームの作成や名前とアバターの変更が可能です。また環境設定やチュートリアル、利用規約の確認も可能です。<br/><br/>

                    【スマートフォンでの操作方法】<br/><br/>

                    ・移動<br/><br/>

                    画面をスワイプまたは画面右に表示されている半透明のコントローラーをスワイプする事で視点を変更し、画面右に表示されている半透明のコントローラーをスワイプする事で移動します。<br/><br/>

                    画面をマルチタップする事で着席アイコンが表示され、タップする事で着席できます。<br/><br/>

                    ・UI説明<br/><br/>

                    マイクボタンから、マイクとスピーカーの変更またはミュートが行えます。<br/><br/>

                    共有ボタンを押すと、自分のカメラの共有が可能です。<br/><br/>

                    アイテムボタンを押すことでペンやカメラ、アバターの変更、シーンの変更や画像・動画・PDF等のアップロードが可能です。<br/><br/>

                    リアクションボタンから、空間上に飛び出すリアクションスタンプを呼び出すことが可能です。<br/><br/>

                    画面右下にあるチャットボタンから、チャットを行う事も可能です。またその際にDiscordにも送信する欄にチェックを入れる事で、Discordにも同時に送信可能です。<br/><br/>

                    画面左上にあるメニューボタンから、新規ルームの作成や名前とアバターの変更が可能です。また環境設定やチュートリアル、利用規約の確認も可能です。<br/><br/>

                    退室するには、ブラウザを閉じてください。
                  </p>
                :
                  <p className={mobileMenu && enterDetail.details ? 'description open' : 'description'}>
                    MetaCampUsのハブとなるワールドです。
                    <br />
                    初めての方もリピートの方もまずはここから始めてみましょう！！
              
                  <br /><br/>
                
                    操作説明やチュートリアルはワールド内に用意されています。
                    <br /><br/>
                    必要なものはアカウントのみです。
                  </p>
                }
                
                <div className={mobileMenu && enterDetail.details ? 'details open' : 'details'}>
                  <div className="schoolList" onClick={() => setEnterDetail({list: !enterDetail.list, manual: false, rule: false, details: enterDetail.details})}>
                    <img src={School}/>
                    <p>{enterDetail.list ? '閉じる' : '参加大学一覧'}</p>
                    <div className="list">
                      aaaa
                    </div>
                  </div>
                  <div className="manualAndRule">
                    <div className="manual" onClick={() => setEnterDetail({list: false, manual: !enterDetail.manual, rule: false, details: enterDetail.details})}>
                      <img src={Manual}/>
                      <p>{enterDetail.manual ? '閉じる' : '操作説明'}</p>
                    </div>
                    <div className="rule" onClick={() => setEnterDetail({list: false, manual: false, rule: !enterDetail.rule, details: enterDetail.details})}>
                      <img src={Rule}/>
                      <p>{enterDetail.rule ? '閉じる' : '規約'}</p>
                    </div>
                  </div>
                </div>
                
                
                {mobileMenu ?
                <div className="detailsOpen" onClick={()=> setEnterDetail({...enterDetail, details: !enterDetail.details})}>{enterDetail.details ?  '閉じる' : '詳　細'}</div>
                : undefined}
              </div>
              <div className="ground">© 2024- GTIE</div>
            </div>
            <div className="scrollHeader">
              <div className="logo">
              <img src={MetaCampUsLogo}/>
              <img src={GTIELogo}/></div>
              <div className="menu" onClick={()=> setMobileMenu(!mobileMenu)}>
                <img src={Menu}/>
              </div>
            </div>
            <div className={mobileMenu ? 'Scroll mobile' : 'Scroll'}>

              <div className="scrollHero scrollAnchor" data-key={0}>
                <img src={Hero}/>
                <div className="container">
                  <p>
                  「<span>やりたい</span>」が<span>カタチ</span>になるコミュニティ「MetaCampUs」
                  </p>
                  <p>
                  MCUは、どんなバカげた<span>挑戦</span>も、ここから<span>カタチ</span>になっていくのを応援します
                  </p>
                </div>
              </div>
              <div className="scrollAbout scrollAnchor" data-key={1}>
                <div className="container">
                  <br/>
                  <h2 className='title'>ABOUT</h2>
                  <br/><br/>
                  <p>MetaCampUs Japan（MCU：エムシーユー）は、アカデミア起業のためのコンテンツやネットワークを共有するためのコミュニティ・プラットフォームです。
                  <br/><br/>
                  メタバース上のキャンパスに通いコミュニティに参加することで、普段のキャンパスライフにはない新たな出会いや気づきが生まれます。</p>
                </div>
              </div>
              <div className="scrollFeature scrollAnchor" data-key={2}>
                <div className="container">
                  <br/>
                  <h2 className='title'>FEATURE</h2>
                  <br/><br/>
                  <p>
                  MCUは、大学の垣根を横断した、出会い、共感、触発が生まれるコミュニティです。
                  <br/><br/>
                  ・<span>出会い</span>：自分と異なる価値観や世界と出会い、「当たり前」の感覚を広げていく。
                  <br/><br/>
                  ・<span>共感</span>：お互いの想いに共有しあい、仲間と共感し、高めあう。夢と理想の壁打ちの場。    
                  <br/><br/>
                  ・<span>触発</span>：仲間や先輩達の熱にあてられ、自分もできる、という根拠のない自信。
                  </p>
                </div>
              </div>
              <div className="scrollWorlds scrollAnchor" data-key={3}>
                <div className="container">
                  <h2 className='title'>WORLDS</h2>
                  <br/><br/>
                  <div className={worldsDetail.publicOpen || worldsDetail.privateOpen ? "content" : "content offContent"}>
                    <div className={worldsDetail.publicOpen ? "public" : "public offPublic"}>
                        <div className="publicLabel">
                          <span>オープンワールド</span>
                          <p>
                            参加者全員がお楽しみいただけるワールドです。
                            <br/><br/>
                            まずはこのワールドから探索しましょう！！
                          </p>
                          <button onClick={() => 
                            {
                              setWorldsDetail({...worldsDetail, publicOpen: true})
                              //openWorlds('public')
                            }
                          }>詳細</button>
                        </div>
                        <div id="publicRoulette" className={worldsDetail.publicOpen ? "" : "offPublic"}>
                          {worldsDetail.publicChoosen === 0 ? 
                            <p>
                              ①エントランスワールド
                              <br/><br/>
                              入口となるワールドです。<br/>
                              操作方法や全体のマップなどが配置されており、いつでも確認が可能です。
                            </p>
                          : worldsDetail.publicChoosen === 1 ? 
                            <p>
                              ②横丁ワールド
                              <br/><br/>
                              ワイワイ楽しむ下町ワールドです。<br/>
                              各店でみんなと話し込みましょう！！
                            </p>
                          : undefined}
                          
                          <img className="Entrance" src={Entrance}/>
                          <img className="SideStreet" src={SideStreet}/>
                        </div>
                    </div>
                    <div className={worldsDetail.privateOpen ? "private" : "private offPrivate"}>  
                      <div className="privateLabel">
                        <span>プライベートワールド</span>
                        <p>
                          限られたメンバーだけが入室できるワールドです。
                          <br/><br/>
                          グループ活動やイベントにご活用いただけます！！
                        </p>
                        <button onClick={() => 
                          {
                            setWorldsDetail({...worldsDetail, privateOpen: true})
                            //openWorlds('private')
                          }
                        }>詳細</button>
                      </div>
                      <div id="privateRoulette" className={worldsDetail.privateOpen ? "" : "offPrivate"}>
                        {worldsDetail.privateChoosen === 0 ? 
                          <p>
                            ①会議室ワールド
                            <br/><br/>
                            入口となるワールドです。<br/>
                            操作方法や全体のマップなどが配置されており、いつでも確認が可能です。
                          </p>
                        : worldsDetail.privateChoosen === 1 ? 
                          <p>
                            ②視聴覚室ワールド
                            <br/><br/>
                            ワイワイ楽しむ下町ワールドです。<br/>
                            各店でみんなと話し込みましょう！！
                          </p>
                        : worldsDetail.privateChoosen === 2 ?
                          <p>
                            ②職員室ワールド
                            <br/><br/>
                            ワイワイ楽しむ下町ワールドです。<br/>
                            各店でみんなと話し込みましょう！！
                          </p>
                        : worldsDetail.privateChoosen === 3 ?
                          <p>
                            ②イベントワールド
                            <br/><br/>
                            ワイワイ楽しむ下町ワールドです。<br/>
                            各店でみんなと話し込みましょう！！
                          </p>
                        : undefined}
                        <img className="profession" src={Proffession}/>
                        <img className="audio" src={Audio}/>
                        <img className="meeting" src={Meeting}/>
                        <img className="event" src={Event}/>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="scrollGTIE">
                <img className="ProducedBy" src={ProducedBy}/>
                <div className="GTIE">
                  <img className="GTIEBackground" src={GTIEBackground}/>
                  <p>
                  MetaCampUs Japan（MCU）の運営団体であるGTIE（ジータイ）とは、東京大学・東京工業大学・早稲田大学を主幹機関とした『世界を変える大学発スタートアップを育てる』プラットフォームです。
                  <br/><br/>
                    <a href="https://gtie.jp/" target="_blank" rel="noopener noreferrer"><button>GTIEサイト</button></a>              
                  </p>

                </div>
              </div>
              <div className="scrollGround">
                <img className="glass" src={Glass}/>
                <div className="ground"></div>
              </div>
            </div>
            <div className={mobileMenu ? 'IndexAndNews mobile' : 'IndexAndNews' }>
              <div className='Index'>
                <ul>
                  <li><h2 className={progress === 0 ? "title accent" : "title"}>-TOP</h2></li>
                  <li><h2 className={progress === 1 ? "title accent" : "title"}>-ABOUT</h2></li>
                  <li><h2 className={progress === 2 ? "title accent" : "title"}>-FEATURE</h2></li>
                  <li><h2 className={progress === 3 ? "title accent" : "title"}>-WORLD</h2></li>
                </ul>
              </div>
              <div className='News'>
                <h2 className='title'>NEWS</h2>
                <div className='articleContainer'>
                  <div className='article'>
                    <h3 className='articleTitle'>2023-02-09 β版リリース</h3>
                    <div className='articleContent'>
                      <img src={Entry} />
                      <p>MetaCampUsがverβとしてリリースされました。正式版リリースについては続報をお待ちください。
                      </p>
                    </div>
                    <a className='articleDetail'>詳細</a>
                  </div>

                  {/* 
                  <div className='article'>
                    <h3 className='articleTitle'>
                      2023-12-08 アップデートのお知らせ
                    </h3>
                    <div className='articleContent'>
                      <img src={Entry} />
                      <p>フレンド機能が追加されました</p>
                    </div>
                    <a className='articleDetail'>詳細</a>
                  </div>

                  <div className='article'>
                    <h3 className='articleTitle'>
                      2023-12-08 アップデートのお知らせ
                    </h3>
                    <div className='articleContent'>
                      <img src={Entry} />
                      <p>図書館ワールドが追加されました</p>
                    </div>
                    <a className='articleDetail'>詳細</a>
                  </div>*/}
                </div>
                {/*
                <div className='paging'>
                  <span className='dot accent'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>
                  <span className='dot'></span>
                </div>
                */}
              </div>
              {contactOpen ?
                <form className="contactForm" ref={form} onSubmit={sendEmail}>
                  <label>名前</label>
                  <input type="text" name="user_name" required/>
                  <label>メールアドレス</label>
                  <input type="email" name="user_email" required/>
                  <label>送信内容</label>
                  <textarea name="message" />
                  <input type="submit" value="提出" required/>
                </form>
              : 
              
              <div className="contact" onClick={() => setContact(!contactOpen)}>
                <img src={Mail}/>
                <p>お問い合わせ</p>
                <div>
              </div>
              </div>
              }
              <div className="ground">
              Ver. β
              </div>
            </div>
          </div>
        </div>
    </div>
       
      </Container>
    </PageContainer>
  );
}

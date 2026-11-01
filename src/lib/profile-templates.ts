import additionalTemplates from './locales/profiles.json';
import {withLocales} from './locale-data';
import {commonMetadata,seoTitles} from './seo';
import {decorateProfile} from './profile-decoration';
import type {Lang} from './site';
export const profileCopy=withLocales({
 ko:{nav:'프로필 꾸미기',title:'프로필 비포 & 애프터',intro:'13가지 용도별 템플릿을 비교하고, 마음에 드는 소개글을 내 스타일로 바꿔보세요.',gallery:'프로필 템플릿',before:'꾸미기 전',after:'꾸민 후',previous:'이전 테마',next:'다음 테마',copyTemplate:'복사하고 편집하기',load:'편집창에 불러오기',all:'프로필 꾸미기 열기',example:'Instagram 스타일 미리보기 · 계정과 수치는 가상 예시입니다.',posts:'게시물',followers:'팔로워',following:'팔로잉',follow:'팔로우',message:'메시지',editor:'내 프로필 편집',editorIntro:'표시 이름과 소개글을 각각 작성하고, 글꼴과 문자를 골라 내 프로필을 완성하세요.',handle:'사용자 이름',bio:'표시 이름 · 소개글',count:'글자',copy:'내 소개글 복사',preview:'실시간 미리보기',privacy:'입력 내용은 서버로 보내지 않습니다. 프로필 초안은 현재 탭에 임시 보관하며 직접 비울 수 있습니다.',notice:'실제 프로필의 글자 수 제한과 표시 방식은 앱에서 확인하세요. 표시 이름과 소개글은 각각의 입력란에 붙여넣으세요.',loaded:'템플릿을 편집창에 불러왔습니다.',replace:'작성 중인 내용이 있습니다. 새 템플릿으로 바꿀까요?',confirm:'새 템플릿으로 교체',keep:'내 내용 유지',start:'마음에 드는 프로필을 골라보세요.',help:'템플릿의 이름·날짜·실적 문구는 예시입니다. 본인의 실제 정보로 수정해서 사용하세요.'},
 en:{nav:'Profile studio',title:'Profile before & after',intro:'Explore 13 profile templates, pick a template and make the bio your own.',gallery:'Profile templates',before:'Before',after:'After',previous:'Previous theme',next:'Next theme',copyTemplate:'Copy & customize',load:'Load into editor',all:'Open profile studio',example:'Instagram-style preview · All accounts and numbers are fictional examples.',posts:'posts',followers:'followers',following:'following',follow:'Follow',message:'Message',editor:'Customize your profile',editorIntro:'Write your display name and bio separately, then choose styles and symbols to finish your profile.',handle:'Username',bio:'Display name & bio',count:'characters',copy:'Copy my bio',preview:'Live preview',privacy:'Your input is not sent to a server. The draft is temporarily kept in this tab and can be cleared.',notice:'Check the actual app for character limits and rendering. Paste the display name and bio into their separate fields.',loaded:'Template loaded into the editor.',replace:'You have unsaved edits. Replace them with this template?',confirm:'Replace with template',keep:'Keep my edits',start:'Find a look you like.',help:'Names, dates and business claims are examples. Replace them with your own accurate information.'},
 ja:{nav:'プロフィール作成',title:'プロフィールのビフォー・アフター',intro:'13種類のテンプレートから選んで、自分の名前や紹介文に書き換えられます。',gallery:'プロフィールのテンプレート',before:'変更前',after:'変更後',previous:'前のテンプレート',next:'次のテンプレート',copyTemplate:'コピーして編集',load:'編集欄に読み込む',all:'プロフィール作成を開く',example:'Instagram風のプレビューです。アカウントと数値は架空のサンプルです。',posts:'投稿',followers:'フォロワー',following:'フォロー中',follow:'フォロー',message:'メッセージ',editor:'プロフィールを編集',editorIntro:'表示名と自己紹介を入力し、文字スタイルや記号を選んでプロフィールを仕上げましょう。',handle:'ユーザーネーム',bio:'表示名・自己紹介',count:'文字',copy:'自己紹介をコピー',preview:'プレビュー',privacy:'入力内容はサーバーに送信しません。下書きはこのタブに一時保存し、いつでも削除できます。',notice:'文字数の上限や表示は、実際のアプリで確認してください。表示名と自己紹介は、それぞれの入力欄に貼り付けてください。',loaded:'テンプレートを編集欄に読み込みました。',replace:'編集中の内容があります。テンプレートで置き換えますか？',confirm:'テンプレートで置き換える',keep:'編集内容を残す',start:'好みのテイストを選んでみましょう。',help:'名前・日付・実績などはサンプルです。ご自身の正しい情報に書き換えてご利用ください。'}
});
export const profileThemeIds=["cafe", "daily", "y2k", "lovely", "travel", "photographer", "shop", "local-business", "business", "pets", "student", "beauty", "company"] as const;
export type ProfileThemeId=typeof profileThemeIds[number];
export type ProfileTemplate={id:ProfileThemeId;title:string;subtitle:string;handle:string;before:string;after:string};
const templates:Record<Lang,ProfileTemplate[]>=withLocales({
  "ko": [
    {
      "id": "cafe",
      "title": "카페·사진 기록",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.cafe",
      "before": "김라나 (Lana) | 카페와 필름\n☕ 서울 카페와 필름 사진 좋았던 공간을 천천히 모아요 위치는 게시물에 남겨둘게요",
      "after": "김라나 (Lana) | 카페와 필름\n☕ 서울 카페와 필름 사진\n좋았던 공간을 천천히 모아요\n위치는 게시물에 남겨둘게요"
    },
    {
      "id": "daily",
      "title": "일상·미니멀",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.daily",
      "before": "서연\n산책하고, 읽고, 가끔 여행해요 오래 기억하고 싶은 날들",
      "after": "서연\n산책하고, 읽고, 가끔 여행해요\n오래 기억하고 싶은 날들"
    },
    {
      "id": "y2k",
      "title": "패션·스트릿",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.y2k",
      "before": "김주원 (Kim Juwon) ✦\n오늘 입은 옷, 요즘 듣는 음악 빈티지와 오래된 운동화 수집 중 착장 정보는 게시물에",
      "after": "김주원 (Kim Juwon) ✦\n오늘 입은 옷, 요즘 듣는 음악\n빈티지와 오래된 운동화 수집 중\n착장 정보는 게시물에"
    },
    {
      "id": "lovely",
      "title": "덕질·팬 기록",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.lovely",
      "before": "유주 ୨୧\n좋아하는 무대와 공연의 기록 같이 이야기할 분들 환영해요 ♡ 팬 계정 · 공식 계정 아님",
      "after": "유주 ୨୧\n좋아하는 무대와 공연의 기록\n같이 이야기할 분들 환영해요 ♡\n팬 계정 · 공식 계정 아님"
    },
    {
      "id": "travel",
      "title": "여행·주말 기록",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.travel",
      "before": "지수 | 주말 여행\n가까운 곳부터 하나씩 뚜벅이 여행 · 숙소 · 동네 산책 다녀온 코스는 게시물에 정리해요",
      "after": "지수 | 주말 여행\n가까운 곳부터 하나씩\n뚜벅이 여행 · 숙소 · 동네 산책\n다녀온 코스는 게시물에 정리해요"
    },
    {
      "id": "photographer",
      "title": "사진가·작업 의뢰",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.photographer",
      "before": "도윤 | 인물 사진\n자연스러운 표정과 빛을 담아요 서울 · 프로필 / 커플 스냅 촬영 문의는 아래 링크로",
      "after": "도윤 | 인물 사진\n자연스러운 표정과 빛을 담아요\n서울 · 프로필 / 커플 스냅\n촬영 문의는 아래 링크로"
    },
    {
      "id": "shop",
      "title": "동네 카페",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.shop",
      "before": "모퉁이 커피 | 연남동\n커피와 직접 굽는 작은 과자 수–일 11:00–19:00 · 월·화 휴무 오시는 길과 메뉴는 아래 링크",
      "after": "모퉁이 커피 | 연남동\n커피와 직접 굽는 작은 과자\n수–일 11:00–19:00 · 월·화 휴무\n오시는 길과 메뉴는 아래 링크"
    },
    {
      "id": "local-business",
      "title": "공방·클래스",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.local.business",
      "before": "온유공방 | 도자기\n손으로 빚는 나만의 그릇 처음 오시는 분도 함께할 수 있어요 수업 일정·예약은 아래 링크",
      "after": "온유공방 | 도자기\n손으로 빚는 나만의 그릇\n처음 오시는 분도 함께할 수 있어요\n수업 일정·예약은 아래 링크"
    },
    {
      "id": "business",
      "title": "프리랜서·디자인",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.business",
      "before": "수빈 | 브랜드 디자이너\n작은 브랜드의 시작을 함께합니다 로고 · 패키지 · 그래픽 포트폴리오와 작업 문의 ↓",
      "after": "수빈 | 브랜드 디자이너\n작은 브랜드의 시작을 함께합니다\n로고 · 패키지 · 그래픽\n포트폴리오와 작업 문의 ↓"
    },
    {
      "id": "pets",
      "title": "반려동물",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.pets",
      "before": "보리의 산책일지 🐾\n산책이 제일 좋은 강아지 보리 동네 한 바퀴와 주말 나들이 사진은 집사가 올려요",
      "after": "보리의 산책일지 🐾\n산책이 제일 좋은 강아지 보리\n동네 한 바퀴와 주말 나들이\n사진은 집사가 올려요"
    },
    {
      "id": "student",
      "title": "학생·캠퍼스 일상",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.student",
      "before": "지민 | 캠퍼스 일상\n수업 끝나면 카페나 도서관 공부 기록 · 동아리 · 소소한 일상 전공도 취향도 알아가는 중 📚",
      "after": "지민 | 캠퍼스 일상\n수업 끝나면 카페나 도서관\n공부 기록 · 동아리 · 소소한 일상\n전공도 취향도 알아가는 중 📚"
    },
    {
      "id": "beauty",
      "title": "뷰티 인플루언서",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.beauty",
      "before": "소윤 | 메이크업·뷰티 리뷰\n직접 써본 화장품과 데일리 메이크업 피부 타입: 복합성 · 제품별 사용감 기록 광고·협찬 여부는 게시물에 표시해요 협업 문의는 아래 메일로 ↓",
      "after": "소윤 | 메이크업·뷰티 리뷰\n직접 써본 화장품과 데일리 메이크업\n피부 타입: 복합성 · 제품별 사용감 기록\n광고·협찬 여부는 게시물에 표시해요\n협업 문의는 아래 메일로 ↓"
    },
    {
      "id": "company",
      "title": "회사 공식계정",
      "subtitle": "내 정보로 바꿔 쓸 수 있는 소개글",
      "handle": "sample.company",
      "before": "온담 스튜디오 | 공식 계정\n브랜드의 시작을 함께하는 디자인 스튜디오 프로젝트 · 팀 소식 · 작업 이야기 서비스 안내와 문의는 공식 홈페이지 ↓",
      "after": "온담 스튜디오 | 공식 계정\n브랜드의 시작을 함께하는 디자인 스튜디오\n프로젝트 · 팀 소식 · 작업 이야기\n서비스 안내와 문의는 공식 홈페이지 ↓"
    }
  ],
  "en": [
    {
      "id": "cafe",
      "title": "Cafés & film",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.cafe",
      "before": "Lana | cafés & film\nCoffee stops, city walks, a roll of film. London, mostly. Locations in the captions ↓",
      "after": "Lana | cafés & film\nCoffee stops, city walks, a roll of film.\nLondon, mostly.\nLocations in the captions ↓"
    },
    {
      "id": "daily",
      "title": "Everyday / minimal",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.daily",
      "before": "Emma\nUsually reading, walking, or making coffee. A few things I want to remember.",
      "after": "Emma\nUsually reading, walking, or making coffee.\nA few things I want to remember."
    },
    {
      "id": "y2k",
      "title": "Personal style",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.y2k",
      "before": "Chloe ✦\nRepeat outfits. Secondhand finds. Good shoes, loud playlists. Outfit details in each post.",
      "after": "Chloe ✦\nRepeat outfits. Secondhand finds.\nGood shoes, loud playlists.\nOutfit details in each post."
    },
    {
      "id": "lovely",
      "title": "Fan account",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.lovely",
      "before": "Lucy | live music diary\nGig photos & setlist memories ♡ Always up for talking music. Fan account · not affiliated.",
      "after": "Lucy | live music diary\nGig photos & setlist memories ♡\nAlways up for talking music.\nFan account · not affiliated."
    },
    {
      "id": "travel",
      "title": "Weekend travel",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.travel",
      "before": "Olivia | weekends away\nShort trips without the packed itinerary. Train rides, little towns, good food. Saved routes & stays ↓",
      "after": "Olivia | weekends away\nShort trips without the packed itinerary.\nTrain rides, little towns, good food.\nSaved routes & stays ↓"
    },
    {
      "id": "photographer",
      "title": "Photographer",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.photographer",
      "before": "Riley | portrait photographer\nRelaxed portraits, natural light. Based in Bristol · available to travel. Portfolio & booking enquiries ↓",
      "after": "Riley | portrait photographer\nRelaxed portraits, natural light.\nBased in Bristol · available to travel.\nPortfolio & booking enquiries ↓"
    },
    {
      "id": "shop",
      "title": "Small shop",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.shop",
      "before": "Field Notes Studio | ceramics\nSmall-batch pottery for everyday use. Made by hand in Portland. Shop & shipping details ↓",
      "after": "Field Notes Studio | ceramics\nSmall-batch pottery for everyday use.\nMade by hand in Portland.\nShop & shipping details ↓"
    },
    {
      "id": "local-business",
      "title": "Neighborhood café",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.local.business",
      "before": "Sunday Counter | coffee & bakes\nYour neighborhood coffee stop. Tue–Sun, 8am–3pm · closed Mondays Menu & directions ↓",
      "after": "Sunday Counter | coffee & bakes\nYour neighborhood coffee stop.\nTue–Sun, 8am–3pm · closed Mondays\nMenu & directions ↓"
    },
    {
      "id": "business",
      "title": "Freelance designer",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.business",
      "before": "Jamie | brand designer\nThoughtful identities for small businesses. Branding · packaging · print Selected work & project enquiries ↓",
      "after": "Jamie | brand designer\nThoughtful identities for small businesses.\nBranding · packaging · print\nSelected work & project enquiries ↓"
    },
    {
      "id": "pets",
      "title": "Pets",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.pets",
      "before": "Milo & his human 🐾\nProfessional stick collector. Walks, naps, repeat. Managed by the one holding the treats.",
      "after": "Milo & his human 🐾\nProfessional stick collector.\nWalks, naps, repeat.\nManaged by the one holding the treats."
    },
    {
      "id": "student",
      "title": "Student / campus life",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.student",
      "before": "Casey | campus days\nLectures, library breaks & life in between. Study notes, club days, weekend plans 📚",
      "after": "Casey | campus days\nLectures, library breaks & life in between.\nStudy notes, club days, weekend plans 📚"
    },
    {
      "id": "beauty",
      "title": "Beauty creator",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.beauty",
      "before": "Maya | makeup & beauty\nEveryday makeup & products I actually use. Combination skin · wear tests & routines Ads & gifted products disclosed in posts. Collabs ↓",
      "after": "Maya | makeup & beauty\nEveryday makeup & products I actually use.\nCombination skin · wear tests & routines\nAds & gifted products disclosed in posts.\nCollabs ↓"
    },
    {
      "id": "company",
      "title": "Company account",
      "subtitle": "A bio to customize with your own details",
      "handle": "sample.company",
      "before": "Northline Studio | Official\nBrand design for growing businesses. Our work, team updates & behind the scenes. Services & enquiries on our website ↓",
      "after": "Northline Studio | Official\nBrand design for growing businesses.\nOur work, team updates & behind the scenes.\nServices & enquiries on our website ↓"
    }
  ],
  "ja": [
    {
      "id": "cafe",
      "title": "カフェ巡り",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.cafe",
      "before": "ラナ｜東京カフェ\n週末は気になるカフェへ ☕ コーヒーと焼き菓子が好きです お店の情報は投稿にまとめています",
      "after": "ラナ｜東京カフェ\n週末は気になるカフェへ ☕\nコーヒーと焼き菓子が好きです\nお店の情報は投稿にまとめています"
    },
    {
      "id": "daily",
      "title": "日常・暮らし",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.daily",
      "before": "あおい\n本と散歩、ときどき喫茶店 何気ない日々の記録 気ままに更新しています",
      "after": "あおい\n本と散歩、ときどき喫茶店\n何気ない日々の記録\n気ままに更新しています"
    },
    {
      "id": "y2k",
      "title": "古着・コーデ",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.y2k",
      "before": "りお｜古着と日々の服\n古着多めの着回し記録 スニーカーと音楽が好きです 着用アイテムは投稿に載せています",
      "after": "りお｜古着と日々の服\n古着多めの着回し記録\nスニーカーと音楽が好きです\n着用アイテムは投稿に載せています"
    },
    {
      "id": "lovely",
      "title": "推し活",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.lovely",
      "before": "ゆい ୨୧\n好きなステージと現場の記録 🫧 同じ趣味の方とお話できたらうれしいです ファンアカウントです",
      "after": "ゆい ୨୧\n好きなステージと現場の記録 🫧\n同じ趣味の方とお話できたらうれしいです\nファンアカウントです"
    },
    {
      "id": "travel",
      "title": "週末旅",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.travel",
      "before": "なつ｜週末のおでかけ\n電車で行ける、小さな旅 喫茶店・温泉・街歩き 行き方や寄り道もまとめています",
      "after": "なつ｜週末のおでかけ\n電車で行ける、小さな旅\n喫茶店・温泉・街歩き\n行き方や寄り道もまとめています"
    },
    {
      "id": "photographer",
      "title": "写真・撮影依頼",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.photographer",
      "before": "そう｜出張フォトグラファー\n家族写真・プロフィール撮影 東京を中心に出張しています 作例・撮影のご相談はこちら ↓",
      "after": "そう｜出張フォトグラファー\n家族写真・プロフィール撮影\n東京を中心に出張しています\n作例・撮影のご相談はこちら ↓"
    },
    {
      "id": "shop",
      "title": "ハンドメイド",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.shop",
      "before": "こもれび｜布小物\n暮らしになじむ、手作りの布小物 新作や制作の様子を載せています ご購入・発送についてはショップへ ↓",
      "after": "こもれび｜布小物\n暮らしになじむ、手作りの布小物\n新作や制作の様子を載せています\nご購入・発送についてはショップへ ↓"
    },
    {
      "id": "local-business",
      "title": "ネイルサロン",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.local.business",
      "before": "nagi nail｜吉祥寺\n日常に合わせやすいシンプルネイル 完全予約制 メニュー・空き状況・ご予約はこちら ↓",
      "after": "nagi nail｜吉祥寺\n日常に合わせやすいシンプルネイル\n完全予約制\nメニュー・空き状況・ご予約はこちら ↓"
    },
    {
      "id": "business",
      "title": "イラスト・お仕事",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.business",
      "before": "しおり｜イラストレーター\n食べものと暮らしのイラスト 制作実績を載せています お仕事のご相談はリンク先へ ↓",
      "after": "しおり｜イラストレーター\n食べものと暮らしのイラスト\n制作実績を載せています\nお仕事のご相談はリンク先へ ↓"
    },
    {
      "id": "pets",
      "title": "手帳・文房具",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.pets",
      "before": "あお｜手帳と文房具\n手帳と文房具の記録 ✎ 書くこと、集めることが好きです お気に入りを少しずつ紹介します",
      "after": "あお｜手帳と文房具\n手帳と文房具の記録 ✎\n書くこと、集めることが好きです\nお気に入りを少しずつ紹介します"
    },
    {
      "id": "student",
      "title": "学生・キャンパスライフ",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.student",
      "before": "りん｜大学生活の記録\n授業とサークル、ときどきカフェ 勉強のことも、休日のことも 📚 マイペースに更新しています",
      "after": "りん｜大学生活の記録\n授業とサークル、ときどきカフェ\n勉強のことも、休日のことも 📚\nマイペースに更新しています"
    },
    {
      "id": "beauty",
      "title": "美容・コスメ発信",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.beauty",
      "before": "まい｜コスメとメイク\n混合肌｜毎日のメイクと使い心地の記録 色味や使用感を写真で紹介しています PR・提供品は投稿に明記 お仕事のご相談はリンク先へ ↓",
      "after": "まい｜コスメとメイク\n混合肌｜毎日のメイクと使い心地の記録\n色味や使用感を写真で紹介しています\nPR・提供品は投稿に明記\nお仕事のご相談はリンク先へ ↓"
    },
    {
      "id": "company",
      "title": "企業公式アカウント",
      "subtitle": "自分の情報に書き換えて使えます",
      "handle": "sample.company",
      "before": "こはるデザイン｜公式\nお店やブランドのデザインをお手伝いします 制作実績・スタッフのこと・日々の取り組み サービスのご案内・お問い合わせはこちら ↓",
      "after": "こはるデザイン｜公式\nお店やブランドのデザインをお手伝いします\n制作実績・スタッフのこと・日々の取り組み\nサービスのご案内・お問い合わせはこちら ↓"
    }
  ]
});
export function profileTemplates(lang:Lang):ProfileTemplate[]{const rows=lang==='es'||lang==='ms'||lang==='pt-BR'||lang==='id'||lang==='tr'?additionalTemplates[lang]:templates[lang];return rows.map(t=>decorateProfile({...t,id:t.id as ProfileThemeId},lang));}
export function templateFromHash(hash:string,lang:Lang){return profileTemplates(lang).find(t=>'#'+t.id===hash)??null;}

export function profileMetadata(lang:Lang){const description=(withLocales({ko:'13가지 인스타 소개글 예시를 내 정보로 바꾸고 글꼴·특수문자·정렬을 적용하세요. 원형 프로필 사진도 만들 수 있어요.',en:'Edit 13 Instagram bio templates with fancy text, symbols and a profile photo.',ja:'13種類のインスタ自己紹介テンプレートを編集。文字・顔文字・配置を選び、丸いプロフィール写真も作れます。'}))[lang];return commonMetadata(lang,'/profile/',seoTitles[lang].profile,description);}

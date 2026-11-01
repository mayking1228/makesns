// Only reviewed, published locales participate in routes, menus and SEO.
export const languageCodes=['en','ko','ja','es','ms','pt-BR','id','tr'] as const;
export type LanguageCode=typeof languageCodes[number];
export const publishedLocaleNames:Record<LanguageCode,string>={en:'English',ko:'한국어',ja:'日本語',es:'Español',ms:'Bahasa Melayu','pt-BR':'Português (Brasil)',id:'Bahasa Indonesia',tr:'Türkçe'};
export const localeSearchNames:Record<LanguageCode,string>={en:'English 영어 英語 inglés bahasa Inggeris',ko:'한국어 Korean 韓国語 coreano bahasa Korea',ja:'日本語 Japanese 일본어 japonés bahasa Jepun',es:'Español Spanish 스페인어 スペイン語 bahasa Sepanyol',ms:'Bahasa Melayu Malay 말레이어 マレー語 malayo Malaysia','pt-BR':'Português Brasil Brazilian Portuguese 포르투갈어 브라질 ポルトガル語 português Brasil',id:'Bahasa Indonesia Indonesian 인도네시아어 インドネシア語 indonésio indonesio',tr:'Türkçe Turkish Türkiye Turkce 터키어 トルコ語 turco'};
export const languageLocales:Record<LanguageCode,string>={en:'en_US',ko:'ko_KR',ja:'ja_JP',es:'es_ES',ms:'ms_MY','pt-BR':'pt_BR',id:'id_ID',tr:'tr_TR'};
export const localeShortNames:Record<LanguageCode,string>={en:'EN',ko:'한국어',ja:'日本語',es:'ES',ms:'BM','pt-BR':'PT-BR',id:'ID',tr:'TR'};
// Planning data only. No empty routes or hreflang targets are generated from this list.
export const languageRoadmap=[
 {code:'fr',name:'Français',english:'French',script:'Latin',phase:1},
 {code:'de',name:'Deutsch',english:'German',script:'Latin',phase:1},
 {code:'vi',name:'Tiếng Việt',english:'Vietnamese',script:'Latin',phase:2},
 {code:'fil',name:'Filipino',english:'Filipino',script:'Latin',phase:2},
 {code:'ru',name:'Русский',english:'Russian',script:'Cyrillic',phase:3},
 {code:'th',name:'ไทย',english:'Thai',script:'Thai',phase:3},
 {code:'hi',name:'हिन्दी',english:'Hindi',script:'Devanagari',phase:3,needsDecision:true}
] as const;
export function normalizeNavigationSearch(value:string){return value.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase().replace(/ı/g,'i').trim();}
export function findLanguages(query:string){const q=normalizeNavigationSearch(query);return languageCodes.filter(code=>!q||normalizeNavigationSearch(code+' '+publishedLocaleNames[code]+' '+localeSearchNames[code]).includes(q));}

export function suggestedLanguage(value:string):LanguageCode{const lower=value.toLowerCase();if(lower==='pt'||lower.startsWith('pt-'))return 'pt-BR';return languageCodes.find(code=>code.toLowerCase()===lower||code===lower.split('-')[0])??'en';}

// Flags complement the native language names; language is never identified by a flag alone.
export const localeFlags:Record<LanguageCode,string>={"en": "/flags/us.svg", "ko": "/flags/kr.svg", "ja": "/flags/jp.svg", "es": "/flags/es.svg", "ms": "/flags/my.svg", "pt-BR": "/flags/br.svg", "id": "/flags/id.svg", "tr": "/flags/tr.svg"};

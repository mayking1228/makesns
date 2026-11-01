import {localeFlags,type LanguageCode} from '@/lib/language-registry';
export function LanguageFlag({lang}:{lang:LanguageCode}){return <span className="language-flag" aria-hidden="true"><img src={localeFlags[lang]} alt="" width={24} height={18} decoding="async"/></span>;}

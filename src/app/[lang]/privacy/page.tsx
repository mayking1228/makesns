import {linkCopy} from '@/lib/link-tools';
import {SeoGraph} from '@/components/SeoGraph';
import {privacyMetadata} from '@/lib/seo';
import {ui} from '@/lib/ui';
import {notFound} from 'next/navigation';import {Header,Footer} from '@/components/SiteChrome';import {copy,isLang,languageAlternates} from '@/lib/site';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return isLang(lang)?privacyMetadata(lang):{};}
export default async function Privacy({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();const m=privacyMetadata(lang);return <><Header lang={lang} tool="privacy"/><main id="main" className="site-width privacy-page"><span className="eyebrow">MAKESNS</span><h1>{copy[lang].privacyTitle}</h1><p>{copy[lang].privacyText}</p><h2>{linkCopy[lang].short}</h2><p>{linkCopy[lang].privacy}</p><p>{linkCopy[lang].historyInfo}</p><p><a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">{ui(lang,'Google 개인정보처리방침','Google Privacy Policy')} ↗</a></p><p>{ui(lang,'이 서비스는 Instagram·TikTok·Threads 및 그 운영사와 제휴하거나 공식적으로 연결되어 있지 않습니다.','MakeSNS is not affiliated with or endorsed by Instagram, TikTok, Threads or their owners.')}</p><SeoGraph lang={lang} path={`/${lang}/privacy/`} title={m.title} description={m.description}/></main><Footer lang={lang}/></>;}

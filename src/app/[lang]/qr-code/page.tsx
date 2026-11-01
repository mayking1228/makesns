import {notFound} from 'next/navigation';
import Link from 'next/link';
import {isLang,copy} from '@/lib/site';
import {linkCopy,linkMetadata} from '@/lib/link-tools';
import {Header,Footer} from '@/components/SiteChrome';
import {SeoGraph} from '@/components/SeoGraph';
import {QrTool} from '@/components/QrTool';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return isLang(lang)?linkMetadata(lang,'qr-code'):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();const c=linkCopy[lang],m=linkMetadata(lang,'qr-code');return <><Header lang={lang} tool="qr-code"/><main id="main" className="site-width tool-page"><div className="breadcrumbs"><Link href={`/${lang}/`}>{copy[lang].home}</Link><span>›</span><span>{c.qr}</span></div><div className="tool-page-heading"><div><h1>{c.qr}</h1><p>{c.qrIntro}</p></div><span className="free-pill">{copy[lang].free}</span></div><QrTool lang={lang}/><SeoGraph lang={lang} path={`/${lang}/qr-code/`} title={m.title} description={m.description} application/></main><Footer lang={lang}/></>;}

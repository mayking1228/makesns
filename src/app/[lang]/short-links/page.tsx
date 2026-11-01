import {notFound} from 'next/navigation';
import Link from 'next/link';
import {isLang,copy} from '@/lib/site';
import {linkCopy,linkMetadata} from '@/lib/link-tools';
import {Header,Footer} from '@/components/SiteChrome';
import {SeoGraph} from '@/components/SeoGraph';
import {ShortLinksTool} from '@/components/ShortLinksTool';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return isLang(lang)?linkMetadata(lang,'short-links'):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();const c=linkCopy[lang],m=linkMetadata(lang,'short-links');return <><Header lang={lang} tool="short-links"/><main id="main" className="site-width tool-page"><div className="breadcrumbs"><Link href={`/${lang}/`}>{copy[lang].home}</Link><span>›</span><span>{c.short}</span></div><div className="tool-page-heading"><div><h1>{c.short}</h1><p>{c.shortIntro}</p></div><span className="free-pill">{copy[lang].free}</span></div><ShortLinksTool lang={lang}/><SeoGraph lang={lang} path={`/${lang}/short-links/`} title={m.title} description={m.description} application/></main><Footer lang={lang}/></>;}

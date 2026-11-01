import {SeoGraph} from '@/components/SeoGraph';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {isLang,copy} from '@/lib/site';
import {reelsCopy,reelsMetadata,reelsGuide} from '@/lib/reels-cover';
import {Header,Footer} from '@/components/SiteChrome';
import {ReelsCoverTool} from '@/components/ReelsCoverTool';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return isLang(lang)?reelsMetadata(lang):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();const m=reelsMetadata(lang),c=reelsCopy[lang],g=reelsGuide[lang];return <><Header lang={lang} tool="reels-cover"/><main id="main" className="site-width tool-page"><div className="breadcrumbs"><Link href={`/${lang}/`}>{copy[lang].home}</Link><span>›</span><span>{c.title}</span></div><div className="tool-page-heading"><div><h1>{c.title}</h1><p>{c.intro}</p></div><span className="free-pill">{copy[lang].free}</span></div><ReelsCoverTool lang={lang}/><section className="reels-howto"><h2>{g.title}</h2><ol>{g.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{c.help}</p><p>{c.guideNote}</p>{g.faq.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<Link className="button" href={`/${lang}/resizer/`}>{copy[lang].nav[3]}</Link></section><SeoGraph lang={lang} path={`/${lang}/reels-cover/`} title={m.title} description={m.description} application/></main><Footer lang={lang}/></>;}

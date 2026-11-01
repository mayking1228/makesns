import {SeoGraph} from '@/components/SeoGraph';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {isLang,copy} from '@/lib/site';
import {profileCopy,profileMetadata} from '@/lib/profile-templates';
import {Header,Footer} from '@/components/SiteChrome';
import {ProfileStudio} from '@/components/ProfileStudio';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return isLang(lang)?profileMetadata(lang):{};}
export default async function ProfilePage({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();const m=profileMetadata(lang);return <><Header lang={lang} tool="profile"/><main id="main" className="site-width tool-page"><div className="breadcrumbs"><Link href={`/${lang}/`}>{copy[lang].home}</Link><ArrowRight size={12}/><span>{profileCopy[lang].nav}</span></div><div className="tool-page-heading"><div><h1>{profileCopy[lang].nav}</h1><p>{profileCopy[lang].intro}</p></div><span className="free-pill">{copy[lang].free}</span></div><ProfileStudio lang={lang} workspace/><SeoGraph lang={lang} path={`/${lang}/profile/`} title={m.title} description={m.description} application/></main><Footer lang={lang}/></>;}

import '@fontsource-variable/noto-sans-jp';
import {AnalyticsConsent} from '@/components/AnalyticsConsent';
import type {Metadata} from 'next';import {notFound} from 'next/navigation';import {languages,isLang,origin} from '@/lib/site';import '../globals.css';
export const metadata:Metadata={verification:{other:{'naver-site-verification':'531beb9f2f7c8163e9309847000dc6ebcde2d505'}},metadataBase:new URL(origin),applicationName:'MakeSNS',icons:{icon:'/icon.svg'}};
export function generateStaticParams(){return languages.map(lang=>({lang}));}export const dynamicParams=false;
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{lang:string}>}){const {lang}=await params;if(!isLang(lang))notFound();return <html lang={lang}><body>{children}<AnalyticsConsent lang={lang}/></body></html>;}

import {entryMetadata} from '@/lib/seo';
import '@fontsource-variable/noto-sans-jp';
import {AnalyticsConsent} from '@/components/AnalyticsConsent';
import type {Metadata} from 'next';import '../globals.css';
export const metadata:Metadata={...entryMetadata,verification:{other:{'naver-site-verification':'531beb9f2f7c8163e9309847000dc6ebcde2d505'}},metadataBase:new URL('https://makesns.com'),icons:{icon:'/icon.svg'}};
export default function EntryLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<AnalyticsConsent/></body></html>;}

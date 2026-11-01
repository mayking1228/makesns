import type {Lang} from '@/lib/site';
import {structuredPage,safeJsonLd} from '@/lib/seo';
export function SeoGraph(props:{lang?:Lang;path:string;title:string;description:string;application?:boolean}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(structuredPage(props))}}/>;}

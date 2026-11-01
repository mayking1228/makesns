import type {MetadataRoute} from 'next';
import {exampleSlugs} from '@/lib/example-routes';
import {languages,tools,origin,languageAlternates} from '@/lib/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{const urls=(path:string)=>Object.fromEntries(Object.entries(languageAlternates(path)).map(([lang,url])=>[lang,origin+url]));return [{url:origin+'/',changeFrequency:'monthly',priority:.6,alternates:{languages:urls('/')}},...languages.flatMap(lang=>['',...tools,'qr-code','short-links','reels-cover','profile','examples',...exampleSlugs.map(slug=>'examples/'+slug),'privacy'].map(tool=>{const path=tool?'/'+tool+'/':'/';return {url:`${origin}/${lang}${path}`,changeFrequency:'monthly' as const,priority:tool==='privacy'?.2:tool?.8:1,alternates:{languages:urls(path)}};}))];}

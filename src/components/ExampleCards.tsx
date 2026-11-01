import Link from 'next/link';
import {ArrowUpRight,AlignLeft,Sparkles,UserRound} from 'lucide-react';
import type {Lang} from '@/lib/site';
import {exampleGuides,examplesCopy} from '@/lib/examples';
import type {ExampleSlug} from '@/lib/example-routes';
const icons={'profile-bio':UserRound,'caption-spacing':AlignLeft,symbols:Sparkles};
export function ExampleCards({lang,except}:{lang:Lang;except?:ExampleSlug}){return <div className="example-cards">{exampleGuides(lang).filter(guide=>guide.slug!==except).map(guide=>{const Icon=icons[guide.slug];return <Link key={guide.slug} href={`/${lang}/examples/${guide.slug}/`} className="example-card"><span className="example-icon"><Icon size={23}/></span><h3>{guide.title}</h3><p>{guide.description}</p><span className="example-card-action">{examplesCopy[lang].read}<ArrowUpRight size={17}/></span></Link>;})}</div>;}

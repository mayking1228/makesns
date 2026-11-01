import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {Lang} from '@/lib/site';
import type {ExampleSlug} from '@/lib/example-routes';
import {examplesCopy,guideSamples} from '@/lib/examples';
import {CopyButton} from './CopyButton';
import {ProfileTransferButton} from './LibraryControls';
export function UsageSamples({lang,slug}:{lang:Lang;slug:ExampleSlug}){const c=examplesCopy[lang];return <div className="usage-samples">{guideSamples(lang,slug).map(sample=><article className="usage-sample" key={sample.id} id={'sample-'+sample.id}><h3>{sample.title}</h3><div className="usage-comparison"><div><span>{c.before}</span><pre>{sample.before}</pre></div><div><span>{c.after}</span><pre>{sample.after}</pre></div></div><div className="usage-actions">{sample.profileTheme?<Link className="button primary" href={`/${lang}/profile/#${sample.profileTheme}`}>{c.useProfile}<ArrowUpRight size={15}/></Link>:sample.captionId?<Link className="button primary" href={`/${lang}/caption/#example-${sample.captionId}`}>{c.useCaption}<ArrowUpRight size={15}/></Link>:<ProfileTransferButton lang={lang} kind="symbol" text={sample.after}/>}<CopyButton lang={lang} text={sample.copyText} label={c.copy}/></div></article>)}<p className="examples-disclaimer">{c.note}</p></div>;}

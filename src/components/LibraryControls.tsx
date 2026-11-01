'use client';
import {Star,ArrowUpRight} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {workflowCopy} from '@/lib/workflow-copy';
import type {Lang} from '@/lib/site';
import {queueTransfer,type ProfileTransfer} from '@/lib/profile-draft';
export function FavoriteButton({lang,active,onToggle}:{lang:Lang;active:boolean;onToggle:()=>void}){const c=workflowCopy[lang];return <button type="button" className="favorite-toggle" aria-pressed={active} aria-label={active?c.unfavorite:c.favorite} title={active?c.unfavorite:c.favorite} onClick={onToggle}><Star size={18} fill={active?'currentColor':'none'}/></button>;}
export function ProfileTransferButton({lang,kind,text,onUse}:{lang:Lang;kind:ProfileTransfer['kind'];text:string;onUse?:(text:string)=>void}){const router=useRouter(),c=workflowCopy[lang];return <button className="button profile-add" type="button" disabled={!text.trim()||text.length>500} title={text.length>500?c.max:undefined} onClick={()=>{if(onUse){onUse(text);return;}queueTransfer({kind,text});router.push(`/${lang}/profile/#profile-editor`);}}>{onUse?(kind==='name'?c.apply:c.insert):(kind==='name'?c.useName:c.useSymbol)}<ArrowUpRight size={14}/></button>;}
export function LibraryNotice({lang,persistent}:{lang:Lang;persistent:boolean}){return <p className="library-note" role={persistent?undefined:'status'}>{workflowCopy[lang][persistent?'local':'blocked']}</p>;}

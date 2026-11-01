'use client';
import {withLocales,localText} from '@/lib/locale-data';

import {useEffect,useRef,useState,type RefObject} from 'react';
import dynamic from 'next/dynamic';
import {workflowCopy} from '@/lib/workflow-copy';
import {readDraft,saveDraft,clearDraft,takeTransfer,splitProfile,replaceName,insertSnippet,applyTransfer,localizeSampleDraft} from '@/lib/profile-draft';
import {trackUsage} from '@/lib/analytics-client';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight,Coffee,Flower2,Grid3X3,Heart,Briefcase,Mountain,MoreHorizontal,Plane,Sparkles,ChevronLeft,ChevronDown,Bell,UserRoundPlus,Clapperboard,ContactRound} from 'lucide-react';
import type {Lang} from '@/lib/site';
import {captionStats,plainFancyText,wrapText} from '@/lib/text';
import {profileCopy,profileTemplates,templateFromHash,type ProfileTemplate,type ProfileThemeId} from '@/lib/profile-templates';
import {photoCopy} from '@/lib/profile-photo';
import {alignmentCopy,type BioAlignment} from '@/lib/profile-alignment';
import {useBioAlignment} from '@/lib/use-bio-alignment';
import {decorationLabels} from '@/lib/profile-decoration';
import {CopyButton} from './CopyButton';
const FontBrowser=dynamic(()=>import('./FontsTool').then(m=>m.FontsTool),{ssr:false,loading:()=> <p role="status">…</p>});
const PhotoTool=dynamic(()=>import('./ProfilePhotoTool').then(m=>m.ProfilePhotoTool),{ssr:false,loading:()=> <p role="status">…</p>});
const SymbolBrowser=dynamic(()=>import('./SymbolsTool').then(m=>m.SymbolsTool),{ssr:false,loading:()=> <p role="status">…</p>});
const themeIcons={cafe:Coffee,daily:Heart,y2k:Sparkles,lovely:Heart,business:Briefcase,travel:Plane,photographer:ContactRound,shop:Briefcase,"local-business":Coffee,pets:Heart,student:Grid3X3,beauty:Sparkles,company:Briefcase};
function ProfilePreview({lang,theme,text,handle,label,bioRef,avatar,alignment='left'}:{lang:Lang;theme:ProfileThemeId;text:string;handle:string;label:string;bioRef?:RefObject<HTMLParagraphElement|null>;avatar?:string;alignment?:BioAlignment}){
 const c=profileCopy[lang],Icon=themeIcons[theme],[name,...bio]=text.split('\n');
 const category=profileTemplates(lang).find(t=>t.id===theme)?.title??'';
 const highlights=(withLocales({ko:['일상','좋아하는 것','기록'],en:['Daily','Favorites','Memories'],ja:['日常','お気に入り','記録']}))[lang];
 return <article className={'ps-mock ps-theme-'+theme} aria-label={label}>
  <div className="ps-mock-bar"><ChevronLeft size={23} aria-hidden="true"/><strong>{handle||'your.profile'}</strong><Bell size={21} aria-hidden="true"/><MoreHorizontal size={22} aria-hidden="true"/></div>
  <div className="ps-mock-stats"><span className="ps-avatar"><span className="ps-avatar-photo"><>{avatar?<img src={avatar} alt=""/>:<Icon size={33} strokeWidth={1.3} aria-hidden="true"/>}</></span></span><div><b>124</b><span>{c.posts}</span></div><div><b>{(1500).toLocaleString(lang)}</b><span>{c.followers}</span></div><div><b>320</b><span>{c.following}</span></div></div>
  <div className="ps-mock-bio"><strong>{name||'…'}</strong><span className="ps-account-category">{category}</span><p ref={bioRef} style={alignment==='left'?undefined:{maxWidth:310,marginInlineStart:'auto',marginInlineEnd:alignment==='center'?'auto':0}}>{bio.join('\n')||'…'}</p></div>
  <div className="ps-mock-buttons" aria-hidden="true"><span className="ps-follow-label">{c.follow}<ChevronDown size={12}/></span><span>{c.message}</span><span className="ps-suggest-label"><UserRoundPlus size={17}/></span></div>
  <div className="ps-highlights" aria-hidden="true">{[Icon,Heart,Mountain].map((Highlight,i)=><div key={highlights[i]}><span><Highlight size={23} strokeWidth={1.2}/></span><small>{highlights[i]}</small></div>)}</div>
  <div className="ps-mock-tabs" aria-hidden="true"><span className="ps-grid-active"><Grid3X3 size={22}/></span><span><Clapperboard size={23}/></span><span><ContactRound size={24}/></span></div>
  <div className="ps-mock-tiles" aria-hidden="true"><div className="ps-post ps-post-one"><Icon size={39} strokeWidth={1.1}/><span>{localText(lang, 'daily moments')}</span></div><div className="ps-post ps-post-two"><Flower2 size={49} strokeWidth={1.1}/><span>{localText(lang, 'little things')}</span></div><div className="ps-post ps-post-three"><Mountain size={47} strokeWidth={1.1}/><span>{localText(lang, 'slow days')}</span></div></div>
 </article>;
}
export function ProfileStudio({lang,workspace=false}:{lang:Lang;workspace?:boolean}){
 const c=profileCopy[lang],w=workflowCopy[lang],templates=profileTemplates(lang),router=useRouter();
 const [alignment,setAlignment]=useState<BioAlignment>('left'),[galleryAlignment,setGalleryAlignment]=useState<BioAlignment>('left'),[avatar,setAvatar]=useState<string>(),[photoOpen,setPhotoOpen]=useState(false);
 const liveBio=useRef<HTMLParagraphElement>(null),sampleBio=useRef<HTMLParagraphElement>(null);
 const [selected,setSelected]=useState(0),[view,setView]=useState<'before'|'after'>('after');
 const [base,setBase]=useState(templates[0]),[draft,setDraft]=useState(workspace?'':templates[0].after),[handle,setHandle]=useState(workspace?'':templates[0].handle),[pending,setPending]=useState<ProfileTemplate|null>(null),[status,setStatus]=useState('');
 const photoSection=useRef<HTMLDivElement>(null);
 const editor=useRef<HTMLDivElement>(null),textarea=useRef<HTMLTextAreaElement>(null),touch=useRef<{x:number;y:number}|null>(null),range=useRef({start:0,end:0}),skipSave=useRef(false);
 const [ready,setReady]=useState(false),[saved,setSaved]=useState(true),[decorate,setDecorate]=useState<'fonts'|'symbols'|null>(null),[clearOpen,setClearOpen]=useState(false),[finished,setFinished]=useState(false);
 useEffect(()=>{if(!workspace)return;const cached=readDraft(),stored=cached?localizeSampleDraft(cached,lang):null,chosen=templateFromHash(window.location.hash,lang);let data=stored??{version:1 as const,theme:templates[0].id,text:'',handle:''};let pendingChoice:ProfileTemplate|null=null;
  if(chosen){const prior=templates.find(t=>t.id===data.theme)!;if(stored&&(stored.text.trim()||stored.handle.trim())&&(stored.text!==prior.after||stored.handle!==prior.handle)){if(chosen.id!==data.theme)pendingChoice=chosen;}else data={version:1,theme:chosen.id,text:chosen.after,handle:chosen.handle};setSelected(templates.findIndex(t=>t.id===chosen.id));}
  const transfer=takeTransfer(),beforeTransfer=data.text;if(transfer)data=applyTransfer(data,transfer);const transferBlocked=Boolean(transfer&&transfer.kind==='symbol'&&data.text===beforeTransfer);
  const requestedAlignment=new URLSearchParams(window.location.search).get('align');setAlignment(chosen&&['left','center','right'].includes(requestedAlignment||'')?requestedAlignment as BioAlignment:stored?.alignment??'left');
  setBase(templates.find(t=>t.id===data.theme)!);setDraft(data.text);setHandle(data.handle);setPending(pendingChoice);range.current={start:splitProfile(data.text).bio.length,end:splitProfile(data.text).bio.length};setStatus(transferBlocked?w.max:transfer?w.added:stored?w.restored:'');setReady(true);if(chosen||transfer)requestAnimationFrame(()=>editor.current?.scrollIntoView({behavior:'instant',block:'start'}));
 },[lang,workspace]);
 useEffect(()=>{if(!workspace||!ready)return;if(skipSave.current){skipSave.current=false;return;}setSaved(saveDraft({version:1,theme:base.id,text:draft,handle,alignment}));setFinished(false);},[workspace,ready,base.id,draft,handle,alignment]);
 const parts=splitProfile(draft),template=templates[selected],sampleParts=splitProfile(template.after),aligned=useBioAlignment(parts.bio,alignment,liveBio),sampleAligned=useBioAlignment(sampleParts.bio,galleryAlignment,sampleBio),dirty=Boolean(draft.trim()||handle.trim())&&(draft!==base.after||handle!==base.handle);
 function focusBio(position?:number){requestAnimationFrame(()=>{textarea.current?.focus();if(position!==undefined)textarea.current?.setSelectionRange(position,position);});}
 function useName(name:string){setDraft(replaceName(draft,name));setStatus(w.added);setDecorate(null);requestAnimationFrame(()=>document.getElementById('profile-name')?.focus());}
 function useSymbol(symbol:string){const next=insertSnippet(parts.bio,symbol,range.current.start,range.current.end,1799);if(!next.inserted){setStatus(w.max);return;}setDraft(parts.name+'\n'+next.text);range.current={start:next.position,end:next.position};setStatus(w.added);setDecorate(null);focusBio(next.position);}
 function useFrame(frame:string){if(textarea.current)range.current={start:textarea.current.selectionStart,end:textarea.current.selectionEnd};const selected=parts.bio.slice(range.current.start,range.current.end);if(!selected){setStatus(localText(lang, lang==='ko'?'소개글에서 감쌀 문장을 먼저 선택하세요.':lang==='ja'?'自己紹介から囲みたい文章を選択してください。':'Select the bio text you want to frame first.'));return;}useSymbol(wrapText(selected,frame));}
 function clear(){clearDraft();setAlignment('left');setAvatar(undefined);setPhotoOpen(false);skipSave.current=true;setDraft('');setHandle('');setPending(null);setStatus('');setDecorate(null);setClearOpen(false);setFinished(false);}
 function complete(part:'name'|'bio'|'all'){setFinished(true);trackUsage('profile_complete',{part});}
 const finalText=parts.name&&aligned.text?parts.name+'\n'+aligned.text:parts.name||aligned.text;

 function replace(t:ProfileTemplate){setAlignment(galleryAlignment);setBase(t);setDraft(t.after);setHandle(t.handle);setPending(null);setDecorate(null);range.current={start:splitProfile(t.after).bio.length,end:splitProfile(t.after).bio.length};setStatus(c.loaded);requestAnimationFrame(()=>{editor.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});textarea.current?.focus({preventScroll:true});});}
 function load(t:ProfileTemplate){if(!workspace){router.push(`/${lang}/profile/?align=${galleryAlignment}#${t.id}`);return;}if(dirty){setPending(t);setStatus('');requestAnimationFrame(()=>editor.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));}else replace(t);}
 function move(by:number){setSelected(i=>(i+by+templates.length)%templates.length);}
 const bioCount=captionStats(aligned.text).characters,ac=alignmentCopy[lang],accents=decorationLabels[lang];
 const foreignDraft=workspace&&lang!=='ko'&&/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u.test(draft);
 return <section className={workspace?'profile-studio':'profile-studio profile-studio-home site-width'} id="profile-showcase">
  {workspace&&<nav className="profile-steps" aria-label={w.resume}><a href="#profile-showcase"><b>1</b>{w.choose}</a><a href="#profile-editor"><b>2</b>{w.edit}</a><a href="#profile-decorations"><b>3</b>{w.decorate}</a><a href="#profile-finish"><b>4</b>{w.finish}</a></nav>}
  {workspace&&<div className="profile-photo-entry"><span>{photoCopy[lang].title}</span><button className="button" type="button" onClick={()=>{setPhotoOpen(true);requestAnimationFrame(()=>photoSection.current?.scrollIntoView({behavior:'smooth',block:'start'}));}}>{photoCopy[lang].open}</button></div>}
  <div className="ps-heading"><div><span className="eyebrow">{c.gallery}</span><h2>{workspace?c.start:c.title}</h2><p>{c.intro}</p></div>{!workspace&&<Link href={`/${lang}/profile/`} className="button">{c.all}<ArrowUpRight size={16}/></Link>}</div>
  <div className="ps-gallery-navigation">
   <div className="ps-current-theme"><div><h3>{template.title}</h3><span aria-live="polite">{selected+1} / {templates.length}</span></div></div>
   <div className="ps-theme-picker"><label><span>{c.gallery}</span><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{templates.map((t,i)=><option key={t.id} value={i}>{t.title}</option>)}</select></label></div>
   <div className="bio-alignment gallery-alignment"><span>{ac.label}</span><div role="group" aria-label={ac.label}>{(['left','center','right'] as const).map(mode=><button type="button" key={mode} aria-pressed={galleryAlignment===mode} onClick={()=>setGalleryAlignment(mode)}>{ac[mode]}</button>)}</div>{sampleAligned.blocked&&<p role="status">{ac.blocked}</p>}</div>
  </div>
  <div className="ps-view-switch" role="group" aria-label={c.title}>{(['before','after'] as const).map(v=><button type="button" key={v} aria-pressed={view===v} onClick={()=>setView(v)}>{c[v]}</button>)}</div>
  <div className="ps-comparison-wrap"><button type="button" className="ps-card-nav ps-card-prev" aria-label={c.previous} onClick={()=>move(-1)}><ArrowLeft size={20}/></button>
  <div className={'ps-comparison ps-view-'+view} onTouchStart={e=>{if(e.touches.length===1)touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{if(!touch.current||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>65&&Math.abs(dy)<45&&window.getSelection()?.isCollapsed!==false)move(dx<0?1:-1);}}>
   <div className="ps-before"><span className="ps-badge">{c.before}<span>{template.title}</span></span><ProfilePreview lang={lang} theme={template.id} text={template.before} handle={template.handle} label={c.before}/></div>
   <div className="ps-after"><span className="ps-badge">{c.after}<span>{template.title}</span></span><ProfilePreview lang={lang} theme={template.id} text={sampleParts.name+'\n'+sampleAligned.text} bioRef={sampleBio} alignment={galleryAlignment} handle={template.handle} label={c.after}/></div>
  </div>
  <button type="button" className="ps-card-nav ps-card-next" aria-label={c.next} onClick={()=>move(1)}><ArrowRight size={20}/></button></div>
  <div className="ps-template-actions"><button type="button" className="button primary" data-action="use-template" onClick={()=>load(template)}>{w.startTemplate}<ArrowRight size={15}/></button><CopyButton lang={lang} text={sampleParts.name+'\n'+sampleAligned.text} label={c.copyTemplate} onCopied={()=>load(template)}/></div>
  <p className="ps-disclaimer">{c.example}</p>
  <details className="ps-accents"><summary>{accents.title}</summary><ul>{accents.names.map(name=><li key={name}>{name}</li>)}</ul><p>{accents.hint}</p></details>
  <p className="ps-alignment-note">{ac.note}</p>
  {workspace&&<div className="ps-workspace" ref={editor} id="profile-editor">
   <div className="ps-editor"><h2>{c.editor}</h2><p>{c.editorIntro}</p>
    {foreignDraft&&<div className="ps-draft-language" role="status"><p>{localText(lang, lang==='ja'?'以前の下書きに韓国語が含まれています。入力内容を残しています。日本語の例を使う場合は、テンプレートを読み込んでください。':'Your saved draft contains Korean text. Your writing has been kept. Load a template above to start with an English example.')}</p><button type="button" className="button" onClick={()=>load(template)}>{c.load}</button></div>}
    {pending&&<div className="ps-replace" role="alert"><p>{c.replace}</p><div><button className="button primary" type="button" onClick={()=>replace(pending)}>{c.confirm}</button><button className="button" type="button" onClick={()=>setPending(null)}>{c.keep}</button></div></div>}
    <label htmlFor="profile-handle">{c.handle}</label><input id="profile-handle" value={handle} maxLength={50} autoComplete="off" spellCheck={false} onChange={e=>setHandle(e.target.value)}/>
    <label htmlFor="profile-name">{w.name}</label><input id="profile-name" value={parts.name} maxLength={200} autoComplete="off" onChange={e=>setDraft(replaceName(draft,e.target.value))}/>
    <label htmlFor="profile-bio">{w.bio}</label><textarea id="profile-bio" ref={textarea} value={parts.bio} maxLength={1799} onSelect={e=>{range.current={start:e.currentTarget.selectionStart,end:e.currentTarget.selectionEnd};}} onChange={e=>{setDraft(parts.name+'\n'+e.target.value);range.current={start:e.target.selectionStart,end:e.target.selectionEnd};}}/>
    <div className="bio-alignment editor-alignment"><span>{ac.label}</span><div role="group" aria-label={ac.label}>{(['left','center','right'] as const).map(mode=><button type="button" key={mode} aria-pressed={alignment===mode} onClick={()=>setAlignment(mode)}>{ac[mode]}</button>)}</div><p role="status">{aligned.blocked?ac.blocked:ac.note}</p></div>
    <div className="ps-editor-footer"><span className={bioCount>150?'ps-count-long':''}>{bioCount} / 150 {c.count}</span><span role="status">{saved?w.saved:w.unsaved}</span></div>
    <div className="profile-decorations" id="profile-decorations"><h3>{w.decorate}</h3><div className="decoration-tabs" role="group" aria-label={w.decorate}><button type="button" className="button" aria-pressed={decorate==='fonts'} onClick={()=>setDecorate(v=>v==='fonts'?null:'fonts')}>{localText(lang, lang==='ko'?'글꼴 고르기':lang==='ja'?'文字スタイルを選ぶ':'Choose text style')}</button><button type="button" className="button" aria-pressed={decorate==='symbols'} onClick={()=>setDecorate(v=>v==='symbols'?null:'symbols')}>{localText(lang, lang==='ko'?'특수문자 고르기':lang==='ja'?'特殊文字を選ぶ':'Choose symbols')}</button></div>
     {decorate==='fonts'&&<div className="embedded-library"><p>{w.fontHelp}</p><FontBrowser lang={lang} initialText={plainFancyText(parts.name)} onUse={useName}/></div>}
     {decorate==='symbols'&&<div className="embedded-library"><p>{w.symbolHelp}</p><SymbolBrowser lang={lang} onUse={useSymbol} onWrap={useFrame}/></div>}
    </div>
    <p role="status" className="ps-status">{status}</p><p className="ps-editor-note">{c.notice}</p><p className="ps-editor-note">{c.help}</p><p className="ps-editor-note">{w.draftInfo}</p>
    <button type="button" className="text-button" onClick={()=>setClearOpen(true)}>{w.clear}</button>{clearOpen&&<div className="ps-replace" role="alert"><p>{w.clearConfirm}</p><div><button type="button" className="button" onClick={clear}>{w.clearYes}</button><button type="button" className="button" onClick={()=>setClearOpen(false)}>{w.cancel}</button></div></div>}

   </div>
   <div className="ps-live"><h3>{c.preview}</h3><ProfilePreview lang={lang} theme={base.id} text={parts.name+'\n'+aligned.text} bioRef={liveBio} alignment={alignment} avatar={avatar} handle={handle} label={c.preview}/></div>
  </div>}
  {workspace&&<section className="profile-finish" id="profile-finish"><h2>{w.finish}</h2><p>{c.notice}</p><div className="profile-copy-parts"><div><h3>{w.name}</h3><p>{parts.name||'…'}</p><CopyButton lang={lang} text={parts.name} label={w.nameCopy} onCopied={()=>complete('name')}/></div><div><h3>{w.bio}</h3><p>{aligned.text||'…'}</p><CopyButton lang={lang} text={aligned.text} label={w.bioCopy} className="primary" onCopied={()=>complete('bio')}/></div></div><CopyButton lang={lang} text={finalText} label={w.allCopy} onCopied={()=>complete('all')}/><p role="status" className="profile-done">{finished?w.done:''}</p></section>}
  {workspace&&<div className="profile-photo-section" id="profile-photo" ref={photoSection}><h2>{photoCopy[lang].title}</h2>{photoOpen?<PhotoTool lang={lang} onApply={setAvatar}/>:<button className="button" type="button" onClick={()=>setPhotoOpen(true)}>{photoCopy[lang].open}</button>}</div>}
 </section>;
}

'use client';
import {useEffect,useMemo,useState} from 'react';
import {fontStyles,type FontStyle} from '@/lib/text';
import {type Lang,copy} from '@/lib/site';
import {fontName,fontCategories,capsOnly,fontPreview} from '@/lib/font-catalog';
import {decorationPresets,decorateText,decorationMoods} from '@/lib/decoration-catalog';
import decorationNames from '@/lib/locales/decoration-names.json';
import {libraryText} from '@/lib/library-copy';
import {useLibrary} from '@/lib/use-library';
import {workflowCopy} from '@/lib/workflow-copy';
import {FavoriteButton,LibraryNotice,ProfileTransferButton} from './LibraryControls';
import {CopyButton} from './CopyButton';
import {normalizeNavigationSearch} from '@/lib/language-registry';
type Collection='recommended'|'all'|'newest'|'favorites'|'recent';
export function FontsTool({lang,initialText,onUse}:{lang:Lang;initialText?:string;onUse?:(text:string)=>void}){
 const c=libraryText(lang),w=workflowCopy[lang],library=useLibrary();
 const [text,setText]=useState(initialText??({ko:'Lana 123',ja:'Lana 123',en:'Make something lovely',es:'Crea algo bonito',ms:'Cipta sesuatu indah','pt-BR':'Crie algo bonito',id:'Bikin cerita baru',tr:'İyi ki buradayız'}[lang]));
 const [mode,setMode]=useState<'font'|'decoration'>('font'),[collection,setCollection]=useState<Collection>('recommended'),[family,setFamily]=useState('all'),[query,setQuery]=useState(''),[mood,setMood]=useState<'all'|'minimal'|'cute'|'lovely'|'sparkle'|'vintage'>('all'),[limit,setLimit]=useState(12);
 useEffect(()=>{if(initialText!==undefined)setText(initialText);},[initialText]);
 useEffect(()=>setLimit(12),[mode,collection,family,query,mood]);
 const rows=useMemo(()=>{
  const source=mode==='font'?fontStyles.map(id=>{const p=fontPreview(text,id);return {id,name:fontName(lang,id),preview:p.preview,output:p.output,example:p.example,category:Object.entries(fontCategories).filter(([,ids])=>(ids as readonly string[]).includes(id)).map(([key])=>key),support:['doubleCircleDigits','filledDigits'].includes(id)?c.digits:['smallCaps','superscript','subscript'].includes(id)?c.partial:c.latin};}):decorationPresets.map((p,i)=>({id:p.id,name:decorationNames[lang][i<36?i:i-36]+' · '+(p.font?fontName(lang,p.font):c[p.category]),preview:decorateText(text.trim()?text:'Lana 123',p.id),output:decorateText(text,p.id),example:null,category:[p.category],support:p.font?c.latin+' · '+c.allLanguages:c.allLanguages}));
  const favs=mode==='font'?library.value.fonts:library.value.decorations,recent=library.value.recent.filter(r=>r.kind===mode).map(r=>r.id),q=normalizeNavigationSearch(query);
  let result=source.filter(row=>(mode!=='decoration'||mood==='all'||decorationMoods(row.id).includes(mood))&&(family==='all'||(row.category as readonly string[]).includes(family))&&(!q||normalizeNavigationSearch(row.name+' '+row.preview).includes(q))&&(collection!=='favorites'||favs.includes(row.id as FontStyle))&&(collection!=='recent'||recent.includes(row.id)));
  if(collection==='recent')result.sort((a,b)=>recent.indexOf(a.id)-recent.indexOf(b.id));
  if(collection==='newest'&&mode==='font')result.sort((a,b)=>Number(fontStyles.indexOf(b.id as FontStyle)>=18)-Number(fontStyles.indexOf(a.id as FontStyle)>=18));
  if(collection==='recommended'){const preferred=mode==='font'?['bold','script','mono','smallCaps','parenthesized','superscript','double','sansBold','circle','subscript','negativeSquare','wide']:['frame-heart','frame-ribbon','accent-underline','label-heart','frame-moon','accent-overline','frame-flower','label-ribbon','accent-dotBelow','frame-corner','label-sparkle','accent-strike'];result.sort((a,b)=>{const ai=preferred.indexOf(a.id),bi=preferred.indexOf(b.id);return (ai<0?9999:ai)-(bi<0?9999:bi);});}
  // A Korean-only name may produce identical framed variants. Show one of each visible output.
  if(mode==='decoration'&&collection!=='favorites'&&collection!=='recent'){const seen=new Set<string>();result=result.filter(r=>{if(seen.has(r.preview))return false;seen.add(r.preview);return true;});}
  return result;
 },[mode,text,lang,family,query,mood,collection,library.value,c]);
 return <div className="tool-panel fonts-panel catalog-panel" data-catalog-count={fontStyles.length} data-decoration-count={decorationPresets.length}>
  <div className="catalog-input"><label htmlFor="fonts-input">{copy[lang].input}</label><input className="big-input" id="fonts-input" maxLength={500} value={text} onChange={e=>setText(e.target.value)} placeholder={copy[lang].input}/><p className="panel-note">{mode==='font'?copy[lang].unsupported:c.supportNote}</p></div>
  <div className="catalog-modes" role="group" aria-label={c.fontFamily}>{(['font','decoration'] as const).map(value=><button type="button" key={value} aria-pressed={mode===value} onClick={()=>{setMode(value);setFamily('all');setCollection('recommended');setMood('all');}}>{value==='font'?c.styles:c.decorations}<small>{value==='font'?fontStyles.length:decorationPresets.length}</small></button>)}</div>
  <div className="library-filters" role="group" aria-label={c.category}>{(['recommended','all','newest','favorites','recent'] as const).map(value=><button type="button" key={value} data-filter={value} aria-pressed={collection===value} onClick={()=>setCollection(value)}>{c[value]}</button>)}</div>
  <div className="catalog-filters"><label>{c.search}<input type="search" maxLength={80} value={query} onChange={e=>setQuery(e.target.value)} placeholder={c.search}/></label><label>{c.fontFamily}<select value={family} onChange={e=>setFamily(e.target.value)}><option value="all">{c.all}</option>{(mode==='font'?Object.keys(fontCategories):['frame','accent','label']).map(key=><option key={key} value={key}>{mode==='font'?w[key as keyof typeof fontCategories]:c[key as 'frame'|'accent'|'label']}</option>)}</select></label></div>
  {mode==='decoration'&&<details className="catalog-advanced"><summary>{c.mood}{mood!=='all'?' · '+c[mood]:''}</summary><div className="catalog-moods catalog-scroll-row" role="group" aria-label={c.mood}>{(['all','minimal','cute','lovely','sparkle','vintage'] as const).map(value=><button type="button" key={value} aria-pressed={mood===value} onClick={()=>setMood(value)}>{value==='all'?c.anyMood:c[value]}</button>)}</div></details>}<div className="library-summary" role="status"><span>{c.showing} {Math.min(limit,rows.length)} / {rows.length}</span>{collection==='recent'&&<button type="button" className="text-button" onClick={library.clearRecent}>{w.clearRecent}</button>}</div>
  <div className="font-results">{rows.slice(0,limit).map(row=><article className="font-row" key={row.id} data-style={row.id}><div><span className="eyebrow">{row.name}{capsOnly.has(row.id)?' · A–Z':''}</span><p>{row.preview}</p><small className="catalog-support">{row.support}</small>{row.example&&<div className="font-style-example"><span>{c.preview}</span><span>{row.example}</span></div>}</div><div className="font-actions"><FavoriteButton lang={lang} active={mode==='font'?library.value.fonts.includes(row.id as FontStyle):library.value.decorations.includes(row.id)} onToggle={()=>library.toggle({kind:mode,id:row.id})}/><CopyButton lang={lang} text={row.output} onCopied={()=>library.record({kind:mode,id:row.id})}/><ProfileTransferButton lang={lang} kind="name" text={row.output} onUse={onUse}/>{mode==='decoration'&&!onUse&&<ProfileTransferButton lang={lang} kind="symbol" text={row.output}/>}</div></article>)}</div>
  {!rows.length&&<p role="status" className="library-empty">{c.empty}</p>}{limit<rows.length&&<button type="button" className="button catalog-more" onClick={()=>setLimit(n=>n+12)}>{c.more}</button>}<LibraryNotice lang={lang} persistent={library.persistent}/>
 </div>;
}

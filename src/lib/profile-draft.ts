import {languageCodes} from './language-registry';
import type {BioAlignment} from './profile-alignment';
import legacySamples from './profile-legacy-samples.json';
import type {Lang} from './site';
import {profileThemeIds,profileTemplates,type ProfileThemeId} from './profile-templates';
export type ProfileDraft={version:1;theme:ProfileThemeId;text:string;handle:string;alignment?:BioAlignment};
export type ProfileTransfer={kind:'name'|'symbol';text:string};
export const draftKey='makesns.profile.draft.v1',transferKey='makesns.profile.transfer.v1';
export function parseDraft(raw:unknown):ProfileDraft|null{try{const v=typeof raw==='string'?(raw.length>20000?null:JSON.parse(raw)):raw;if(!v||v.version!==1||!(profileThemeIds as readonly unknown[]).includes(v.theme)||typeof v.text!=='string'||v.text.length>2000||typeof v.handle!=='string'||v.handle.length>50)return null;return {version:1,theme:v.theme,text:v.text,handle:v.handle,...(['left','center','right'].includes(v.alignment)?{alignment:v.alignment as BioAlignment}:{})};}catch{return null;}}
let memory:ProfileDraft|null=null,payload:ProfileTransfer|null=null;let draftStorageUnavailable=false;
export function readDraft(){if(draftStorageUnavailable)return memory;try{memory=parseDraft(sessionStorage.getItem(draftKey));}catch{draftStorageUnavailable=true;}return memory;}
export function saveDraft(value:ProfileDraft){memory=parseDraft(value);try{if(memory)sessionStorage.setItem(draftKey,JSON.stringify(memory));draftStorageUnavailable=false;return true;}catch{draftStorageUnavailable=true;return false;}}
export function clearDraft(){memory=null;payload=null;try{sessionStorage.removeItem(draftKey);sessionStorage.removeItem(transferKey);draftStorageUnavailable=false;}catch{draftStorageUnavailable=true;}}
export function truncateUnits(text:string,max:number){let result='';for(const char of text){if(result.length+char.length>max)break;result+=char;}return result;}
export function queueTransfer(value:ProfileTransfer){payload={kind:value.kind,text:truncateUnits(value.text,500)};try{sessionStorage.setItem(transferKey,JSON.stringify(payload));}catch{}}
export function takeTransfer():ProfileTransfer|null{let value:unknown=payload;payload=null;try{const raw=sessionStorage.getItem(transferKey);sessionStorage.removeItem(transferKey);if(value===null&&raw&&raw.length<=6000)value=JSON.parse(raw);}catch{}if(!value||typeof value!=='object')return null;const v=value as ProfileTransfer;return (v.kind==='name'||v.kind==='symbol')&&typeof v.text==='string'&&v.text.length<=500?{kind:v.kind,text:v.text}:null;}
export function splitProfile(text:string){const at=text.indexOf('\n');return at<0?{name:text,bio:''}:{name:text.slice(0,at),bio:text.slice(at+1)};}
export function replaceName(text:string,name:string){const {bio}=splitProfile(text);return truncateUnits(name,200)+(bio?'\n'+bio:'');}
export function insertSnippet(text:string,snippet:string,start=text.length,end=start,limit=2000){const boundaries=[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(v=>v.index).concat(text.length);const floor=(n:number)=>boundaries.filter(b=>b<=Math.max(0,Math.min(text.length,n))).at(-1)??0;const ceil=(n:number)=>boundaries.find(b=>b>=Math.max(0,Math.min(text.length,n)))??text.length;const left=floor(start),right=start===end?left:ceil(end);if(text.length-(right-left)+snippet.length>limit)return {text,position:left,inserted:false};return {text:text.slice(0,left)+snippet+text.slice(right),position:left+snippet.length,inserted:true};}
export function applyTransfer(draft:ProfileDraft,transfer:ProfileTransfer){if(transfer.kind==='name')return {...draft,text:truncateUnits(replaceName(draft.text,transfer.text),2000)};const parts=splitProfile(draft.text),suffix=(parts.bio?' ':'')+transfer.text,next=insertSnippet(parts.bio,suffix,parts.bio.length,parts.bio.length,1799);return next.inserted?{...draft,text:parts.name+'\n'+next.text}:draft;}

export function localizeSampleDraft(draft:ProfileDraft,lang:Lang):ProfileDraft{
 const candidates=[...legacySamples,...languageCodes.flatMap(source=>profileTemplates(source))];
 const parts=splitProfile(draft.text);
 // A styled/custom name can accompany an otherwise unchanged built-in bio.
 // Match the entire bio and original sample handle, never a substring or language alone.
 const sameSample=(t:{id:string;handle:string;after:string})=>t.id===draft.theme&&t.handle===draft.handle&&splitProfile(t.after).bio===parts.bio;
 // Name-only sample updates share bios: prefer the exact built-in name before preserving custom names.
 const matched=candidates.find(t=>sameSample(t)&&splitProfile(t.after).name===parts.name)??candidates.find(sameSample);
 if(!matched)return draft;
 const target=profileTemplates(lang).find(t=>t.id===draft.theme)!;
 const sourceName=splitProfile(matched.after).name;
 const name=parts.name===sourceName?splitProfile(target.after).name:parts.name;
 return {...draft,text:name+'\n'+splitProfile(target.after).bio,handle:target.handle};
}

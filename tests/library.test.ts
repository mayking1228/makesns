import {test} from 'node:test';import assert from 'node:assert/strict';
import {emptyLibrary,parseLibrary,recordCopy,toggleFavorite} from '../src/lib/library';
import {parseDraft,splitProfile,replaceName,insertSnippet,applyTransfer,truncateUnits} from '../src/lib/profile-draft';
import {fontStyles,fancyText,plainFancyText,symbolGroups} from '../src/lib/text';
import {usageEvent} from '../src/lib/analytics-policy';
import {copy} from '../src/lib/site';

test('saved library accepts only known style IDs/symbols and drops raw text or extra fields',()=>{
 const value=parseLibrary(JSON.stringify({version:1,fonts:['script','wrong','script'],symbols:['♡','private@example.test','♡'],recent:[{kind:'font',id:'bold',text:'PRIVATE'},{kind:'symbol',id:'♡',email:'private@example.test'},{kind:'symbol',id:'UNKNOWN'}],input:'SECRET'}));
 assert.deepEqual(value,{version:1,fonts:['script'],symbols:['♡'],decorations:[],recent:[{kind:'font',id:'bold'},{kind:'symbol',id:'♡'}]});assert.ok(!JSON.stringify(value).includes('private'));
 for(const raw of ['bad','{}','{"version":2}','x'.repeat(40001),null])assert.deepEqual(parseLibrary(raw),emptyLibrary());
});
test('favorites toggle independently of recent copies; history is unique, ordered and bounded',()=>{
 let value=emptyLibrary();value=toggleFavorite(value,{kind:'font',id:'script'});value=toggleFavorite(value,{kind:'symbol',id:'♡'});value=recordCopy(value,{kind:'font',id:'script'});value=toggleFavorite(value,{kind:'font',id:'script'});assert.deepEqual(value.fonts,[]);assert.deepEqual(value.symbols,['♡']);assert.deepEqual(value.recent,[{kind:'font',id:'script'}]);
 for(const id of Object.values(symbolGroups).flat().slice(0,35))value=recordCopy(value,{kind:'symbol',id});assert.equal(value.recent.length,24);value=recordCopy(value,value.recent[10]);assert.equal(value.recent.length,24);assert.equal(new Set(value.recent.map(v=>v.kind+v.id)).size,24);assert.deepEqual(toggleFavorite(value,{kind:'font',id:'not-real'}),value);
});
test('decorated names can be restyled without changing Korean, Japanese, punctuation or emoji',()=>{
 for(const style of fontStyles.slice(0,18))assert.equal(plainFancyText(fancyText('Alice 123 한글 日本語 👩‍👩‍👧‍👦',style)),['square','negativeCircle','negativeSquare'].includes(style)?'ALICE 123 한글 日本語 👩‍👩‍👧‍👦':'Alice 123 한글 日本語 👩‍👩‍👧‍👦',style);
});
test('profile drafts are bounded and cross-tool transfer changes only its intended field',()=>{
 const draft={version:1 as const,theme:'cafe' as const,text:'Alice\nMy bio 👩‍👩‍👧‍👦',handle:'alice'};assert.deepEqual(parseDraft(JSON.stringify({...draft,secret:'ignore'})),draft);assert.equal(parseDraft({...draft,text:'x'.repeat(2001)}),null);assert.equal(parseDraft({...draft,theme:'unknown'}),null);assert.equal(parseDraft({...draft,handle:'x'.repeat(51)}),null);
 assert.deepEqual(splitProfile(draft.text),{name:'Alice',bio:'My bio 👩‍👩‍👧‍👦'});assert.equal(replaceName(draft.text,'𝗔𝗹𝗶𝗰𝗲'),'𝗔𝗹𝗶𝗰𝗲\nMy bio 👩‍👩‍👧‍👦');assert.equal(applyTransfer(draft,{kind:'symbol',text:'♡'}).text,'Alice\nMy bio 👩‍👩‍👧‍👦 ♡');assert.equal(applyTransfer(draft,{kind:'name',text:'Bob'}).text,'Bob\nMy bio 👩‍👩‍👧‍👦');assert.equal(truncateUnits('a'.repeat(199)+'😀',200),'a'.repeat(199));
});
test('inserting a symbol preserves whole emoji clusters and refuses oversized edits without truncation',()=>{
 const family='👩‍👩‍👧‍👦',text='A'+family+'B';assert.deepEqual(insertSnippet(text,'♡',2,2),{text:'A♡'+family+'B',position:2,inserted:true});assert.equal(insertSnippet(text,'♡',2,5).text,'A♡B');assert.deepEqual(insertSnippet('abc','xxxxx',1,1,5),{text:'abc',position:1,inserted:false});assert.equal(insertSnippet('Hello world','♡',6,11).text,'Hello ♡');
});
test('profile completion analytics allow only the copy part, without private input; privacy explains local storage',()=>{
 assert.deepEqual(usageEvent('profile_complete','/ko/profile/',{part:'bio',text:'PRIVATE',handle:'PRIVATE'}),{name:'profile_complete',params:{tool_name:'profile',ui_language:'ko',copy_part:'bio'}});assert.equal(usageEvent('profile_complete','/ko/profile/',{part:'PRIVATE'}),null);assert.equal(usageEvent('profile_complete','/en/fonts/',{part:'bio'}),null);assert.ok(copy.ko.privacyText.includes('즐겨찾기'));assert.ok(copy.en.privacyText.includes('Favorites'));assert.ok(copy.ja.privacyText.includes('お気に入り'));
});

test('a write-only storage failure keeps the latest tab draft and transfer in memory instead of restoring stale data',async()=>{
 const {saveDraft,readDraft,clearDraft,queueTransfer,takeTransfer,transferKey}=await import('../src/lib/profile-draft');const values=new Map<string,string>();let blocked=false;const previous=Object.getOwnPropertyDescriptor(globalThis,'sessionStorage');Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{if(blocked)throw Error('quota');values.set(key,value);},removeItem:(key:string)=>values.delete(key)}});
 try{clearDraft();const first={version:1 as const,theme:'cafe' as const,text:'First\nBio',handle:'first'};assert.equal(saveDraft(first),true);blocked=true;const latest={...first,text:'Latest\nKeep this'};assert.equal(saveDraft(latest),false);assert.deepEqual(readDraft(),latest);values.set(transferKey,JSON.stringify({kind:'name',text:'STALE'}));queueTransfer({kind:'name',text:'LATEST'});assert.deepEqual(takeTransfer(),{kind:'name',text:'LATEST'});assert.equal(takeTransfer(),null);blocked=false;clearDraft();assert.equal(readDraft(),null);}finally{if(previous)Object.defineProperty(globalThis,'sessionStorage',previous);else Reflect.deleteProperty(globalThis,'sessionStorage');}
});

test('small-cap template names normalize before restyling; empty and non-Latin previews never copy sample text',async()=>{
 const {fontPreview}=await import('../src/lib/font-catalog');assert.equal(plainFancyText('ɢɪʟ-ᴅᴏɴɢ ☕️'),'GIL-DONG ☕️');assert.equal(plainFancyText('ʜᴀʀᴜ ☕️'),'HARU ☕️');assert.equal(plainFancyText('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ'),'ABCDEFGHIJKLMNOPQRSTUVWxYZ');
 for(const text of ['ɢɪʟ-ᴅᴏɴɢ ☕️','ʜᴀʀᴜ ☕️',''])assert.equal(new Set(fontStyles.slice(0,18).map(style=>fontPreview(text,style).preview)).size,18);
 for(const style of fontStyles){assert.equal(fontPreview('',style).output,'');assert.equal(fontPreview('   ',style).output,'');assert.equal(fontPreview('김명균 日本語 ☕',style).output,'김명균 日本語 ☕');assert.ok(fontPreview('김명균',style).example);assert.equal(fontPreview('𝐀𝐥𝐢𝐜𝐞',style).output,fancyText('Alice',style));}
});

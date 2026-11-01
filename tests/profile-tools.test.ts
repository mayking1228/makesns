import {parseDraft} from '../src/lib/profile-draft';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {alignBio} from '../src/lib/profile-alignment';
import {searchSymbols,additionalSymbols,symbolRecords} from '../src/lib/symbol-search';
import {emptyLibrary,parseLibrary,toggleFavorite,recordCopy} from '../src/lib/library';
import {drawProfilePhoto} from '../src/lib/profile-photo';
import {profileTemplates} from '../src/lib/profile-templates';
const measure=(s:string)=>[...s].length*10;
test('center and right alignment copy spacing without changing the editable source or overflowing the budget',()=>{
 const input='Hello\nNice to meet you';const center=alignBio(input,'center',200,measure),right=alignBio(input,'right',200,measure);
 assert.ok(center.padding>0);assert.ok(right.padding>center.padding);assert.equal(center.text.replace(/\u2800/g,''),input);assert.equal(alignBio(input,'left',200,measure).text,input);
 const long='x'.repeat(145);assert.deepEqual(alignBio(long,'center',2000,measure),{text:long,blocked:true,padding:0});assert.equal(alignBio('日本語\n안녕','center',200,measure).text.replace(/\u2800/g,''),'日本語\n안녕');assert.equal(alignBio(input,'center',0,measure).blocked,true);
});
test('multilingual search finds exact emoji sequences, cats, ribbons and saved items without changing IDs',()=>{
 for(const [lang,heart,cat] of [['ko','하트','고양이'],['en','heart','cat'],['ja','ハート','猫']] as const){assert.ok(searchSymbols(heart,lang).includes('♡'));assert.ok(searchSymbols(cat,lang).includes('🐱'));assert.ok(searchSymbols(cat,lang,'face').includes('(=^･ω･^=)'));assert.ok(searchSymbols('👩‍💻',lang,'emoji').includes('👩‍💻'));assert.deepEqual(searchSymbols('not-a-real-term-xyz',lang),[]);assert.deepEqual(searchSymbols(cat,lang,'all',['🐱']),['🐱']);assert.equal(new Set(symbolRecords(lang).map(r=>r.id)).size,symbolRecords(lang).length);}
 const saved=recordCopy(toggleFavorite(emptyLibrary(),{kind:'symbol',id:'👩‍💻'}),{kind:'symbol',id:'👩‍💻'});assert.ok(parseLibrary(JSON.stringify(saved)).symbols.includes('👩‍💻'));assert.ok(additionalSymbols.includes('👩‍💻'));assert.equal(saved.recent[0].id,'👩‍💻');
});
test('profile photo square output preserves corners, circle PNG uses a circular alpha mask and rejects unsupported output',()=>{
 const operations:string[]=[];const ctx={drawImage(){operations.push('draw');},fillRect(){operations.push('background');},save(){},restore(){},beginPath(){},arc(x:number,y:number,r:number){assert.equal(x,160);assert.equal(y,160);assert.equal(r,160);operations.push('circle');},fill(){operations.push('mask');},globalCompositeOperation:'source-over'};
 const canvas={width:0,height:0,getContext:()=>ctx} as unknown as HTMLCanvasElement;const image={naturalWidth:600,naturalHeight:400} as HTMLImageElement;
 drawProfilePhoto(image,canvas,undefined,320,'image/png');assert.equal(canvas.width,320);assert.ok(!operations.includes('mask'));
 drawProfilePhoto(image,canvas,undefined,320,'image/png',true);assert.deepEqual(operations.slice(-3),['draw','circle','mask']);assert.equal(ctx.globalCompositeOperation,'destination-in');
 assert.throws(()=>drawProfilePhoto(image,canvas,undefined,320,'image/jpeg',true));assert.throws(()=>drawProfilePhoto(image,canvas,undefined,999 as 320,'image/png'));
});
test('locale examples have independently chosen decoration layouts while keeping all bios within 150 units',()=>{
 for(const id of profileTemplates('ko').map(t=>t.id)){const bios=(['ko','en','ja'] as const).map(lang=>profileTemplates(lang).find(t=>t.id===id)!.after.split('\n').slice(1).join('\n'));for(const bio of bios)assert.ok(bio.length<=150,id);if(id!=='company')assert.ok(new Set(bios.map(bio=>bio.split('\n').at(-1))).size>=2,id);}
});

test('alignment persists as a bounded enum without interpreting arbitrary CSS or text',()=>{
 const draft={version:1,theme:'cafe',text:'Name\nBio',handle:'sample.cafe',alignment:'center'};assert.equal(parseDraft(draft)?.alignment,'center');assert.equal(parseDraft({...draft,alignment:'position:fixed'})?.alignment,undefined);
});

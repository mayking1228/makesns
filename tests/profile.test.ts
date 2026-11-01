import {test} from 'node:test';
import assert from 'node:assert/strict';
import {profileTemplates,profileCopy,profileThemeIds,templateFromHash,profileMetadata} from '../src/lib/profile-templates';
import {languages} from '../src/lib/site';
import {captionStats,plainFancyText} from '../src/lib/text';
import {analyticsContext,usageEvent} from '../src/lib/analytics-policy';
import sitemap from '../src/app/sitemap';

test('all 13 profile themes have localized comparisons and usable separate display-name/bio examples',()=>{
 for(const lang of languages){const templates=profileTemplates(lang);assert.deepEqual(templates.map(t=>t.id),profileThemeIds);assert.deepEqual(Object.keys(profileCopy[lang]).sort(),Object.keys(profileCopy.en).sort());for(const t of templates){assert.ok(t.title&&t.subtitle&&t.handle);assert.notEqual(t.before,t.after);const [name,...bio]=t.after.split('\n');assert.ok(name.trim()&&bio.length>0);assert.ok(captionStats(bio.join('\n')).characters<=150,lang+'/'+t.id);assert.ok(bio.join('\n').length<=150,lang+'/'+t.id+' UTF16');}}
});
test('template links accept only known sample IDs, without interpreting raw text or external destinations',()=>{
 for(const lang of languages)for(const id of profileThemeIds)assert.equal(templateFromHash('#'+id,lang)?.id,id);
 for(const value of ['#https://example.test','#<script>','#../../secret','#cafe?bio=private','#%63afe',''])assert.equal(templateFromHash(value,'ko'),null);
});
test('profile pages have reciprocal language metadata, sitemap entries and safe analytics fields',()=>{
 for(const lang of languages){const meta=profileMetadata(lang);assert.equal(meta.alternates.canonical,`/${lang}/profile/`);assert.ok(meta.description.length<=80);for(const l of languages)assert.equal(meta.alternates.languages[l],`/${l}/profile/`);assert.ok(sitemap().some(row=>row.url===`https://makesns.com/${lang}/profile/`));assert.deepEqual(analyticsContext(`/${lang}/profile/?bio=private#private`),{language:lang,tool:'profile',path:`/${lang}/profile/`});assert.deepEqual(usageEvent('copy_complete',`/${lang}/profile/`,{bio:'private',handle:'private',template:'private'}),{name:'copy_complete',params:{tool_name:'profile',ui_language:lang}});}
});

import legacySamples from '../src/lib/profile-legacy-samples.json';
import {localizeSampleDraft,parseDraft} from '../src/lib/profile-draft';
test('legacy untouched samples migrate while personal edits survive new templates',()=>{
 for(const old of legacySamples){const draft={version:1 as const,theme:old.id as typeof profileThemeIds[number],text:old.after,handle:old.handle};assert.ok(parseDraft(draft));const next=localizeSampleDraft(draft,'ja');assert.equal(next.text,profileTemplates('ja').find(t=>t.id===old.id)!.after);const edited={...draft,text:old.after+'\nMy own note'};assert.deepEqual(localizeSampleDraft(edited,'ja'),edited);}
});
test('each locale includes students, beauty creators and company accounts with complete previews',()=>{
 for(const lang of languages){const templates=profileTemplates(lang);assert.equal(templates.length,13);assert.equal(new Set(templates.map(t=>t.id)).size,13);for(const id of ['student','beauty','company']){const t=templates.find(t=>t.id===id)!;assert.ok(t);assert.ok(parseDraft({version:1,theme:t.id,text:t.after,handle:t.handle}));assert.equal(plainFancyText(t.before).replace(/[^A-Za-z0-9가-힣ぁ-ゖァ-ヺ一-龯]/gu,'').toLowerCase(),plainFancyText(t.after).replace(/[୨୧]/g,'').replace(/[^A-Za-z0-9가-힣ぁ-ゖァ-ヺ一-龯]/gu,'').toLowerCase());}}
});

test('restyled legacy sample names do not keep a Korean sample bio on English or Japanese pages',()=>{
 const old=legacySamples.find(t=>t.id==='cafe'&&t.handle==='daily.archive'&&t.after.includes('서울'))!;
 const bio=old.after.split('\n').slice(1).join('\n');
 for(const lang of ['en','ja'] as const){const draft={version:1 as const,theme:'cafe' as const,handle:old.handle,text:'Hong GIL-DONG ☕\n'+bio};const next=localizeSampleDraft(draft,lang);assert.equal(next.text.split('\n')[0],'Hong GIL-DONG ☕');assert.equal(next.text.split('\n').slice(1).join('\n'),profileTemplates(lang)[0].after.split('\n').slice(1).join('\n'));const edited={...draft,text:draft.text+'\n나만의 내용'};assert.deepEqual(localizeSampleDraft(edited,lang),edited);}
});

test('every template demonstrates visible name and bio decorations without exceeding bio limits',()=>{
 for(const lang of languages)for(const t of profileTemplates(lang)){
  const beforeName=t.before.split('\n')[0],afterName=t.after.split('\n')[0],bio=t.after.split('\n').slice(1).join('\n');
  assert.notEqual(beforeName,afterName,lang+'/'+t.id+' name');
  assert.match(bio,/[✧✦⋆★♡▫▪ꕤ↟✎\p{Extended_Pictographic}]/u,lang+'/'+t.id+' accents');
  assert.ok(bio.length<=150,lang+'/'+t.id+' length');
 }
});

import {applyTransfer} from '../src/lib/profile-draft';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {languages,origin} from '../src/lib/site';
import {exampleSlugs,isExampleSlug} from '../src/lib/example-routes';
import {examplesCopy,exampleGuides,guideSamples,examplesMetadata,exampleBreadcrumbs} from '../src/lib/examples';
import {captionExamples,captionExampleFromHash} from '../src/lib/caption-examples';
import {analyticsContext,usageEvent} from '../src/lib/analytics-policy';import sitemap from '../src/app/sitemap';

test('all localized examples have meaningful instructions, comparisons and valid links to existing tools',()=>{
 for(const lang of languages){assert.deepEqual(Object.keys(examplesCopy[lang]).sort(),Object.keys(examplesCopy.en).sort());const guides=exampleGuides(lang);assert.deepEqual(guides.map(g=>g.slug),exampleSlugs);for(const guide of guides){assert.ok(guide.intro.length>80);assert.equal(guide.steps.length,4);assert.equal(guide.tips.length,4);assert.equal(guide.faq.length,2);const samples=guideSamples(lang,guide.slug);assert.equal(samples.length,guide.slug==='profile-bio'?13:3);for(const sample of samples){assert.ok(sample.title&&sample.before&&sample.after&&sample.copyText);assert.notEqual(sample.before,sample.after);if(guide.slug==='profile-bio')assert.ok(sample.profileTheme);if(guide.slug==='caption-spacing')assert.ok(sample.captionId);}}}
});
test('each examples page has bounded localized descriptions, reciprocal metadata, sitemap and breadcrumb URLs',()=>{
 for(const lang of languages)for(const slug of [undefined,...exampleSlugs]){const meta=examplesMetadata(lang,slug),path='/examples/'+(slug?slug+'/':'');assert.equal(meta.alternates.canonical,'/'+lang+path);assert.ok(meta.description.length<=80,lang+'/'+slug+': '+meta.description.length);for(const l of languages)assert.equal(meta.alternates.languages[l],'/'+l+path);assert.ok(sitemap().some(entry=>entry.url===origin+'/'+lang+path));if(slug){const crumbs=exampleBreadcrumbs(lang,slug);assert.equal(crumbs.itemListElement[2].item,origin+'/'+lang+path);}}
 assert.equal(sitemap().length,113);assert.equal(new Set(sitemap().map(e=>e.url)).size,113);
});
test('caption sample links load only allowlisted IDs and only spacing changes between before and after',()=>{
 for(const lang of languages)for(const sample of captionExamples(lang)){assert.equal(captionExampleFromHash('#example-'+sample.id,lang)?.after,sample.after);assert.equal(sample.before.replace(/\s+/g,' '),sample.after.replace(/\s+/g,' '));assert.ok(sample.copyText.includes('\u2800'));}
 for(const hash of ['#example-https://example.test','#example-<script>','#example-daily?text=PRIVATE','#example-%64aily',''])assert.equal(captionExampleFromHash(hash,'ko'),null);
});
test('example analytics allow known guide paths, drop query/hash text and reject arbitrary private paths',()=>{
 for(const slug of exampleSlugs){assert.ok(isExampleSlug(slug));assert.deepEqual(analyticsContext('/ja/examples/'+slug+'/?bio=PRIVATE#PRIVATE'),{language:'ja',tool:'examples',path:'/ja/examples/'+slug+'/'});assert.deepEqual(usageEvent('copy_complete','/ko/examples/'+slug+'/',{text:'PRIVATE'}),{name:'copy_complete',params:{tool_name:'examples',ui_language:'ko'}});}
 for(const path of ['/ko/examples/PRIVATE/','/ko/examples/profile-bio/PRIVATE/','/xx/examples/','/ko/PRIVATE/'])assert.equal(analyticsContext(path),null);assert.equal(isExampleSlug('PRIVATE'),false);
});

test('adding a sample phrase preserves the existing profile and refuses an overlong bio without partial insertion',()=>{const draft={version:1 as const,theme:'cafe' as const,text:'My name\nMy own bio',handle:'my.account'};const sample=guideSamples('ko','symbols')[0];const next=applyTransfer(draft,{kind:'symbol',text:sample.after});assert.ok(next.text.startsWith('My name\nMy own bio '));assert.equal(next.handle,'my.account');const full={...draft,text:'My name\n'+'x'.repeat(1799)};assert.deepEqual(applyTransfer(full,{kind:'symbol',text:sample.after}),full);});

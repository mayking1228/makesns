import {test} from 'node:test';import assert from 'node:assert/strict';import {captionSpace,captionStats,fancyText,fontStyles,wrapText} from '../src/lib/text';import {centeredCrop,boundedSize,validateFiles,imageName} from '../src/lib/images';import {languages,tools,pageMetadata} from '../src/lib/site';
test('caption spacing normalizes CRLF, preserves text and creates one invisible marker per empty line idempotently',()=>{const source='안녕하세요  \r\n\r\n#한글 #hello_world';const result=captionSpace(source);assert.equal(result,'안녕하세요\n\u2800\n#한글 #hello_world');assert.equal(captionSpace(result),result);assert.deepEqual(captionStats('👩‍👩‍👧‍👦 가 #한글 #hello_world'),{characters:20,hashtags:2});});
test('Unicode converters map every Latin letter and digit without deleting Korean or emoji',()=>{for(const style of fontStyles){const result=fancyText('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 한글 ☕',style);assert.equal([...result].length,67);assert.ok(!result.includes('undefined'));assert.ok(result.endsWith(' 한글 ☕'));}assert.equal(fancyText('ChNZ 123','double'),'ℂ𝕙ℕℤ 𝟙𝟚𝟛');assert.equal(fancyText('hi','italic'),'ℎ𝑖');assert.equal(fancyText('한글','bold'),'한글');assert.equal(wrapText('hello','「 」'),'「 hello 」');});
test('crop geometry preserves aspect, centers the source and caps output at 2500px',()=>{assert.deepEqual(centeredCrop(2000,1000,1),{x:500,y:0,width:1000,height:1000});assert.deepEqual(centeredCrop(1000,2000,1),{x:0,y:500,width:1000,height:1000});assert.deepEqual(boundedSize(5000,4000),{width:2500,height:2000});assert.deepEqual(boundedSize(1080,1920),{width:1080,height:1920});});
test('batch limits reject unsupported types, excessive files and total memory budgets',()=>{const img={name:'test.jpg',type:'image/jpeg',size:1024};assert.equal(validateFiles([img]),null);assert.equal(validateFiles(Array(6).fill(img)),'count');assert.equal(validateFiles([{...img,type:'image/svg+xml'}]),'type');assert.equal(validateFiles([{...img,size:13*1024*1024}]),'size');assert.equal(validateFiles(Array(4).fill({...img,size:11*1024*1024})),'size');assert.equal(imageName('../../a.jpg',0,'png'),'------a-1.png');assert.notEqual(imageName('same.png',0,'png'),imageName('same.png',1,'png'));});
test('each locale and tool has canonical and cross-language metadata without redirecting users',()=>{for(const lang of languages)for(const tool of tools){const m=pageMetadata(lang,tool);assert.equal(m.alternates?.canonical,`/${lang}/${tool}/`);assert.equal(m.alternates?.languages?.en,`/en/${tool}/`);assert.equal(m.alternates?.languages?.ko,`/ko/${tool}/`);}});

test('image header inspection rejects oversized and disguised files before browser decoding',async()=>{
 const {fileDimensions}=await import('../src/lib/images');const bytes=new Uint8Array(33);bytes.set([137,80,78,71,13,10,26,10]);const v=new DataView(bytes.buffer);v.setUint32(8,13);bytes.set([73,72,68,82],12);v.setUint32(16,1200);v.setUint32(20,800);assert.deepEqual(await fileDimensions(new Blob([bytes],{type:'image/png'})),{width:1200,height:800});v.setUint32(16,20000);v.setUint32(20,20000);await assert.rejects(fileDimensions(new Blob([bytes],{type:'image/png'})),/pixels/);await assert.rejects(fileDimensions(new Blob(['not an image'],{type:'image/png'})),/pixels/);
});

test('search and social descriptions stay within 80 characters in every language',()=>{for(const lang of languages)for(const tool of [undefined,...tools]){const m=pageMetadata(lang,tool);assert.ok(m.description&&m.description.length<=80,lang+'/'+tool);const og=m.openGraph as {description?:string};assert.equal(og.description,m.description);}});

test('symbol catalog contains valid, distinct entries within each category and every frame wraps text intact',async()=>{const {symbolGroups}=await import('../src/lib/text');for(const values of Object.values(symbolGroups)){assert.equal(new Set(values).size,values.length);for(const value of values){assert.ok(value.trim().length);assert.ok(!/[\p{Cc}\p{Cf}\p{Cs}]/u.test(value),value);}}for(const frame of symbolGroups.frames){const [left,right]=frame.split(' ');assert.equal(wrapText('Hello 日本語 한글',frame),left+' Hello 日本語 한글 '+right);}});

test('decorative alphabets use the correct Unicode letters, including legacy script and Fraktur exceptions',()=>{
 const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 for(const style of fontStyles.slice(0,18)){
  if(['square','negativeCircle','negativeSquare'].includes(style)){assert.equal(fancyText('abc',style),fancyText('ABC',style));continue;}
  assert.equal(fancyText(letters,style).normalize('NFKD'),letters,style);
 }
 assert.equal(fancyText('BEFHILMR ego','script'),'ℬℰℱℋℐℒℳℛ ℯℊℴ');
 assert.equal(fancyText('CHIRZ','fraktur'),'ℭℌℑℜℨ');
});

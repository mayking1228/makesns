import {test} from 'node:test';import assert from 'node:assert/strict';
import {containPlacement,imageBackground,imagePresets} from '../src/lib/images';
import {usageEvent} from '../src/lib/analytics-policy';

test('contain layout keeps the entire original aspect ratio inside every preset and padding setting',()=>{
 for(const source of [[400,200],[200,400],[300,300],[4096,2304]])for(const preset of imagePresets)for(const padding of [0,5,10,25]){const r=containPlacement(source[0],source[1],preset.width,preset.height,padding);assert.ok(Math.abs(r.width/r.height-source[0]/source[1])<1e-10);assert.ok(Math.abs(r.x-(preset.width-r.width)/2)<1e-10);assert.ok(Math.abs(r.y-(preset.height-r.height)/2)<1e-10);assert.ok(r.x>=preset.width*padding/100-1e-8&&r.y>=preset.height*padding/100-1e-8);assert.ok(r.x+r.width<=preset.width*(1-padding/100)+1e-8&&r.y+r.height<=preset.height*(1-padding/100)+1e-8);}
 assert.deepEqual(containPlacement(400,200,1080,1080,10),{x:108,y:324,width:864,height:432});
});
test('contain dimensions/padding are validated and transparent JPG backgrounds resolve to white',()=>{
 for(const args of [[0,100,1080,1080,0],[100,100,NaN,1080,0],[100,100,1080,1080,-1],[100,100,1080,1080,26]])assert.throws(()=>containPlacement(...args as [number,number,number,number,number]));
 assert.equal(imageBackground('transparent','image/jpeg'),'#ffffff');assert.equal(imageBackground('transparent','image/png'),'transparent');assert.equal(imageBackground('transparent','image/webp'),'transparent');assert.equal(imageBackground('#123456','image/png'),'#123456');assert.throws(()=>imageBackground('url(https://example.test)','image/png'));
});
test('image download analytics accept only the fit-mode enum and never colors, padding, file names or data',()=>{
 assert.deepEqual(usageEvent('image_download','/ko/resizer/',{format:'png',preset:'square',fit_mode:'contain',background:'#123456',padding:10,filename:'SECRET.png'}),{name:'image_download',params:{tool_name:'resizer',ui_language:'ko',format:'png',preset:'square',file_count:1,fit_mode:'contain'}});assert.equal(usageEvent('image_download','/en/resizer/',{format:'png',preset:'square',fit_mode:'SECRET'}),null);
});

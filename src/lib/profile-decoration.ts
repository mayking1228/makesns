import {withLocales} from './locale-data';
import {fancyText,type FontStyle} from './text';
import type {Lang} from './site';
const designs:Record<string,{style:FontStyle;frame:[string,string];marks:string[];divider:string}>={
 cafe:{style:'italic',frame:['',' ☕'],marks:['✧','', ''],divider:'── ⋆ ──'},
 daily:{style:'sans',frame:['⌜ ',' ⌟'],marks:['','⋆'],divider:'─ · ─'},
 y2k:{style:'boldFraktur',frame:['',' ★'],marks:['★','⭑',''],divider:'⋆ ── ⋆'},
 lovely:{style:'script',frame:['୨୧ ',' ୨୧'],marks:['♡','',''],divider:'(˶ᵔ ᵕ ᵔ˶)'},
 travel:{style:'italic',frame:['',' ↟'],marks:['↟','⌁',''],divider:'── ⌁ ──'},
 photographer:{style:'mono',frame:['',' ✦'],marks:['✦','▫','↳'],divider:'─ ◇ ─'},
 shop:{style:'script',frame:['ꕤ ',''],marks:['ꕤ','','↳'],divider:'─ ꕤ ─'},
 'local-business':{style:'sansBold',frame:['',' ⌂'],marks:['▫','▫','↳'],divider:'─ · ─'},
 business:{style:'sansBold',frame:['',' ✦'],marks:['✦','▫','↳'],divider:'─ ◇ ─'},
 pets:{style:'sans',frame:['♡ ',' ♡'],marks:['♡','',''],divider:'୨୧ ─ ୨୧'},
 student:{style:'mono',frame:['',' ✎'],marks:['✎','▫',''],divider:'─ ✧ ─'},
 beauty:{style:'script',frame:['୨୧ ',''],marks:['✧','','',''],divider:'─ ♡ ─'},
 company:{style:'sansBold',frame:['',' ▪'],marks:['▪','▫','↳'],divider:'─ ▪ ─'}
};
// Each locale has a separately edited visual vocabulary, not translated decorations.
const localDesigns:Record<Lang,Record<string,{frame:[string,string];marks:string[];divider:string}>>=withLocales({
 ko:{
 cafe:{frame:['',' ☕'],marks:['📍','✧','↳'],divider:'⋆ ─ ☕ ─ ⋆'},
 daily:{frame:['˗ˋˏ ',' ˎˊ˗'],marks:['🌿','⋆'],divider:'─ ･ ｡ﾟ☆ ─'},
 y2k:{frame:['★ ',''],marks:['🪩','★','↳'],divider:'⋆｡°✩ ──'},
 lovely:{frame:['♡ ',' ♡'],marks:['🎤','(｡•̀ᴗ-)✧',''],divider:'୨୧ ┈┈ ୨୧'},
 travel:{frame:['',' 🧳'],marks:['🗺️','⌁','↳'],divider:'── ✈ ──'},
 photographer:{frame:['',' 📷'],marks:['✦','📍','↳'],divider:'─ ◇ ─'},
 shop:{frame:['ꕤ ',''],marks:['☕','🕒','↳'],divider:'⋆ ┈ ꕤ ┈ ⋆'},
 'local-business':{frame:['',' 🏺'],marks:['✦','🌱','↳'],divider:'─ ✧ ─'},
 business:{frame:['',' ✦'],marks:['✦','▫','↳'],divider:'─ ◇ ─'},
 pets:{frame:['',' 🐾'],marks:['🐶','🌳','♡'],divider:'ʕ•ᴥ•ʔ ─ ♡'},
 student:{frame:['',' 📚'],marks:['✎','🎧','⋆'],divider:'─ ✧ ─'},
 beauty:{frame:['୨୧ ',''],marks:['💄','🫧','▫','↳'],divider:'─ ♡ ─'},
 company:{frame:['',' ▪'],marks:['▪','▫','↳'],divider:'─ ▪ ─'}
 },
 en:{
 cafe:{frame:['',' ☕'],marks:['☕','📍','↳'],divider:'· · ✦ · ·'},
 daily:{frame:['',' 🌿'],marks:['🌱',''],divider:'— little things —'},
 y2k:{frame:['',' ✷'],marks:['🧷','🎧','↳'],divider:'✷ ━ ✷'},
 lovely:{frame:['',' ♫'],marks:['🎟️','♡',''],divider:'✩ · ♫ · ✩'},
 travel:{frame:['',' 🧭'],marks:['🧭','🚆','↳'],divider:'· ─ ✈ ─ ·'},
 photographer:{frame:['',' 📷'],marks:['📷','📍','↳'],divider:'— ✦ —'},
 shop:{frame:['',' ✿'],marks:['🏺','✿','↳'],divider:'· ✿ ·'},
 'local-business':{frame:['',' ☕'],marks:['☕','🕒','↳'],divider:'— ☕ —'},
 business:{frame:['',' ↗'],marks:['✦','▫','↳'],divider:'— ◇ —'},
 pets:{frame:['',' 🐾'],marks:['🐕','🐾','♡'],divider:'· 🦴 ·'},
 student:{frame:['',' ✎'],marks:['📚','🎧'],divider:'✎ · · ·'},
 beauty:{frame:['',' ✧'],marks:['💄','🫧','',''],divider:'· ♡ ·'},
 company:{frame:['',' ▪'],marks:['▪','▫','↳'],divider:'— ▪ —'}
 },
 ja:{
 cafe:{frame:['꒰ ',' ꒱'],marks:['☕','🍪','↳'],divider:'┈┈ 𖠚 ┈┈'},
 daily:{frame:['⌜ ',' ⌟'],marks:['📖','𓂃',''],divider:'( ˘͈ ᵕ ˘͈ )'},
 y2k:{frame:['',' ⟡'],marks:['🧷','🎧','⌁'],divider:'⋆⸜ ─ ⸝⋆'},
 lovely:{frame:['୨୧ ',' ୨୧'],marks:['🎀','(ᐡᴗ ̫ ᴗᐡ)',''],divider:'♡ ┈┈ ໒꒱'},
 travel:{frame:['',' 🕊️'],marks:['🚃','♨️','↳'],divider:'𓂃 ✈︎ 𓂃'},
 photographer:{frame:['',' 𓆸'],marks:['📷','⌂','↳'],divider:'─ 𖧷 ─'},
 shop:{frame:['',' 🧵'],marks:['🧵','ꕤ','↳'],divider:'┈ ꕤ ┈'},
 'local-business':{frame:['୨୧ ',''],marks:['💅','𓂃','↳'],divider:'୨୧ ┈ ୨୧'},
 business:{frame:['',' ✎'],marks:['🎨','⌁','↳'],divider:'─ ✎ ─'},
 pets:{frame:['',' ✎'],marks:['📔','✎','ꕤ'],divider:'⋆ ┈ 𖤣 ┈ ⋆'},
 student:{frame:['',' 𖧷'],marks:['🎓','📚','𓂃'],divider:'(｡•̀ᴗ-)✧'},
 beauty:{frame:['꒰ ',' ꒱'],marks:['🫧','💄','▫','↳'],divider:'♡ ┈ ୨୧'},
 company:{frame:['',' ▫'],marks:['▫','▸','↳'],divider:'┈ ▫ ┈'}
 }
});
localDesigns.id={
 cafe:{frame:['',' ☕'],marks:['☕','📍','↳'],divider:'— ☕ —'},
 daily:{frame:['⌜ ',' ⌟'],marks:['🌿','⋆'],divider:'· pelan-pelan ·'},
 y2k:{frame:['',' ✷'],marks:['🧷','🎧','↳'],divider:'✷ ─ ✷'},
 lovely:{frame:['♡ ',' ♡'],marks:['🎟️','♪',''],divider:'(˶ᵔ ᵕ ᵔ˶)'},
 travel:{frame:['',' 🧭'],marks:['🧭','🚆','↳'],divider:'· ─ ✈ ─ ·'},
 photographer:{frame:['',' 📷'],marks:['📷','📍','↳'],divider:'─ ◇ ─'},
 shop:{frame:['✿ ',''],marks:['🧵','📦','↳'],divider:'· ✿ ·'},
 'local-business':{frame:['',' ☕'],marks:['☕','🕒','↳'],divider:'─ ☕ ─'},
 business:{frame:['',' ✦'],marks:['✦','▫','↳'],divider:'— ◇ —'},
 pets:{frame:['',' 🐾'],marks:['🐈','🐾','♡'],divider:'ʕ•ᴥ•ʔ ─ ♡'},
 student:{frame:['',' ✎'],marks:['📚','🎧','⋆'],divider:'✎ · · ·'},
 beauty:{frame:['୨୧ ',''],marks:['💄','🫧','',''],divider:'· ♡ ·'},
 company:{frame:['',' ▪'],marks:['▪','▫','↳'],divider:'─ ▪ ─'}
};
localDesigns.tr={
 cafe:{frame:['',' ☕'],marks:['☕','📍','↳'],divider:'─ kahve molası ─'},
 daily:{frame:['⌜ ',' ⌟'],marks:['🌿','⋆'],divider:'· küçük notlar ·'},
 y2k:{frame:['',' ✷'],marks:['🧷','🎧','↳'],divider:'✷ ─ ✷'},
 lovely:{frame:['♡ ',' ♡'],marks:['🎟️','♪',''],divider:'(˶ᵔ ᵕ ᵔ˶)'},
 travel:{frame:['',' 🧭'],marks:['🧭','🚆','↳'],divider:'· ─ ✈ ─ ·'},
 photographer:{frame:['',' 📷'],marks:['📷','📍','↳'],divider:'─ ◇ ─'},
 shop:{frame:['✿ ',''],marks:['🧵','📦','↳'],divider:'· el emeği ·'},
 'local-business':{frame:['',' ☕'],marks:['☕','🕒','↳'],divider:'─ ☕ ─'},
 business:{frame:['',' ✦'],marks:['✦','▫','↳'],divider:'— ◇ —'},
 pets:{frame:['',' 🐾'],marks:['🐈','🐾','♡'],divider:'ʕ•ᴥ•ʔ ─ ♡'},
 student:{frame:['',' ✎'],marks:['📚','🎧','⋆'],divider:'✎ · · ·'},
 beauty:{frame:['୨୧ ',''],marks:['💄','🫧','',''],divider:'· ♡ ·'},
 company:{frame:['',' ▪'],marks:['▪','▫','↳'],divider:'─ ▪ ─'}
};
export function decorateProfile<T extends {id:string;after:string}>(sample:T,lang:Lang):T{
 const source=localDesigns[lang][sample.id],d=(lang==='es'||lang==='ms'||lang==='pt-BR'||lang==='id'||lang==='tr')&&source?{...source,marks:source.marks.map(mark=>mark==='↳'?'→':mark)}:source,base=designs[sample.id];if(!d)return sample;
 const [rawName,...lines]=sample.after.split('\n');
 const styledName=['en','es','ms','pt-BR','id','tr'].includes(lang)?rawName.replace(/\p{L}+/u,word=>fancyText(word,base.style)):rawName;
 const decorated=lines.map((line,i)=>d.marks[i]&&!line.includes(d.marks[i])?d.marks[i]+' '+line:line);
 const withDivider=[...decorated,d.divider].join('\n');
 // Do not silently shorten the original bio or exceed the target's length budget.
 const bio=withDivider.length<=150?withDivider:decorated.join('\n');
 return {...sample,after:d.frame[0]+styledName+d.frame[1]+'\n'+bio};
}
export const decorationLabels=withLocales({
 ko:{title:'이 템플릿의 장식',names:['꾸미기 글꼴·이름 장식','특수문자 포인트','짧은 구분선'],hint:'마음에 드는 예시를 불러온 뒤, 이름·소개글과 장식을 바꿔보세요.'},
 en:{title:'Styles in this template',names:['Styled display name','Symbol accents','Short divider'],hint:'Load a template, then make the name, bio and decorations your own.'},
 ja:{title:'このテンプレートの装飾',names:['名前の装飾','特殊文字のアクセント','短い区切り線'],hint:'テンプレートを読み込み、名前や自己紹介、記号を自分好みに変えられます。'}
});

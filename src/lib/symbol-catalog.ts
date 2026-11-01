import {withLocales} from './locale-data';
export const symbolLabels=withLocales({en:['Stars','Hearts','Arrows','Frames','Happy faces','Expressions','Actions & animals','Flowers','Nature & weather','Music','Checks & marks','Shapes','Lines & dots','Numbers','Units & currency'],ko:['별','하트','화살표','꾸미기 괄호','웃는 표정','감정 표정','동작·동물','꽃','자연·날씨','음악','체크·기호','도형','선·점','숫자','단위·통화'],ja:['星','ハート','矢印','飾り枠','笑顔','気持ち','あいさつ・動物','花','自然・天気','音楽','チェック・マーク','図形','罫線・点','数字','単位・通貨']});

// Some shared kaomoji use Hangul letters as facial features. Keep Korean IDs for
// favorites/history, while displaying and copying non-Hangul variants elsewhere.
const nonKoreanFaces:Record<string,string>={'(๑•̀ㅂ•́)و✧':'(๑•̀ᴗ•́)و✧','(ㅅ´ ˘ `)':'(人´ ˘ `)','(๑´ㅂ`๑)':'(๑´ڡ`๑)'};
export function displaySymbol(value:string,lang:import('./site').Lang){return lang==='ko'?value:nonKoreanFaces[value]??value;}

import type {Lang} from './site';
import {localText} from './locale-data';
import japanese from './ja-ui.json';
export function ui(lang:Lang,ko:string,en:string){return lang==='ja'?(japanese as Record<string,string>)[en]??en:lang==='ko'?ko:localText(lang,en);}

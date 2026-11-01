import tr from './locales/tr.json';
import id from './locales/id.json';
import ptBR from './locales/pt-BR.json';
import es from './locales/es.json';
import ms from './locales/ms.json';
type AddedLocale='es'|'ms'|'pt-BR'|'id'|'tr';
const catalogs:Record<AddedLocale,Record<string,string>>={es,ms,'pt-BR':ptBR,id,tr};
export function localText(lang:string,text:string):string{return lang==='es'||lang==='ms'||lang==='pt-BR'||lang==='id'||lang==='tr'?catalogs[lang][text]??text:text;}
export function translateLocale<T>(lang:AddedLocale,value:T):T{if(typeof value==='string')return localText(lang,value) as T;if(Array.isArray(value))return value.map(item=>translateLocale(lang,item)) as T;if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,translateLocale(lang,item)])) as T;return value;}
export function withLocales<T extends {en:unknown;ko:unknown;ja:unknown}>(base:T):T&{es:T['en'];ms:T['en'];'pt-BR':T['en'];id:T['en'];tr:T['en']}{return {...base,es:translateLocale('es',base.en),ms:translateLocale('ms',base.en),'pt-BR':translateLocale('pt-BR',base.en),id:translateLocale('id',base.en),tr:translateLocale('tr',base.en)};}

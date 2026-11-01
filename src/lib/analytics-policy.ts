import {languageCodes} from './language-registry';
import {isExampleSlug} from './example-routes';
// This module only defines the analytics contract. It does not load Google scripts or send data.
export type AnalyticsChoice='accepted'|'declined';
export const analyticsPreferenceKey='makesns.analytics.v1';
export function analyticsChoice(value:unknown):AnalyticsChoice|null{return value==='accepted'||value==='declined'?value:null;}
export function validMeasurementId(value:unknown):value is string{return typeof value==='string'&&/^G-[A-Z0-9]{6,20}$/.test(value);}
const toolNames=['caption','fonts','symbols','resizer','profile','reels-cover','qr-code','short-links'] as const;
export function analyticsContext(path:string){const clean=path.split(/[?#]/)[0],parts=clean.split('/').filter(Boolean);if(parts.length===0)return {language:'entry',tool:'home',path:'/'};if(!(languageCodes as readonly string[]).includes(parts[0]))return null;if(parts[1]==='examples'){if(parts.length===2||parts.length===3&&isExampleSlug(parts[2]))return {language:parts[0],tool:'examples',path:'/'+parts.join('/')+'/'};return null;}if(parts.length>2)return null;const tool=parts[1]||'home';if(![...toolNames,'home','privacy'].includes(tool as typeof toolNames[number]))return null;return {language:parts[0],tool,path:'/'+parts.join('/')+'/'};}
export function usageEvent(name:string,path:string,details:Record<string,unknown>={}){
 const context=analyticsContext(path);if(!context)return null;const params:Record<string,string|number>={tool_name:context.tool,ui_language:context.language};
 if(name==='copy_complete'){if(!['home','caption','fonts','symbols','profile','examples','short-links'].includes(context.tool))return null;}
 else if(name==='qr_generate'){if(context.tool!=='qr-code')return null;}
 else if(name==='qr_download'){if(context.tool!=='qr-code'||!['png','svg'].includes(String(details.format))||![512,1024,2048].includes(Number(details.size)))return null;params.format=String(details.format);params.size=Number(details.size);}
 else if(name==='link_create'){if(context.tool!=='short-links')return null;}
 else if(name==='profile_complete'){if(context.tool!=='profile'||!['name','bio','all'].includes(String(details.part)))return null;params.copy_part=String(details.part);}
 else if(name==='cover_download'){if(context.tool!=='reels-cover'||!['png','jpg'].includes(String(details.format))||!['reels','grid'].includes(String(details.preset)))return null;params.format=String(details.format);params.preset=String(details.preset);}
 else if(name==='image_download'||name==='zip_download'){
  if(context.tool!=='resizer'||!['jpg','png','webp'].includes(String(details.format))||!['square','portrait','story','landscape'].includes(String(details.preset)))return null;
  const count=name==='image_download'?1:details.count;if(typeof count!=='number'||!Number.isInteger(count)||count<1||count>5)return null;
  params.format=String(details.format);params.preset=String(details.preset);params.file_count=count;if(details.fit_mode!==undefined){if(!['crop','contain'].includes(String(details.fit_mode)))return null;params.fit_mode=String(details.fit_mode);}
 }else return null;
 return {name,params};
}

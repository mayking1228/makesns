import {analyticsChoice,analyticsContext,analyticsPreferenceKey,usageEvent} from './analytics-policy';
export const measurementId='G-NV7DJD8JET';
type GoogleWindow=Window&{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;[key:string]:unknown};
let active=false,lastPage='';
export function storedAnalyticsChoice(){try{return analyticsChoice(localStorage.getItem(analyticsPreferenceKey));}catch{return null;}}
export function saveAnalyticsChoice(choice:'accepted'|'declined'){try{localStorage.setItem(analyticsPreferenceKey,choice);}catch{} }
export function startAnalytics(path:string,choice:unknown){if(typeof window==='undefined'||analyticsChoice(choice)!=='accepted'||!analyticsContext(path))return;const w=window as unknown as GoogleWindow;
 if(!active){active=true;w['ga-disable-'+measurementId]=false;w.dataLayer=w.dataLayer||[];w.gtag=function(){w.dataLayer!.push(arguments);};
 w.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 w.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 w.gtag('js',new Date());w.gtag('set','ads_data_redaction',true);
 const route=analyticsContext(path);let referrer='';try{referrer=new URL(document.referrer).origin;}catch{}
 w.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:window.location.origin+(route?.path||'/'),page_referrer:referrer});
 const script=document.createElement('script');script.id='makesns-google-analytics';script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;document.head.append(script);
 }
 pageAnalytics(path);
}
export function pageAnalytics(path:string){if(!active||typeof window==='undefined')return;const context=analyticsContext(path);if(!context||lastPage===context.path)return;lastPage=context.path;(window as unknown as GoogleWindow).gtag?.('event','page_view',{page_title:'MakeSNS | '+context.language+' | '+context.tool,page_location:window.location.origin+context.path,ui_language:context.language,tool_name:context.tool});}
export function trackUsage(name:string,details:Record<string,unknown>={}){if(!active||typeof window==='undefined')return;const event=usageEvent(name,window.location.pathname,details);if(event)(window as unknown as GoogleWindow).gtag?.('event',event.name,event.params);}
export function stopAnalytics(){if(typeof window==='undefined')return false;const wasActive=active;active=false;lastPage='';const w=window as unknown as GoogleWindow;w['ga-disable-'+measurementId]=true;document.getElementById('makesns-google-analytics')?.remove();
 for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)|^_gid$/.test(name))continue;for(const domain of ['',window.location.hostname,'.'+window.location.hostname,...(window.location.hostname.endsWith('makesns.com')?['makesns.com','.makesns.com']:[])])document.cookie=name+'=; Max-Age=0; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'');}
 return wasActive;
}

// One explicit menu navigation owns the scroll reset. Back/forward is left to the browser.
let cancelPending:(()=>void)|undefined;
export function navigationStartsAtTop(href:string){
 if(typeof window==='undefined')return;
 const target=new URL(href,window.location.href);
 if(target.origin!==window.location.origin||(target.hash&&!['#round','#resize'].includes(target.hash)))return;
 cancelPending?.();let frame=0,matched=0,stopped=false;const until=Date.now()+30000;
 const stop=()=>{stopped=true;cancelAnimationFrame(frame);window.removeEventListener('popstate',stop);if(cancelPending===stop)cancelPending=undefined;};
 cancelPending=stop;window.addEventListener('popstate',stop,{once:true});
 const tick=()=>{if(stopped)return;const current=new URL(window.location.href);if(current.pathname===target.pathname&&current.search===target.search&&current.hash===target.hash){if(++matched>=2){window.scrollTo({top:0,left:0,behavior:'instant'});stop();return;}}else matched=0;if(Date.now()>until){stop();return;}frame=requestAnimationFrame(tick);};
 frame=requestAnimationFrame(tick);
}

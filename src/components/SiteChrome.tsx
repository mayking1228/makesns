import {NavigationLink} from './NavigationLink';
import {navigationCopy,navigationItems,navigationGroups} from '@/lib/navigation';
import {NavigationIcon} from './NavigationIcon';
import {localText} from '@/lib/locale-data';
import {linkCopy} from '@/lib/link-tools';
import {reelsCopy} from '@/lib/reels-cover';
import type {ExampleSlug} from '@/lib/example-routes';
import {examplesCopy} from '@/lib/examples';
import {profileCopy} from '@/lib/profile-templates';
import {ui} from '@/lib/ui';
import {ArrowUpRight,Languages,Sparkles,Type,AlignLeft,Image as ImageIcon} from 'lucide-react';import {copy,tools,toolName,languages,languageNames,type Lang,type Tool} from '@/lib/site';
export const toolIcons={caption:AlignLeft,fonts:Type,symbols:Sparkles,resizer:ImageIcon};
export {NavigationHeader as Header} from './NavigationHeader';
export function Footer({lang}:{lang:Lang}){const c=copy[lang],n=navigationCopy[lang],items=navigationItems(lang);return <footer className="site-footer navigation-footer"><div className="navigation-footer-brand"><NavigationLink href={`/${lang}/`} className="footer-brand">makesns<span>✳</span></NavigationLink><p>{c.footer}</p><div className="related-brands"><a className="related-brand" href="https://360photo.kr/" target="_blank" rel="noopener noreferrer">{localText(lang, lang==='ko'?'360PHOTO · 행사 포토부스·촬영':lang==='ja'?'360PHOTO · イベント向けフォトブース':'360PHOTO · event photo booths')}<ArrowUpRight size={13}/></a><a className="related-brand" href="https://aiphotobooth.kr/" target="_blank" rel="noopener noreferrer">{localText(lang, lang==='ko'?'AI PHOTOBOOTH · AI 포토부스':lang==='ja'?'AI PHOTOBOOTH · AIフォトブース':'AI PHOTOBOOTH · AI photo booths')}<ArrowUpRight size={13}/></a></div><small>© {new Date().getUTCFullYear()} MakeSNS</small></div><nav className="navigation-footer-groups" aria-label={n.all}>{navigationGroups.map(group=><section key={group}><h2><NavigationIcon name={group} small/>{n[group]}</h2>{items.filter(i=>i.group===group).map(i=><NavigationLink key={i.id} href={i.path}>{i.label}</NavigationLink>)}</section>)}<section><h2><NavigationIcon name="profile" small/>{n.profile}</h2><NavigationLink href={`/${lang}/profile/`}>{profileCopy[lang].nav}</NavigationLink><NavigationLink href={`/${lang}/examples/`}>{examplesCopy[lang].nav}</NavigationLink><NavigationLink href={`/${lang}/privacy/`}>{c.privacyTitle}</NavigationLink></section></nav></footer>;}
export function ToolCards({lang,except}:{lang:Lang;except?:Tool}){return <div className="tool-cards">{tools.filter(t=>t!==except).map(t=>{const Icon=toolIcons[t],index=tools.indexOf(t);return <NavigationLink className={'tool-card tool-'+t} key={t} href={`/${lang}/${t}/`}><div className="card-top"><span className="tool-icon"><Icon size={24}/></span><ArrowUpRight size={20}/></div><h3>{toolName(lang,t)}</h3><p>{copy[lang].descriptions[index]}</p><span className="card-cta">{copy[lang].use}<span>→</span></span></NavigationLink>;})}</div>;}

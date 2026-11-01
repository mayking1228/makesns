'use client';
import Link from 'next/link';
import type {AnchorHTMLAttributes,MouseEvent} from 'react';
import {navigationStartsAtTop} from '@/lib/navigation-scroll';
// Tool-mode hashes select a mode, not an anchor below the page heading.
export function NavigationLink({href,onClick,target,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}){
 function follow(e:MouseEvent<HTMLAnchorElement>){onClick?.(e);if(!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&(!target||target==='_self'))navigationStartsAtTop(href);}
 return href.includes('#')?<a href={href} target={target} onClick={follow} {...props}/>:<Link href={href} target={target} prefetch={false} scroll={false} onClick={follow} {...props}/>;
}

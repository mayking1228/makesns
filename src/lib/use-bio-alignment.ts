'use client';
import {useEffect,useState,type RefObject} from 'react';
import {alignBio,type BioAlignment} from './profile-alignment';
export function useBioAlignment(text:string,alignment:BioAlignment,ref:RefObject<HTMLParagraphElement|null>){
 const [result,setResult]=useState({source:text,mode:alignment,text,blocked:false,padding:0});
 useEffect(()=>{let alive=true;const element=ref.current;if(!element)return;const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
  function update(){if(!alive||!ref.current)return;const e=ref.current,style=getComputedStyle(e);ctx!.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;const output=alignBio(text,alignment,e.clientWidth,value=>ctx!.measureText(value).width);setResult({source:text,mode:alignment,...output});}
  update();const observer=new ResizeObserver(update);observer.observe(element);document.fonts.ready.then(update);return()=>{alive=false;observer.disconnect();};
 },[text,alignment,ref]);
 return result.source===text&&result.mode===alignment?result:{text,blocked:false,padding:0};
}

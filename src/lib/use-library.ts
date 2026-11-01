'use client';
import {useEffect,useState} from 'react';
import {emptyLibrary,parseLibrary,recordCopy,toggleFavorite,libraryKey,type Library,type LibraryItem} from './library';
let memory=emptyLibrary();let unavailable=false;
function read(){if(unavailable)return memory;try{const raw=localStorage.getItem(libraryKey);if(raw!==null)memory=parseLibrary(raw);else if(!unavailable)memory=emptyLibrary();}catch{unavailable=true;}return memory;}
function save(next:Library){memory=parseLibrary(next);try{localStorage.setItem(libraryKey,JSON.stringify(memory));unavailable=false;}catch{unavailable=true;}window.dispatchEvent(new Event('makesns-library-change'));}
export function useLibrary(){const [value,setValue]=useState<Library>(emptyLibrary),[persistent,setPersistent]=useState(true);useEffect(()=>{const sync=()=>{setValue(read());setPersistent(!unavailable);};sync();window.addEventListener('storage',sync);window.addEventListener('makesns-library-change',sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener('makesns-library-change',sync);};},[]);return {value,persistent,toggle:(item:LibraryItem)=>save(toggleFavorite(read(),item)),record:(item:LibraryItem)=>save(recordCopy(read(),item)),clearRecent:()=>save({...read(),recent:[]})};}

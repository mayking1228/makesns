'use client';
import {useEffect,useState} from 'react';
import {languageCodes,suggestedLanguage} from '@/lib/language-registry';
import type {Lang} from '@/lib/site';
export function LanguageEntry(){const [lang,setLang]=useState<Lang>('en');useEffect(()=>{setLang(suggestedLanguage(navigator.language));},[]);const n=languageCodes.length,text={en:`All tools are available in ${n} languages.`,ko:`모든 도구를 ${n}개 언어로 이용할 수 있어요.`,ja:`${n}つの言語ですべてのツールをご利用いただけます。`,es:`Todas las herramientas están disponibles en ${n} idiomas.`,ms:`Semua alat tersedia dalam ${n} bahasa.`,'pt-BR':`Todas as ferramentas estão disponíveis em ${n} idiomas.`,id:`Semua alat tersedia dalam ${n} bahasa.`,tr:`Tüm araçları ${n} dilde kullanabilirsin.`};return <p lang={lang}>{text[lang]}</p>;}

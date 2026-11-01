import {languageCodes,languageLocales} from './language-registry';
import {withLocales} from './locale-data';
import type {Metadata} from 'next';
import type {Lang} from './site';
const base='https://makesns.com';
export const seoTitles=withLocales({
 ko:{home:'인스타 꾸미기·릴스 커버 무료 도구',caption:'인스타 줄바꿈·공백 복사',fonts:'인스타 영어 글씨체·꾸미기 글꼴',symbols:'특수문자·이모티콘·이모지 복사',resizer:'이미지 크기 조절·원형 프로필 사진',profile:'인스타 프로필 꾸미기·소개글 템플릿',reels:'릴스 커버 만들기·영상 썸네일 제작'},
 en:{home:'Free Instagram Tools & Reel Cover Maker',caption:'Instagram Caption Spacer & Line Breaks',fonts:'Fancy Text Generator for Instagram',symbols:'Symbols, Kaomoji & Emoji to Copy',resizer:'Image Resizer & Profile Photo Cropper',profile:'Instagram Bio Templates & Profile Editor',reels:'Reel Cover Maker from Video or Photos'},
 ja:{home:'インスタの文字・画像・リールカバー作成ツール',caption:'インスタ改行・空白行ツール',fonts:'インスタおしゃれ文字・英字フォント変換',symbols:'特殊文字・顔文字・絵文字コピペ',resizer:'画像リサイズ・丸いプロフィール写真作成',profile:'インスタ自己紹介テンプレート・プロフィール作成',reels:'リールの表紙・カバー画像作成'}
});
export const seoDescriptions=withLocales({
 ko:{home:'인스타 소개글, 줄바꿈, 글씨체, 특수문자, 사진 크기 조절과 릴스 커버 제작을 무료로. 가입 없이 브라우저에서 사용하세요.',caption:'인스타 캡션의 줄바꿈과 공백을 정리하고 글자 수·해시태그를 확인하세요. 가입 없이 복사해 사용할 수 있어요.',fonts:'영문과 숫자를 꾸미기 글꼴로 변환하고 복사하세요. 인스타 이름·소개글에 적용할 수 있으며 한글은 그대로 유지됩니다.',symbols:'하트·리본·얼굴문자·이모지를 검색하고 복사하세요. 인스타 소개글에 넣거나 선택한 문장을 프레임으로 꾸밀 수 있어요.',resizer:'사진 크기·비율 조절과 원형 프로필 사진 만들기. 업로드 없이 JPG·PNG·WebP로 자르고 저장하세요.'},
 en:{home:'Free Instagram tools: bios, fancy text, symbols, photo crops and reel covers.',caption:'Add Instagram caption line breaks, keep blank lines and copy your text for free.',fonts:'Create fancy Unicode text for Instagram bios. Style English letters and digits.',symbols:'Search and copy hearts, ribbons, kaomoji and emoji for your Instagram bio.',resizer:'Resize photos or crop a profile picture. Free and private in your browser.'},
 ja:{home:'インスタの自己紹介・改行・おしゃれ文字・特殊文字・画像編集・リール表紙作成を、無料・登録なしで。',caption:'インスタの投稿文に改行・空白行を入れてコピー。文字数とハッシュタグ数も確認できます。無料・登録不要。',fonts:'英字や数字をおしゃれ文字に変換してコピペ。インスタの名前や自己紹介に。日本語の文章はそのまま残せます。',symbols:'ハート・リボン・顔文字・絵文字を検索してコピペ。インスタの自己紹介に挿入し、選んだ文章を飾り枠で囲めます。',resizer:'画像のサイズ・比率変更とプロフィール写真の丸いトリミング。アップロード不要で無料。'}
});
export function seoAlternates(path='/'){return {...Object.fromEntries(languageCodes.map(lang=>[lang,'/'+lang+path])),'x-default':path==='/'?'/':'/en'+path} as Record<Lang|'x-default',string>;}
export function socialImage(lang?:Lang){const key=lang||'global';return {url:'/social/'+key+'-v7.png',width:1200,height:630,alt:(withLocales({ko:'MakeSNS · 프로필 꾸미기, 문자와 이미지 편집 도구',en:'MakeSNS · free tools for bios, text, photos and links',ja:'MakeSNS · 自己紹介・文字・画像の無料編集ツール',global:'MakeSNS · free social media tools in eight languages'}))[key]};}
export function commonMetadata(lang:Lang,path:string,title:string,description:string,article=false){
 const locales=languageLocales,alt=withLocales({ko:'MakeSNS 무료 SNS 도구',en:'MakeSNS free social media tools',ja:'MakeSNS 無料SNSツール'})[lang],fullTitle=title.includes('MakeSNS')?title:title+' — MakeSNS';
 return {title:fullTitle,description,alternates:{canonical:`/${lang}${path}`,languages:seoAlternates(path)},robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},openGraph:{title:fullTitle,description,url:`/${lang}${path}`,siteName:'MakeSNS',locale:locales[lang],alternateLocale:Object.entries(locales).filter(([l])=>l!==lang).map(([,v])=>v),type:article?'article':'website',images:[socialImage(lang)]},twitter:{card:'summary_large_image',title:fullTitle,description,images:[socialImage(lang)]}} satisfies Metadata;
}
export const entryMetadata={metadataBase:new URL(base),title:`MakeSNS — Free Social Media Tools in ${languageCodes.length} Languages`,description:'Tools for bios, captions, symbols, photos and reel covers. Pick your language.',alternates:{canonical:'/',languages:seoAlternates('/')},robots:{index:true,follow:true},openGraph:{title:`MakeSNS — Free Social Media Tools in ${languageCodes.length} Languages`,description:'Tools for bios, captions, symbols, photos and reel covers. Pick your language.',url:'/',siteName:'MakeSNS',type:'website',locale:'en_US',alternateLocale:languageCodes.filter(l=>l!=='en').map(l=>languageLocales[l]),images:[socialImage()]},twitter:{card:'summary_large_image',title:`MakeSNS — Free Social Media Tools in ${languageCodes.length} Languages`,description:'Tools for bios, captions, symbols, photos and reel covers. Pick your language.',images:[socialImage()]}} satisfies Metadata;
export function privacyMetadata(lang:Lang){return commonMetadata(lang,'/privacy/',(withLocales({ko:'개인정보 안내',en:'Privacy',ja:'プライバシーポリシー'}))[lang],(withLocales({ko:'MakeSNS의 브라우저 내 처리, 임시 저장, 선택적 분석 쿠키와 개인정보 보호 방식을 안내합니다.',en:'How MakeSNS handles local processing, temporary drafts and optional analytics.',ja:'ブラウザ内の処理、下書きの一時保存、任意のアクセス解析とプライバシーについてご案内します。'}))[lang]);}
export function structuredPage({lang='en',path,title,description,application=false}:{lang?:Lang;path:string;title:string;description:string;application?:boolean}){
 const url=base+path,siteId=base+'/#website',pageId=url+'#webpage',name=title.replace(/ — MakeSNS$/,'');
 const graph:Record<string,unknown>[]=[{'@type':'WebSite','@id':siteId,url:base+'/',name:'MakeSNS',inLanguage:[...languageCodes]},{'@type':'WebPage','@id':pageId,url,name,description,inLanguage:lang,image:base+socialImage(path==='/'?undefined:lang).url,isPartOf:{'@id':siteId}}];
 if(path!=='/'&&path.split('/').filter(Boolean).length>1){
  const parts=path.split('/').filter(Boolean),home=(withLocales({ko:'홈',en:'Home',ja:'ホーム'}))[lang],crumbs=[{'@type':'ListItem',position:1,name:home,item:base+'/'+lang+'/'}];
  if(parts[1]==='examples'&&parts.length>2)crumbs.push({'@type':'ListItem',position:2,name:(withLocales({ko:'사용 예시',en:'Examples',ja:'使い方・使用例'}))[lang],item:base+'/'+lang+'/examples/'});
  if(parts.length>1)crumbs.push({'@type':'ListItem',position:crumbs.length+1,name,item:url});
  graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs});graph[1].breadcrumb={'@id':url+'#breadcrumb'};
 }
 if(application){graph[1].mainEntity={'@id':url+'#application'};graph.push({'@type':'WebApplication','@id':url+'#application',name,url,description,inLanguage:lang,applicationCategory:/resizer|reels-cover/.test(path)?'MultimediaApplication':'UtilitiesApplication',operatingSystem:'Any',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},isPartOf:{'@id':siteId}});}
 return {'@context':'https://schema.org','@graph':graph};
}
export function safeJsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c');}

export const seoHomeCopy=withLocales({ko:{hero:'인스타 꾸미기부터\n릴스 커버까지, 무료로',intro:'소개글 꾸미기, 줄바꿈·특수문자 복사, 사진 크기 조절과 릴스 커버 제작까지. 가입 없이 브라우저에서 간편하게 사용하세요.'},en:{hero:'Free Instagram tools.\nFor your next post.',intro:'Build your bio, format captions, find fancy text and symbols, resize photos or make a reel cover. Free tools, no account needed.'},ja:{hero:'インスタの文字・画像を\n無料でかんたん編集',intro:'自己紹介の装飾、投稿文の改行、特殊文字のコピペから、画像のサイズ変更・リールの表紙作成まで。登録なしで使えます。'}});

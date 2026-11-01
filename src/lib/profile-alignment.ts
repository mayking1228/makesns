import {withLocales} from './locale-data';
export type BioAlignment='left'|'center'|'right';
export function alignBio(text:string,alignment:BioAlignment,width:number,measure:(text:string)=>number){
 if(alignment==='left')return {text,blocked:false,padding:0};
 if(!Number.isFinite(width)||width<=0)return {text,blocked:true,padding:0};
 const pad='\u2800',padWidth=measure(pad);if(!Number.isFinite(padWidth)||padWidth<=0)return {text,blocked:true,padding:0};
 let padding=0;const output=text.split('\n').map(line=>{if(!line.trim())return line;const length=measure(line);if(!Number.isFinite(length)||length>=width)return line;const count=Math.min(24,Math.max(0,Math.floor((width-length)/(alignment==='center'?2:1)/padWidth)));padding+=count;return pad.repeat(count)+line;}).join('\n');
 // Refuse only the generated padding; never cut the user's text to make it fit.
 return output.length>150?{text,blocked:true,padding:0}:{text:output,blocked:false,padding};
}
export const alignmentCopy=withLocales({ko:{label:'소개글 정렬',left:'왼쪽',center:'가운데',right:'오른쪽',note:'복사할 때 정렬용 공백도 포함됩니다. 앱·기기마다 표시가 달라질 수 있어요.',blocked:'150자 안에 정렬용 공백을 넣을 수 없어 원문을 표시합니다. 소개글을 줄이거나 왼쪽 정렬을 선택하세요.'},en:{label:'Bio alignment',left:'Left',center:'Center',right:'Right',note:'Copied text includes spacing characters. Alignment can vary by app and device.',blocked:'The added spaces would exceed 150 characters, so the original text is shown. Shorten the bio or choose left alignment.'},ja:{label:'自己紹介の配置',left:'左寄せ',center:'中央',right:'右寄せ',note:'コピーする文章には配置用の空白も含まれます。アプリや端末によって表示が異なります。',blocked:'配置用の空白を含めると150文字を超えるため、元の文章を表示しています。文章を短くするか、左寄せを選んでください。'}});

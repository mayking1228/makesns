import {withLocales} from './locale-data';
import {drawImageCanvas,type CropArea} from './images';
export function drawProfilePhoto(image:HTMLImageElement,canvas:HTMLCanvasElement,area:CropArea|undefined,size:320|1080,type:'image/png'|'image/jpeg',circle=false){
 if(![320,1080].includes(size)||!['image/png','image/jpeg'].includes(type)||circle&&type!=='image/png')throw Error('output');
 drawImageCanvas(image,canvas,{mode:'crop',area,width:size,height:size,type});
 if(circle){const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas');ctx.save();ctx.globalCompositeOperation='destination-in';ctx.beginPath();ctx.arc(size/2,size/2,size/2,0,Math.PI*2);ctx.fill();ctx.restore();}
 return canvas;
}
export const photoCopy=withLocales({
 ko:{title:'원형 프로필 사진 만들기',intro:'사진을 움직이고 확대해 원 안에 얼굴이나 로고가 들어오도록 맞추세요.',open:'원형 사진 크롭 열기',choose:'사진 선택',zoom:'확대',size:'저장 크기',square:'정사각형 저장',circle:'원 밖을 투명하게 저장 (PNG)',note:'인스타그램에는 보통 정사각형 사진을 올리면 원형으로 표시됩니다. 투명 원형 PNG도 선택할 수 있어요.',preview:'원형 표시 미리보기',apply:'내 프로필 미리보기에 적용',download:'사진 다운로드',clear:'사진 비우기',privacy:'사진은 이 페이지의 메모리에서만 처리하며 저장·업로드하지 않습니다.',error:'12MB 이하 JPG·PNG·WebP 정지 이미지를 선택하세요. 4,000만 화소를 초과하는 이미지는 사용할 수 없습니다.',busy:'사진을 준비하고 있습니다…',done:'완료했습니다.',failed:'사진을 처리하지 못했습니다. 다른 이미지로 다시 시도하세요.'},
 en:{title:'Make a circular profile photo',intro:'Drag and zoom to keep your face or logo inside the circle.',open:'Open profile photo cropper',choose:'Choose a photo',zoom:'Zoom',size:'Export size',square:'Save as a square',circle:'Transparent corners (PNG)',note:'Instagram normally displays a square upload as a circle. A transparent circular PNG is also available.',preview:'Circular preview',apply:'Use in my profile preview',download:'Download photo',clear:'Clear photo',privacy:'Photos stay in this page’s memory. They are not stored or uploaded.',error:'Choose a still JPG, PNG or WebP under 12MB and 40 megapixels.',busy:'Preparing your photo…',done:'Done.',failed:'Could not process this photo. Try a different image.'},
 ja:{title:'プロフィール写真を丸くトリミング',intro:'写真を動かして拡大し、顔やロゴが円の中に収まるように調整します。',open:'写真のトリミングを開く',choose:'写真を選ぶ',zoom:'拡大',size:'保存サイズ',square:'正方形で保存',circle:'円の外側を透過して保存（PNG）',note:'Instagramでは通常、正方形の写真をアップロードすると丸く表示されます。円の外側を透過したPNGも保存できます。',preview:'丸く表示したときの見え方',apply:'プロフィールのプレビューに反映',download:'写真をダウンロード',clear:'写真をクリア',privacy:'写真はこのページのメモリ内だけで処理し、保存・アップロードしません。',error:'12MB以下・4,000万画素以下のJPG・PNG・WebPの静止画を選んでください。',busy:'写真を準備しています…',done:'完了しました。',failed:'写真を処理できませんでした。別の画像でお試しください。'}
});

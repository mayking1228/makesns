"""Generate localized, rasterized 1200×630 social cards (Pillow + Noto CJK)."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/social';OUT.mkdir(exist_ok=True)
FONT='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc';REG='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
DATA={
 'ko':{'label':'한국어','title':['프로필부터','게시물까지, 나답게.'],'sub':['소개글 · 꾸미기 글꼴 · 특수문자','이미지 편집 · QR · 단축링크'],'pill':'무료 · 가입 없이 바로','name':'김주원의 기록','bio':['「서울의 작은 순간들」','카페와 사진, 나의 취향 ★','오늘도 좋아하는 걸 기록해요'],'paper':'#F5F8EF','accent':'#CEE7AE','muted':'#E8F0DB','sample':'나만의 프로필'},
 'en':{'label':'ENGLISH','title':['Your next post.','A little more you.'],'sub':['Bios, fancy text & symbols.','Images, QR codes & short links.'],'pill':'Free tools. No sign-up.','name':'Lana / little moments','bio':['★ coffee, cameras & city walks','London days. Weekend escapes.','a little archive of things I love'],'paper':'#F0F6FC','accent':'#BED9F3','muted':'#DFEAF6','sample':'Make it yours'},
 'ja':{'label':'日本語','title':['プロフィールも、','投稿も、かんたんに。'],'sub':['自己紹介・おしゃれ文字・顔文字','画像編集・QRコード・短縮URL'],'pill':'無料・登録なしで使えます','name':'ラナ｜暮らしの記録','bio':['〜 喫茶店と、日々のこと','東京⌇カメラ片手に街歩き','好きなものを、少しずつ ☆'],'paper':'#FBF4EF','accent':'#EECAB6','muted':'#F3E5DA','sample':'自分らしくアレンジ'},
 'global':{'label':'EN / 한국어 / 日本語','title':['Create. Style.','Share your way.'],'sub':['Simple tools for your next post.','Text, photos, QR codes & links.'],'pill':'Free tools. No sign-up.','name':'your little corner','bio':['★ make room for your ideas','Bios · text · photos · links','a little more personality'],'paper':'#F7F8EF','accent':'#D8E8AE','muted':'#EAF0D8','sample':'MakeSNS'}}
DATA['es']={'label':'ESPAÑOL','title':['Tu perfil.','A tu manera.'],'sub':['Bios, letras bonitas y símbolos.','Fotos, códigos QR y enlaces cortos.'],'pill':'Gratis. Sin registro.','name':'Lana · pequeños momentos','bio':['★ cafés de barrio y fotos con calma','Madrid, casi siempre','Guardo mis sitios favoritos aquí'],'paper':'#FBF4EA','accent':'#F2C986','muted':'#F7E8CE','sample':'Dale tu toque'}
DATA['ms']={'label':'BAHASA MELAYU','title':['Profil cantik,','ikut gaya anda.'],'sub':['Bio, tulisan cantik dan simbol.','Imej, kod QR dan pautan pendek.'],'pill':'Percuma. Tanpa pendaftaran.','name':'Lana · catatan harian','bio':['★ kopi, gambar dan cerita kecil','Sekitar Kuala Lumpur','Lokasi ada pada setiap siaran'],'paper':'#EFF8F5','accent':'#ACE0CE','muted':'#D9EFE7','sample':'Gayakan profil anda'}
DATA['pt-BR']={'label':'PORTUGUÊS (BRASIL)','title':['Seu perfil.','Do seu jeito.'],'sub':['Bio, letras diferentes e símbolos.','Fotos, códigos QR e links curtos.'],'pill':'Grátis. Sem cadastro.','name':'Lana · pequenos registros','bio':['★ café, fotos e passeios pela cidade','São Paulo, quase sempre','Um pouco do que quero guardar'],'paper':'#EDF8F6','accent':'#A9DECF','muted':'#D8EDE8','sample':'Deixe com a sua cara'}
DATA['id']={'label':'BAHASA INDONESIA','title':['Bikin profil.','Pakai gayamu.'],'sub':['Bio, font keren, dan simbol.','Foto, kode QR, dan tautan pendek.'],'pill':'Gratis. Tanpa daftar.','name':'Lana · cerita sehari-hari','bio':['★ ngopi, foto, dan jalan sebentar','Bandung dan sekitarnya','Catatan kecil yang ingin disimpan'],'paper':'#FFF6F1','accent':'#F0BDA6','muted':'#F7E2D7','sample':'Sesuaikan dengan gayamu'}
DATA['tr']={'label':'TÜRKÇE','title':['Profilin.','Senin tarzın.'],'sub':['Biyografi, şekilli yazı ve semboller.','Fotoğraf, QR kod ve kısa bağlantılar.'],'pill':'Ücretsiz. Üyelik gerekmez.','name':'Lana · günlük notlar','bio':['★ kahve, fotoğraf ve sokak araları','İstanbul ve biraz da yol hikâyeleri','Sevdiğim küçük şeyleri biriktiriyorum'],'paper':'#F7F2FB','accent':'#D9BFEA','muted':'#ECE0F3','sample':'Kendi tarzını kat'}
DATA['global']['label']='EN / 한국어 / 日本語 / ES / BM / PT-BR / ID / TR'
for lang,c in DATA.items():
 scale=2;im=Image.new('RGB',(1200*scale,630*scale),c['paper']);d=ImageDraw.Draw(im);index=1 if lang=='ko' else 0
 def font(size,bold=False):return ImageFont.truetype(('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf') if lang=='tr' else (FONT if bold else REG),size*scale,index=0 if lang=='tr' else index)
 def box(bounds,fill,r=0,outline=None):
  b=tuple(int(v*scale) for v in bounds)
  if r:d.rounded_rectangle(b,radius=r*scale,fill=fill,outline=outline,width=scale)
  else:d.rectangle(b,fill=fill)
 def text(x,y,t,size,fill='#19312E',bold=False):d.text((x*scale,y*scale),t,font=font(size,bold),fill=fill,anchor='lt')
 box((0,0,1200,12),c['accent']);box((64,58,112,106),'#19312E',13);text(75,64,'m',34,c['accent'],True);text(126,68,'makesns.',32,bold=True)
 # Language label is drawn at its measured width, never clipped.
 label_font=font(14);w=d.textlength(c['label'],font=label_font)/scale
 box((1128-w-28,67,1148,104),c['muted'],18);text(1128-w-14,75,c['label'],14,bold=True)
 for i,line in enumerate(c['title']):text(64,177+i*78,line,52,bold=True)
 for i,line in enumerate(c['sub']):text(68,364+i*35,line,21,'#526A60')
 pillw=d.textlength(c['pill'],font=font(17,True))/scale+36
 box((64,475,64+pillw,517),'#19312E',21);text(82,485,c['pill'],17,'#FFFFFF',True)
 text(68,566,'makesns.com',17,'#587166')
 box((784,165,1135,555),c['muted'],26);box((772,151,1123,541),'#FFFFFF',26,'#D8E1D6')
 text(799,178,'@ '+('lana.note' if lang=='ja' else 'juwon.note' if lang=='ko' else 'lana.archive' if lang=='en' else 'little.archive'),16,bold=True)
 d.ellipse((801*scale,224*scale,865*scale,288*scale),fill=c['accent']);text(821,237,'★',28)
 text(890,239,'124    1.5k',18,bold=True);text(801,315,c['name'],20,bold=True)
 for i,line in enumerate(c['bio']):text(801,358+i*29,line,14,'#456052')
 box((799,468,1097,509),c['accent'],10);text(817,479,c['sample'],15,bold=True)
 im.resize((1200,630),Image.Resampling.LANCZOS).save(OUT/(lang+'-v7.png'),optimize=True)
print(f'Generated {len(DATA)} localized social images')

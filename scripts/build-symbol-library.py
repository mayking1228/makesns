from pathlib import Path
import json,re,hashlib,shutil
import argparse
parser=argparse.ArgumentParser(description='Build curated Unicode/CLDR symbol data from local source files.');parser.add_argument('--source-dir',type=Path,required=True);args=parser.parse_args()
r=Path(__file__).resolve().parents[1];src=args.source_dir.resolve();langs=['en','ko','ja','es','ms','pt-BR','id','tr'];ann={l:json.loads((src/('annotations-'+('pt' if l=='pt-BR' else l)+'.json')).read_text())['annotations']['annotations'] for l in langs}
# Stable category keys; native labels are independent of the searchable text.
cats={
'emoji-smileys':['Faces & feelings','표정·감정','表情・気持ち','Caras y emociones','Wajah dan perasaan','Rostos e emoções','Wajah & perasaan','Yüzler ve duygular'],
'emoji-people':['People & gestures','사람·손짓','人・ジェスチャー','Personas y gestos','Orang dan gerak isyarat','Pessoas e gestos','Orang & gestur','İnsanlar ve hareketler'],
'emoji-animals':['Animals & nature','동물·자연','動物・自然','Animales y naturaleza','Haiwan dan alam','Animais e natureza','Hewan & alam','Hayvanlar ve doğa'],
'emoji-food':['Food & drinks','음식·음료','食べ物・飲み物','Comida y bebida','Makanan dan minuman','Comidas e bebidas','Makanan & minuman','Yiyecek ve içecek'],
'emoji-travel':['Travel & places','여행·장소','旅行・場所','Viajes y lugares','Perjalanan dan tempat','Viagens e lugares','Perjalanan & tempat','Seyahat ve yerler'],
'emoji-activities':['Activities & games','활동·게임','活動・ゲーム','Actividades y juegos','Aktiviti dan permainan','Atividades e jogos','Aktivitas & permainan','Etkinlikler ve oyunlar'],
'emoji-objects':['Objects & work','사물·작업','物・仕事','Objetos y trabajo','Benda dan kerja','Objetos e trabalho','Benda & pekerjaan','Nesneler ve işler'],
'emoji-symbols':['Signs & symbols','표식·기호','マーク・記号','Signos y símbolos','Tanda dan simbol','Sinais e símbolos','Tanda & simbol','İşaretler ve semboller'],
'emoji-flags':['Flags','깃발','旗','Banderas','Bendera','Bandeiras','Bendera','Bayraklar'],
'face-greeting':['Greetings','인사','あいさつ','Saludos','Sapaan','Saudações','Sapaan','Selamlaşma'],
'face-hug':['Hugs','포옹','ハグ','Abrazos','Pelukan','Abraços','Pelukan','Sarılma'],
'face-wink':['Winks','윙크','ウインク','Guiños','Kenyitan','Piscadinhas','Kedipan','Göz kırpma'],
'face-apology':['Apologies','사과','おじぎ・ごめん','Disculpas','Minta maaf','Desculpas','Minta maaf','Özür'],
'face-running':['Running','달리기','走る','Corriendo','Berlari','Correndo','Berlari','Koşma'],
'face-sleep':['Sleepy','졸림·잠','眠い','Sueño','Mengantuk','Sono','Mengantuk','Uykulu'],
'face-shrug':['Shrugs','어깨 으쓱','お手上げ','Encogerse de hombros','Angkat bahu','Dar de ombros','Angkat bahu','Omuz silkme'],
'face-victory':['Cheering & victory','응원·승리','応援・ピース','Ánimo y victoria','Semangat dan kemenangan','Torcida e vitória','Semangat & kemenangan','Destek ve zafer'],
'face-love':['Love','사랑','好き・ハート','Cariño','Kasih sayang','Carinho','Kasih sayang','Sevgi'],
'face-cat':['Cats','고양이','ねこ','Gatos','Kucing','Gatos','Kucing','Kediler'],
'face-joy':['Joy','기쁨','うれしい','Alegría','Gembira','Alegria','Senang','Sevinç'],
'face-sad':['Sadness','슬픔','悲しい','Tristeza','Sedih','Tristeza','Sedih','Üzüntü'],
'combo-lovely':['Lovely accents','러블리 조합','かわいい飾り','Adornos románticos','Hiasan manis','Detalhes românticos','Hiasan manis','Romantik süsler'],
'combo-minimal':['Minimal accents','심플 조합','シンプルな飾り','Adornos minimalistas','Hiasan ringkas','Detalhes minimalistas','Hiasan minimalis','Sade süsler'],
'combo-stars':['Sparkling accents','반짝 조합','きらきらの飾り','Adornos brillantes','Hiasan berkilau','Detalhes com brilho','Hiasan berkilau','Işıltılı süsler'],
'combo-floral':['Floral accents','꽃 조합','花の飾り','Adornos florales','Hiasan bunga','Detalhes florais','Hiasan bunga','Çiçekli süsler'],
'combo-wings':['Wings & ribbons','날개·리본 조합','羽・リボン','Alas y lazos','Sayap dan reben','Asas e laços','Sayap & pita','Kanatlar ve kurdeleler'],
'divider-soft':['Minimal dividers','심플 구분선','シンプルな区切り線','Separadores simples','Pemisah ringkas','Divisórias simples','Pemisah minimalis','Sade ayırıcılar'],
'divider-stars':['Star dividers','별 구분선','星の区切り線','Separadores de estrellas','Pemisah bintang','Divisórias de estrelas','Pemisah bintang','Yıldızlı ayırıcılar'],
'divider-love':['Heart dividers','하트 구분선','ハートの区切り線','Separadores de corazones','Pemisah hati','Divisórias de coração','Pemisah hati','Kalpli ayırıcılar'],
'divider-floral':['Floral dividers','꽃 구분선','花の区切り線','Separadores florales','Pemisah bunga','Divisórias florais','Pemisah bunga','Çiçekli ayırıcılar']}
face={
'greeting':'(*・ω・)ﾉ|(￣▽￣)ノ|(°▽°)/|( ´ ∀ ` )ﾉ|(^-^*)/|(＠´ー`)ﾉﾞ|(´• ω •`)ﾉ|( ° ∀ ° )ﾉﾞ|ヾ(*\'▽\'*)|＼(⌒▽⌒)|ヾ(☆▽☆)|( ´ ▽ ` )ﾉ|(^０^)ノ|~ヾ(・ω・)|(・∀・)ノ|ヾ(・ω・*)',
'hug':'(づ￣ ³￣)づ|(つ≧▽≦)つ|(つ✧ω✧)つ|(づ ◕‿◕ )づ|(⊃｡•́‿•̀｡)⊃|(つ . •́ _ʖ •̀ .)つ|(っಠ‿ಠ)っ|(づ◡﹏◡)づ|⊂(´• ω •`⊂)|⊂(･ω･*⊂)|⊂(￣▽￣)⊃|⊂( ´ ▽ ` )⊃',
'wink':'(^_~)|( ﾟｏ⌒)|(^_-)≡☆|(^ω~)|(>ω^)|(~人^)|(^_-)|( -_・)|(^_<)〜☆|(^人<)〜☆|☆⌒(≧▽°)|☆⌒(ゝ。∂)|(^_<)|(^_−)☆|(･ω<)☆|(^.~)☆',
'apology':'m(_ _)m|(シ_ _)シ|m(. .)m|<(_ _)>|人(_ _*)|(*_ _)人|m(_ _;m)|(m;_ _)m|(シ. .)シ|(｡-人-｡)',
'running':'ᕕ༼✪ل͜✪༽ᕗ|₍₍ ᕕ(´◓⌓◔)ᕗ⁾⁾|ᕕ༼✿•̀︿•́༽ᕗ|ᕕ(◉Д◉ )ᕗ|┗(＾0＾)┓|ᕕ( ᐛ )ᕗ|ᕕ(ಥʖ̯ಥ)ᕗ|ᕕ( ՞ ᗜ ՞ )ᕗ|ᕕ( ಠ‿ಠ)ᕗ|┌( ಠ‿ಠ)┘|ε＝┏(･ω･)┛|ヽ(￣д￣;)ノ=3=3=3',
'sleep':'[(－－)]..zzZ|(－_－) zzZ|(∪｡∪)｡｡｡zzZ|(－ω－) zzZ|(￣o￣) zzZZ|(( _ _ ))..zzzZZ|(￣ρ￣)..zzZZ|(－.－)...zzz|(＿ ＿*) Z z z|(x . x) ~~zzZ',
'shrug':'┐(´～｀)┌|┐(´д｀)┌|╮(╯▽╰)╭|╮(╯_╰)╭|¯\\_(⊙︿⊙)_/¯|┐(´ー｀)┌|ᕕ( ᐕ )ᕗ|¯\\_(ツ)_/¯|┐(￣ヘ￣)┌|╮(￣ω￣;)╭',
'victory':'(^-^)V|✌(◕‿-)✌|(￣▽￣)V|v(￣ｰ￣)v|（＾ｖ＾）|(*^-ﾟ)v|ｖ(⌒ｏ⌒)ｖ|✌(-‿-)✌|(^^)v|(´・ω・)v|v(´∀｀*v)|(=￣▽￣=)Ｖ|✌(´◡`)✌|(￣▽￣)ｂ|(*•̀ᴗ•́*)و ̑̑|d(￣◇￣)b',
'love':'(♡˙︶˙♡)|(´｡• ᵕ •｡`) ♡|(｡♥‿♥｡)|♡(˘▽˘>ԅ( ˘⌣˘)|٩(♡ε♡ )۶|(ღ˘⌣˘ღ)|(*♡∀♡)|♡(｡- ω -)|♡＼(￣▽￣)／♡|( ´ ▽ ` ).｡ｏ♡|(*˘︶˘*).｡.:*♡|ღゝ◡╹)ノ♡',
'cat':'(=^･ω･^=)|ฅ^•ﻌ•^ฅ|(=①ω①=)|(=｀ω´=)|(=^‥^=)|(=^-ω-^=)|(=^･ｪ･^=)|(^・ω・^ )|(=ＴェＴ=)|(=；ｪ；=)|(^._.^)ﾉ|ฅ(＾・ω・＾ฅ)',
'joy':'(❁´◡`❁)|✿◕ ‿ ◕✿|◎[▪‿▪]◎|☆(❁‿❁)☆|≧◉◡◉≦|≧◠‿◠≦|٩(˘◡˘)۶|（*^_^*）|ლ(╹◡╹ლ)|o(∩_∩)o|ʘ‿ʘ|（⌒▽⌒）|(◠‿◠)|≖‿≖|(◕‿◕)|(●⌒∇⌒●)',
'sad':'(｡•́︿•̀｡)|(っ˘̩╭╮˘̩)っ|(╥﹏╥)|(ಥ_ಥ)|(T⌓T)|(｡╯︵╰｡)|(´；д；`)|(´•̥̥̥ω•̥̥̥`)|(;﹏;)|(つω`｡)|(ノ_<。)|｡･ﾟﾟ*(>д<)*ﾟﾟ･｡'}
entries=[]
for key,text in face.items():
 for v in text.split('|'):entries.append(dict(value=v,kind='face',category='face-'+key,names=cats['face-'+key],keywords=cats['face-'+key]))
combos={
'lovely':['♡₊˚','୨୧ ⊹','꒰ ♡ ꒱','ʚ♡ɞ','ᥫ᭡ ˚₊','♡ˎˊ˗'],
'minimal':['• ·','⌜ ⌟','— ◇ —','▫ ▪ ▫','∘ ∘ ∘','· ﾟ'],
'stars':['⋆｡°✩','✧˖°','⋆⁺₊⋆','˚₊‧꒰ა ☆ ໒꒱ ‧₊˚','✩₊˚.⋆','˗ˏˋ ★ ˎˊ˗'],
'floral':['❀ ˚₊','✿｡:','𓆸 ⋆','ꕤ ˚','❁ · ❁','☘︎ ✧'],
'wings':['໒꒱ ˚','꒰ა ♡ ໒꒱','ʚ ✧ ɞ','୨୧ ˚₊','༘♡ ⋆','꒰ა ☆ ໒꒱']}
for key,items in combos.items():
 for v in items:entries.append(dict(value=v,kind='combo',category='combo-'+key,names=cats['combo-'+key],keywords=cats['combo-'+key]))
for key,centers in {'soft':['·','◇','∘','▫','•','⌁'],'stars':['✦','✧','★','☆','⋆','✩'],'love':['♡','♥','୨୧','ʚ♡ɞ','ෆ','♡₊˚'],'floral':['✿','❀','ꕤ','❁','☘','𓆸']}.items():
 for i,center in enumerate(centers):
  v=('── '+center+' ──') if i%2==0 else ('┈┈ '+center+' ┈┈');entries.append(dict(value=v,kind='divider',category='divider-'+key,names=cats['divider-'+key],keywords=cats['divider-'+key]))
groupMap={'Smileys & Emotion':'smileys','People & Body':'people','Animals & Nature':'animals','Food & Drink':'food','Travel & Places':'travel','Activities':'activities','Objects':'objects','Symbols':'symbols','Flags':'flags'}
groups={k:[] for k in groupMap};group=None
for line in (src/'emoji-test.txt').read_text().splitlines():
 if line.startswith('# group: '):group=line[9:]
 if '; fully-qualified' not in line or group not in groups:continue
 codes=line.split(';')[0].strip().split();value=''.join(chr(int(c,16)) for c in codes)
 if any(0x1f3fb<=ord(c)<=0x1f3ff for c in value):continue
 # Keep complete standard sequences, including ZWJ and variation selectors.
 english=line.split('#',1)[1].strip().split(' ',2)[-1];english=re.sub(r'^E[\d.]+\s+','',english)
 groups[group].append((value,english))
# Round-robin gives every major subject a useful first release rather than thousands of variants.
chosen=[];idx=0
while len(chosen)<900:
 added=False
 for key,items in groups.items():
  if idx<len(items):chosen.append((key,*items[idx]));added=True
  if len(chosen)>=900:break
 if not added:break
 idx+=1
# Include all current language-country flags, even if outside the alphabetical selection.
for v in ['🇺🇸','🇰🇷','🇯🇵','🇪🇸','🇲🇾','🇧🇷','🇮🇩','🇹🇷','🇫🇷','🇩🇪','🇻🇳','🇹🇭','🇵🇭','🇮🇳']:
 if not any(row[1]==v for row in chosen):chosen.append(('Flags',v,'flag'))
for key,value,english in chosen:
 names=[];keywords=[]
 for i,lang in enumerate(langs):
  a=ann[lang].get(value) or ann[lang].get(value.replace('\ufe0f','')) or {};name=(a.get('tts') or [cats['emoji-'+groupMap[key]][i]])[0]
  names.append(name);keywords.append(' '.join(a.get('default',[])[:12]) or name)
 entries.append(dict(value=value,kind='emoji',category='emoji-'+groupMap[key],names=names,keywords=keywords))
# Exact sequences retain stable IDs. Do not split emoji or merge text and emoji presentation variants.
seen=set();entries=[x for x in entries if not(x['value'] in seen or seen.add(x['value']))]
(r/'src/lib/symbol-expansion.json').write_text(json.dumps({'categories':cats,'entries':entries},ensure_ascii=False,separators=(',',':'))+'\n')
# Light validation IDs keep the expanded localized metadata out of the home/profile initial bundle.
(r/'src/lib/symbol-expansion-ids.json').write_text(json.dumps([e['value'] for e in entries],ensure_ascii=False,separators=(',',':'))+'\n')
(r/'public/licenses').mkdir(exist_ok=True);shutil.copy2(src/'UNICODE-LICENSE.txt',r/'public/licenses/UNICODE-LICENSE.txt')
source={'emojiVersion':'16.0','sources':['https://raw.githubusercontent.com/unicode-org/unicodetools/main/unicodetools/data/emoji/16.0/emoji-test.txt','https://github.com/unicode-org/cldr-json/tree/main/cldr-json/cldr-annotations-full'],'retrieved':'2026-11-01','sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(src.glob('annotations-*.json'))},'entries':len(entries),'license':'/licenses/UNICODE-LICENSE.txt'}
(r/'docs/LIBRARY-DATA-SOURCES.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n');print('New catalog entries:',len(entries),'bytes:',(r/'src/lib/symbol-expansion.json').stat().st_size)

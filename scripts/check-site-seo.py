from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as E,json,sys,struct
site=Path(sys.argv[1]).resolve();base='https://makesns.com'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.head=False;self.lang='';self.meta=[];self.links=[];self.title='';self.in_title=False;self.h1=0;self.ld=[];self.script=None
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='head':self.head=True
  if t=='html':self.lang=d.get('lang','')
  if t=='title' and self.head:self.in_title=True
  if t=='h1':self.h1+=1
  if t=='meta' and self.head:self.meta.append(d)
  if t=='link' and self.head:self.links.append(d)
  if t=='script' and d.get('type')=='application/ld+json':self.script=''
 def handle_data(self,d):
  if self.in_title:self.title+=d
  if self.script is not None:self.script+=d
 def handle_endtag(self,t):
  if t=='head':self.head=False
  if t=='title':self.in_title=False
  if t=='script' and self.script is not None:self.ld.append(json.loads(self.script));self.script=None
 def value(self,key):
  values=[m.get('content','') for m in self.meta if m.get('name')==key or m.get('property')==key]
  assert len(values)==1,(self.title,key,len(values));return values[0]
def file_for(url):
 u=urlsplit(url);assert u.scheme=='https' and u.netloc=='makesns.com' and not u.query and not u.fragment,url
 p=(site/u.path.lstrip('/')/'index.html').resolve();assert p.is_relative_to(site) and p.is_file(),url;return p,u.path
rows=E.parse(site/'sitemap.xml').findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url');assert len(rows)==113,len(rows)
titles=set();descriptions=set();seen=set();apps=0
for row in rows:
 url=row.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text;assert url not in seen;seen.add(url);file,path=file_for(url);p=Page();p.feed(file.read_text());lang='en' if path=='/' else path.strip('/').split('/')[0];assert p.lang==lang and p.h1==1,(url,'language/H1')
 canonical=[l.get('href') for l in p.links if l.get('rel')=='canonical'];assert canonical==[url],url
 desc=p.value('description');assert desc and len(desc)<=80,(url,'description')
 assert p.title not in titles and desc not in descriptions,(url,'duplicate title/description');titles.add(p.title);descriptions.add(desc)
 for key in ['og:title','twitter:title']:assert p.value(key)==p.title,(url,key)
 for key in ['og:description','twitter:description']:assert p.value(key)==desc,(url,key)
 expected_image=base+'/social/'+('global' if url==base+'/' else lang)+'-v7.png';assert p.value('og:image')==expected_image;assert p.value('twitter:image')==expected_image;assert p.value('og:image:alt');assert p.value('twitter:image:alt');assert p.value('twitter:card')=='summary_large_image';assert p.value('og:locale')=={'en':'en_US','ko':'ko_KR','ja':'ja_JP','es':'es_ES','ms':'ms_MY','pt-BR':'pt_BR','id':'id_ID','tr':'tr_TR'}[lang]
 assert 'noindex' not in p.value('robots');assert p.value('naver-site-verification')=='531beb9f2f7c8163e9309847000dc6ebcde2d505'
 part='/' if path=='/' or path in ['/en/','/ko/','/ja/','/es/','/ms/','/pt-BR/','/id/','/tr/'] else '/'+ '/'.join(path.strip('/').split('/')[1:])+'/'
 expected={l:base+'/'+l+part for l in ['en','ko','ja','es','ms','pt-BR','id','tr']};expected['x-default']=base+'/' if part=='/' else base+'/en'+part
 alts={l.get('hreflang'):l['href'] for l in p.links if 'hreflang' in l};assert alts==expected,(url,'HTML alternates')
 xmlalts={l.attrib['hreflang']:l.attrib['href'] for l in row.findall('{http://www.w3.org/1999/xhtml}link')};assert xmlalts==expected,(url,'sitemap alternates')
 for target in expected.values():file_for(target)
 assert len(p.ld)==1 and p.ld[0].get('@context')=='https://schema.org',(url,'JSON-LD')
 graph=p.ld[0]['@graph'];page=next(n for n in graph if n['@type']=='WebPage');assert page['url']==url and page['inLanguage']==lang
 ids=[n.get('@id') for n in graph];assert len(ids)==len(set(ids)),(url,'duplicate schema IDs')
 for n in graph:
  assert 'aggregateRating' not in n and 'review' not in n and 'sameAs' not in n
  if n['@type']=='BreadcrumbList':assert len(n['itemListElement'])>=2
  if n['@type']=='WebApplication':apps+=1;assert n['offers']['price']=='0' and n['isAccessibleForFree'] is True
assert apps==64,apps
robots=(site/'robots.txt').read_text();assert 'Sitemap: '+base+'/sitemap.xml' in robots;assert not any(l.strip()=='Disallow: /' for l in robots.splitlines())
assert 'noindex' in (site/'404.html').read_text();image=(site/'social-card.png').read_bytes();assert image[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',image[16:24])==(1200,630)
print('SEO 검사 통과: 113개 페이지, 언어·canonical·hreflang·소셜 메타·구조화 데이터·robots·사이트맵·공유 이미지')

for key in ['global','ko','en','ja','es','ms','pt-BR','id','tr']:
 image=(site/'social'/f'{key}-v7.png').read_bytes();assert image[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',image[16:24])==(1200,630),key
print('언어별 대표 이미지 9종·1200×630 PNG·OG/X 연결 확인 완료')

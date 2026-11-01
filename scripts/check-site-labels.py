from html.parser import HTMLParser
from pathlib import Path
import sys
class Visible(HTMLParser):
 def __init__(self):super().__init__();self.hidden=0;self.parts=[]
 def handle_starttag(self,t,a):
  if t in ['script','style']:self.hidden+=1
 def handle_endtag(self,t):
  if t in ['script','style']:self.hidden=max(0,self.hidden-1)
 def handle_data(self,d):
  if not self.hidden:self.parts.append(d)
site=Path(sys.argv[1]);count=0
for lang in ['ko','en','ja','es','ms','pt-BR','id','tr']:
 for suffix in ['', 'symbols/', 'profile/']:
  p=site/lang/suffix/'index.html';parser=Visible();parser.feed(p.read_text());text=' '.join(parser.parts)
  for bad in ['yüz yuz','çerçeve cerceve']:assert bad not in text,(lang,suffix,bad)
  if suffix=='symbols/':assert 'data-symbol-count="1596"' in p.read_text(),(lang,'old library UI')
  count+=1
print(f'라벨 교정 검사 통과: {count}개 화면, 검색 별칭 노출 없음.')

// Run as root on the VPS. Never publish the report output or database.
import {DatabaseSync} from 'node:sqlite';
const [action,code]=process.argv.slice(2);
if(!['reports','disable'].includes(action)||action==='disable'&&!/^[A-Za-z0-9_-]{12}$/.test(code||'')){console.error('Usage: node manage.mjs reports | disable <12-character-code>');process.exit(1);}
const db=new DatabaseSync(process.env.LINKS_DB||'/var/lib/makesns-links/links.sqlite',{readOnly:action==='reports'});
try{db.exec('PRAGMA busy_timeout=5000');if(action==='reports')console.log(JSON.stringify(db.prepare('SELECT r.code,l.target,r.reason,COUNT(*) AS reports,MAX(r.created_at) AS latest FROM reports r JOIN links l ON l.code=r.code GROUP BY r.code,r.reason ORDER BY latest DESC LIMIT 100').all(),null,2));else{const result=db.prepare('UPDATE links SET target=NULL,token_hash=NULL,deleted=1 WHERE code=?').run(code);console.log(JSON.stringify({disabled:Number(result.changes)}));}}finally{db.close();}

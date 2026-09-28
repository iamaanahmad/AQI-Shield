'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Advisory, cities, HISTORY_KEY, LANG_KEY, Language, nearestCity, readHistory, RESULT_KEY, sample, validAdvisory } from '@/lib/data';
import { copy } from '@/lib/copy';

function Mark() { return <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true"><path d="M16 3 27 7v9c0 6-7 11-11 13C12 27 5 22 5 16V7Z" stroke="currentColor" strokeWidth="1.8"/><path d="M10 13h10c4 0 4-5 1-5M10 18h12M10 23h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function Landscape() { return <svg className="landscape" viewBox="0 0 540 590" fill="none" aria-hidden="true"><rect width="540" height="590" rx="220" fill="#e4eef0"/><circle cx="357" cy="156" r="64" fill="#fff8d9"/><path d="M0 410Q130 255 285 358T560 354V600H0Z" fill="#bdd7d5"/><path d="M0 491Q140 350 309 447T550 440V600H0Z" fill="#88b7b1"/><path d="M0 571Q200 446 550 538V600H0Z" fill="#387e79"/><path d="M40 195h153c45 0 45-48 17-48M70 227h180M27 259h140c40 0 40 40 13 40" stroke="#a3c6c9" strokeWidth="3" strokeLinecap="round"/><path d="M365 421v106m-23-52 23 20 27-34m-50-5 23 20 27-34" stroke="#246a66" strokeWidth="5" strokeLinecap="round"/><circle cx="365" cy="419" r="38" fill="#5a9991"/><circle cx="348" cy="442" r="32" fill="#5a9991"/><circle cx="383" cy="442" r="29" fill="#5a9991"/></svg>; }

export default function Shield({view}:{view:'home'|'result'|'history'}) {
 const router=useRouter();
 const [lang,setLang]=useState<Language>('en');
 const [city,setCity]=useState('delhi');
 const [advisory,setAdvisory]=useState<Advisory|null>(null);
 const [history,setHistory]=useState<Advisory[]>([]);
 const [error,setError]=useState<''|'storage'|'corrupt'|'geoError'|'geoOutside'>('');
 const [ready,setReady]=useState(false);
 const [locating,setLocating]=useState(false);
 const t=copy[lang];
 useEffect(()=>{
  try { const l=localStorage.getItem(LANG_KEY); if(l==='en'||l==='hi') setLang(l); } catch { /* Language still works in memory. */ }
  try { setHistory(readHistory()); } catch { setError('corrupt'); }
  try { const raw=sessionStorage.getItem(RESULT_KEY); if(raw) {const data:unknown=JSON.parse(raw); if(validAdvisory(data)) {setAdvisory(data);setCity(data.city);} else setError('corrupt');} } catch { setError('corrupt'); }
  setReady(true);
 },[view]);
 useEffect(()=>{document.documentElement.lang=lang;},[lang]);
 function language(l:Language) {setLang(l);try {localStorage.setItem(LANG_KEY,l);} catch { /* No false persistence claim. */ }}
 function open(a:Advisory) {try {sessionStorage.setItem(RESULT_KEY,JSON.stringify(a));setError('');setAdvisory(a);router.push('/result/');} catch {setError('storage');}}
 function save() {
  if(!advisory) return;
  try {
   const current=readHistory();
   const next=[{...advisory,savedAt:new Date().toISOString()},...current.filter(a=>a.id!==advisory.id)].slice(0,30);
   localStorage.setItem(HISTORY_KEY,JSON.stringify(next));setHistory(next);setError('');
  } catch {setError('storage');}
 }
 function remove(id:string) {try {const next=readHistory().filter(a=>a.id!==id);localStorage.setItem(HISTORY_KEY,JSON.stringify(next));setHistory(next);setError('');} catch {setError('storage');}}
 function locate() {
  if(!navigator.geolocation) {setError('geoError');return;}
  setLocating(true);setError('');
  navigator.geolocation.getCurrentPosition(p=>{const match=nearestCity(p.coords.latitude,p.coords.longitude);if(match)setCity(match.id);else setError('geoOutside');setLocating(false);},()=>{setError('geoError');setLocating(false);},{timeout:8000,maximumAge:60000});
 }
 const selected=cities.find(c=>c.id===(advisory?.city||city))!;
 const isSaved=history.some(a=>a.id===advisory?.id);
 return <><a className="skip" href="#main">{lang==='en'?'Skip to content':'मुख्य सामग्री पर जाएँ'}</a><header className="header"><Link href="/" className="brand" aria-label={t.homeLabel}><Mark/><span>AQI Shield<small>SchoolSafe Air</small></span></Link><nav aria-label={lang==='en'?'Main navigation':'मुख्य नेविगेशन'}><Link href="/" aria-current={view==='home'?'page':undefined}>{t.home}</Link><Link href="/history/" aria-current={view==='history'?'page':undefined}>{t.history}</Link></nav><div className="languages" role="group" aria-label={t.language}><button aria-pressed={lang==='en'} onClick={()=>language('en')}>EN</button><button aria-pressed={lang==='hi'} onClick={()=>language('hi')}>हिन्दी</button></div></header>
 <main id="main"><div className="preview"><span className="dot"/>{t.demo}</div>{error&&<p className="notice" role="alert">{t[error]}</p>}
 {view==='home' ? <><section className="hero"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="intro">{t.intro}</p><form onSubmit={e=>{e.preventDefault();open({id:crypto.randomUUID(),city,sample:true});}}><label htmlFor="city">{t.city}</label><div className="location-row"><span aria-hidden="true">◎</span><select id="city" value={city} onChange={e=>setCity(e.target.value)}>{cities.map(c=><option value={c.id} key={c.id}>{c[lang]}</option>)}</select></div><button className="primary" type="submit">{t.check}<span aria-hidden="true">↗</span></button><button className="locate" type="button" disabled={locating} onClick={locate}><span aria-hidden="true">◎</span> {locating?t.locating:t.location}</button></form><p className="privacy">{t.privacy}</p></div><div className="scene"><Landscape/><div className="scene-caption"><span aria-hidden="true">↗</span><p>{lang==='en'?'A clearer picture.\nA calmer plan.':'हवा की साफ़ तस्वीर।\nदिन की बेहतर तैयारी।'}</p></div></div></section><p className="footnote">{t.note}</p></> : !ready ? <p className="empty" role="status">{t.loading}</p> : view==='result' ? advisory ? <div className="result"><div className="page-heading"><div><p className="eyebrow">{t.today}</p><h1>{selected[lang]}</h1><p>{t.sampleDate}</p></div><Link className="text-link" href="/">{t.back} ↗</Link></div><section className="air-panel"><div className="air-reading"><div className="reading">3<span>/ 5</span></div><span className="status-label">{t.moderate}</span><p>{t.index}</p></div><div className="air-meaning"><h2>{t.meaning}</h2><p>{t.explanation}</p><div className="scale" aria-hidden="true"><i/><i/><i/><i/><i/></div><div className="scale-labels"><span>{t.scaleLow}</span><span>{t.scaleHigh}</span></div><small>{t.indexNote}</small></div></section><div className="result-columns"><section className="forecast"><h2>{t.forecast}</h2><p className="muted">{t.forecastNote}</p><div className="bars" role="img" aria-label={sample.forecast.map((v,i)=>`${9+i}:00 ${v}/5`).join(', ')}>{sample.forecast.map((v,i)=><div className={'bar-item '+(i===3||i===4?'best':'')} key={i}><span className="bar-value">{v}</span><div className="bar" style={{height:`${v*22}px`}}/><span className="hour">{i+9}</span></div>)}</div><div className="window"><span className="window-icon" aria-hidden="true">◷</span><div><p>{t.window}</p><strong>{t.windowTime}</strong><small>{t.windowNote}</small></div></div></section><section className="actions"><h2>{t.actions}</h2><ol>{[t.action1,t.action2,t.action3].map((a,i)=><li key={i}><span>0{i+1}</span>{a}</li>)}</ol><p className="muted">{t.notMedical}</p></section></div><section className="family"><h2>{t.family}</h2><div><article><h3>{t.children}</h3><p>{t.childNote}</p></article><article><h3>{t.older}</h3><p>{t.olderNote}</p></article></div></section><div className="save-row"><button className="primary" onClick={save} disabled={isSaved}>{isSaved?'✓ '+t.saved:t.save}</button><p>{t.local}</p></div></div> : <section className="empty"><h1>{t.noResult}</h1><p>{t.noResultBody}</p><Link className="primary" href="/">{t.home} ↗</Link></section> : <section className="history"><div className="page-heading"><div><p className="eyebrow">{t.history}</p><h1>{t.historyIntro}</h1><p>{t.local}</p></div></div>{history.length ? <><p className="footnote">{t.stale}</p><ul className="history-list">{history.map(a=><li key={a.id}><div className="mini-reading">3<small>/ 5</small></div><div className="history-info"><h2>{cities.find(c=>c.id===a.city)![lang]}</h2><p>{t.sample} · {t.moderate}</p><small>{t.savedOn} {new Date(a.savedAt!).toLocaleString(lang==='hi'?'hi-IN':'en-IN',{dateStyle:'medium',timeStyle:'short'})}</small></div><div className="history-buttons"><button className="text-link" onClick={()=>open(a)}>{t.open} ↗</button><button className="remove" onClick={()=>remove(a.id)}>{t.remove}</button></div></li>)}</ul></> : <div className="empty"><div className="empty-symbol" aria-hidden="true">☷</div><h2>{t.empty}</h2><p>{t.emptyBody}</p><Link className="primary" href="/">{t.home} ↗</Link></div>}</section>}
 </main><footer><span>AQI Shield</span><span>{lang==='en'?'Made for everyday decisions.':'हर दिन के फ़ैसलों के लिए।'}</span></footer></>;
}

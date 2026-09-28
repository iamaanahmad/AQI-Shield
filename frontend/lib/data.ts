export type Language = 'en' | 'hi';
export const cities = [
 {id:'delhi',en:'New Delhi',hi:'नई दिल्ली',lat:28.61,lon:77.21},
 {id:'mumbai',en:'Mumbai',hi:'मुंबई',lat:19.08,lon:72.88},
 {id:'bengaluru',en:'Bengaluru',hi:'बेंगलुरु',lat:12.97,lon:77.59},
 {id:'kolkata',en:'Kolkata',hi:'कोलकाता',lat:22.57,lon:88.36},
 {id:'chennai',en:'Chennai',hi:'चेन्नई',lat:13.08,lon:80.27},
 {id:'hyderabad',en:'Hyderabad',hi:'हैदराबाद',lat:17.39,lon:78.49},
];
export type Advisory = { id:string; city:string; savedAt?:string; sample:true };
export const sample = { index:3, forecast:[3,3,3,2,2,2,3,3,4,4,3,3] };
export const HISTORY_KEY='aqi-shield.history.v1';
export const RESULT_KEY='aqi-shield.result.v1';
export const LANG_KEY='aqi-shield.language.v1';
export function validAdvisory(value:unknown): value is Advisory {
 if (!value || typeof value!=='object') return false;
 const v=value as Advisory;
 return typeof v.id==='string' && v.id.length<100 && v.sample===true && cities.some(c=>c.id===v.city) && (v.savedAt===undefined || (typeof v.savedAt==='string' && Number.isFinite(Date.parse(v.savedAt))));
}
export function readHistory():Advisory[] {
 const raw=localStorage.getItem(HISTORY_KEY);
 if (!raw) return [];
 const data:unknown=JSON.parse(raw);
 if (!Array.isArray(data) || !data.every(v=>validAdvisory(v) && typeof v.savedAt==='string')) throw new Error('Invalid saved history');
 return data.slice(0,30);
}
export function nearestCity(lat:number,lon:number) {
 const ranked=cities.map(city=>({city,d:Math.hypot((city.lat-lat)*111,(city.lon-lon)*111*Math.cos(lat*Math.PI/180))})).sort((a,b)=>a.d-b.d);
 return ranked[0].d<=80 ? ranked[0].city : null;
}

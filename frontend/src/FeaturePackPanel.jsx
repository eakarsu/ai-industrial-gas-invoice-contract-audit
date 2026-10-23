import React,{useEffect,useState} from 'react';
export default function FeaturePackPanel({api,insightsPath,exportPath}){
  const [q,setQ]=useState(''); const [data,setData]=useState(null); const [error,setError]=useState('');
  useEffect(()=>{ if(!insightsPath) return; api(insightsPath).then(setData).catch(e=>setError(e.message)); },[insightsPath]);
  const dl=(fmt)=>{ const a=document.createElement('a'); a.href=`${exportPath}${exportPath.includes('?')?'&':'?'}format=${fmt}&q=${encodeURIComponent(q)}`; a.download=`records.${fmt}`; a.click(); };
  return <section aria-label="Search, export and record insights"><h3>Search, export &amp; record insights</h3>
    <label>Search records <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title, reference, owner..." /></label>
    <button type="button" onClick={()=>dl('csv')}>Export CSV</button><button type="button" onClick={()=>dl('json')}>Export JSON</button>
    {error&&<p>{error}</p>}
    {data&&<div><p>{data.label} — aiGenerated: {String(data.aiGenerated)}</p>{data.sections.map(s=><div key={s.label}><h4>{s.label}</h4><strong>{String(s.value)}</strong><p>{s.detail}</p></div>)}</div>}
  </section>;
}

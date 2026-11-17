/* Browser/Node implementation of app.py. No runtime dependencies. */
(function(root) {
  'use strict';
  const services = {health:['uninsured','Health van'],food:['low_income','Food bank'],vaccine:['unvaccinated','Vaccine clinic']};
  const sum = values => values.reduce((a,b)=>a+b,0);
  function distance(a,b) {return Math.hypot((a.lon-b.lon)*111.32*Math.cos(32.8*Math.PI/180),(a.lat-b.lat)*111.32);}
  // Python round(x) uses ties-to-even; Math.round instead rounds .5 toward +Infinity.
  function roundEven(x) {const floor=Math.floor(x),fraction=x-floor;return fraction===.5 ? floor+(floor%2!==0 ? 1 : 0) : Math.round(x);}
  function best(items,score,min=false) {return items.reduce((a,b)=>(min ? score(b)<score(a) : score(b)>score(a)) ? b:a);}
  function optimize(data,service='health',stops=5,minutes=15) {
    if(!Object.hasOwn(services,service)||!Number.isInteger(stops)||stops<1||stops>10||!Number.isInteger(minutes)||minutes<5||minutes>45)throw Error('Use service health/food/vaccine, 1–10 stops, and 5–45 minutes.');
    const [field,title]=services[service],points=data.centers,indices=points.map((_,i)=>i);
    const weights=points.map(p=>p.population*(.15+p[field]+.2*(!p.nearby_clinic)));
    const chosen=[best(indices,i=>weights[i])];
    while(chosen.length<stops)chosen.push(best(indices.filter(i=>!chosen.includes(i)),i=>weights[i]*Math.min(...chosen.map(j=>distance(points[i],points[j])**2))));
    let centers=chosen.map(i=>({...points[i]}));
    for(let iteration=0;iteration<60;iteration++) {
      const groups=centers.map(()=>[]);
      points.forEach((p,i)=>groups[best(centers.map((_,j)=>j),j=>distance(p,centers[j]),true)].push(i));
      const updated=groups.map((group,j)=>{
        if(!group.length)return centers[j];
        const total=sum(group.map(i=>weights[i]));
        return {lat:sum(group.map(i=>weights[i]*points[i].lat))/total,lon:sum(group.map(i=>weights[i]*points[i].lon))/total};
      });
      const shift=Math.max(...updated.map((c,j)=>distance(c,centers[j])));centers=updated;
      if(shift<.001)break;
    }
    const candidates=[];
    centers.forEach(c=>candidates.push(best(indices.filter(i=>!candidates.includes(i)),i=>distance(c,points[i]),true)));
    const radius=minutes/60*25/1.3,covered=new Set(),result=[];
    const coverage=i=>indices.filter(j=>distance(points[i],points[j])<=radius);
    const fmt=n=>n.toLocaleString('en-US');
    while(candidates.length) {
      const selected=best(candidates,i=>sum(coverage(i).filter(j=>!covered.has(j)).map(j=>points[j].population*(.15+points[j][field]))));
      candidates.splice(candidates.indexOf(selected),1);
      const ids=coverage(selected),fresh=ids.filter(j=>!covered.has(j));
      const population=sum(ids.map(j=>points[j].population)),added=sum(fresh.map(j=>points[j].population));
      const high=sum(ids.map(j=>roundEven(points[j].population*points[j][field])));
      const noClinic=sum(ids.filter(j=>!points[j].nearby_clinic).map(j=>points[j].population)),p=points[selected];
      result.push({rank:result.length+1,name:p.name,lat:p.lat,lon:p.lon,population,additional_population:added,high_need_population:high,no_clinic_population:noClinic,explanation:`${p.name} covers about ${fmt(population)} sample residents within an estimated ${minutes}-minute trip, including ${fmt(high)} with this service’s need indicator. ${fmt(noClinic)} live in sample centers marked as lacking a nearby clinic. This stop adds ${fmt(added)} residents beyond higher-ranked stops.`});
      ids.forEach(j=>covered.add(j));
    }
    return {city:'Dallas, TX',service:title,minutes,radius_km:Number(radius.toFixed(3)),stops:result,unique_population_served:sum([...covered].map(j=>points[j].population)),sample_population:sum(points.map(p=>p.population)),data_notice:data.notice,centers:points};
  }
  const api={optimize,roundEven};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.PopUpOptimizer=api;
})(typeof globalThis!=='undefined'?globalThis:this);

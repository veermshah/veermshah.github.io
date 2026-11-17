'use strict';
const $ = id => document.getElementById(id);
const make = (tag, text, cls) => { const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(cls)n.className=cls; return n; };
const names={solo:'Solo',fixed:'Fixed pipeline',generated:'Generated program',aime2024:'AIME 2024',hotpotqa:'HotpotQA',math:'Original math',multihop:'Original multi-hop'};
const num = value => value===null || value===undefined ? 'undefined' : Number(value).toLocaleString('en-US',{maximumFractionDigits:1});
const fee = value => value===null || value===undefined ? 'undefined' : '$'+Number(value).toLocaleString('en-US',{maximumFractionDigits:6});
let records={}, cohort='official', selectedCall=0;
function showExperiment(key){
 cohort=key; const data=records[key]; const official=key==='official';
 document.querySelectorAll('[data-cohort]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.cohort===key));b.tabIndex=b.dataset.cohort===key?0:-1;});
 $('experiment').setAttribute('aria-labelledby',key+'-tab');
 $('cohort-name').textContent=official?'Public AIME 2024 + HotpotQA subset':'Accessible math + fictional multi-hop calibration';
 $('cohort-description').textContent=official?'First six public AIME 2024 records and first six HotpotQA distractor-validation records. Every Hotpot distractor paragraph is retained. These are public benchmark examples, not the paper’s full evaluation.':'Twelve pre-existing original toy questions, measured with the real model after the official AIME cohort reached a zero-correct floor. Exploratory calibration; official results and denominators remain unchanged.';
 const g=data.generation_settings;
 $('budget').textContent=`${data.model} · temperature ${g.temperature} · solver cap ${g.max_tokens} tokens · workflow cap ${g.plan_max_tokens} tokens · ${g.context.toLocaleString()} context`;
 $('download').href=`./data/${key}.json`;
 $('stats').replaceChildren();
 const stats=[[new Set(data.runs.map(r=>r.id)).size,'FIXED TASKS'],[data.summary.reduce((n,s)=>n+s.calls,0),'COMPLETED MODEL CALLS'],[data.summary.reduce((n,s)=>n+s.token_units,0),'ACTUAL INPUT + OUTPUT TOKENS'],[fee(data.summary.reduce((n,s)=>n+s.dollars,0)),'TOTAL LOCAL API FEES']];
 for(const [value,label] of stats){const d=make('div',undefined,'stat');d.append(make('span',typeof value==='number'?num(value):value,'number'),make('span',label,'label'));$('stats').append(d);}
 if(official){$('finding').textContent='No generated-orchestration advantage demonstrated. All AIME arms solved zero tasks. On HotpotQA only the fixed pipeline solved one; costs per solved task are undefined for the other arms.';}
 else{const s=data.summary;const ratio=b=>{const solo=s.find(x=>x.benchmark===b&&x.arm==='solo'),gen=s.find(x=>x.benchmark===b&&x.arm==='generated');return (gen.units_per_solved/solo.units_per_solved).toFixed(2);};$('finding').textContent=`In this calibration, generated orchestration used ${ratio('math')}× the solo tokens per solved math task and ${ratio('multihop')}× per solved multi-hop task. It did not beat solo inference. This is not a full-paper reproduction.`;}
 $('metrics').replaceChildren();let family='';
 for(const row of data.summary){
  if(row.benchmark!==family){family=row.benchmark;const tr=make('tr',undefined,'family-row'),cell=make('td',names[family]||family);cell.colSpan=8;tr.append(cell);$('metrics').append(tr);}
  const tr=make('tr',undefined,row.arm==='generated'?'generated-row':'');
  const vals=[names[row.arm],`${row.solved}/${row.tasks}`,num(row.units_per_solved),num(row.token_units),fee(row.dollars_per_solved),row.protocol_errors,row.infrastructure_errors,row.truncated_calls];
  vals.forEach(v=>tr.append(make('td',String(v),v==='undefined'?'undefined':undefined)));$('metrics').append(tr);
 }
 const tasks=[...new Map(data.runs.map(r=>[r.id,r])).values()];$('task-select').replaceChildren();
 for(const r of tasks){const task=r.trace[0]?.input?.task;const title=task?.question||r.id;const op=make('option',`${names[r.benchmark]} · ${title.length>95?title.slice(0,95)+'…':title}`);op.value=r.id;$('task-select').append(op);}
 showRun();
 const url=new URL(location.href);url.searchParams.set('dataset',key);history.replaceState(null,'',url);
}
function showRun(){
 const data=records[cohort], row=data.runs.find(r=>r.id===$('task-select').value&&r.arm===$('arm-select').value);
 if(!row)return;
 const task=row.trace[0]?.input?.task||{id:row.id,question:'No completed model call recorded.'};
 $('question').textContent=task.question;
 $('task-context').textContent=JSON.stringify(task,null,2);
 $('outcome').className='outcome'+(row.correct?'':' failure');
 $('outcome').textContent=row.error_kind==='model_protocol_failure'?'INVALID PLAN · MODEL FAILURE':row.error?'PROVIDER / INFRASTRUCTURE FAILURE':row.correct?'CORRECT · EXACT MATCH':'INCORRECT · EXACT MATCH';
 $('answer-details').replaceChildren();
 const details=[['Task ID',row.id],['Expected',row.expected],['Extracted',row.extracted_answer||'(none)'],['Tokens',`${num(row.input_tokens)} input + ${num(row.output_tokens)} output`]];
 if(row.error)details.push(['Error',row.error]);
 for(const [label,value] of details)$('answer-details').append(make('dt',label),make('dd',String(value)));
 const plan=row.trace.find(t=>t.role==='workflow designer');
 $('workflow-label').textContent=plan?'Model-emitted workflow'+(row.error_kind==='model_protocol_failure'?' · rejected':''):'Recorded call sequence';
 $('workflow').textContent=plan?(row.workflow||plan.output):row.trace.map(t=>t.role).join(' → ');
 $('workflow-note').textContent=plan?(row.error_kind==='model_protocol_failure'?'This saved model output failed the workflow contract. It was counted incorrect and its emitted tokens were charged.':'The saved program was validated and interpreted during the experiment. This static page never executes it.'):'This method does not generate a workflow program. The sequence above comes from the saved call roles.';
 $('call-count').textContent=`${row.trace.length} completed ${row.trace.length===1?'call':'calls'}`;
 $('call-list').replaceChildren();
 row.trace.forEach((call,i)=>{const b=make('button',`${i+1}. ${call.role}`);b.type='button';b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>showCall(row,i));$('call-list').append(b);});
 selectedCall=0;showCall(row,selectedCall);
}
function showCall(row,index){
 selectedCall=index;document.querySelectorAll('#call-list button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 const root=$('call-details');root.replaceChildren();const call=row.trace[index];
 if(!call){root.append(make('p','No completed response was recorded.','small-note'));return;}
 const meta=make('div',undefined,'call-meta');meta.append(make('span',`${num(call.input_tokens)} input tokens`,'pill'),make('span',`${num(call.output_tokens)} output tokens`,'pill'),make('span',`finish: ${call.finish_reason||'not recorded'}`,'pill'));root.append(meta);
 root.append(make('p','EXACT MODEL RESPONSE','call-section-title'),make('pre',call.output,'call-output'));
 for(const [title,value] of [['Complete task + history supplied to this call',JSON.stringify(call.input,null,2)],['System prompt for this call',call.system_prompt||'(not recorded)']]){const d=make('details');d.append(make('summary',title),make('pre',value));root.append(d);}
 root.append(make('p','All content is a saved response or saved prompt. Input and output tokens are reported by the inference provider. An output capped by length remains visible and is not silently retried.','small-note'));
}
async function init(){
 try{
  const load=async key=>{const response=await fetch(`./data/${key}.json`);if(!response.ok)throw new Error(`Saved ${key} record unavailable (${response.status})`);records[key]=await response.json();};
  await Promise.all(['official','calibration'].map(load));
  document.querySelectorAll('[data-cohort]').forEach((b,index,buttons)=>{b.addEventListener('click',()=>showExperiment(b.dataset.cohort));b.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const target=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[target].focus();showExperiment(buttons[target].dataset.cohort);}});});
  $('task-select').addEventListener('change',showRun);$('arm-select').addEventListener('change',showRun);
  const requested=new URL(location.href).searchParams.get('dataset');showExperiment(requested==='calibration'?'calibration':'official');
 }catch(error){$('cohort-name').textContent='Saved records could not be loaded';$('finding').textContent=error.message+'. Serve the docs folder over HTTP or use GitHub Pages; opening file:// directly may block local JSON reads.';}
}
init();

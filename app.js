const KEY='unsmoke-v1';
const defaults={quitDate:new Date().toISOString().slice(0,10),dailyCount:10,topTrigger:'Stress',entries:[],checkins:[],mood:'',craving:0};
let data={...defaults,...load()};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
const $=id=>document.getElementById(id);
function dateLabel(){return new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}
function daysSince(date){if(!date)return 0;const start=new Date(date+'T00:00:00');const now=new Date();now.setHours(0,0,0,0);return Math.max(0,Math.floor((now-start)/86400000))}
function render(){
 $('todayLabel').textContent=dateLabel().toUpperCase();
 const days=daysSince(data.quitDate);$('daysCount').textContent=days;
 $('streakMessage').textContent=days===0?'Today is a fresh start. One moment at a time.':days===1?'You have started. Keep taking it one moment at a time.':'You are building momentum, one day at a time.';
 $('cigarettesAvoided').textContent=Math.max(0,days*(Number(data.dailyCount)||0));
 $('loggedCount').textContent=data.entries.length;
 $('quitDate').value=data.quitDate||'';$('dailyCount').value=data.dailyCount??10;$('topTrigger').value=data.topTrigger||'Stress';
 $('entryCount').textContent=`${data.entries.length} entr${data.entries.length===1?'y':'ies'}`;
 $('journalList').innerHTML=data.entries.length?data.entries.slice(0,12).map(e=>`<article class="journal-item"><div class="meta">${new Date(e.at).toLocaleString()} · ${escapeHtml(e.type)}</div><b>${escapeHtml(e.trigger||'No trigger selected')}</b><p>${escapeHtml(e.note||'No note added.')}</p></article>`).join(''):'<p class="muted tiny">Your entries will appear here.</p>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.view===id));$('tabbar').style.display=id==='sosView'||id==='settingsView'?'none':'flex';window.scrollTo(0,0)}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>show('homeView')));
$('settingsBtn').onclick=()=>show('settingsView');
$('sosBtn').onclick=()=>show('sosView');
$('cravingLevel').oninput=e=>$('cravingValue').textContent=e.target.value+'/10';
document.querySelectorAll('.mood').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mood').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');data.mood=b.dataset.mood});
$('saveCheckin').onclick=()=>{data.checkins.unshift({at:new Date().toISOString(),mood:data.mood||'Not selected',craving:Number($('cravingLevel').value)});data.checkins=data.checkins.slice(0,60);localStorage.setItem(KEY,JSON.stringify(data));$('checkinSaved').textContent='Saved. Thank you for checking in.'};
let selectedTrigger='';
document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedTrigger=b.dataset.trigger});
function addEntry(type){data.entries.unshift({at:new Date().toISOString(),type,trigger:selectedTrigger,note:$('entryNote').value.trim()});data.entries=data.entries.slice(0,100);save();$('entryNote').value='';$('logFeedback').textContent='Entry saved. No judgement—just useful information.'}
$('saveCraving').onclick=()=>addEntry('Craving');
$('saveSlip').onclick=()=>addEntry('Smoked');
$('logCraving').onclick=()=>{show('logView');selectedTrigger='';document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));$('logFeedback').textContent='Choose a trigger if you can, then save your moment.'};
$('savePlan').onclick=()=>{data.quitDate=$('quitDate').value||new Date().toISOString().slice(0,10);data.dailyCount=Math.max(0,Number($('dailyCount').value)||0);data.topTrigger=$('topTrigger').value;save();$('planFeedback').textContent='Your plan has been saved on this device.'};
let timerInterval=null,remaining=300,breathInterval=null;
const prompts=['Put both feet on the floor. Let your shoulders soften.','Breathe in gently. Now breathe out slowly.','Notice five things you can see around you.','Take a sip of water or change your surroundings.','Ask yourself: what do I need in this moment besides a cigarette?'];
function timerDisplay(){$('timer').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');$('sosPrompt').textContent=prompts[Math.min(4,Math.floor((300-remaining)/60))]}
$('timerButton').onclick=()=>{if(timerInterval){clearInterval(timerInterval);timerInterval=null;$('timerButton').textContent='Resume 5-minute pause';return}if(remaining<=0)remaining=300;$('timerButton').textContent='Pause';$('breathOrb').classList.add('breathe');timerInterval=setInterval(()=>{remaining--;timerDisplay();if(remaining<=0){clearInterval(timerInterval);timerInterval=null;$('timerButton').textContent='Start again';$('breathOrb').classList.remove('breathe');$('breathText').textContent='Well done';$('sosPrompt').textContent='You made space between the urge and the action. How are you feeling now?'}},1000)};
$('exportData').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='unsmoke-my-data.json';a.click();URL.revokeObjectURL(a.href);$('settingsFeedback').textContent='Your export has been prepared.'};
$('resetData').onclick=()=>{if(confirm('Delete all Unsmoke data stored in this browser? This cannot be undone.')){localStorage.removeItem(KEY);data={...defaults,entries:[],checkins:[]};render();$('settingsFeedback').textContent='Your local app data has been deleted.'}};
render();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(()=>{});

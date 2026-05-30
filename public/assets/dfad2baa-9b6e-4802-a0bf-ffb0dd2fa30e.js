/* ============================================================
   H&T HAIR LOUNGE — Booking widget logic (vanilla)
   ============================================================ */
(function () {
  const root = document.getElementById('bookingApp');
  if (!root) return;

  const SERVICES = [
    { id:'signature', name:'H&T Signature Headspa Retreat', desc:'Soothing reset · fine & healthy hair', price:47, dur:'45 min' },
    { id:'ultimate',  name:'Ultimate Repair Headspa',       desc:'Deep restoration · coarse/treated hair', price:62, dur:'60 min' },
    { id:'olaplex',   name:'Olaplex Scalp Detox & Renewal',  desc:'Clarifying detox · color-safe', price:77, dur:'60 min' },
    { id:'elite',     name:'Elite Rejuvenation Ritual',      desc:'Full indulgence · body massage', price:95, dur:'90 min' },
    { id:'blowout',   name:'Professional Blowout',           desc:'Blow-dry & style', price:45, priceLabel:'$35–55', dur:'30 min' },
    { id:'extension', name:'Nano Bead Hair Extensions',      desc:'Length & volume · consultation', price:450, priceLabel:'$450–900', dur:'By consult' },
  ];
  const STYLISTS = [
    { id:'any',   nm:'No preference', rl:'First available therapist', init:'✿' },
    { id:'hannah',nm:'Hannah',  rl:'Senior head-spa therapist', init:'H' },
    { id:'tracy', nm:'Tracy',   rl:'Scalp & trichology specialist', init:'T' },
    { id:'mai',   nm:'Mai',     rl:'Head-spa therapist & stylist', init:'M' },
  ];
  const STEPS = ['Service','Date & Time','Therapist','Your Details','Confirm'];
  const HOURS = { 0:[9,17], 1:[10,20], 2:[10,20], 3:[10,20], 4:[10,20], 5:[10,19], 6:[9,17] }; // dow -> [open, close]

  const saved = (() => { try { return JSON.parse(localStorage.getItem('ht_booking')||'{}'); } catch(e){ return {}; } })();
  const state = Object.assign({ step:0, service:null, date:null, time:null, stylist:'any', name:'', phone:'', email:'', notes:'', done:false }, saved);
  state.done = false; // never restore into success state
  if (state.step > 4) state.step = 0;

  let viewMonth = new Date(); viewMonth.setDate(1);

  function save(){ localStorage.setItem('ht_booking', JSON.stringify(state)); }

  // ---------- helpers ----------
  const pad = n => String(n).padStart(2,'0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  function fmtDate(isoStr){
    if(!isoStr) return '—';
    const d = new Date(isoStr+'T00:00:00');
    return d.toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric' });
  }
  function fmt12(h){
    const m = h%1 ? '30':'00'; const hr = Math.floor(h);
    const ap = hr>=12 ? 'PM':'AM'; let hh = hr%12; if(hh===0) hh=12;
    return `${hh}:${m} ${ap}`;
  }
  function timesFor(isoStr){
    const d = new Date(isoStr+'T00:00:00'); const [o,c] = HOURS[d.getDay()];
    const out = []; for(let h=o; h<=c-1.5; h+=1.5) out.push(h);
    return out;
  }
  function svc(){ return SERVICES.find(s=>s.id===state.service); }
  function priceText(s){ return s.priceLabel || ('$'+s.price); }

  // ---------- validation per step ----------
  function valid(step){
    if(step===0) return !!state.service;
    if(step===1) return !!state.date && state.time!=null;
    if(step===2) return !!state.stylist;
    if(step===3) return state.name.trim().length>1 && /[0-9]{7,}/.test(state.phone.replace(/\D/g,'')) && (state.email==='' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email));
    return true;
  }

  // ---------- shell ----------
  root.innerHTML = `
    <div class="bk-steps" id="bkSteps"></div>
    <div class="bk-body" id="bkBody"></div>
    <div class="bk-foot" id="bkFoot">
      <button class="bk-back" id="bkBack">← Back</button>
      <span class="bk-hint" id="bkHint"></span>
      <button class="btn bk-next" id="bkNext">Continue <span class="arrow">→</span></button>
    </div>`;

  const elSteps = root.querySelector('#bkSteps');
  const elBody  = root.querySelector('#bkBody');
  const elFoot  = root.querySelector('#bkFoot');
  const elBack  = root.querySelector('#bkBack');
  const elNext  = root.querySelector('#bkNext');
  const elHint  = root.querySelector('#bkHint');

  function renderSteps(){
    elSteps.innerHTML = STEPS.map((s,i)=>{
      const cls = i===state.step ? 'active' : (i<state.step ? 'done':'');
      return `<div class="bk-step ${cls}"><span class="dot">${i<state.step?'✓':i+1}</span><span class="lbl">${s}</span></div>`;
    }).join('');
  }

  // ---------- panels ----------
  function panelService(){
    return `<h3 class="bk-h">Choose your ritual</h3>
      <p class="bk-sub">Every head-spa package includes a complimentary DIY blowout.</p>
      <div class="bk-svc-grid">${SERVICES.map(s=>`
        <button class="bk-svc ${state.service===s.id?'sel':''}" data-svc="${s.id}">
          <span><span class="t">${s.name}</span><span class="d">${s.desc} · ${s.dur}</span></span>
          <span style="display:flex;gap:12px;align-items:flex-start"><span class="p">${priceText(s)}</span><span class="check">✓</span></span>
        </button>`).join('')}</div>`;
  }

  function panelDate(){
    const y = viewMonth.getFullYear(), m = viewMonth.getMonth();
    const first = new Date(y,m,1).getDay();
    const days = new Date(y,m+1,0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);
    const max = new Date(); max.setMonth(max.getMonth()+3);
    const prevDis = (y===today.getFullYear() && m<=today.getMonth());
    const nextDis = (new Date(y,m,1) >= new Date(max.getFullYear(),max.getMonth(),1));
    let cells='';
    for(let i=0;i<first;i++) cells+=`<button class="bk-day empty" disabled></button>`;
    for(let d=1;d<=days;d++){
      const date=new Date(y,m,d); const dis = date<today || date>max;
      cells+=`<button class="bk-day ${state.date===iso(date)?'sel':''}" ${dis?'disabled':''} data-date="${iso(date)}">${d}</button>`;
    }
    const dows=['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<span class="dow">${d}</span>`).join('');
    const slots = state.date ? timesFor(state.date) : [];
    const timesHtml = !state.date
      ? `<p class="bk-times-empty">Pick a date to see available times.</p>`
      : (slots.length ? slots.map(h=>`<button class="bk-time ${state.time===h?'sel':''}" data-time="${h}">${fmt12(h)}</button>`).join('')
                      : `<p class="bk-times-empty">Closed this day.</p>`);
    return `<h3 class="bk-h">Select date & time</h3>
      <p class="bk-sub">Open seven days a week. Choose a moment that suits you.</p>
      <div class="bk-cal-wrap">
        <div class="bk-cal">
          <div class="bk-cal-head">
            <span class="mn">${viewMonth.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span>
            <span class="bk-cal-nav">
              <button id="bkPrev" ${prevDis?'disabled':''} aria-label="Previous month">‹</button>
              <button id="bkNextM" ${nextDis?'disabled':''} aria-label="Next month">›</button>
            </span>
          </div>
          <div class="bk-cal-grid">${dows}${cells}</div>
        </div>
        <div class="bk-times-col">
          <div class="bk-times-h">${state.date?fmtDate(state.date):'Available times'}</div>
          <div class="bk-times">${timesHtml}</div>
        </div>
      </div>`;
  }

  function panelStylist(){
    return `<h3 class="bk-h">Choose your therapist</h3>
      <p class="bk-sub">Have a favourite? Pick them — or let us match you with the first available.</p>
      <div class="bk-stylists">${STYLISTS.map(s=>`
        <button class="bk-stylist ${state.stylist===s.id?'sel':''}" data-stylist="${s.id}">
          <span class="av">${s.init}</span>
          <span><span class="nm">${s.nm}</span><br><span class="rl">${s.rl}</span></span>
        </button>`).join('')}</div>`;
  }

  function panelDetails(){
    return `<h3 class="bk-h">Your details</h3>
      <p class="bk-sub">We'll confirm your appointment by phone or email.</p>
      <div class="bk-form">
        <div class="bk-field" data-f="name"><label>Full name *</label><input type="text" id="fName" value="${esc(state.name)}" placeholder="Your name" autocomplete="name"><span class="err">Please enter your name.</span></div>
        <div class="bk-field" data-f="phone"><label>Phone *</label><input type="tel" id="fPhone" value="${esc(state.phone)}" placeholder="(470) 000-0000" autocomplete="tel"><span class="err">Enter a valid phone number.</span></div>
        <div class="bk-field full" data-f="email"><label>Email</label><input type="email" id="fEmail" value="${esc(state.email)}" placeholder="you@email.com" autocomplete="email"><span class="err">Enter a valid email.</span></div>
        <div class="bk-field full" data-f="notes"><label>Notes (optional)</label><textarea id="fNotes" placeholder="Anything we should know — scalp concerns, allergies, special requests…">${esc(state.notes)}</textarea></div>
      </div>`;
  }

  function panelConfirm(){
    const s = svc(); const st = STYLISTS.find(x=>x.id===state.stylist);
    return `<h3 class="bk-h">Confirm your retreat</h3>
      <p class="bk-sub">Please review your appointment before booking.</p>
      <div class="bk-summary">
        <div class="bk-sum-row"><span class="k">Service</span><span class="v">${s?s.name:'—'}${s?` · ${s.dur}`:''}</span></div>
        <div class="bk-sum-row"><span class="k">Date</span><span class="v">${fmtDate(state.date)}</span></div>
        <div class="bk-sum-row"><span class="k">Time</span><span class="v">${state.time!=null?fmt12(state.time):'—'}</span></div>
        <div class="bk-sum-row"><span class="k">Therapist</span><span class="v">${st?st.nm:'—'}</span></div>
        <div class="bk-sum-row"><span class="k">Name</span><span class="v">${esc(state.name)||'—'}</span></div>
        <div class="bk-sum-row"><span class="k">Contact</span><span class="v">${esc(state.phone)||'—'}${state.email?` · ${esc(state.email)}`:''}</span></div>
        <div class="bk-sum-row total"><span class="k">From</span><span class="v">${s?priceText(s):'—'}</span></div>
      </div>
      <div class="bk-note">
        <strong>Heads up:</strong> this sends us a request, not a confirmed booking. We'll call or text within 24 hours to confirm your slot.
        Need a same-day appointment? Call us at <a href="tel:+14706408801">(470) 640-8801</a>.
      </div>`;
  }

  function panelSuccess(){
    const s = svc(); const ref = 'HT-' + Math.random().toString(36).slice(2,7).toUpperCase();
    return `<div class="bk-success">
      <div class="seal">✓</div>
      <h3>Your retreat is reserved</h3>
      <p>Thank you, ${esc(state.name.split(' ')[0]||'')}. We've received your request for the <strong>${s?s.name:'head spa'}</strong> on <strong>${fmtDate(state.date)}</strong> at <strong>${state.time!=null?fmt12(state.time):''}</strong>.</p>
      <p>Our team will call or text you within 24 hours to confirm. We can't wait to welcome you.</p>
      <div class="ref">Reference · ${ref}</div>
      <a class="btn" href="tel:+14706408801" style="margin-top:14px">Call (470) 640-8801 <span class="arrow">→</span></a>
      <button class="btn ghost restart" id="bkRestart">Book another</button>
    </div>`;
  }

  function esc(v){ return String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // ---------- render ----------
  function render(){
    renderSteps();
    if(state.done){
      elBody.innerHTML = panelSuccess();
      elFoot.style.display='none';
      root.querySelector('#bkRestart').addEventListener('click', restart);
      bindBody(); return;
    }
    elFoot.style.display='';
    const panels=[panelService,panelDate,panelStylist,panelDetails,panelConfirm];
    elBody.innerHTML = `<div class="bk-panel active">${panels[state.step]()}</div>`;
    elBack.hidden = state.step===0;
    elNext.innerHTML = state.step===4 ? 'Confirm Booking <span class="arrow">→</span>' : 'Continue <span class="arrow">→</span>';
    elNext.disabled = !valid(state.step);
    elHint.textContent = hintFor(state.step);
    bindBody();
  }

  function hintFor(step){
    if(step===0 && !state.service) return 'Select a service to continue';
    if(step===1){ if(!state.date) return 'Choose a date'; if(state.time==null) return 'Choose a time'; }
    if(step===3 && !valid(3)) return 'Name & phone required';
    return '';
  }

  function bindBody(){
    // service
    elBody.querySelectorAll('[data-svc]').forEach(b=>b.addEventListener('click',()=>{
      state.service=b.dataset.svc; save(); render();
    }));
    // date
    const prev=elBody.querySelector('#bkPrev'), nextM=elBody.querySelector('#bkNextM');
    if(prev) prev.addEventListener('click',()=>{ viewMonth.setMonth(viewMonth.getMonth()-1); render(); });
    if(nextM) nextM.addEventListener('click',()=>{ viewMonth.setMonth(viewMonth.getMonth()+1); render(); });
    elBody.querySelectorAll('[data-date]').forEach(b=>b.addEventListener('click',()=>{
      state.date=b.dataset.date; state.time=null; save(); render();
    }));
    elBody.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>{
      state.time=parseFloat(b.dataset.time); save(); render();
    }));
    // stylist
    elBody.querySelectorAll('[data-stylist]').forEach(b=>b.addEventListener('click',()=>{
      state.stylist=b.dataset.stylist; save();
      elBody.querySelectorAll('[data-stylist]').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel'); elNext.disabled=!valid(2); elHint.textContent=hintFor(2);
    }));
    // details
    const map={fName:'name',fPhone:'phone',fEmail:'email',fNotes:'notes'};
    Object.keys(map).forEach(id=>{
      const el=elBody.querySelector('#'+id); if(!el) return;
      el.addEventListener('input',()=>{
        state[map[id]]=el.value; save();
        elNext.disabled=!valid(3); elHint.textContent=hintFor(3);
      });
    });
  }

  function go(step){ state.step=Math.max(0,Math.min(4,step)); save(); render(); root.scrollIntoView?null:0; }

  elNext.addEventListener('click',()=>{
    if(!valid(state.step)){ flagInvalid(); return; }
    if(state.step===4){ state.done=true; save(); render(); return; }
    state.step++; save(); render();
  });
  elBack.addEventListener('click',()=>{ if(state.step>0){ state.step--; save(); render(); } });

  function flagInvalid(){
    if(state.step===3){
      elBody.querySelectorAll('.bk-field[data-f]').forEach(f=>{
        const k=f.dataset.f;
        let bad=false;
        if(k==='name') bad = state.name.trim().length<=1;
        if(k==='phone') bad = !/[0-9]{7,}/.test(state.phone.replace(/\D/g,''));
        if(k==='email') bad = state.email!=='' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email);
        f.classList.toggle('invalid', bad);
      });
    }
  }

  function restart(){
    state.step=0; state.service=null; state.date=null; state.time=null; state.stylist='any';
    state.name=''; state.phone=''; state.email=''; state.notes=''; state.done=false;
    viewMonth=new Date(); viewMonth.setDate(1); save(); render();
  }

  // deep-link: clicking a service card on the page selects it & jumps to booking
  document.querySelectorAll('.book-svc').forEach(card=>{
    card.addEventListener('click',()=>{
      const id=card.dataset.svc;
      if(SERVICES.some(s=>s.id===id)){ state.service=id; state.step=1; state.done=false; save(); render(); }
      document.getElementById('booking').scrollIntoView({behavior:'smooth'});
    });
  });

  render();
})();

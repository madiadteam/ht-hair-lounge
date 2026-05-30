/* ============================================================
   H&T HAIR LOUNGE — Booking widget logic (vanilla)
   ============================================================ */
(function () {
  const root = document.getElementById('bookingApp');
  if (!root) return;

  const LANG_RAW = (document.documentElement.lang || 'en').toLowerCase().slice(0,2);
  const LANG = ['en','es','vi'].includes(LANG_RAW) ? LANG_RAW : 'en';

  const I18N = {
    en: {
      steps: ['Service','Date & Time','Therapist','Your Details','Confirm'],
      dows: ['Su','Mo','Tu','We','Th','Fr','Sa'],
      dateLoc: 'en-US', use12h: true,
      serviceH: 'Choose your ritual',
      serviceSub: 'Every head-spa package includes a complimentary DIY blowout.',
      dateH: 'Select date & time',
      dateSub: 'Open seven days a week. Choose a moment that suits you.',
      timesEmpty: 'Pick a date to see available times.',
      timesAvail: 'Available times',
      timesClosed: 'Closed this day.',
      prevMonth: 'Previous month', nextMonth: 'Next month',
      stylistH: 'Choose your therapist',
      stylistSub: 'Have a favourite? Pick them — or let us match you with the first available.',
      detailsH: 'Your details',
      detailsSub: "We'll confirm your appointment by phone or email.",
      fName: 'Full name *', phName: 'Your name', errName: 'Please enter your name.',
      fPhone: 'Phone *', phPhone: '(470) 000-0000', errPhone: 'Enter a valid phone number.',
      fEmail: 'Email', phEmail: 'you@email.com', errEmail: 'Enter a valid email.',
      fNotes: 'Notes (optional)', phNotes: 'Anything we should know — scalp concerns, allergies, special requests…',
      confirmH: 'Confirm your retreat',
      confirmSub: 'Please review your appointment before booking.',
      sumService: 'Service', sumDate: 'Date', sumTime: 'Time', sumTherapist: 'Therapist',
      sumName: 'Name', sumContact: 'Contact', sumFrom: 'From',
      noteLead: 'Heads up:',
      noteBody: "this sends us a request, not a confirmed booking. We'll call or text within 24 hours to confirm your slot.",
      noteCall: 'Need a same-day appointment? Call us at',
      successH: 'Your retreat is reserved',
      successFor: (svc, date, time) => `We've received your request for the <strong>${svc}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.`,
      successHi: (name) => `Thank you, ${name}.`,
      successWait: "Our team will call or text you within 24 hours to confirm. We can't wait to welcome you.",
      successRef: 'Reference',
      successCall: 'Call (470) 640-8801',
      successAnother: 'Book another',
      back: '← Back', continue: 'Continue', confirmBooking: 'Confirm Booking',
      hintService: 'Select a service to continue',
      hintDate: 'Choose a date', hintTime: 'Choose a time',
      hintDetails: 'Name & phone required',
      sep: '·', placeholder: '—',
      services: {
        signature:  { name:'H&T Signature Headspa Retreat', desc:'Soothing reset · fine & healthy hair' },
        ultimate:   { name:'Ultimate Repair Headspa',       desc:'Deep restoration · coarse/treated hair' },
        olaplex:    { name:'Olaplex Scalp Detox & Renewal', desc:'Clarifying detox · color-safe' },
        elite:      { name:'Elite Rejuvenation Ritual',     desc:'Full indulgence · body massage' },
        blowout:    { name:'Professional Blowout',          desc:'Blow-dry & style' },
        extension:  { name:'Nano Bead Hair Extensions',     desc:'Length & volume · consultation' },
      },
      durations: { '45':'45 min', '60':'60 min', '30':'30 min', '90':'90 min', consult:'By consult' },
      stylists: {
        any:    { nm:'No preference', rl:'First available therapist' },
        hannah: { nm:'Hannah',        rl:'Senior head-spa therapist' },
        tracy:  { nm:'Tracy',         rl:'Scalp & trichology specialist' },
        mai:    { nm:'Mai',           rl:'Head-spa therapist & stylist' },
      },
      defaultSvc: 'head spa',
    },
    es: {
      steps: ['Servicio','Fecha y hora','Terapeuta','Tus datos','Confirmar'],
      dows: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      dateLoc: 'es-ES', use12h: false,
      serviceH: 'Elige tu ritual',
      serviceSub: 'Cada paquete de head spa incluye un secado DIY de cortesía.',
      dateH: 'Selecciona fecha y hora',
      dateSub: 'Abierto los siete días de la semana. Elige el momento que te convenga.',
      timesEmpty: 'Elige una fecha para ver los horarios disponibles.',
      timesAvail: 'Horarios disponibles',
      timesClosed: 'Cerrado este día.',
      prevMonth: 'Mes anterior', nextMonth: 'Mes siguiente',
      stylistH: 'Elige tu terapeuta',
      stylistSub: '¿Tienes preferencia? Selecciona a tu favorita o te asignamos a la primera disponible.',
      detailsH: 'Tus datos',
      detailsSub: 'Confirmaremos tu cita por teléfono o correo.',
      fName: 'Nombre completo *', phName: 'Tu nombre', errName: 'Por favor ingresa tu nombre.',
      fPhone: 'Teléfono *', phPhone: '(470) 000-0000', errPhone: 'Ingresa un número válido.',
      fEmail: 'Correo', phEmail: 'tu@correo.com', errEmail: 'Ingresa un correo válido.',
      fNotes: 'Notas (opcional)', phNotes: 'Algo que debamos saber: cuero cabelludo, alergias, peticiones especiales…',
      confirmH: 'Confirma tu retiro',
      confirmSub: 'Revisa tu cita antes de reservar.',
      sumService: 'Servicio', sumDate: 'Fecha', sumTime: 'Hora', sumTherapist: 'Terapeuta',
      sumName: 'Nombre', sumContact: 'Contacto', sumFrom: 'Desde',
      noteLead: 'Atención:',
      noteBody: 'esto envía una solicitud, no una reserva confirmada. Te llamaremos o enviaremos un mensaje en 24 horas para confirmar tu horario.',
      noteCall: '¿Necesitas una cita el mismo día? Llámanos al',
      successH: 'Tu retiro está reservado',
      successFor: (svc, date, time) => `Recibimos tu solicitud para <strong>${svc}</strong> el <strong>${date}</strong> a las <strong>${time}</strong>.`,
      successHi: (name) => `Gracias, ${name}.`,
      successWait: 'Nuestro equipo te llamará o enviará un mensaje en 24 horas para confirmar. Te esperamos con gusto.',
      successRef: 'Referencia',
      successCall: 'Llamar (470) 640-8801',
      successAnother: 'Reservar otra',
      back: '← Volver', continue: 'Continuar', confirmBooking: 'Confirmar reserva',
      hintService: 'Selecciona un servicio para continuar',
      hintDate: 'Elige una fecha', hintTime: 'Elige un horario',
      hintDetails: 'Nombre y teléfono requeridos',
      sep: '·', placeholder: '—',
      services: {
        signature:  { name:'Retiro Head Spa Insignia H&T',      desc:'Reseteo suave · cabello fino y sano' },
        ultimate:   { name:'Head Spa Reparación Total',          desc:'Restauración profunda · cabello grueso o tratado' },
        olaplex:    { name:'Detox y Renovación Olaplex',         desc:'Detox clarificante · seguro para color' },
        elite:      { name:'Ritual Rejuvenecedor Elite',         desc:'Indulgencia completa · masaje corporal' },
        blowout:    { name:'Secado Profesional',                 desc:'Secado y peinado' },
        extension:  { name:'Extensiones Nano Bead',              desc:'Largo y volumen · consulta previa' },
      },
      durations: { '45':'45 min', '60':'60 min', '30':'30 min', '90':'90 min', consult:'Con consulta' },
      stylists: {
        any:    { nm:'Sin preferencia', rl:'Primera terapeuta disponible' },
        hannah: { nm:'Hannah',          rl:'Terapeuta sénior de head spa' },
        tracy:  { nm:'Tracy',           rl:'Especialista en cuero cabelludo y tricología' },
        mai:    { nm:'Mai',             rl:'Terapeuta y estilista de head spa' },
      },
      defaultSvc: 'head spa',
    },
    vi: {
      steps: ['Dịch vụ','Ngày & giờ','Chuyên viên','Thông tin','Xác nhận'],
      dows: ['CN','T2','T3','T4','T5','T6','T7'],
      dateLoc: 'vi-VN', use12h: false,
      serviceH: 'Chọn liệu trình',
      serviceSub: 'Mọi gói head spa đều tặng kèm dịch vụ sấy tạo kiểu DIY.',
      dateH: 'Chọn ngày và giờ',
      dateSub: 'Mở cửa cả 7 ngày trong tuần. Chọn khung giờ phù hợp với bạn.',
      timesEmpty: 'Chọn ngày để xem các khung giờ còn trống.',
      timesAvail: 'Khung giờ còn trống',
      timesClosed: 'Đóng cửa ngày này.',
      prevMonth: 'Tháng trước', nextMonth: 'Tháng sau',
      stylistH: 'Chọn chuyên viên',
      stylistSub: 'Có chuyên viên yêu thích? Hãy chọn, hoặc để chúng tôi sắp xếp người đầu tiên có mặt.',
      detailsH: 'Thông tin của bạn',
      detailsSub: 'Chúng tôi sẽ gọi hoặc gửi email để xác nhận lịch hẹn.',
      fName: 'Họ và tên *', phName: 'Tên của bạn', errName: 'Vui lòng nhập họ tên.',
      fPhone: 'Số điện thoại *', phPhone: '(470) 000-0000', errPhone: 'Nhập số điện thoại hợp lệ.',
      fEmail: 'Email', phEmail: 'ban@email.com', errEmail: 'Nhập email hợp lệ.',
      fNotes: 'Ghi chú (tuỳ chọn)', phNotes: 'Bất cứ điều gì cần lưu ý: tình trạng da đầu, dị ứng, yêu cầu đặc biệt…',
      confirmH: 'Xác nhận lịch hẹn',
      confirmSub: 'Vui lòng kiểm tra thông tin trước khi đặt.',
      sumService: 'Dịch vụ', sumDate: 'Ngày', sumTime: 'Giờ', sumTherapist: 'Chuyên viên',
      sumName: 'Họ tên', sumContact: 'Liên hệ', sumFrom: 'Từ',
      noteLead: 'Lưu ý:',
      noteBody: 'đây là yêu cầu đặt lịch, chưa phải xác nhận chính thức. Chúng tôi sẽ gọi hoặc nhắn trong 24 giờ để xác nhận khung giờ.',
      noteCall: 'Cần lịch hẹn trong ngày? Hãy gọi',
      successH: 'Lịch hẹn của bạn đã được ghi nhận',
      successFor: (svc, date, time) => `Chúng tôi đã nhận yêu cầu cho <strong>${svc}</strong> vào <strong>${date}</strong> lúc <strong>${time}</strong>.`,
      successHi: (name) => `Cảm ơn ${name}.`,
      successWait: 'Đội ngũ của chúng tôi sẽ gọi hoặc nhắn trong 24 giờ để xác nhận. Rất mong được đón tiếp bạn.',
      successRef: 'Mã tham chiếu',
      successCall: 'Gọi (470) 640-8801',
      successAnother: 'Đặt lịch khác',
      back: '← Quay lại', continue: 'Tiếp tục', confirmBooking: 'Xác nhận đặt lịch',
      hintService: 'Chọn dịch vụ để tiếp tục',
      hintDate: 'Chọn ngày', hintTime: 'Chọn giờ',
      hintDetails: 'Cần nhập họ tên và điện thoại',
      sep: '·', placeholder: '—',
      services: {
        signature:  { name:'Liệu trình Head Spa H&T Signature', desc:'Thư giãn nhẹ nhàng · tóc mỏng và khỏe' },
        ultimate:   { name:'Head Spa Phục hồi chuyên sâu',     desc:'Phục hồi sâu · tóc dày hoặc qua xử lý' },
        olaplex:    { name:'Olaplex Detox và Tái tạo da đầu',  desc:'Detox làm sạch · an toàn cho tóc nhuộm' },
        elite:      { name:'Liệu trình Tái sinh Elite',         desc:'Trải nghiệm trọn vẹn · massage toàn thân' },
        blowout:    { name:'Sấy tạo kiểu chuyên nghiệp',        desc:'Sấy và tạo kiểu' },
        extension:  { name:'Nối tóc Nano Bead',                 desc:'Tăng độ dài và độ dày · cần tư vấn' },
      },
      durations: { '45':'45 phút', '60':'60 phút', '30':'30 phút', '90':'90 phút', consult:'Theo tư vấn' },
      stylists: {
        any:    { nm:'Không yêu cầu', rl:'Chuyên viên có mặt sớm nhất' },
        hannah: { nm:'Hannah',        rl:'Chuyên viên head spa cao cấp' },
        tracy:  { nm:'Tracy',         rl:'Chuyên gia da đầu và tóc' },
        mai:    { nm:'Mai',           rl:'Chuyên viên head spa và tạo kiểu' },
      },
      defaultSvc: 'head spa',
    },
  };
  const T = I18N[LANG];

  const SERVICE_META = [
    { id:'signature', price:47,  dur:'45' },
    { id:'ultimate',  price:62,  dur:'60' },
    { id:'olaplex',   price:77,  dur:'60' },
    { id:'elite',     price:95,  dur:'90' },
    { id:'blowout',   price:45,  dur:'30', priceLabel:'$35–55' },
    { id:'extension', price:450, dur:'consult', priceLabel:'$450–900' },
  ];
  const SERVICES = SERVICE_META.map(s => ({
    id: s.id,
    name: T.services[s.id].name,
    desc: T.services[s.id].desc,
    price: s.price,
    priceLabel: s.priceLabel,
    dur: T.durations[s.dur],
  }));
  const STYLIST_META = [
    { id:'any',    init:'✿' },
    { id:'hannah', init:'H' },
    { id:'tracy',  init:'T' },
    { id:'mai',    init:'M' },
  ];
  const STYLISTS = STYLIST_META.map(s => ({
    id: s.id,
    nm: T.stylists[s.id].nm,
    rl: T.stylists[s.id].rl,
    init: s.init,
  }));
  const STEPS = T.steps;
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
    if(!isoStr) return T.placeholder;
    const d = new Date(isoStr+'T00:00:00');
    return d.toLocaleDateString(T.dateLoc,{ weekday:'long', month:'long', day:'numeric' });
  }
  function fmt12(h){
    const m = h%1 ? '30':'00'; const hr = Math.floor(h);
    if(!T.use12h) return `${pad(hr)}:${m}`;
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
      <button class="bk-back" id="bkBack">${T.back}</button>
      <span class="bk-hint" id="bkHint"></span>
      <button class="btn bk-next" id="bkNext">${T.continue} <span class="arrow">→</span></button>
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
    return `<h3 class="bk-h">${T.serviceH}</h3>
      <p class="bk-sub">${T.serviceSub}</p>
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
    const dows=T.dows.map(d=>`<span class="dow">${d}</span>`).join('');
    const slots = state.date ? timesFor(state.date) : [];
    const timesHtml = !state.date
      ? `<p class="bk-times-empty">${T.timesEmpty}</p>`
      : (slots.length ? slots.map(h=>`<button class="bk-time ${state.time===h?'sel':''}" data-time="${h}">${fmt12(h)}</button>`).join('')
                      : `<p class="bk-times-empty">${T.timesClosed}</p>`);
    return `<h3 class="bk-h">${T.dateH}</h3>
      <p class="bk-sub">${T.dateSub}</p>
      <div class="bk-cal-wrap">
        <div class="bk-cal">
          <div class="bk-cal-head">
            <span class="mn">${viewMonth.toLocaleDateString(T.dateLoc,{month:'long',year:'numeric'})}</span>
            <span class="bk-cal-nav">
              <button id="bkPrev" ${prevDis?'disabled':''} aria-label="${T.prevMonth}">‹</button>
              <button id="bkNextM" ${nextDis?'disabled':''} aria-label="${T.nextMonth}">›</button>
            </span>
          </div>
          <div class="bk-cal-grid">${dows}${cells}</div>
        </div>
        <div class="bk-times-col">
          <div class="bk-times-h">${state.date?fmtDate(state.date):T.timesAvail}</div>
          <div class="bk-times">${timesHtml}</div>
        </div>
      </div>`;
  }

  function panelStylist(){
    return `<h3 class="bk-h">${T.stylistH}</h3>
      <p class="bk-sub">${T.stylistSub}</p>
      <div class="bk-stylists">${STYLISTS.map(s=>`
        <button class="bk-stylist ${state.stylist===s.id?'sel':''}" data-stylist="${s.id}">
          <span class="av">${s.init}</span>
          <span><span class="nm">${s.nm}</span><br><span class="rl">${s.rl}</span></span>
        </button>`).join('')}</div>`;
  }

  function panelDetails(){
    return `<h3 class="bk-h">${T.detailsH}</h3>
      <p class="bk-sub">${T.detailsSub}</p>
      <div class="bk-form">
        <div class="bk-field" data-f="name"><label>${T.fName}</label><input type="text" id="fName" value="${esc(state.name)}" placeholder="${T.phName}" autocomplete="name"><span class="err">${T.errName}</span></div>
        <div class="bk-field" data-f="phone"><label>${T.fPhone}</label><input type="tel" id="fPhone" value="${esc(state.phone)}" placeholder="${T.phPhone}" autocomplete="tel"><span class="err">${T.errPhone}</span></div>
        <div class="bk-field full" data-f="email"><label>${T.fEmail}</label><input type="email" id="fEmail" value="${esc(state.email)}" placeholder="${T.phEmail}" autocomplete="email"><span class="err">${T.errEmail}</span></div>
        <div class="bk-field full" data-f="notes"><label>${T.fNotes}</label><textarea id="fNotes" placeholder="${T.phNotes}">${esc(state.notes)}</textarea></div>
      </div>`;
  }

  function panelConfirm(){
    const s = svc(); const st = STYLISTS.find(x=>x.id===state.stylist);
    return `<h3 class="bk-h">${T.confirmH}</h3>
      <p class="bk-sub">${T.confirmSub}</p>
      <div class="bk-summary">
        <div class="bk-sum-row"><span class="k">${T.sumService}</span><span class="v">${s?s.name:T.placeholder}${s?` · ${s.dur}`:''}</span></div>
        <div class="bk-sum-row"><span class="k">${T.sumDate}</span><span class="v">${fmtDate(state.date)}</span></div>
        <div class="bk-sum-row"><span class="k">${T.sumTime}</span><span class="v">${state.time!=null?fmt12(state.time):T.placeholder}</span></div>
        <div class="bk-sum-row"><span class="k">${T.sumTherapist}</span><span class="v">${st?st.nm:T.placeholder}</span></div>
        <div class="bk-sum-row"><span class="k">${T.sumName}</span><span class="v">${esc(state.name)||T.placeholder}</span></div>
        <div class="bk-sum-row"><span class="k">${T.sumContact}</span><span class="v">${esc(state.phone)||T.placeholder}${state.email?` · ${esc(state.email)}`:''}</span></div>
        <div class="bk-sum-row total"><span class="k">${T.sumFrom}</span><span class="v">${s?priceText(s):T.placeholder}</span></div>
      </div>
      <div class="bk-note">
        <strong>${T.noteLead}</strong> ${T.noteBody}
        ${T.noteCall} <a href="tel:+14706408801">(470) 640-8801</a>.
      </div>`;
  }

  function panelSuccess(){
    const s = svc(); const ref = 'HT-' + Math.random().toString(36).slice(2,7).toUpperCase();
    const firstName = esc(state.name.split(' ')[0]||'');
    const svcName = s ? s.name : T.defaultSvc;
    const dateStr = fmtDate(state.date);
    const timeStr = state.time!=null ? fmt12(state.time) : '';
    return `<div class="bk-success">
      <div class="seal">✓</div>
      <h3>${T.successH}</h3>
      <p>${T.successHi(firstName)} ${T.successFor(svcName, dateStr, timeStr)}</p>
      <p>${T.successWait}</p>
      <div class="ref">${T.successRef} · ${ref}</div>
      <a class="btn" href="tel:+14706408801" style="margin-top:14px">${T.successCall} <span class="arrow">→</span></a>
      <button class="btn ghost restart" id="bkRestart">${T.successAnother}</button>
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
    elNext.innerHTML = state.step===4 ? `${T.confirmBooking} <span class="arrow">→</span>` : `${T.continue} <span class="arrow">→</span>`;
    elNext.disabled = !valid(state.step);
    elHint.textContent = hintFor(state.step);
    bindBody();
  }

  function hintFor(step){
    if(step===0 && !state.service) return T.hintService;
    if(step===1){ if(!state.date) return T.hintDate; if(state.time==null) return T.hintTime; }
    if(step===3 && !valid(3)) return T.hintDetails;
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

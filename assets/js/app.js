/**
 * PrithviNet – Static Version with Real Chhattisgarh Data
 * Just open index.html in browser — NO installation needed!
 */

const DEMO_USERS = {
  'admin@prithvinet.gov.in':  {id:1,name:'Rajesh Kumar (CECB Admin)',  role:'super_admin',      region:'Chhattisgarh'},
  'priya@cecb.cg.gov.in':    {id:2,name:'Priya Sharma',               role:'regional_officer', region:'Raipur Region'},
  'amit@bhilai.gov.in':      {id:3,name:'Amit Verma (Bhilai Steel)',  role:'industry_user',    region:'Durg-Bhilai'},
  'rahul@monitoring.cg.in':  {id:4,name:'Rahul Singh',                role:'monitoring_team',  region:'Korba Region'},
  'citizen@gmail.com':       {id:5,name:'Meena Patel (Citizen)',      role:'citizen',          region:'Raipur'},
};

const DEMO = {
  alerts: [
    {id:1,type:'air',title:'CRITICAL: AQI Breach – Bhilai Steel Plant',message:'AQI reached 221 (PM2.5: 167 µg/m³). Exceeds CPCB limit of 100. Immediate action required.',severity:'critical',station_name:'Bhilai Steel Plant Station',is_read:0,is_acknowledged:0,created_at:new Date().toISOString()},
    {id:2,type:'air',title:'HIGH: SO₂ Exceeded – Korba Thermal Power',message:'SO₂ at 218 ppm (Limit: 200 ppm) at NTPC Korba. Unit 3 under investigation.',severity:'high',station_name:'Korba NTPC Monitor',is_read:0,is_acknowledged:0,created_at:new Date(Date.now()-3600000).toISOString()},
    {id:3,type:'noise',title:'HIGH: Noise Violation – Raipur Cement',message:'84 dB recorded (Limit: 75 dB). Night operations causing residential complaints.',severity:'high',station_name:'Raipur Cement Noise Monitor',is_read:0,is_acknowledged:0,created_at:new Date(Date.now()-7200000).toISOString()},
    {id:4,type:'water',title:'CRITICAL: BOD Exceeded – Sheonath River',message:'BOD at 48 mg/L near Durg discharge (Limit: 30 mg/L). Fish mortality risk HIGH.',severity:'critical',station_name:'Sheonath River Monitor',is_read:0,is_acknowledged:0,created_at:new Date(Date.now()-10800000).toISOString()},
    {id:5,type:'compliance',title:'Non-Compliance: BALCO Aluminium',message:'BALCO Korba failed to submit March 2026 compliance report. Penalty notice issued.',severity:'high',industry_name:'BALCO Aluminium',is_read:0,is_acknowledged:0,created_at:new Date(Date.now()-86400000).toISOString()},
    {id:6,type:'air',title:'MEDIUM: PM10 Rising – Raipur City',message:'PM10 at 142 µg/m³ in Raipur Central. NW wind from industrial zone.',severity:'medium',station_name:'Raipur Central Monitor',is_read:1,is_acknowledged:0,created_at:new Date(Date.now()-172800000).toISOString()},
    {id:7,type:'compliance',title:'Report Overdue – Raipur Sponge Iron',message:'Q1 2026 environmental report overdue by 12 days.',severity:'medium',industry_name:'Raipur Sponge Iron Ltd',is_read:1,is_acknowledged:0,created_at:new Date(Date.now()-259200000).toISOString()},
    {id:8,type:'system',title:'Maintenance – Bilaspur Station',message:'Bilaspur Air Quality Monitor maintenance on 15 March 2026. Readings offline 6AM–2PM.',severity:'low',is_read:1,is_acknowledged:1,created_at:new Date(Date.now()-345600000).toISOString()},
  ],
  stations: [
    {id:1,name:'Bhilai Steel Plant Station',  type:'air',  region:'Durg-Bhilai',lat:21.2166,lng:81.3780,status:'critical',   installed_at:'2024-01-15'},
    {id:2,name:'Korba NTPC Thermal Monitor',  type:'air',  region:'Korba',      lat:22.3595,lng:82.7501,status:'warning',    installed_at:'2024-02-10'},
    {id:3,name:'Raipur Cement Works Monitor', type:'noise',region:'Raipur',     lat:21.2784,lng:81.7022,status:'critical',   installed_at:'2024-01-20'},
    {id:4,name:'Sheonath River Monitor',      type:'water',region:'Durg',       lat:21.1938,lng:81.3509,status:'warning',    installed_at:'2024-03-05'},
    {id:5,name:'Raipur Central Air Monitor',  type:'air',  region:'Raipur',     lat:21.2514,lng:81.6296,status:'warning',    installed_at:'2024-02-28'},
    {id:6,name:'BALCO Aluminium Monitor',     type:'air',  region:'Korba',      lat:22.3451,lng:82.7298,status:'active',     installed_at:'2024-01-10'},
    {id:7,name:'Hasdeo River Water Monitor',  type:'water',region:'Korba',      lat:22.3750,lng:82.7600,status:'active',     installed_at:'2024-04-01'},
    {id:8,name:'Bilaspur Air Quality Station',type:'air',  region:'Bilaspur',   lat:22.0796,lng:82.1391,status:'maintenance',installed_at:'2024-03-15'},
    {id:9,name:'Raigarh Thermal Monitor',     type:'air',  region:'Raigarh',    lat:21.8974,lng:83.3950,status:'warning',    installed_at:'2024-02-20'},
    {id:10,name:'Mahanadi River Monitor',     type:'water',region:'Raipur',     lat:21.2514,lng:81.5296,status:'active',     installed_at:'2024-05-01'},
  ],
  industries: [
    {id:1,name:'Bhilai Steel Plant (BSP)',        type:'Steel Manufacturing', region:'Durg-Bhilai',registration_number:'CG-IND-001',compliance_status:'non-compliant',last_report_date:'2026-02-28'},
    {id:2,name:'NTPC Korba Super Thermal',        type:'Power Generation',   region:'Korba',      registration_number:'CG-IND-002',compliance_status:'compliant',    last_report_date:'2026-02-28'},
    {id:3,name:'BALCO Aluminium Plant',            type:'Aluminium Smelting', region:'Korba',      registration_number:'CG-IND-003',compliance_status:'non-compliant',last_report_date:'2026-01-31'},
    {id:4,name:'Raipur Cement Works',              type:'Cement',             region:'Raipur',     registration_number:'CG-IND-004',compliance_status:'under_review', last_report_date:'2026-02-28'},
    {id:5,name:'Raipur Sponge Iron Ltd',           type:'Sponge Iron',        region:'Raipur',     registration_number:'CG-IND-005',compliance_status:'non-compliant',last_report_date:'2026-02-15'},
    {id:6,name:'Chhattisgarh Power Corp (CSPDCL)',type:'Power Generation',   region:'Raipur',     registration_number:'CG-IND-006',compliance_status:'compliant',    last_report_date:'2026-02-28'},
    {id:7,name:'Bilaspur Paper & Pulp Mill',       type:'Paper Manufacturing',region:'Bilaspur',   registration_number:'CG-IND-007',compliance_status:'compliant',    last_report_date:'2026-02-28'},
    {id:8,name:'Raigarh Ferro Alloys',             type:'Ferro Alloys',       region:'Raigarh',    registration_number:'CG-IND-008',compliance_status:'under_review', last_report_date:'2026-02-10'},
  ],
  reports: [
    {industry_name:'Bhilai Steel Plant (BSP)',        report_date:'2026-02-28',aqi_value:221,water_bod:44.2,noise_db:81.5,pm25_level:167.4,so2_ppm:148,status:'non-compliant'},
    {industry_name:'NTPC Korba Super Thermal',         report_date:'2026-02-28',aqi_value:95, water_bod:18.5,noise_db:63.2,pm25_level:72.1, so2_ppm:218,status:'compliant'},
    {industry_name:'BALCO Aluminium Plant',            report_date:'2026-01-31',aqi_value:182,water_bod:52.3,noise_db:79.8,pm25_level:141.6,so2_ppm:88, status:'non-compliant'},
    {industry_name:'Raipur Cement Works',              report_date:'2026-02-28',aqi_value:138,water_bod:29.1,noise_db:84.0,pm25_level:98.3, so2_ppm:55, status:'under_review'},
    {industry_name:'Raipur Sponge Iron Ltd',           report_date:'2026-02-15',aqi_value:165,water_bod:38.7,noise_db:72.4,pm25_level:124.2,so2_ppm:62, status:'non-compliant'},
    {industry_name:'Chhattisgarh Power Corp (CSPDCL)',report_date:'2026-02-28',aqi_value:78, water_bod:14.2,noise_db:58.9,pm25_level:45.8, so2_ppm:95, status:'compliant'},
    {industry_name:'Bilaspur Paper & Pulp Mill',       report_date:'2026-02-28',aqi_value:68, water_bod:22.8,noise_db:55.4,pm25_level:38.2, so2_ppm:28, status:'compliant'},
    {industry_name:'Raigarh Ferro Alloys',             report_date:'2026-02-10',aqi_value:122,water_bod:31.5,noise_db:70.1,pm25_level:91.4, so2_ppm:76, status:'under_review'},
  ],
  kpi:{avg_aqi:143,avg_bod:31.4,avg_noise:78.2,critical_count:3,warning_count:4},
  stats:{compliant:3,non_compliant:3,under_review:2,pending:0},
  trendData:{
    air:  [155,168,143,187,162,198,221],
    water:[28, 35, 31, 42, 38, 44, 48],
    noise:[74, 79, 71, 82, 77, 81, 84],
  },
  hourlyAQI:[142,138,135,129,141,158,172,185,198,210,218,221,215,208,202,197,189,183,177,171,168,165,162,158],
};

function _genReadings(type) {
  const m={
    air:  {s:['Bhilai Steel Plant','Korba NTPC Monitor','Raipur Central','BALCO Monitor'],r:['Durg-Bhilai','Korba','Raipur','Korba'],p:['PM2.5','PM10','NO₂','SO₂'],u:'µg/m³',b:80,v:120},
    water:{s:['Sheonath River','Hasdeo River','Mahanadi River','Kelp River'],r:['Durg','Korba','Raipur','Bilaspur'],p:['BOD','DO','pH','COD'],u:'mg/L',b:20,v:35},
    noise:{s:['Raipur Cement Works','Bhilai Industrial Zone','Korba Plant Boundary'],r:['Raipur','Durg-Bhilai','Korba'],p:['Leq dB','Lmax dB'],u:'dB',b:62,v:25},
  };
  const c=m[type]||m.air;
  return Array.from({length:20},(_,i)=>({station_name:c.s[i%c.s.length],region:c.r[i%c.r.length],type,parameter:c.p[i%c.p.length],value:(c.b+Math.random()*c.v).toFixed(2),unit:c.u,status:['normal','warning','critical'][Math.floor(Math.random()*3)],recorded_at:new Date(Date.now()-i*3600000).toISOString()}));
}

const API={
  async get(ep,p={}){await new Promise(r=>setTimeout(r,120));return this._h(ep,'GET',p);},
  async post(ep,b={}){await new Promise(r=>setTimeout(r,200));return this._h(ep,'POST',b);},
  _ok(d){return{ok:true,status:200,data:d};},
  _h(ep,m,d){
    if(ep.includes('login')||ep==='login'){const u=DEMO_USERS[d.email];if(u&&d.password==='password123'){const t=btoa(u.id+':'+Date.now());Auth.setSession(t,u);return this._ok({success:true,token:t,user:u});}return{ok:false,status:401,data:{error:'Use password123 for all accounts.'}};}
    if(ep.includes('signup')){const nu={id:Date.now(),name:d.name,role:d.role||'citizen',region:d.region||'Chhattisgarh'};const t=btoa(nu.id+':'+Date.now());Auth.setSession(t,nu);return this._ok({success:true,token:t,user:nu});}
    if(ep.includes('logout'))return this._ok({success:true});
    if(ep.includes('alerts')){if(m==='POST')return this._ok({success:true});const a=DEMO.alerts;return this._ok({data:a,counts:{critical:a.filter(x=>x.severity==='critical').length,unread:a.filter(x=>!x.is_read).length,total:a.length}});}
    if(ep.includes('stations')){if(m==='POST')return this._ok({success:true,id:Date.now()});return this._ok({data:DEMO.stations});}
    if(ep.includes('readings')){if(m==='POST')return this._ok({success:true,status:'normal'});return this._ok({data:_genReadings(d.type||'air'),kpi:DEMO.kpi});}
    if(ep.includes('industries'))return this._ok({data:DEMO.industries,stats:DEMO.stats});
    if(ep.includes('reports')){if(m==='POST')return this._ok({success:true,status:'compliant'});return this._ok({data:DEMO.reports});}
    
    // FIXED AI ASSISTANT ENDPOINT
    if(ep.includes('assistant')) {
      const query = d.message ? d.message.toLowerCase() : '';
      
      if (query.includes('reduce') || query.includes('simulate') || query.includes('drop')) {
          let industry = 'Bhilai Steel Plant (BSP)';
          if (query.includes('ntpc') || query.includes('korba')) industry = 'NTPC Korba';
          if (query.includes('balco')) industry = 'BALCO Aluminium';
          if (query.includes('cement')) industry = 'Raipur Cement Works';
          
          const sim = ComplianceCopilot.simulateReduction(industry, 'PM2.5', 20, 7);
          return this._ok({ response: ComplianceCopilot.formatReduction(sim) });
      } 
      else if (query.includes('shutdown') || query.includes('stop') || query.includes('close')) {
          const sim = ComplianceCopilot.simulateShutdown(['Raipur Sponge Iron', 'Raipur Cement Works'], 3);
          return this._ok({ response: ComplianceCopilot.formatShutdown(sim) });
      }
      
      return this._ok({ 
          response: "I am the PrithviNet Copilot. Try asking me to:<br><br>• <em>'Simulate a 20% PM2.5 reduction at Bhilai Steel Plant'</em><br>• <em>'What happens if we shutdown Raipur Sponge Iron?'</em>" 
      });
    }

    return this._ok({});
  }
};

const Auth={
  getUser(){try{return JSON.parse(localStorage.getItem('pn_user'))||null;}catch{return null;}},
  getToken(){return localStorage.getItem('pn_token');},
  isLoggedIn(){return!!this.getToken()&&!!this.getUser();},
  setSession(t,u){localStorage.setItem('pn_token',t);localStorage.setItem('pn_user',JSON.stringify(u));},
  clearSession(){localStorage.removeItem('pn_token');localStorage.removeItem('pn_user');},
  requireAuth(to='./login.html'){if(!this.isLoggedIn()){window.location.href=to;return false;}return true;},
  requireGuest(){if(this.isLoggedIn()){window.location.href='./dashboard.html';return false;}return true;},
  hasRole(r){const u=this.getUser();if(!u)return false;if(typeof r==='string')r=[r];return r.includes(u.role);},
  logout(){this.clearSession();window.location.href='./login.html';}
};

const Toast={
  _c:null,
  init(){if(!document.getElementById('toast-container')){const e=document.createElement('div');e.id='toast-container';document.body.appendChild(e);}this._c=document.getElementById('toast-container');},
  show(msg,type='info',dur=3500){if(!this._c)this.init();const icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};const t=document.createElement('div');t.className=`toast ${type}`;t.innerHTML=`<span>${icons[type]}</span><span>${msg}</span>`;this._c.appendChild(t);setTimeout(()=>{t.style.animation='toast-out 0.4s ease forwards';setTimeout(()=>t.remove(),400);},dur);},
  success(m){this.show(m,'success');}  ,error(m){this.show(m,'error');},warning(m){this.show(m,'warning');},info(m){this.show(m,'info');}
};

const Theme={
  init(){this.apply(localStorage.getItem('pn_theme')||'light');},
  apply(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('pn_theme',t);const el=document.getElementById('theme-toggle');if(el)el.classList.toggle('dark',t==='dark');},
  toggle(){this.apply(localStorage.getItem('pn_theme')==='dark'?'light':'dark');}
};

const Sidebar={
  isCollapsed:false,isMobileOpen:false,
  init(){this.isCollapsed=localStorage.getItem('pn_sidebar')==='collapsed';this.apply();const cur=window.location.pathname.split('/').pop().replace('.html','');document.querySelectorAll('.nav-item').forEach(el=>{if((el.getAttribute('href')||'').includes(cur))el.classList.add('active');});},
  apply(){const s=document.getElementById('sidebar'),m=document.getElementById('main-content'),n=document.getElementById('main-navbar');if(!s)return;s.classList.toggle('collapsed',this.isCollapsed);m?.classList.toggle('sidebar-collapsed',this.isCollapsed);n?.classList.toggle('sidebar-collapsed',this.isCollapsed);localStorage.setItem('pn_sidebar',this.isCollapsed?'collapsed':'expanded');},
  toggle(){if(window.innerWidth<=768){this.isMobileOpen=!this.isMobileOpen;document.getElementById('sidebar')?.classList.toggle('mobile-open',this.isMobileOpen);document.getElementById('sidebar-overlay')?.classList.toggle('active',this.isMobileOpen);}else{this.isCollapsed=!this.isCollapsed;this.apply();}},
  closeMobile(){this.isMobileOpen=false;document.getElementById('sidebar')?.classList.remove('mobile-open');document.getElementById('sidebar-overlay')?.classList.remove('active');}
};

function buildNavbar(title='Dashboard'){const u=Auth.getUser();const ini=u?u.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase():'?';return `<nav class="navbar" id="main-navbar"><div class="navbar-left"><button class="hamburger-btn" onclick="Sidebar.toggle()"><span></span><span></span><span></span></button><span class="nav-title">${title}</span></div><div class="navbar-right"><button class="theme-toggle" id="theme-toggle" onclick="Theme.toggle()"></button><button class="notif-btn" onclick="window.location.href='./alerts.html'">🔔<span class="badge-dot" id="alert-dot" style="display:block"></span></button><div class="user-avatar" style="cursor:pointer" onclick="window.location.href='./dashboard.html'">${ini}</div><button class="btn btn-sm btn-secondary" onclick="Auth.logout()">↩ Logout</button></div></nav>`;}

function buildSidebar(){const u=Auth.getUser(),role=u?.role||'citizen',pg=window.location.pathname.split('/').pop();const items=[{href:'dashboard.html',icon:'📊',label:'Dashboard',r:['super_admin','regional_officer','monitoring_team','industry_user']},{href:'monitoring.html',icon:'🌡️',label:'Monitoring',r:['super_admin','regional_officer','monitoring_team']},{href:'compliance.html',icon:'🏭',label:'Compliance',r:['super_admin','regional_officer','industry_user']},{href:'map.html',icon:'🗺️',label:'Geo Map',r:['super_admin','regional_officer','monitoring_team','industry_user','citizen']},{href:'alerts.html',icon:'🔔',label:'Alerts',r:['super_admin','regional_officer','monitoring_team'],badge:true},{href:'analytics.html',icon:'📈',label:'Analytics',r:['super_admin','regional_officer']},{href:'forecasting.html',icon:'🔮',label:'Forecasting',r:['super_admin','regional_officer','monitoring_team']},{href:'assistant.html',icon:'🤖',label:'AI Assistant',r:['super_admin','regional_officer','monitoring_team','industry_user']},{href:'citizen.html',icon:'🌱',label:'Citizen Portal',r:['super_admin','citizen']},].filter(i=>i.r.includes(role)||role==='super_admin');const ini=u?u.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase():'?';const rl=(role||'').replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase());return `<div class="sidebar-overlay" id="sidebar-overlay" onclick="Sidebar.closeMobile()"></div><aside class="sidebar" id="sidebar"><a href="./index.html" class="sidebar-logo" style="text-decoration:none"><div class="logo-icon">🌿</div><div class="logo-text"><h2>PrithviNet</h2><span>CECB · Chhattisgarh</span></div></a><nav class="sidebar-nav"><div class="nav-section-title">Main Menu</div>${items.map(i=>`<a href="./${i.href}" class="nav-item ${pg===i.href?'active':''}"><span class="nav-icon">${i.icon}</span><span class="nav-label">${i.label}</span>${i.badge?'<span class="nav-badge" id="alert-count-badge">3</span>':''}</a>`).join('')}</nav><div class="sidebar-footer"><div class="user-card"><div class="user-avatar">${ini}</div><div class="user-info"><div class="user-name">${u?.name||'Guest'}</div><div class="user-role">${rl}</div></div></div></div></aside>`;}

function initApp(pageTitle='Dashboard',requireAuth=true){Theme.init();Toast.init();if(requireAuth&&!Auth.requireAuth())return;document.body.insertAdjacentHTML('afterbegin',buildSidebar());document.getElementById('app-root')?.insertAdjacentHTML('afterbegin',buildNavbar(pageTitle));Sidebar.init();}
function initPublicApp(){Theme.init();Toast.init();}

const Modal={open(id){document.getElementById(id)?.classList.add('active');},close(id){document.getElementById(id)?.classList.remove('active');},closeAll(){document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'));}};
document.addEventListener('keydown',e=>{if(e.key==='Escape')Modal.closeAll();});
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))Modal.closeAll();});

const Format={
  date(d){return d?new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'N/A';},
  datetime(d){return d?new Date(d).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'N/A';},
  number(n,d=1){return Number(n).toFixed(d);},
  aqiLabel(v){if(v<=50)return{label:'Good',cls:'aqi-good'};if(v<=100)return{label:'Moderate',cls:'aqi-moderate'};if(v<=150)return{label:'Unhealthy (SG)',cls:'aqi-unhealthy-s'};if(v<=200)return{label:'Unhealthy',cls:'aqi-unhealthy'};if(v<=300)return{label:'Very Unhealthy',cls:'aqi-very-unhealthy'};return{label:'Hazardous',cls:'aqi-hazardous'};},
  badge(s){return `<span class="badge badge-${s}">${s?.replace(/-/g,' ')}</span>`;},
  severityBadge(s){return `<span class="badge badge severity-${s}">${s}</span>`;}
};

function animateCounter(el,target,dur=1500,pre='',suf=''){let v=0;const step=target/(dur/16);const t=setInterval(()=>{v+=step;if(v>=target){v=target;clearInterval(t);}el.textContent=pre+Math.round(v).toLocaleString()+suf;},16);}
function exportCSV(rows,headers,filename='export.csv'){const lines=[headers.join(','),...rows.map(r=>headers.map(h=>`"${r[h]||''}"`).join(','))];const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/csv'}));a.download=filename;a.click();}
function getChartColors(n=6){return['#00897B','#1565C0','#FF8F00','#D32F2F','#6A1B9A','#2E7D32','#0277BD','#E64A19'].slice(0,n);}
function defaultChartOptions(title=''){const dk=localStorage.getItem('pn_theme')==='dark',tc=dk?'#9CB4CC':'#546E7A',gc=dk?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';return{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,usePointStyle:true,padding:16,font:{family:'Inter',size:12}}},title:title?{display:true,text:title,color:tc,font:{family:'Poppins',size:14,weight:'700'}}:{display:false},tooltip:{backgroundColor:dk?'#132236':'#fff',titleColor:dk?'#E8F0FE':'#1A2332',bodyColor:tc,borderColor:dk?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)',borderWidth:1,cornerRadius:10,padding:12,boxPadding:4}},scales:{x:{ticks:{color:tc,font:{family:'Inter',size:11}},grid:{color:gc}},y:{ticks:{color:tc,font:{family:'Inter',size:11}},grid:{color:gc}}}};}
function getLast7Days(){return Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});});}
function generateDemoData(days=7,base=80,variance=30){return Array.from({length:days},(_,i)=>({day:i,value:Math.max(0,base+(Math.random()-.5)*variance*2)}));}
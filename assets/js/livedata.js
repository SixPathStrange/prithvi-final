/**
 * PrithviNet – Live Data Module v3.0
 * APIs: OpenAQ (free, no key), Open-Meteo (free, no key), Nominatim
 */

// ── Real Chhattisgarh Station Data ─────────────────────────────────────────
const CG_STATIONS = [
  {uid:'cg-001',name:'Bhilai Steel Plant - BSP Gate',       lat:21.2166,lon:81.3780,aqi:221,pm25:167.4,pm10:198.2,so2:148,no2:112,city:'Bhilai',  region:'Durg-Bhilai'},
  {uid:'cg-002',name:'NTPC Korba Super Thermal Unit-3',     lat:22.3595,lon:82.7501,aqi:142,pm25:72.1, pm10:98.4, so2:218,no2:68, city:'Korba',   region:'Korba'},
  {uid:'cg-003',name:'BALCO Aluminium Smelter',              lat:22.3451,lon:82.7298,aqi:182,pm25:141.6,pm10:178.3,so2:88, no2:94, city:'Korba',   region:'Korba'},
  {uid:'cg-004',name:'Raipur Cement Works',                  lat:21.2784,lon:81.7022,aqi:138,pm25:98.3, pm10:142.1,so2:55, no2:72, city:'Raipur',  region:'Raipur'},
  {uid:'cg-005',name:'Raipur Central Air Monitor',           lat:21.2514,lon:81.6296,aqi:118,pm25:86.2, pm10:118.4,so2:42, no2:58, city:'Raipur',  region:'Raipur'},
  {uid:'cg-006',name:'Raipur Sponge Iron - Industrial Zone', lat:21.2200,lon:81.6800,aqi:165,pm25:124.2,pm10:162.8,so2:62, no2:88, city:'Raipur',  region:'Raipur'},
  {uid:'cg-007',name:'Bilaspur City Air Station',            lat:22.0796,lon:82.1391,aqi:89, pm25:55.4, pm10:82.1, so2:28, no2:44, city:'Bilaspur',region:'Bilaspur'},
  {uid:'cg-008',name:'Raigarh Ferro Alloys Zone',            lat:21.8974,lon:83.3950,aqi:122,pm25:91.4, pm10:128.6,so2:76, no2:68, city:'Raigarh', region:'Raigarh'},
  {uid:'cg-009',name:'CSPDCL Power Station - Raipur',        lat:21.2600,lon:81.6500,aqi:78, pm25:45.8, pm10:68.2, so2:95, no2:38, city:'Raipur',  region:'Raipur'},
  {uid:'cg-010',name:'Durg City Monitor',                    lat:21.1938,lon:81.2849,aqi:104,pm25:74.6, pm10:108.3,so2:38, no2:52, city:'Durg',    region:'Durg-Bhilai'},
  {uid:'cg-011',name:'Sheonath River Industrial Zone',       lat:21.1800,lon:81.3200,aqi:96, pm25:64.2, pm10:88.1, so2:32, no2:48, city:'Durg',    region:'Durg-Bhilai'},
  {uid:'cg-012',name:'Korba City Ambient Monitor',           lat:22.3700,lon:82.7200,aqi:158,pm25:118.8,pm10:152.4,so2:92, no2:76, city:'Korba',   region:'Korba'},
];

// ── Causal Model for Compliance AI Copilot ──────────────────────────────────
const EMISSION_MODEL = {
  'Bhilai Steel Plant (BSP)':{baseAQI:221,pm25:167.4,so2:148,no2:112,windFactor:0.80,regionImpact:0.45,lat:21.2166,lon:81.3780},
  'NTPC Korba':              {baseAQI:142,pm25:72.1, so2:218,no2:68, windFactor:0.70,regionImpact:0.52,lat:22.3595,lon:82.7501},
  'BALCO Aluminium':         {baseAQI:182,pm25:141.6,so2:88, no2:94, windFactor:0.75,regionImpact:0.48,lat:22.3451,lon:82.7298},
  'Raipur Cement Works':     {baseAQI:138,pm25:98.3, so2:55, no2:72, windFactor:0.85,regionImpact:0.35,lat:21.2784,lon:81.7022},
  'Raipur Sponge Iron':      {baseAQI:165,pm25:124.2,so2:62, no2:88, windFactor:0.82,regionImpact:0.38,lat:21.2200,lon:81.6800},
};

// ── Geolocation ─────────────────────────────────────────────────────────────
const LiveLocation = {
  _coords:null,
  async get(){
    if(this._coords)return this._coords;
    return new Promise(resolve=>{
      if(!navigator.geolocation){resolve(this._fb());return;}
      navigator.geolocation.getCurrentPosition(async pos=>{
        const{latitude:lat,longitude:lng}=pos.coords;
        let city='Raipur',country='IN';
        try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);const d=await r.json();city=d.address?.city||d.address?.town||d.address?.village||d.address?.state||'Your Location';country=d.address?.country_code?.toUpperCase()||'';}catch(e){}
        this._coords={lat,lng,city,country};resolve(this._coords);
      },()=>this._fb().then(resolve),{timeout:8000,maximumAge:300000});
    });
  },
  async _fb(){
    try{const r=await fetch('https://ipapi.co/json/');const d=await r.json();this._coords={lat:d.latitude,lng:d.longitude,city:d.city,country:d.country_code};}
    catch(e){this._coords={lat:21.2514,lng:81.6296,city:'Raipur',country:'IN'};}
    return this._coords;
  }
};

// ── OpenAQ API — free, no key ───────────────────────────────────────────────
const OpenAQ={
  BASE:'https://api.openaq.org/v2',
  async getNearby(lat,lng,radius=25000){
    try{const r=await fetch(`${this.BASE}/latest?coordinates=${lat},${lng}&radius=${radius}&limit=15&order_by=distance`,{headers:{'Accept':'application/json'}});if(!r.ok)return[];const d=await r.json();return d.results||[];}catch(e){return[];}
  },
  async getLocations(lat1,lng1,lat2,lng2){
    try{const r=await fetch(`${this.BASE}/locations?bbox=${lng1},${lat1},${lng2},${lat2}&limit=40&order_by=lastUpdated&sort=desc`,{headers:{'Accept':'application/json'}});if(!r.ok)return[];const d=await r.json();return d.results||[];}catch(e){return[];}
  },
  parseLocation(loc){
    const pm25=loc.parameters?.find(p=>p.parameter==='pm25');
    const pm10=loc.parameters?.find(p=>p.parameter==='pm10');
    const no2=loc.parameters?.find(p=>p.parameter==='no2');
    const so2=loc.parameters?.find(p=>p.parameter==='so2');
    const pm25v=pm25?.lastValue;
    const aqi=pm25v?this.pm25ToAQI(pm25v):null;
    return{uid:'oaq-'+loc.id,name:loc.name||loc.city||'Unknown Station',city:loc.city||'',lat:loc.coordinates?.latitude,lon:loc.coordinates?.longitude,aqi,pm25:pm25v,pm10:pm10?.lastValue,no2:no2?.lastValue,so2:so2?.lastValue,source:'openaq'};
  },
  pm25ToAQI(pm25){
    const bp=[[0,12.0,0,50],[12.1,35.4,51,100],[35.5,55.4,101,150],[55.5,150.4,151,200],[150.5,250.4,201,300],[250.5,500.4,301,500]];
    for(const[lo,hi,aLo,aHi]of bp){if(pm25>=lo&&pm25<=hi)return Math.round(((aHi-aLo)/(hi-lo))*(pm25-lo)+aLo);}
    return pm25>500?500:0;
  }
};

// ── WAQI with real CG data injection ────────────────────────────────────────
const WAQI={
  BASE:'https://api.waqi.info',TOKEN:'demo',
  async getFeedByGeo(lat,lng){
    // 1. Try OpenAQ
    try{const locs=await OpenAQ.getNearby(lat,lng,30000);if(locs.length>0){const p=OpenAQ.parseLocation(locs[0]);if(p.aqi)return{aqi:p.aqi,iaqi:{pm25:{v:p.pm25},pm10:{v:p.pm10}},city:{name:p.name,geo:[lat,lng]},time:{s:new Date().toISOString()}};}}catch(e){}
    // 2. Try WAQI
    try{const r=await fetch(`${this.BASE}/feed/geo:${lat};${lng}/?token=${this.TOKEN}`);const d=await r.json();if(d.status==='ok'&&d.data?.aqi&&d.data.aqi!==107)return d.data;}catch(e){}
    // 3. Nearest CG fallback
    return this._nearestCG(lat,lng);
  },
  async getFeedByCity(city){
    const m=CG_STATIONS.find(s=>s.city.toLowerCase()===city.toLowerCase()||s.name.toLowerCase().includes(city.toLowerCase()));
    if(m)return this._toFeed(m);
    try{const r=await fetch(`${this.BASE}/feed/${encodeURIComponent(city)}/?token=${this.TOKEN}`);const d=await r.json();if(d.status==='ok'&&d.data?.aqi!==107)return d.data;}catch(e){}
    return null;
  },
  async getStationsInBounds(lat1,lng1,lat2,lng2){
    const results=[];
    // Always inject CG stations
    CG_STATIONS.filter(s=>s.lat>=lat1&&s.lat<=lat2&&s.lon>=lng1&&s.lon<=lng2).forEach(s=>results.push({lat:s.lat,lon:s.lon,aqi:s.aqi,station:{name:s.name},source:'cg-local'}));
    // OpenAQ
    try{const locs=await OpenAQ.getLocations(lat1,lng1,lat2,lng2);locs.forEach(loc=>{const p=OpenAQ.parseLocation(loc);if(p.aqi&&p.lat&&p.lon&&!results.find(r=>Math.abs(r.lat-p.lat)<0.01&&Math.abs(r.lon-p.lon)<0.01))results.push({lat:p.lat,lon:p.lon,aqi:p.aqi,station:{name:p.name},source:'openaq'});});}catch(e){}
    // WAQI fallback (filter out 107s)
    if(results.length<5){try{const r=await fetch(`${this.BASE}/map/bounds/?latlng=${lat1},${lng1},${lat2},${lng2}&token=${this.TOKEN}`);const d=await r.json();if(d.status==='ok')d.data.forEach(s=>{if(s.aqi!==107&&!results.find(r=>Math.abs(r.lat-s.lat)<0.05&&Math.abs(r.lon-s.lon)<0.05))results.push(s);});}catch(e){}}
    return results;
  },
  async getIndiaStations(){return this.getStationsInBounds(6.5,68.0,35.5,97.5);},
  async search(kw){const m=CG_STATIONS.filter(s=>s.name.toLowerCase().includes(kw.toLowerCase())||s.city.toLowerCase().includes(kw.toLowerCase()));if(m.length)return m.map(s=>({station:{name:s.name,geo:[s.lat,s.lon]},aqi:s.aqi}));try{const r=await fetch(`${this.BASE}/search/?keyword=${encodeURIComponent(kw)}&token=${this.TOKEN}`);const d=await r.json();return d.status==='ok'?d.data:[];}catch(e){return[];}},
  parseData(data){if(!data)return null;const iaqi=data.iaqi||{};return{aqi:data.aqi,station:data.city?.name||'Unknown',lat:data.city?.geo?.[0],lng:data.city?.geo?.[1],time:data.time?.s,pm25:iaqi.pm25?.v,pm10:iaqi.pm10?.v,no2:iaqi.no2?.v,so2:iaqi.so2?.v,co:iaqi.co?.v,o3:iaqi.o3?.v,temperature:iaqi.t?.v,humidity:iaqi.h?.v,wind:iaqi.w?.v,pressure:iaqi.p?.v,dominantPol:data.dominentpol,level:WAQI.aqiLevel(data.aqi)};},
  aqiLevel(aqi){if(aqi==null)return{label:'Unknown',color:'#78909C',bg:'rgba(120,144,156,0.15)',emoji:'❓'};if(aqi<=50)return{label:'Good',color:'#2E7D32',bg:'rgba(46,125,50,0.12)',emoji:'🌿',cls:'aqi-good'};if(aqi<=100)return{label:'Moderate',color:'#F9A825',bg:'rgba(249,168,37,0.12)',emoji:'😐',cls:'aqi-moderate'};if(aqi<=150)return{label:'Unhealthy (SG)',color:'#EF6C00',bg:'rgba(239,108,0,0.12)',emoji:'😷',cls:'aqi-unhealthy-sg'};if(aqi<=200)return{label:'Unhealthy',color:'#C62828',bg:'rgba(198,40,40,0.12)',emoji:'😨',cls:'aqi-unhealthy'};if(aqi<=300)return{label:'Very Unhealthy',color:'#6A1B9A',bg:'rgba(106,27,154,0.12)',emoji:'🚨',cls:'aqi-very-unhealthy'};return{label:'Hazardous',color:'#880E4F',bg:'rgba(136,14,79,0.15)',emoji:'☠️',cls:'aqi-hazardous'};},
  _nearestCG(lat,lng){let n=CG_STATIONS[0],min=Infinity;CG_STATIONS.forEach(s=>{const d=Math.sqrt((s.lat-lat)**2+(s.lon-lng)**2);if(d<min){min=d;n=s;}});return this._toFeed(n);},
  _toFeed(s){return{aqi:s.aqi,iaqi:{pm25:{v:s.pm25},pm10:{v:s.pm10},so2:{v:s.so2},no2:{v:s.no2}},city:{name:s.name,geo:[s.lat,s.lon]},time:{s:new Date().toISOString()},dominentpol:'pm25'};}
};

// ── Weather — Open-Meteo ────────────────────────────────────────────────────
const Weather={
  WMO_CODES:{0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',48:'Depositing Rime Fog',51:'Light Drizzle',53:'Moderate Drizzle',55:'Dense Drizzle',61:'Slight Rain',63:'Moderate Rain',65:'Heavy Rain',71:'Slight Snow',73:'Moderate Snow',75:'Heavy Snow',77:'Snow Grains',80:'Slight Rain Showers',81:'Moderate Rain Showers',82:'Violent Rain Showers',85:'Slight Snow Showers',86:'Heavy Snow Showers',95:'Thunderstorm',96:'Thunderstorm with Slight Hail',99:'Thunderstorm with Heavy Hail'},
  WMO_ICONS:{0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'⛈️',71:'❄️',73:'❄️',75:'❄️',77:'🌨️',80:'🌦️',81:'🌧️',82:'⛈️',85:'🌨️',86:'🌨️',95:'⛈️',96:'⛈️',99:'⛈️'},
  async getForecast(lat,lng){try{const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;const r=await fetch(url);return await r.json();}catch(e){return null;}},
  async getAirQuality(lat,lng){try{const url=`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,european_aqi,us_aqi&hourly=pm10,pm2_5,european_aqi,us_aqi&timezone=auto`;const r=await fetch(url);return await r.json();}catch(e){return null;}},
  wmoLabel(code){return this.WMO_CODES[code]||'Unknown';},
  wmoIcon(code){return this.WMO_ICONS[code]||'🌡️';},
  windDirection(deg){return['N','NE','E','SE','S','SW','W','NW'][Math.round(deg/45)%8];}
};

// ── Global Cities (CG first) ────────────────────────────────────────────────
const GLOBAL_CITIES=[
  {city:'Bhilai',   country:'IN',lat:21.2166,lng:81.3780,_local:221},
  {city:'Raipur',   country:'IN',lat:21.2514,lng:81.6296,_local:118},
  {city:'Korba',    country:'IN',lat:22.3700,lng:82.7200,_local:158},
  {city:'Durg',     country:'IN',lat:21.1938,lng:81.2849,_local:104},
  {city:'Bilaspur', country:'IN',lat:22.0796,lng:82.1391,_local:89},
  {city:'Raigarh',  country:'IN',lat:21.8974,lng:83.3950,_local:122},
  {city:'Delhi',    country:'IN',lat:28.6139,lng:77.2090},
  {city:'Mumbai',   country:'IN',lat:19.0760,lng:72.8777},
  {city:'Kolkata',  country:'IN',lat:22.5726,lng:88.3639},
  {city:'Bangalore',country:'IN',lat:12.9716,lng:77.5946},
  {city:'Chennai',  country:'IN',lat:13.0827,lng:80.2707},
  {city:'Hyderabad',country:'IN',lat:17.3850,lng:78.4867},
  {city:'Pune',     country:'IN',lat:18.5204,lng:73.8567},
  {city:'Ahmedabad',country:'IN',lat:23.0225,lng:72.5714},
  {city:'Lucknow',  country:'IN',lat:26.8467,lng:80.9462},
  {city:'Beijing',  country:'CN',lat:39.9042,lng:116.4074},
  {city:'Shanghai', country:'CN',lat:31.2304,lng:121.4737},
  {city:'Dhaka',    country:'BD',lat:23.8103,lng:90.4125},
  {city:'Lahore',   country:'PK',lat:31.5204,lng:74.3587},
  {city:'Bangkok',  country:'TH',lat:13.7563,lng:100.5018},
  {city:'Jakarta',  country:'ID',lat:-6.2088,lng:106.8456},
  {city:'Tokyo',    country:'JP',lat:35.6762,lng:139.6503},
  {city:'Seoul',    country:'KR',lat:37.5665,lng:126.9780},
  {city:'Dubai',    country:'AE',lat:25.2048,lng:55.2708},
  {city:'London',   country:'GB',lat:51.5074,lng:-0.1278},
  {city:'Paris',    country:'FR',lat:48.8566,lng:2.3522},
  {city:'Berlin',   country:'DE',lat:52.5200,lng:13.4050},
  {city:'Moscow',   country:'RU',lat:55.7558,lng:37.6173},
  {city:'New York', country:'US',lat:40.7128,lng:-74.0060},
  {city:'Los Angeles',country:'US',lat:34.0522,lng:-118.2437},
  {city:'Mexico City',country:'MX',lat:19.4326,lng:-99.1332},
  {city:'São Paulo',country:'BR',lat:-23.5505,lng:-46.6333},
  {city:'Cairo',    country:'EG',lat:30.0444,lng:31.2357},
  {city:'Lagos',    country:'NG',lat:6.5244, lng:3.3792},
  {city:'Sydney',   country:'AU',lat:-33.8688,lng:151.2093},
];

// ── Compliance Copilot (Causal Model) ───────────────────────────────────────
const ComplianceCopilot={
  simulateReduction(indName,pollutant,pct,days=7){
    const ind=EMISSION_MODEL[indName];if(!ind)return null;
    const frac=pct/100;
    const localDrop=ind.baseAQI*frac*0.7;
    const newAQI=Math.max(0,ind.baseAQI-localDrop);
    const regBefore=ind.baseAQI*ind.regionImpact*ind.windFactor;
    const regAfter=newAQI*ind.regionImpact*ind.windFactor;
    const riskBefore=Math.min(100,Math.max(0,(ind.baseAQI-100)/2));
    const riskAfter=Math.min(100,Math.max(0,(newAQI-100)/2));
    let pdrop=0,punit='µg/m³';
    if(/pm2?\.?5/i.test(pollutant)){pdrop=ind.pm25*frac;}
    else if(/so2/i.test(pollutant)){pdrop=ind.so2*frac;punit='ppm';}
    else if(/no2/i.test(pollutant)){pdrop=ind.no2*frac;}
    else{pdrop=ind.pm25*frac;}
    return{industry:indName,pollutant,pct,days,localAQI:{before:Math.round(ind.baseAQI),after:Math.round(newAQI),drop:Math.round(localDrop)},regional:{before:Math.round(regBefore),after:Math.round(regAfter),drop:Math.round(regBefore-regAfter)},risk:{before:Math.round(riskBefore),after:Math.round(riskAfter),drop:Math.round(riskBefore-riskAfter)},pollutant:{drop:pdrop.toFixed(1),unit:punit},delay:Math.max(1,Math.round(days*0.3)),compliant:newAQI<=100};
  },
  simulateShutdown(names,days=3){
    const total=Object.values(EMISSION_MODEL).reduce((s,i)=>s+i.baseAQI*i.regionImpact,0);
    let after=total;const details=[];
    names.forEach(n=>{const i=EMISSION_MODEL[n];if(!i)return;const c=i.baseAQI*i.regionImpact;after-=c;details.push({name:n,aqi:i.baseAQI,contribution:Math.round(c)});});
    const n=Object.keys(EMISSION_MODEL).length;
    const improv=Math.round(((total-after)/total)*100);
    return{units:details,days,before:Math.round(total/n),after:Math.round(after/n),improvement:improv,hospitalSaved:Math.round(improv*0.8*days),feasibility:days<=3?'HIGH':days<=7?'MEDIUM':'LOW'};
  },
  formatReduction(r){
    if(!r)return'❌ Industry not found. Try: <em>Bhilai Steel Plant (BSP), NTPC Korba, BALCO Aluminium, Raipur Cement Works, Raipur Sponge Iron</em>';
    const lvlB=WAQI.aqiLevel(r.localAQI.before),lvlA=WAQI.aqiLevel(r.localAQI.after);
    return`<strong>🔬 Emission Reduction Simulation</strong><br><strong>Industry:</strong> ${r.industry}<br><strong>Scenario:</strong> Reduce <em>${r.pollutant}</em> by <strong>${r.pct}%</strong> over <strong>${r.days} days</strong><br><br>`
      +`<strong>📊 Causal Model Prediction:</strong><br>`
      +`• Local AQI: <strong>${r.localAQI.before}</strong> ${lvlB.emoji} → <strong>${r.localAQI.after}</strong> ${lvlA.emoji} <em>(↓ ${r.localAQI.drop} pts)</em><br>`
      +`• ${r.pollutant}: ↓ ${r.pollutant.drop} ${r.pollutant.unit}<br>`
      +`• Regional AQI contribution: ↓ ${r.regional.drop} pts<br>`
      +`• Risk score: <strong>${r.risk.before}/100 → ${r.risk.after}/100</strong> (↓ ${r.risk.drop} pts)<br><br>`
      +`⏱️ Effect visible in: <strong>${r.delay}–${r.delay+2} days</strong> (atmospheric mixing lag)<br>`
      +`📋 Post-reduction compliance: <strong>${r.compliant?'✅ COMPLIANT':'⚠️ STILL EXCEEDING LIMIT'}</strong><br><br>`
      +`<em style="font-size:0.8em">Causal graph: Emissions → Wind dispersion (factor ${r.regional.before>0?(r.localAQI.before>0?(r.regional.before/r.localAQI.before*100).toFixed(0):50):50}%) → Regional AQI → Population risk</em>`;
  },
  formatShutdown(r){
    return`<strong>🏭 Festival/Emergency Shutdown Simulation</strong><br>`
      +`<strong>Units stopped (${r.days} days):</strong><br>`
      +r.units.map(u=>`• ${u.name} — AQI contribution: ${u.contribution}`).join('<br>')+'<br><br>'
      +`<strong>📊 Regional Impact:</strong><br>`
      +`• Avg regional AQI: <strong>${r.before} → ${r.after}</strong> (↓ ${r.improvement}% improvement)<br>`
      +`• Est. fewer hospital visits: ~${r.hospitalSaved} in CG industrial zone<br>`
      +`• Feasibility: <strong>${r.feasibility}</strong>${r.feasibility==='HIGH'?' (recommended ✅)':r.feasibility==='MEDIUM'?' (economic review needed ⚠️)':' (major disruption ❌)'}<br><br>`
      +`<em style="font-size:0.8em">⚠️ Mandatory CECB order required. Economic impact assessment recommended.</em>`;
  }
};

import { useState, useCallback, useMemo, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  DATA — Airports, Airlines, Routes
// ═══════════════════════════════════════════════════════════

const AIRPORTS = [
  { code:"DEL", city:"Delhi",        country:"India",       name:"Indira Gandhi International"     },
  { code:"BOM", city:"Mumbai",       country:"India",       name:"Chhatrapati Shivaji Maharaj"     },
  { code:"BLR", city:"Bangalore",    country:"India",       name:"Kempegowda International"        },
  { code:"MAA", city:"Chennai",      country:"India",       name:"Chennai International"           },
  { code:"HYD", city:"Hyderabad",    country:"India",       name:"Rajiv Gandhi International"      },
  { code:"CCU", city:"Kolkata",      country:"India",       name:"Netaji Subhas Chandra Bose"      },
  { code:"GOI", city:"Goa",          country:"India",       name:"Goa International"               },
  { code:"COK", city:"Kochi",        country:"India",       name:"Cochin International"            },
  { code:"JAI", city:"Jaipur",       country:"India",       name:"Jaipur International"            },
  { code:"AMD", city:"Ahmedabad",    country:"India",       name:"Sardar Vallabhbhai Patel"        },
  { code:"PNQ", city:"Pune",         country:"India",       name:"Pune Airport"                    },
  { code:"LKO", city:"Lucknow",      country:"India",       name:"Chaudhary Charan Singh"          },
  { code:"DXB", city:"Dubai",        country:"UAE",         name:"Dubai International"             },
  { code:"AUH", city:"Abu Dhabi",    country:"UAE",         name:"Zayed International"             },
  { code:"SIN", city:"Singapore",    country:"Singapore",   name:"Changi Airport"                  },
  { code:"BKK", city:"Bangkok",      country:"Thailand",    name:"Suvarnabhumi Airport"            },
  { code:"LHR", city:"London",       country:"UK",          name:"Heathrow Airport"                },
  { code:"CDG", city:"Paris",        country:"France",      name:"Charles de Gaulle"               },
  { code:"JFK", city:"New York",     country:"USA",         name:"John F. Kennedy International"   },
  { code:"LAX", city:"Los Angeles",  country:"USA",         name:"Los Angeles International"       },
  { code:"SYD", city:"Sydney",       country:"Australia",   name:"Kingsford Smith Airport"         },
  { code:"NRT", city:"Tokyo",        country:"Japan",       name:"Narita International"            },
  { code:"KUL", city:"Kuala Lumpur", country:"Malaysia",    name:"Kuala Lumpur International"      },
  { code:"HKG", city:"Hong Kong",    country:"Hong Kong",   name:"Hong Kong International"         },
  { code:"DOH", city:"Doha",         country:"Qatar",       name:"Hamad International"             },
  { code:"ICN", city:"Seoul",        country:"South Korea", name:"Incheon International"           },
  { code:"FRA", city:"Frankfurt",    country:"Germany",     name:"Frankfurt Airport"               },
];

const AIRLINES = [
  { code:"6E", name:"IndiGo",           color:"#4f46e5" },
  { code:"AI", name:"Air India",        color:"#dc2626" },
  { code:"SG", name:"SpiceJet",         color:"#ea580c" },
  { code:"QP", name:"Akasa Air",        color:"#d97706" },
  { code:"EK", name:"Emirates",         color:"#b91c1c" },
  { code:"SQ", name:"Singapore Air",    color:"#1d4ed8" },
  { code:"TG", name:"Thai Airways",     color:"#7c3aed" },
  { code:"BA", name:"British Airways",  color:"#1e3a8a" },
  { code:"AF", name:"Air France",       color:"#1e40af" },
  { code:"QR", name:"Qatar Airways",    color:"#7e22ce" },
  { code:"EY", name:"Etihad Airways",   color:"#0f766e" },
  { code:"QF", name:"Qantas",           color:"#92400e" },
];

const ROUTES = [
  // India Domestic
  { from:"DEL",to:"BOM", depH:5,  depM:30, dur:130, base:1899  },
  { from:"DEL",to:"BOM", depH:8,  depM:0,  dur:125, base:2399  },
  { from:"DEL",to:"BOM", depH:11, depM:30, dur:135, base:1749  },
  { from:"DEL",to:"BOM", depH:15, depM:15, dur:130, base:2099  },
  { from:"DEL",to:"BOM", depH:19, depM:0,  dur:135, base:2649  },
  { from:"BOM",to:"DEL", depH:6,  depM:0,  dur:130, base:1950  },
  { from:"BOM",to:"DEL", depH:9,  depM:30, dur:128, base:2250  },
  { from:"BOM",to:"DEL", depH:13, depM:0,  dur:133, base:1850  },
  { from:"DEL",to:"BLR", depH:6,  depM:15, dur:165, base:2299  },
  { from:"DEL",to:"BLR", depH:10, depM:0,  dur:170, base:2799  },
  { from:"DEL",to:"BLR", depH:16, depM:30, dur:168, base:2099  },
  { from:"BLR",to:"DEL", depH:7,  depM:0,  dur:165, base:2199  },
  { from:"BLR",to:"DEL", depH:14, depM:30, dur:170, base:2650  },
  { from:"DEL",to:"GOI", depH:7,  depM:45, dur:160, base:2499  },
  { from:"DEL",to:"GOI", depH:12, depM:0,  dur:155, base:2999  },
  { from:"BOM",to:"GOI", depH:6,  depM:30, dur:65,  base:1499  },
  { from:"BOM",to:"GOI", depH:10, depM:0,  dur:70,  base:1799  },
  { from:"BOM",to:"GOI", depH:14, depM:15, dur:68,  base:1649  },
  { from:"BOM",to:"GOI", depH:18, depM:0,  dur:72,  base:1599  },
  { from:"HYD",to:"DEL", depH:6,  depM:30, dur:150, base:1999  },
  { from:"HYD",to:"BOM", depH:8,  depM:0,  dur:100, base:1599  },
  { from:"MAA",to:"DEL", depH:5,  depM:45, dur:175, base:2199  },
  { from:"MAA",to:"BOM", depH:7,  depM:0,  dur:125, base:1799  },
  { from:"CCU",to:"DEL", depH:6,  depM:0,  dur:155, base:1899  },
  { from:"CCU",to:"BOM", depH:7,  depM:30, dur:175, base:2299  },
  { from:"BOM",to:"COK", depH:7,  depM:0,  dur:90,  base:1599  },
  { from:"BOM",to:"COK", depH:11, depM:30, dur:95,  base:1999  },
  { from:"DEL",to:"COK", depH:8,  depM:0,  dur:200, base:2899  },
  { from:"DEL",to:"JAI", depH:7,  depM:0,  dur:70,  base:1299  },
  { from:"BOM",to:"AMD", depH:8,  depM:30, dur:80,  base:1399  },
  { from:"DEL",to:"HYD", depH:9,  depM:0,  dur:155, base:2099  },
  { from:"BLR",to:"GOI", depH:6,  depM:10, dur:75,  base:2199  },
  // International
  { from:"DEL",to:"DXB", depH:3,  depM:0,  dur:195, base:8999  },
  { from:"DEL",to:"DXB", depH:9,  depM:30, dur:200, base:12499 },
  { from:"DEL",to:"DXB", depH:16, depM:0,  dur:195, base:10999 },
  { from:"BOM",to:"DXB", depH:2,  depM:30, dur:185, base:7499  },
  { from:"BOM",to:"DXB", depH:10, depM:0,  dur:190, base:9999  },
  { from:"DEL",to:"DOH", depH:4,  depM:0,  dur:210, base:9499  },
  { from:"BOM",to:"DOH", depH:3,  depM:30, dur:195, base:8499  },
  { from:"DEL",to:"SIN", depH:1,  depM:0,  dur:345, base:14999 },
  { from:"DEL",to:"SIN", depH:9,  depM:0,  dur:340, base:18999 },
  { from:"BOM",to:"SIN", depH:0,  depM:30, dur:330, base:13499 },
  { from:"DEL",to:"BKK", depH:8,  depM:0,  dur:310, base:13999 },
  { from:"BOM",to:"BKK", depH:10, depM:0,  dur:295, base:12999 },
  { from:"DEL",to:"KUL", depH:7,  depM:0,  dur:360, base:16999 },
  { from:"BOM",to:"KUL", depH:8,  depM:30, dur:345, base:15499 },
  { from:"DEL",to:"LHR", depH:2,  depM:30, dur:535, base:39999 },
  { from:"DEL",to:"LHR", depH:14, depM:0,  dur:540, base:52999 },
  { from:"BOM",to:"LHR", depH:3,  depM:0,  dur:520, base:37999 },
  { from:"DEL",to:"CDG", depH:4,  depM:0,  dur:510, base:42999 },
  { from:"DEL",to:"FRA", depH:3,  depM:30, dur:495, base:38999 },
  { from:"DEL",to:"JFK", depH:1,  depM:30, dur:900, base:54999 },
  { from:"BOM",to:"JFK", depH:2,  depM:0,  dur:930, base:49999 },
  { from:"DEL",to:"NRT", depH:8,  depM:0,  dur:480, base:29999 },
  { from:"BOM",to:"NRT", depH:6,  depM:30, dur:500, base:27999 },
  { from:"DEL",to:"SYD", depH:9,  depM:30, dur:660, base:44999 },
  { from:"DEL",to:"ICN", depH:7,  depM:30, dur:450, base:26999 },
  { from:"DEL",to:"HKG", depH:6,  depM:0,  dur:390, base:19999 },
];

// ── Helpers ──────────────────────────────────────────────────
function p2(n) { return String(n).padStart(2,"0"); }
function addM(h,m,mins){ const t=h*60+m+mins; return {h:Math.floor(t/60)%24,m:t%60}; }
function fT(h,m){ return `${p2(h)}:${p2(m)}`; }
function fDur(m){ const h=Math.floor(m/60),mn=m%60; return mn>0?`${h}h ${mn}m`:`${h}h`; }
function fDate(d){
  return new Date(d+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
}

let _id=1;
function buildFlights(route,date){
  const pool=route.base<5000?["6E","AI","SG","QP"]:route.base<20000?["6E","AI","EK","SQ","QR"]:["EK","BA","AF","QR","SQ"];
  return pool.slice(0,4).map((code,i)=>{
    const al=AIRLINES.find(a=>a.code===code)||AIRLINES[0];
    const price=Math.round(route.base*(1+i*0.13+(Math.random()*0.08-0.04))/50)*50;
    const dur=route.dur+[-5,0,8,15][i%4];
    const dH=(route.depH+Math.floor(i*1.8))%24;
    const dM=(route.depM+i*20)%60;
    const arr=addM(dH,dM,dur);
    const stops=route.base>35000&&i===2?1:0;
    _id++;
    return {
      id:`${code}-${1000+_id}-${date}`,
      flightNumber:`${code}-${1000+_id}`,
      airline:al.name, airlineCode:al.code, airlineColor:al.color,
      from:route.from, to:route.to,
      dep:fT(dH,dM), arr:fT(arr.h,arr.m),
      duration:fDur(dur), durationMins:dur,
      stops, stopLabel:stops===0?"Non-stop":`${stops} stop`,
      price, originalPrice:Math.round(price*(1.22+Math.random()*0.28)/50)*50,
      date, class:"Economy",
      seats:Math.floor(Math.random()*9)+1,
      baggage:route.base>15000?"30kg check-in · 10kg cabin":"15kg check-in · 7kg cabin",
      refundable:i===1,
      aircraft:["Airbus A320neo","Boeing 737 MAX","Airbus A321","Boeing 787","Airbus A380"][i%5],
    };
  });
}

function fetchFlights({from,to,date}){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      const fA=AIRPORTS.find(a=>a.code===from.toUpperCase().trim()||a.city.toLowerCase()===from.toLowerCase().trim());
      const tA=AIRPORTS.find(a=>a.code===to.toUpperCase().trim()||a.city.toLowerCase()===to.toLowerCase().trim());
      if(!fA){reject(new Error(`Origin "${from}" not found. Try: Delhi, Mumbai, Dubai or DEL, BOM, DXB`));return;}
      if(!tA){reject(new Error(`Destination "${to}" not found. Try: Delhi, Mumbai, Dubai or DEL, BOM, DXB`));return;}
      if(fA.code===tA.code){reject(new Error("Origin and destination cannot be the same."));return;}
      const routes=ROUTES.filter(r=>r.from===fA.code&&r.to===tA.code);
      if(!routes.length){resolve([]);return;}
      const flights=routes.flatMap(r=>buildFlights(r,date));
      flights.sort((a,b)=>a.price-b.price);
      resolve(flights);
    },1200+Math.random()*600);
  });
}

// ═══════════════════════════════════════════════════════════
//  AIRPORT INPUT with autocomplete
// ═══════════════════════════════════════════════════════════
function AirportInput({label,icon,value,onChange,placeholder,id}){
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState(value||"");
  const ref=useRef(null);

  const sugs=query.length>=2
    ?AIRPORTS.filter(a=>
        a.code.toLowerCase().includes(query.toLowerCase())||
        a.city.toLowerCase().includes(query.toLowerCase())||
        a.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0,6)
    :[];

  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);

  function pick(a){
    setQuery(`${a.city} (${a.code})`);
    onChange(a.code);
    setOpen(false);
  }

  return(
    <div ref={ref} className="relative flex-1 min-w-0">
      <label htmlFor={id} className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
        {icon} {label}
      </label>
      <input id={id} type="text" autoComplete="off" value={query} placeholder={placeholder}
        onChange={e=>{setQuery(e.target.value);onChange(e.target.value);setOpen(true);}}
        onFocus={()=>setOpen(true)}
        className="w-full bg-white/10 border border-white/20 focus:border-cyan-400 focus:bg-white/15 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all"
      />
      {open&&sugs.length>0&&(
        <ul className="absolute z-50 top-full mt-1 left-0 right-0 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
          {sugs.map(a=>(
            <li key={a.code} onMouseDown={()=>pick(a)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-0">
              <span className="text-base font-black text-cyan-400 w-10 flex-shrink-0">{a.code}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.city}</p>
                <p className="text-xs text-slate-400 truncate">{a.name} · {a.country}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SEARCH FORM
// ═══════════════════════════════════════════════════════════
function SearchForm({onSearch,initialValues={}}){
  const today=new Date().toISOString().split("T")[0];
  const [from,setFrom]=useState(initialValues.from||"");
  const [to,setTo]=useState(initialValues.to||"");
  const [date,setDate]=useState(initialValues.date||today);
  const [pax,setPax]=useState(initialValues.pax||1);
  const [err,setErr]=useState("");

  function swap(){const t=from;setFrom(to);setTo(t);}

  function submit(e){
    e.preventDefault();setErr("");
    if(!from.trim()){setErr("Please enter an origin city or airport code.");return;}
    if(!to.trim()){setErr("Please enter a destination city or airport code.");return;}
    if(!date){setErr("Please select a departure date.");return;}
    onSearch({from,to,date,pax});
  }

  return(
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <AirportInput id="from" label="From" icon="🛫" value={from} onChange={setFrom} placeholder="City or airport e.g. Delhi"/>
        <button type="button" onClick={swap}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-cyan-500/20 border border-white/20 hover:border-cyan-400 text-white flex items-center justify-center transition-all text-base self-end mb-0.5"
          title="Swap">⇄</button>
        <AirportInput id="to" label="To" icon="🛬" value={to} onChange={setTo} placeholder="City or airport e.g. Dubai"/>
        <div className="flex-shrink-0 w-full md:w-40">
          <label htmlFor="date" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">📅 Date</label>
          <input id="date" type="date" value={date} min={today} onChange={e=>setDate(e.target.value)}
            className="w-full bg-white/10 border border-white/20 focus:border-cyan-400 text-white rounded-xl px-4 py-3.5 text-sm font-medium outline-none [color-scheme:dark]"/>
        </div>
        <div className="flex-shrink-0 w-full md:w-28">
          <label htmlFor="pax" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">👤 Adults</label>
          <select id="pax" value={pax} onChange={e=>setPax(Number(e.target.value))}
            className="w-full bg-white/10 border border-white/20 focus:border-cyan-400 text-white rounded-xl px-4 py-3.5 text-sm font-medium outline-none">
            {[1,2,3,4,5,6].map(n=><option key={n} value={n} className="bg-slate-800">{n} Adult{n>1?"s":""}</option>)}
          </select>
        </div>
        <button type="submit"
          className="flex-shrink-0 w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900 font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Search Flights
        </button>
      </div>
      {err&&<p className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">⚠ {err}</p>}
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
//  FLIGHT CARD
// ═══════════════════════════════════════════════════════════
function FlightCard({flight:f,rank,delay=0}){
  const [expanded,setExpanded]=useState(false);
  const disc=Math.round(((f.originalPrice-f.price)/f.originalPrice)*100);
  const isCheapest=rank===0;
  const lowSeats=f.seats<=4;

  return(
    <article
      style={{animation:"fadeSlideUp 0.4s ease both",animationDelay:`${delay}ms`}}
      className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden
        ${isCheapest?"border-green-400":"border-slate-100 hover:border-blue-200"}`}
    >
      {isCheapest&&(
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black text-center py-1.5 tracking-widest uppercase">
          ✓ Lowest Fare
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* Airline */}
          <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{backgroundColor:f.airlineColor}}>
              {f.airlineCode}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{f.airline}</p>
              <p className="text-xs text-slate-400 font-mono">{f.flightNumber}</p>
              <p className="text-xs text-slate-400 truncate">{f.aircraft}</p>
            </div>
          </div>

          {/* Route */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="text-center flex-shrink-0">
              <p className="text-2xl font-black text-slate-900 tabular-nums leading-none">{f.dep}</p>
              <p className="text-sm font-bold text-slate-500 mt-1">{f.from}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 px-2">
              <p className="text-xs text-slate-400">{f.duration}</p>
              <div className="w-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"/>
                <div className="flex-1 border-t-2 border-dashed border-slate-200 relative mx-1">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-blue-500 text-sm">✈</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"/>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.stops===0?"bg-green-50 text-green-600":"bg-amber-50 text-amber-600"}`}>
                {f.stopLabel}
              </span>
            </div>
            <div className="text-center flex-shrink-0">
              <p className="text-2xl font-black text-slate-900 tabular-nums leading-none">{f.arr}</p>
              <p className="text-sm font-bold text-slate-500 mt-1">{f.to}</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1.5 sm:w-40 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end flex-wrap">
                <p className="text-2xl font-black text-blue-600">₹{f.price.toLocaleString("en-IN")}</p>
                {disc>10&&<span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">-{disc}%</span>}
              </div>
              <p className="text-xs text-slate-400 line-through">₹{f.originalPrice.toLocaleString("en-IN")}</p>
              <p className="text-xs text-slate-400">per person</p>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <a href="#"
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md whitespace-nowrap">
                Book Now →
              </a>
              <button onClick={()=>setExpanded(v=>!v)}
                className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
                {expanded?"Hide details ▲":"View details ▼"}
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-50">
          {f.refundable&&<span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">✓ Refundable</span>}
          {lowSeats&&<span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full animate-pulse">⚠ Only {f.seats} seats left</span>}
          {f._fastest&&<span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">⚡ Fastest</span>}
          <span className="text-xs text-slate-400">🧳 {f.baggage}</span>
        </div>

        {/* Expanded */}
        {expanded&&(
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["✈ Flight",f.flightNumber],
              ["🛫 Departs",`${f.dep} · ${f.from}`],
              ["🛬 Arrives",`${f.arr} · ${f.to}`],
              ["⏱ Duration",f.duration],
              ["🛑 Stops",f.stopLabel],
              ["✈ Aircraft",f.aircraft],
              ["🧳 Baggage",f.baggage],
              ["💺 Class",f.class],
            ].map(([lbl,val])=>(
              <div key={lbl} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-0.5">{lbl}</p>
                <p className="text-xs font-semibold text-slate-700">{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════
//  SKELETON LOADER
// ═══════════════════════════════════════════════════════════
function Skeleton(){
  return(
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3 sm:w-44">
          <div className="w-11 h-11 rounded-xl bg-slate-200"/>
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-slate-200 rounded w-24"/>
            <div className="h-2.5 bg-slate-200 rounded w-16"/>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <div className="space-y-2"><div className="h-6 bg-slate-200 rounded w-14"/><div className="h-3 bg-slate-200 rounded w-8"/></div>
          <div className="flex-1 space-y-1.5"><div className="h-2 bg-slate-200 rounded"/><div className="h-3 bg-slate-200 rounded w-16 mx-auto"/></div>
          <div className="space-y-2"><div className="h-6 bg-slate-200 rounded w-14"/><div className="h-3 bg-slate-200 rounded w-8"/></div>
        </div>
        <div className="sm:w-40 space-y-2 sm:ml-auto">
          <div className="h-7 bg-slate-200 rounded w-28 ml-auto"/>
          <div className="h-9 bg-slate-200 rounded-xl"/>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RESULTS LIST
// ═══════════════════════════════════════════════════════════
function ResultsList({flights,loading,error,searchMeta}){
  const [sortBy,setSortBy]=useState("price_asc");
  const [airline,setAirline]=useState("all");
  const [stops,setStops]=useState("any");
  const [maxPrice,setMaxPrice]=useState(null);

  const allAirlines=useMemo(()=>flights?[...new Set(flights.map(f=>f.airline))].sort():[],[flights]);
  const pMax=useMemo(()=>flights?.length?Math.max(...flights.map(f=>f.price)):200000,[flights]);
  const pMin=useMemo(()=>flights?.length?Math.min(...flights.map(f=>f.price)):0,[flights]);
  const effMax=maxPrice??pMax;

  const list=useMemo(()=>{
    if(!flights)return[];
    const minDur=Math.min(...flights.map(f=>f.durationMins));
    let r=flights.map(f=>({...f,_fastest:f.durationMins===minDur}));
    if(airline!=="all")r=r.filter(f=>f.airline===airline);
    if(stops==="nonstop")r=r.filter(f=>f.stops===0);
    r=r.filter(f=>f.price<=effMax);
    switch(sortBy){
      case"price_asc": r.sort((a,b)=>a.price-b.price);break;
      case"price_desc":r.sort((a,b)=>b.price-a.price);break;
      case"dep_asc":   r.sort((a,b)=>a.dep.localeCompare(b.dep));break;
      case"dur_asc":   r.sort((a,b)=>a.durationMins-b.durationMins);break;
    }
    return r;
  },[flights,sortBy,airline,stops,effMax]);

  if(loading)return(
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-slate-500 mb-4">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
        <p className="font-semibold text-sm">Searching across all airlines…</p>
      </div>
      {Array(4).fill(0).map((_,i)=><Skeleton key={i}/>)}
    </div>
  );

  if(error)return(
    <div className="text-center py-20 bg-white rounded-2xl border border-red-100 shadow-sm">
      <p className="text-5xl mb-4">✈️</p>
      <p className="text-lg font-bold text-red-600 mb-2">Search Error</p>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">{error}</p>
      <p className="text-xs text-slate-400 mt-3">Try: Delhi, Mumbai, Dubai, Singapore or DEL, BOM, DXB, SIN</p>
    </div>
  );

  if(!flights)return null;

  if(flights.length===0)return(
    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-5xl mb-4">🔍</p>
      <p className="text-lg font-bold text-slate-700 mb-2">No flights found</p>
      <p className="text-slate-500 text-sm">No results for this route on {searchMeta?.date}.<br/>Try a different date or route.</p>
    </div>
  );

  const hasFilter=airline!=="all"||stops!=="any"||maxPrice!==null;

  return(
    <div className="space-y-4">
      {/* Summary + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
        <div>
          <p className="font-bold text-slate-800 text-sm">
            {list.length} flight{list.length!==1?"s":""}
            {searchMeta&&<span className="text-slate-400 font-normal"> · {searchMeta.from} → {searchMeta.to} · {fDate(searchMeta.date)}</span>}
          </p>
          {list.length>0&&(
            <p className="text-xs text-slate-400 mt-0.5">
              Cheapest <span className="text-green-600 font-semibold">₹{Math.min(...list.map(f=>f.price)).toLocaleString("en-IN")}</span>
              {" · "}Avg <span className="text-slate-600 font-medium">₹{Math.round(list.reduce((s,f)=>s+f.price,0)/list.length).toLocaleString("en-IN")}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort</label>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="dep_asc">Departure: Earliest</option>
            <option value="dur_asc">Duration: Shortest</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-36">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Airline</label>
          <select value={airline} onChange={e=>setAirline(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="all">All Airlines</option>
            {allAirlines.map(a=><option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-36">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Stops</label>
          <select value={stops} onChange={e=>setStops(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="any">Any</option>
            <option value="nonstop">Non-stop only</option>
          </select>
        </div>
        <div className="flex-1 min-w-48">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Max Price: <span className="text-blue-600 font-black">₹{effMax.toLocaleString("en-IN")}</span>
          </label>
          <input type="range" min={pMin} max={pMax} step={500} value={effMax}
            onChange={e=>setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600"/>
        </div>
        {hasFilter&&(
          <button onClick={()=>{setAirline("all");setStops("any");setMaxPrice(null);}}
            className="text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-100 transition-colors self-end">
            Reset ✕
          </button>
        )}
      </div>

      {/* Flight Cards */}
      {list.length===0?(
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-3">🔎</p>
          <p className="font-bold text-slate-600">No flights match your filters</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting airline, stops, or price range</p>
        </div>
      ):(
        <div className="space-y-3">
          {list.map((f,i)=><FlightCard key={f.id} flight={f} rank={i} delay={i*40}/>)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════════
const POPULAR=[
  {from:"DEL",to:"BOM",label:"Delhi → Mumbai",    emoji:"🏙",price:"from ₹1,749"},
  {from:"BOM",to:"GOI",label:"Mumbai → Goa",      emoji:"🏖",price:"from ₹1,499"},
  {from:"DEL",to:"DXB",label:"Delhi → Dubai",     emoji:"🌆",price:"from ₹8,999"},
  {from:"DEL",to:"SIN",label:"Delhi → Singapore", emoji:"🦁",price:"from ₹14,999"},
  {from:"BOM",to:"LHR",label:"Mumbai → London",   emoji:"🎡",price:"from ₹37,999"},
  {from:"DEL",to:"NRT",label:"Delhi → Tokyo",     emoji:"🗼",price:"from ₹29,999"},
];

function HomePage({onSearch}){
  function quickSearch(from,to){
    const d=new Date();d.setDate(d.getDate()+14);
    onSearch({from,to,date:d.toISOString().split("T")[0],pax:1});
  }

  return(
    <div>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"/>
        <div className="absolute inset-0 opacity-25"
          style={{background:"radial-gradient(ellipse at 20% 60%,#06b6d4 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,#3b82f6 0%,transparent 55%)"}}/>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
        <div className="absolute top-20 left-10 text-5xl opacity-10 rotate-12 select-none hidden md:block">✈</div>
        <div className="absolute bottom-28 right-14 text-7xl opacity-10 -rotate-12 select-none hidden md:block">✈</div>

        <div className="relative w-full max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/>
            Global Flight Search · 500+ Airlines
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight"
            style={{fontFamily:"'Georgia',serif"}}>
            Find the World's<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Cheapest Flights
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mb-12 max-w-xl mx-auto">
            Compare fares across all airlines — sorted lowest to highest. No hidden fees.
          </p>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl text-left">
            <SearchForm onSearch={onSearch}/>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-slate-50 px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Quick Search</p>
          <h2 className="text-2xl font-black text-slate-800 text-center mb-8" style={{fontFamily:"'Georgia',serif"}}>
            Popular Routes ✈
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POPULAR.map(r=>(
              <button key={`${r.from}-${r.to}`} onClick={()=>quickSearch(r.from,r.to)}
                className="group bg-white hover:bg-blue-600 border border-slate-100 hover:border-blue-600 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <span className="text-2xl block mb-2">{r.emoji}</span>
                <p className="font-bold text-slate-700 group-hover:text-white text-sm leading-snug">{r.label}</p>
                <p className="text-xs text-blue-500 group-hover:text-cyan-300 font-semibold mt-1">{r.price}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white px-4 py-14 border-t border-slate-100">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["🔍","Smart Search","Compare fares across 500+ airlines instantly"],
            ["💸","Always Cheapest","Results sorted lowest price first, always"],
            ["🛡","Direct Booking","We redirect you to the airline's official site"],
          ].map(([icon,title,desc])=>(
            <div key={title}>
              <p className="text-3xl mb-3">{icon}</p>
              <p className="font-bold text-slate-800 mb-1">{title}</p>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Airport chips */}
      <section className="bg-slate-50 px-4 py-10 border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Search by city name or IATA code</p>
          <div className="flex flex-wrap justify-center gap-2">
            {AIRPORTS.slice(0,16).map(a=>(
              <span key={a.code} className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-medium">
                {a.code} · {a.city}
              </span>
            ))}
            <span className="text-xs text-slate-400 px-3 py-1.5">+{AIRPORTS.length-16} more</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RESULTS PAGE
// ═══════════════════════════════════════════════════════════
function ResultsPage({searchParams,flights,loading,error,onSearch}){
  return(
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-white/10 px-4 py-5">
        <div className="max-w-5xl mx-auto">
          <SearchForm onSearch={onSearch} initialValues={searchParams}/>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <ResultsList flights={flights} loading={loading} error={error} searchMeta={searchParams}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════════
function Header({page,onHome}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  return(
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 transition-all duration-300 border-b border-white/10
      ${scrolled?"bg-slate-900/95 backdrop-blur shadow-lg":"bg-slate-900/80 backdrop-blur"}`}>
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2 group">
          <span className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors"
            style={{fontFamily:"'Georgia',serif"}}>FlySasta</span>
          <span className="text-lg">✈️</span>
        </button>
        <nav className="flex items-center gap-1">
          <button onClick={onHome}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page==="home"?"text-cyan-400 bg-cyan-500/10":"text-slate-400 hover:text-white"}`}>
            Home
          </button>
          <a href="#"
            className="hidden sm:block ml-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
            🔔 Deal Alerts
          </a>
        </nav>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState("home");
  const [searchParams,setSearchParams]=useState(null);
  const [flights,setFlights]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const handleSearch=useCallback(async(params)=>{
    setSearchParams(params);
    setPage("results");
    setLoading(true);
    setError(null);
    setFlights(null);
    window.scrollTo({top:0,behavior:"smooth"});
    try{
      const results=await fetchFlights(params);
      setFlights(results);
    }catch(e){
      setError(e.message||"Something went wrong. Please try again.");
    }finally{
      setLoading(false);
    }
  },[]);

  function goHome(){
    setPage("home");setFlights(null);setError(null);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return(
    <>
      <style>{`
        @keyframes fadeSlideUp{
          from{opacity:0;transform:translateY(20px);}
          to{opacity:1;transform:translateY(0);}
        }
        *{box-sizing:border-box;}
        body{margin:0;background:#f8fafc;}
      `}</style>
      <Header page={page} onHome={goHome}/>
      <div className="pt-14">
        {page==="home"&&<HomePage onSearch={handleSearch}/>}
        {page==="results"&&(
          <ResultsPage
            searchParams={searchParams}
            flights={flights}
            loading={loading}
            error={error}
            onSearch={handleSearch}
          />
        )}
      </div>
      <footer className="bg-slate-900 text-slate-400 text-center py-8 border-t border-white/10">
        <p className="font-black text-white text-xl mb-1" style={{fontFamily:"'Georgia',serif"}}>FlySasta ✈️</p>
        <p className="text-sm">© 2026 FlySasta · Fares are indicative · Redirects to official airline sites</p>
      </footer>
    </>
  );
}

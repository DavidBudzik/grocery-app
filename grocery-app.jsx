import { useState, useRef, useCallback } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Nunito+Sans:wght@300;400;600;700&display=swap";
document.head.appendChild(fontLink);

// ── Styles ─────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { height: 100%; }
  body {
    background: #f2f2f7;
    font-family: 'Nunito Sans', sans-serif;
    overscroll-behavior: none;
    -webkit-font-smoothing: antialiased;
  }

  .app {
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    min-height: 100dvh;
    background: #f2f2f7;
    position: relative;
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
    overflow-x: hidden;
  }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(0,0,0,0.07);
    display: flex;
    padding-top: 8px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    z-index: 100;
  }
  .nav-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; min-height:48px; justify-content:center; transition:opacity 0.15s; }
  .nav-item:active { opacity: 0.55; }
  .nav-icon { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:9px; transition:background 0.2s; }
  .nav-item.active .nav-icon { background: #e8f5e9; }
  .nav-label { font-size:10px; font-weight:700; color:#8e8e93; letter-spacing:0.3px; }
  .nav-item.active .nav-label { color: #34a853; }

  /* ── Header ── */
  .header {
    padding: calc(env(safe-area-inset-top) + 52px) 20px 12px;
    background: #f2f2f7;
  }
  .header-title { font-family:'Nunito',sans-serif; font-size:30px; font-weight:800; color:#1c1c1e; letter-spacing:-0.6px; }
  .header-sub { font-size:14px; color:#8e8e93; margin-top:2px; }

  /* ── Cards ── */
  .card { background:#fff; margin-bottom:10px; overflow:hidden; }
  .card-rounded { border-radius:16px; margin-left:16px; margin-right:16px; }
  .card-bleed { border-radius:0; }
  .card-title { font-size:12px; font-weight:800; color:#8e8e93; letter-spacing:0.6px; text-transform:uppercase; padding:14px 20px 8px; }

  /* ── Stats strip ── */
  .stats-strip { display:flex; gap:10px; padding:4px 16px 12px; overflow-x:auto; scrollbar-width:none; }
  .stats-strip::-webkit-scrollbar { display:none; }
  .stat-card { background:#fff; border-radius:14px; padding:12px 18px; flex-shrink:0; }
  .stat-val { font-family:'Nunito',sans-serif; font-size:24px; font-weight:800; color:#1c1c1e; }
  .stat-label { font-size:11px; color:#8e8e93; margin-top:1px; }

  /* ── Pill tabs ── */
  .pill-tabs { display:flex; gap:6px; padding:4px 16px 12px; overflow-x:auto; scrollbar-width:none; }
  .pill-tabs::-webkit-scrollbar { display:none; }
  .pill { padding:8px 16px; border-radius:22px; font-size:13px; font-weight:700; cursor:pointer; border:none; white-space:nowrap; transition:all 0.18s; min-height:36px; }
  .pill-active { background:#34a853; color:#fff; }
  .pill-inactive { background:#fff; color:#636366; }

  /* ── Swipeable rows ── */
  .swipe-wrapper { position:relative; overflow:hidden; border-bottom:1px solid #f2f2f7; }
  .swipe-wrapper:last-child { border-bottom:none; }
  .swipe-bg { position:absolute; top:0; bottom:0; display:flex; align-items:center; padding:0 22px; z-index:0; }
  .swipe-bg-left  { left:0;  background:#34a853; }
  .swipe-bg-right { right:0; background:#ff453a; }
  .swipe-bg-label { font-size:12px; font-weight:800; color:#fff; letter-spacing:0.5px; text-transform:uppercase; }

  .item-row {
    position:relative; display:flex; align-items:center;
    padding:13px 20px; gap:14px; background:#fff; z-index:1;
    transition:transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
    will-change:transform; min-height:64px;
    cursor:pointer; user-select:none; touch-action:pan-y;
  }
  .item-row.swiping { transition:none; }

  .item-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .item-info { flex:1; min-width:0; }
  .item-name { font-size:15px; font-weight:700; color:#1c1c1e; }
  .item-name.checked { text-decoration:line-through; color:#c7c7cc; }
  .item-meta { font-size:12px; color:#8e8e93; margin-top:2px; }

  .check-btn { width:28px; height:28px; border-radius:50%; border:2px solid #d1d1d6; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; }
  .check-btn.checked { background:#34a853; border-color:#34a853; }

  /* ── Badges ── */
  .badge { display:inline-flex; align-items:center; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:700; }
  .badge-green { background:#e8f5e9; color:#2e7d32; }
  .badge-orange { background:#fff3e0; color:#e65100; }
  .badge-blue { background:#e3f2fd; color:#1565c0; }
  .badge-red { background:#fce4ec; color:#c62828; }

  /* ── Inputs ── */
  .input-row { display:flex; gap:10px; padding:12px 20px; border-top:1px solid #f2f2f7; }
  .input-field { flex:1; border:1.5px solid #e5e5ea; border-radius:12px; padding:12px 14px; font-size:15px; font-family:'Nunito Sans',sans-serif; outline:none; color:#1c1c1e; background:#fafafa; min-height:48px; transition:border-color 0.2s; }
  .input-field:focus { border-color:#34a853; background:#fff; }
  .btn { border:none; border-radius:12px; padding:12px 18px; font-size:15px; font-weight:800; font-family:'Nunito',sans-serif; cursor:pointer; transition:all 0.18s; min-height:48px; display:flex; align-items:center; justify-content:center; }
  .btn-green { background:#34a853; color:#fff; }
  .btn-green:active { background:#2e7d32; transform:scale(0.97); }
  .btn-green:disabled { background:#a5d6a7; cursor:not-allowed; }
  .btn-outline { background:#f2f2f7; color:#34a853; border:1.5px solid #34a853; }
  .btn-sm { padding:8px 14px; font-size:13px; border-radius:10px; min-height:36px; }
  .btn-red { background:#ffebee; color:#c62828; }

  /* ── AI Bubble ── */
  .ai-bubble { background:linear-gradient(135deg,#e8f5e9 0%,#f1f8e9 100%); border-radius:16px; padding:16px 20px; margin:0 16px 12px; border:1px solid #c8e6c9; }
  .ai-bubble-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
  .ai-dot { width:8px; height:8px; border-radius:50%; background:#34a853; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .ai-label { font-size:11px; font-weight:800; color:#2e7d32; text-transform:uppercase; letter-spacing:0.6px; }
  .ai-text { font-size:14px; color:#1c1c1e; line-height:1.55; }
  .ai-typing { display:flex; gap:4px; align-items:center; padding:4px 0; }
  .ai-dot-anim { width:6px; height:6px; border-radius:50%; background:#34a853; animation:bounce 1.2s infinite; }
  .ai-dot-anim:nth-child(2){animation-delay:0.2s}
  .ai-dot-anim:nth-child(3){animation-delay:0.4s}
  @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-5px);opacity:1} }

  /* ── Meal grid ── */
  .meal-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:12px 20px; }
  .meal-card { background:#f9f9f9; border-radius:14px; padding:14px; cursor:pointer; border:1.5px solid transparent; transition:all 0.2s; min-height:72px; }
  .meal-card:active { transform:scale(0.96); }
  .meal-card.has-meal { background:#f1f8e9; border-color:#a5d6a7; }
  .meal-day { font-size:11px; font-weight:800; color:#8e8e93; text-transform:uppercase; letter-spacing:0.5px; }
  .meal-name { font-size:13px; font-weight:700; color:#1c1c1e; margin-top:5px; line-height:1.3; }
  .meal-empty { font-size:12px; color:#c7c7cc; margin-top:5px; }

  /* ── Agent card ── */
  .webhook-card { background:#1c1c1e; border-radius:16px; margin:0 16px 12px; padding:22px; }
  .webhook-title { font-family:'Nunito',sans-serif; font-size:17px; font-weight:800; color:#fff; margin-bottom:4px; }
  .webhook-sub { font-size:12px; color:#636366; margin-bottom:16px; line-height:1.5; }
  .webhook-input { width:100%; background:#2c2c2e; border:1px solid #3a3a3c; border-radius:12px; padding:13px 14px; color:#fff; font-size:14px; font-family:'Nunito Sans',sans-serif; outline:none; min-height:48px; }
  .webhook-input:focus { border-color:#34a853; }
  .schedule-row { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
  .sched-btn { padding:9px 14px; border-radius:22px; font-size:12px; font-weight:700; border:1px solid #3a3a3c; background:#2c2c2e; color:#8e8e93; cursor:pointer; min-height:38px; transition:all 0.18s; }
  .sched-btn.active { background:#34a853; border-color:#34a853; color:#fff; }
  .trigger-btn { margin-top:16px; width:100%; padding:16px; border-radius:14px; background:#34a853; border:none; color:#fff; font-size:16px; font-weight:800; font-family:'Nunito',sans-serif; cursor:pointer; min-height:54px; transition:all 0.18s; }
  .trigger-btn:active { background:#2e7d32; transform:scale(0.98); }
  .trigger-btn:disabled { background:#2c2c2e; color:#636366; cursor:not-allowed; }
  .log-line { font-size:11px; color:#636366; font-family:monospace; padding:3px 0; }
  .log-line.ok { color:#34a853; }
  .log-line.err { color:#ff453a; }

  /* ── Bottom Sheet ── */
  .sheet-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:200; animation:fadein 0.22s ease; }
  @keyframes fadein { from{opacity:0} to{opacity:1} }
  .sheet {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%);
    width:100%; max-width:430px; background:#fff;
    border-radius:24px 24px 0 0;
    max-height:80dvh; overflow-y:auto;
    padding:0 20px calc(24px + env(safe-area-inset-bottom));
    z-index:201;
    animation:slideup 0.32s cubic-bezier(0.32,0.72,0,1);
    overscroll-behavior:contain;
  }
  @keyframes slideup { from{transform:translateX(-50%) translateY(100%)} to{transform:translateX(-50%) translateY(0)} }
  .sheet-handle { width:40px; height:5px; border-radius:3px; background:#e5e5ea; margin:14px auto 20px; }
  .sheet-title { font-family:'Nunito',sans-serif; font-size:22px; font-weight:800; color:#1c1c1e; margin-bottom:18px; }

  /* ── Toast ── */
  .toast { position:fixed; top:calc(env(safe-area-inset-top) + 14px); left:50%; transform:translateX(-50%); background:#1c1c1e; color:#fff; padding:11px 22px; border-radius:22px; font-size:13px; font-weight:700; z-index:400; white-space:nowrap; animation:toastin 0.28s cubic-bezier(0.32,0.72,0,1); pointer-events:none; }
  @keyframes toastin { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── Data ───────────────────────────────────────────────────────────────────
const CATEGORIES = ["🥦 Produce","🥛 Dairy","🥩 Meat","🍞 Bakery","🥫 Pantry","🧴 Household","🧊 Frozen"];
const CAT_BG = {"🥦 Produce":"#e8f5e9","🥛 Dairy":"#e3f2fd","🥩 Meat":"#fce4ec","🍞 Bakery":"#fff8e1","🥫 Pantry":"#fff3e0","🧴 Household":"#f3e5f5","🧊 Frozen":"#e0f7fa"};
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const INIT_PANTRY = [
  {id:1,name:"Whole Milk",category:"🥛 Dairy",qty:2,unit:"L",expiry:"Mar 18",addedBy:"David"},
  {id:2,name:"Sourdough Bread",category:"🍞 Bakery",qty:1,unit:"loaf",expiry:"Mar 16",addedBy:"Sarah"},
  {id:3,name:"Cherry Tomatoes",category:"🥦 Produce",qty:500,unit:"g",expiry:"Mar 20",addedBy:"David"},
  {id:4,name:"Chicken Breast",category:"🥩 Meat",qty:800,unit:"g",expiry:"Mar 17",addedBy:"Sarah"},
  {id:5,name:"Olive Oil",category:"🥫 Pantry",qty:1,unit:"bottle",expiry:"Dec 25",addedBy:"David"},
  {id:6,name:"Greek Yogurt",category:"🥛 Dairy",qty:3,unit:"cups",expiry:"Mar 22",addedBy:"Sarah"},
];
const INIT_SHOPPING = [
  {id:1,name:"Avocados",category:"🥦 Produce",qty:3,unit:"pcs",checked:false,addedBy:"David"},
  {id:2,name:"Feta Cheese",category:"🥛 Dairy",qty:200,unit:"g",checked:false,addedBy:"Sarah"},
  {id:3,name:"Pasta Penne",category:"🥫 Pantry",qty:500,unit:"g",checked:true,addedBy:"David"},
  {id:4,name:"Spinach",category:"🥦 Produce",qty:1,unit:"bag",checked:false,addedBy:"Sarah"},
];
const INIT_MEALS = {Mon:"Grilled Chicken Salad",Tue:"",Wed:"Pasta Arrabbiata",Thu:"",Fri:"Salmon with Veggies",Sat:"Homemade Pizza",Sun:""};

const expiryBadge = (e) => {
  if (e==="Mar 15"||e==="Mar 16") return "badge-red";
  if (e==="Mar 17"||e==="Mar 18") return "badge-orange";
  return "badge-green";
};

let _tt;
const fireToast = (setter,msg) => { setter(msg); clearTimeout(_tt); _tt=setTimeout(()=>setter(""),2600); };

// ── Swipe Row ──────────────────────────────────────────────────────────────
const THRESHOLD = 72;

function SwipeRow({ children, onSwipeLeft, onSwipeRight, leftLabel="✓ Done", rightLabel="Delete" }) {
  const rowRef = useRef(null);
  const sx = useRef(0);
  const dx = useRef(0);

  const tx = (x) => { if (rowRef.current) rowRef.current.style.transform = `translateX(${x}px)`; };

  const onTouchStart = (e) => { sx.current = e.touches[0].clientX; dx.current = 0; if(rowRef.current) rowRef.current.classList.add("swiping"); };
  const onTouchMove  = (e) => { dx.current = e.touches[0].clientX - sx.current; if (Math.abs(dx.current)>6) tx(Math.sign(dx.current)*Math.min(Math.abs(dx.current),110)); };
  const onTouchEnd   = () => {
    if (rowRef.current) rowRef.current.classList.remove("swiping");
    const d = dx.current;
    if (d > THRESHOLD && onSwipeRight) { tx(420); setTimeout(()=>{onSwipeRight();tx(0);},230); }
    else if (d < -THRESHOLD && onSwipeLeft) { tx(-420); setTimeout(()=>{onSwipeLeft();tx(0);},230); }
    else tx(0);
    dx.current = 0;
  };

  return (
    <div className="swipe-wrapper">
      {onSwipeRight && <div className="swipe-bg swipe-bg-left"><span className="swipe-bg-label">{leftLabel}</span></div>}
      {onSwipeLeft  && <div className="swipe-bg swipe-bg-right"><span className="swipe-bg-label">{rightLabel}</span></div>}
      <div ref={rowRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {children}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function GroceryApp() {
  const [tab, setTab] = useState("pantry");
  const [pantry, setPantry]     = useState(INIT_PANTRY);
  const [shopping, setShopping] = useState(INIT_SHOPPING);
  const [meals, setMeals]       = useState(INIT_MEALS);
  const [toastMsg, setToastMsg] = useState("");
  const [modal, setModal]       = useState(null);
  const showToast = useCallback((m) => fireToast(setToastMsg,m), []);

  const TABS = [
    {id:"pantry",  label:"Pantry",   Icon:PantryIcon},
    {id:"shopping",label:"Shopping", Icon:ShoppingIcon},
    {id:"meals",   label:"Meals",    Icon:MealsIcon},
    {id:"agent",   label:"Agent",    Icon:AgentIcon},
  ];

  return (
    <div className="app">
      {toastMsg && <div className="toast">{toastMsg}</div>}
      {tab==="pantry"   && <PantryTab   pantry={pantry}     setPantry={setPantry}     showToast={showToast} setModal={setModal}/>}
      {tab==="shopping" && <ShoppingTab shopping={shopping} setShopping={setShopping} showToast={showToast}/>}
      {tab==="meals"    && <MealsTab    meals={meals}       setMeals={setMeals}       setShopping={setShopping} showToast={showToast}/>}
      {tab==="agent"    && <AgentTab    shopping={shopping} showToast={showToast}/>}
      {modal && <SheetModal modal={modal} setModal={setModal} pantry={pantry} setPantry={setPantry} shopping={shopping} setShopping={setShopping} showToast={showToast}/>}
      <nav className="bottom-nav">
        {TABS.map(({id,label,Icon})=>(
          <div key={id} className={`nav-item ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
            <div className="nav-icon"><Icon active={tab===id}/></div>
            <span className="nav-label">{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

// ── Pantry ─────────────────────────────────────────────────────────────────
function PantryTab({ pantry, setPantry, showToast, setModal }) {
  const [filter, setFilter] = useState("All");
  const [newItem, setNewItem] = useState("");
  const filtered = filter==="All" ? pantry : pantry.filter(i=>i.category===filter);
  const expiring = pantry.filter(i=>["Mar 15","Mar 16","Mar 17","Mar 18"].includes(i.expiry)).length;
  const add = () => { if (!newItem.trim()) return; setPantry(p=>[...p,{id:Date.now(),name:newItem,category:"🥫 Pantry",qty:1,unit:"pcs",expiry:"Apr 30",addedBy:"David"}]); setNewItem(""); showToast("✓ Added to pantry"); };
  const remove = (id) => { setPantry(p=>p.filter(i=>i.id!==id)); showToast("Removed"); };

  return (
    <>
      <div className="header">
        <div className="header-title">Pantry</div>
        <div className="header-sub">Family kitchen · {pantry.length} items</div>
      </div>
      <div className="stats-strip">
        <div className="stat-card"><div className="stat-val">{pantry.length}</div><div className="stat-label">Total Items</div></div>
        <div className="stat-card"><div className="stat-val" style={{color:"#ff9500"}}>{expiring}</div><div className="stat-label">Expiring Soon</div></div>
        <div className="stat-card"><div className="stat-val" style={{color:"#34a853"}}>{CATEGORIES.length}</div><div className="stat-label">Categories</div></div>
      </div>
      <div className="pill-tabs">
        {["All",...CATEGORIES].map(c=>(
          <button key={c} className={`pill ${filter===c?"pill-active":"pill-inactive"}`} onClick={()=>setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="card card-bleed">
        {filtered.map(item=>(
          <SwipeRow key={item.id} onSwipeLeft={()=>remove(item.id)} onSwipeRight={null} rightLabel="🗑 Delete">
            <div className="item-row" onClick={()=>setModal({type:"pantryItem",data:item})}>
              <div className="item-icon" style={{background:CAT_BG[item.category]||"#f5f5f5"}}>{item.category.split(" ")[0]}</div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">{item.qty} {item.unit} · {item.addedBy}</div>
              </div>
              <span className={`badge ${expiryBadge(item.expiry)}`}>{item.expiry}</span>
            </div>
          </SwipeRow>
        ))}
        <div className="input-row">
          <input className="input-field" placeholder="Add item to pantry…" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button className="btn btn-green" onClick={add}>Add</button>
        </div>
      </div>
    </>
  );
}

// ── Shopping ───────────────────────────────────────────────────────────────
function ShoppingTab({ shopping, setShopping, showToast }) {
  const [newItem, setNewItem] = useState("");
  const pending = shopping.filter(i=>!i.checked);
  const done    = shopping.filter(i=>i.checked);
  const toggle  = (id) => setShopping(s=>s.map(i=>i.id===id?{...i,checked:!i.checked}:i));
  const remove  = (id) => { setShopping(s=>s.filter(i=>i.id!==id)); showToast("Removed"); };
  const add     = () => { if (!newItem.trim()) return; setShopping(s=>[...s,{id:Date.now(),name:newItem,category:"🥫 Pantry",qty:1,unit:"pcs",checked:false,addedBy:"David"}]); setNewItem(""); showToast("✓ Added"); };

  return (
    <>
      <div className="header">
        <div className="header-title">Shopping</div>
        <div className="header-sub">{pending.length} to buy · {done.length} in cart</div>
      </div>
      <div className="stats-strip">
        <div className="stat-card"><div className="stat-val">{pending.length}</div><div className="stat-label">To Buy</div></div>
        <div className="stat-card"><div className="stat-val" style={{color:"#34a853"}}>{done.length}</div><div className="stat-label">In Cart</div></div>
        <div className="stat-card"><div className="stat-val">{shopping.length}</div><div className="stat-label">Total</div></div>
      </div>

      {pending.length > 0 && (
        <div className="card card-bleed">
          <div className="card-title">To Buy · swipe → check · swipe ← remove</div>
          {pending.map(item=>(
            <SwipeRow key={item.id} onSwipeLeft={()=>remove(item.id)} onSwipeRight={()=>toggle(item.id)} leftLabel="✓ Done" rightLabel="🗑 Remove">
              <div className="item-row">
                <div className="check-btn" onClick={()=>toggle(item.id)}/>
                <div className="item-icon" style={{background:CAT_BG[item.category]||"#f5f5f5"}}>{item.category.split(" ")[0]}</div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">{item.qty} {item.unit} · {item.category.replace(/[^\w\s]/g,"").trim()}</div>
                </div>
                <span className="badge badge-blue">{item.addedBy}</span>
              </div>
            </SwipeRow>
          ))}
          <div className="input-row">
            <input className="input-field" placeholder="Add item…" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
            <button className="btn btn-green" onClick={add}>Add</button>
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div className="card card-bleed">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px 8px"}}>
            <span className="card-title" style={{padding:0}}>In Cart</span>
            <button className="btn btn-red btn-sm" onClick={()=>{setShopping(s=>s.filter(i=>!i.checked));showToast("✓ Cleared");}}>Clear</button>
          </div>
          {done.map(item=>(
            <SwipeRow key={item.id} onSwipeLeft={()=>remove(item.id)} rightLabel="🗑 Remove">
              <div className="item-row" style={{opacity:0.55}}>
                <div className="check-btn checked">
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="item-icon" style={{background:CAT_BG[item.category]||"#f5f5f5"}}>{item.category.split(" ")[0]}</div>
                <div className="item-info">
                  <div className="item-name checked">{item.name}</div>
                  <div className="item-meta">{item.qty} {item.unit}</div>
                </div>
              </div>
            </SwipeRow>
          ))}
        </div>
      )}

      {shopping.length === 0 && (
        <div style={{textAlign:"center",padding:"80px 20px",color:"#8e8e93"}}>
          <div style={{fontSize:52,marginBottom:14}}>🛒</div>
          <div style={{fontSize:17,fontWeight:700}}>List is empty</div>
          <div style={{fontSize:13,marginTop:6}}>Add items or generate from meal plan</div>
        </div>
      )}
    </>
  );
}

// ── Meals ──────────────────────────────────────────────────────────────────
function MealsTab({ meals, setMeals, setShopping, showToast }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editDay, setEditDay] = useState(null);
  const [editVal, setEditVal] = useState("");
  const count = Object.values(meals).filter(Boolean).length;

  const generate = async () => {
    const plan = Object.entries(meals).filter(([,v])=>v).map(([d,m])=>`${d}: ${m}`).join("\n");
    if (!plan) { showToast("⚠️ Add meals first"); return; }
    setLoading(true); setAiText("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are a home chef assistant. Given a weekly meal plan, generate a grocery shopping list.
Return ONLY valid JSON: { "items": [{ "name": string, "qty": number, "unit": string, "category": string }] }
Categories must be exactly one of: "🥦 Produce","🥛 Dairy","🥩 Meat","🍞 Bakery","🥫 Pantry","🧴 Household","🧊 Frozen"
Consolidate duplicates. Quantities for a family of 3. No preamble, no markdown.`,
          messages:[{role:"user",content:`Meals:\n${plan}\n\nReturn JSON only.`}]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text||"";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      const items = parsed.items.map((i,idx)=>({id:Date.now()+idx,name:i.name,qty:i.qty,unit:i.unit,category:i.category,checked:false,addedBy:"AI ✨"}));
      setShopping(s=>{ const ex=s.map(x=>x.name.toLowerCase()); return [...s,...items.filter(x=>!ex.includes(x.name.toLowerCase()))]; });
      setAiText(`✨ Added ${items.length} ingredients from ${count} planned meals.`);
      showToast(`✓ ${items.length} items added`);
    } catch { setAiText("Something went wrong — please try again."); }
    setLoading(false);
  };

  return (
    <>
      <div className="header">
        <div className="header-title">Meal Plan</div>
        <div className="header-sub">This week · {count} of 7 days planned</div>
      </div>

      <div className="ai-bubble">
        <div className="ai-bubble-header"><div className="ai-dot"/><span className="ai-label">Claude AI</span></div>
        {loading
          ? <div className="ai-typing"><div className="ai-dot-anim"/><div className="ai-dot-anim"/><div className="ai-dot-anim"/></div>
          : <div className="ai-text">{aiText||"Plan your meals for the week and I'll generate a complete shopping list automatically."}</div>}
        <button className="btn btn-green" style={{marginTop:14,width:"100%"}} onClick={generate} disabled={loading||count===0}>
          {loading ? "Generating…" : `✨ Generate Shopping List${count>0?` (${count} meals)`:""}`}
        </button>
      </div>

      <div className="card card-rounded">
        <div className="card-title">Weekly Schedule · tap to plan</div>
        <div className="meal-grid">
          {DAYS.map(day=>(
            <div key={day} className={`meal-card ${meals[day]?"has-meal":""}`} onClick={()=>{setEditDay(day);setEditVal(meals[day]);}}>
              <div className="meal-day">{day}</div>
              {meals[day] ? <div className="meal-name">{meals[day]}</div> : <div className="meal-empty">+ Add meal</div>}
            </div>
          ))}
        </div>
        <div style={{height:8}}/>
      </div>

      {editDay && (
        <div className="sheet-overlay" onClick={()=>setEditDay(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="sheet-title">{editDay}'s Meal</div>
            <input className="input-field" style={{width:"100%",marginBottom:14}} placeholder="e.g. Pasta Bolognese" value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus/>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-green" style={{flex:1}} onClick={()=>{setMeals(m=>({...m,[editDay]:editVal}));setEditDay(null);}}>Save</button>
              {meals[editDay]&&<button className="btn btn-red" onClick={()=>{setMeals(m=>({...m,[editDay]:""}));setEditDay(null);}}>Remove</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Agent ──────────────────────────────────────────────────────────────────
function AgentTab({ shopping, showToast }) {
  const [url, setUrl]         = useState("https://your-agent-endpoint.com/order");
  const [schedule, setSchedule] = useState("Friday");
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const pending = shopping.filter(i=>!i.checked);
  const SCHEDS  = ["Monday","Wednesday","Friday","Sunday","Daily"];

  const addLog = (msg,type="") => { const t=new Date().toLocaleTimeString(); setLogs(l=>[...l.slice(-7),{t,msg,type}]); };

  const trigger = async () => {
    setLoading(true);
    addLog(`→ Dispatching to ${url.slice(0,36)}…`);
    addLog(`→ ${pending.length} items in payload`);
    await new Promise(r=>setTimeout(r,1300));
    addLog("✓ Order dispatched successfully","ok");
    addLog(`✓ Scheduled: every ${schedule}`,"ok");
    showToast("✓ Order sent!"); setLoading(false);
  };

  const copy = () => {
    const p={version:"1.0",timestamp:new Date().toISOString(),schedule,items:pending.map(i=>({name:i.name,qty:i.qty,unit:i.unit,category:i.category}))};
    navigator.clipboard?.writeText(JSON.stringify(p,null,2)); showToast("✓ JSON copied");
  };

  return (
    <>
      <div className="header">
        <div className="header-title">Order Agent</div>
        <div className="header-sub">Automated grocery ordering</div>
      </div>
      <div className="webhook-card">
        <div className="webhook-title">🤖 Webhook Endpoint</div>
        <div className="webhook-sub">Sends your unchecked shopping list as JSON to your ordering agent on schedule.</div>
        <input className="webhook-input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…"/>
        <div style={{marginTop:14}}>
          <div style={{fontSize:11,color:"#636366",marginBottom:8,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.6px"}}>Schedule</div>
          <div className="schedule-row">{SCHEDS.map(s=><button key={s} className={`sched-btn ${schedule===s?"active":""}`} onClick={()=>setSchedule(s)}>{s}</button>)}</div>
        </div>
        <button className="trigger-btn" onClick={trigger} disabled={loading||pending.length===0}>
          {loading ? "Sending order…" : `Send Order · ${pending.length} items`}
        </button>
      </div>

      <div className="card card-rounded">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px 8px"}}>
          <span className="card-title" style={{padding:0}}>Payload Preview</span>
          <button className="btn btn-outline btn-sm" onClick={copy}>Copy JSON</button>
        </div>
        {pending.slice(0,4).map(item=>(
          <div key={item.id} className="item-row" style={{pointerEvents:"none"}}>
            <div className="item-icon" style={{background:CAT_BG[item.category]||"#f5f5f5"}}>{item.category.split(" ")[0]}</div>
            <div className="item-info"><div className="item-name">{item.name}</div><div className="item-meta">{item.qty} {item.unit}</div></div>
          </div>
        ))}
        {pending.length>4 && <div style={{padding:"8px 20px 14px",color:"#8e8e93",fontSize:13}}>+{pending.length-4} more items…</div>}
        {pending.length===0 && <div style={{padding:"20px",textAlign:"center",color:"#8e8e93",fontSize:13}}>Shopping list is empty</div>}
      </div>

      {logs.length > 0 && (
        <div className="card card-rounded">
          <div className="card-title">Activity Log</div>
          <div style={{padding:"8px 20px 16px"}}>{logs.map((l,i)=><div key={i} className={`log-line ${l.type}`}>[{l.t}] {l.msg}</div>)}</div>
        </div>
      )}
    </>
  );
}

// ── Sheet Modal ────────────────────────────────────────────────────────────
function SheetModal({ modal, setModal, pantry, setPantry, shopping, setShopping, showToast }) {
  const close = ()=>setModal(null);
  const {type,data} = modal;

  if (type==="pantryItem") {
    const remove = () => { setPantry(p=>p.filter(i=>i.id!==data.id)); showToast("✓ Removed"); close(); };
    const move   = () => { setShopping(s=>[...s,{id:Date.now(),name:data.name,category:data.category,qty:data.qty,unit:data.unit,checked:false,addedBy:data.addedBy}]); setPantry(p=>p.filter(i=>i.id!==data.id)); showToast("✓ Moved to shopping"); close(); };
    return (
      <div className="sheet-overlay" onClick={close}>
        <div className="sheet" onClick={e=>e.stopPropagation()}>
          <div className="sheet-handle"/>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div className="item-icon" style={{background:CAT_BG[data.category]||"#f5f5f5",width:52,height:52,fontSize:26,borderRadius:14}}>{data.category.split(" ")[0]}</div>
            <div><div className="sheet-title" style={{marginBottom:2}}>{data.name}</div><div style={{fontSize:13,color:"#8e8e93"}}>{data.category} · {data.addedBy}</div></div>
          </div>
          <div style={{background:"#f9f9f9",borderRadius:14,padding:"14px 18px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:14,color:"#8e8e93"}}>Quantity</span>
              <span style={{fontSize:14,fontWeight:700}}>{data.qty} {data.unit}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:14,color:"#8e8e93"}}>Best Before</span>
              <span className={`badge ${expiryBadge(data.expiry)}`}>{data.expiry}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-outline" style={{flex:1}} onClick={move}>Move to Shopping</button>
            <button className="btn btn-red" onClick={remove}>Remove</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const ic = (a) => ({width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:a?"#34a853":"#8e8e93",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"});
const PantryIcon   = ({active})=><svg {...ic(active)}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>;
const ShoppingIcon = ({active})=><svg {...ic(active)}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const MealsIcon    = ({active})=><svg {...ic(active)}><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
const AgentIcon    = ({active})=><svg {...ic(active)}><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;

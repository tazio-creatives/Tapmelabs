"use client";

const S = {
  name: "Alex Morgan", firstName: "Alex", lastName: "Morgan",
  designation: "Product Designer", company: "Stellar Studios",
  phone: "+91 98765 43210", email: "alex@stellar.io", website: "stellar.io",
  city: "Mumbai", bio: "Crafting digital experiences that inspire.",
};

const SOCIALS = ["instagram","linkedin","twitter","whatsapp"];

/* ── icons ── */
function SvgIcon({ d, size = 16, color = "currentColor", fill = "none", strokeWidth = 1.6 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
}
const Phone   = ({ c, s=14 }) => <SvgIcon size={s} color={c} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9Z"/>;
const Mail    = ({ c, s=14 }) => <SvgIcon size={s} color={c} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"/>;
const Globe   = ({ c, s=14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2Z"/></svg>;
const MapPin  = ({ c, s=13 }) => <SvgIcon size={s} color={c} d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/>;
const ChevR   = ({ c="#94a3b8" }) => <SvgIcon size={13} color={c} d="M9 18l6-6-6-6"/>;

function SocialIcon({ platform, size = 28 }) {
  if (platform === "instagram") return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs><radialGradient id={`ig${size}`} cx="30%" cy="107%" r="120%"><stop stopColor="#fdf497"/><stop offset=".05" stopColor="#fdf497"/><stop offset=".45" stopColor="#fd5949"/><stop offset=".6" stopColor="#d6249f"/><stop offset=".9" stopColor="#285AEB"/></radialGradient></defs>
      <rect width="32" height="32" rx="8" fill={`url(#ig${size})`}/>
      <rect x="8" y="8" width="16" height="16" rx="5" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="21.5" cy="10.5" r="1" fill="white"/>
    </svg>
  );
  if (platform === "linkedin") return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill="#0A66C2"/>
      <path d="M8 13h3.5v11H8zm1.75-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM14.5 13H18v1.5s1-1.8 3.5-1.8c3 0 4 2 4 5v5.3H22V18c0-1.7-.5-3-2-3s-2.5 1.3-2.5 3v5H14.5V13z" fill="white"/>
    </svg>
  );
  if (platform === "twitter") return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill="#000"/>
      <path d="M18.2 14.5L24.5 7h-1.5l-5.5 6.2L13 7H7.5l6.6 9.5L7.5 25H9l5.8-6.6 4.7 6.6H25L18.2 14.5zM15.5 17.5l-.7-1L9.2 8.3h2.3l4.2 6 .7 1 5.7 8.1h-2.3l-4.3-6z" fill="white"/>
    </svg>
  );
  if (platform === "whatsapp") return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path fill="white" d="M16 8a8 8 0 0 0-7 11.9l-1 3.6 3.7-1A8 8 0 1 0 16 8zm4.2 10.8c-.2.6-1.2 1.1-1.7 1.1-.4.1-1.8-.2-3.6-2a9 9 0 0 1-2.5-3.7c-.2-.8.2-1.5.6-1.8.2-.2.4-.3.7-.3H14c.2 0 .4.1.5.4l.7 1.8c.1.2 0 .5-.2.6l-.4.5c-.1.1-.1.3 0 .4a7 7 0 0 0 2.9 2.9c.1.1.3 0 .4-.1l.5-.6c.2-.2.4-.3.6-.2l1.8.8c.3.1.4.3.4.5v.2z"/>
    </svg>
  );
  return null;
}

function Avatar({ size = 68, bg = "#1e293b", border, shadow, children }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, border, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
      {children || (
        <svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.7)" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THEME 1 — AURORA
   Cinematic gradient banner · floating centered avatar · pill chips
══════════════════════════════════════════════════════════════════ */
function ThemeAurora() {
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)" }}>
      {/* Banner */}
      <div style={{ height: 150, background: "linear-gradient(135deg,#06b6d4 0%,#3b82f6 35%,#8b5cf6 65%,#ec4899 100%)", position: "relative" }}>
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ position:"absolute", bottom:-10, left:20, width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        {/* Floating avatar */}
        <div style={{ position:"absolute", bottom:-36, left:"50%", transform:"translateX(-50%)" }}>
          <div style={{ padding:3, borderRadius:"50%", background:"#fff", boxShadow:"0 8px 24px rgba(0,0,0,0.18)" }}>
            <Avatar size={72} bg="linear-gradient(135deg,#dbeafe,#ede9fe)"/>
          </div>
        </div>
      </div>

      {/* Name block */}
      <div style={{ textAlign:"center", paddingTop:46, paddingBottom:16, paddingLeft:20, paddingRight:20 }}>
        <p style={{ margin:0, fontWeight:800, fontSize:20, color:"#0f172a", letterSpacing:"-0.02em" }}>{S.name}</p>
        <p style={{ margin:"4px 0 0", fontSize:13, fontWeight:500, color:"#6366f1" }}>{S.designation}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, marginTop:4 }}>
          <MapPin c="#94a3b8" s={12}/>
          <span style={{ fontSize:11, color:"#94a3b8" }}>{S.company} · {S.city}</span>
        </div>
        {/* Bio */}
        <p style={{ margin:"10px auto 0", fontSize:12, color:"#64748b", lineHeight:1.6, maxWidth:220, fontStyle:"italic" }}>"{S.bio}"</p>
      </div>

      {/* Action chips */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"0 16px 16px" }}>
        {[["#0ea5e9","#bae6fd","📞","Call"],["#8b5cf6","#ede9fe","✉","Email"],["#06b6d4","#cffafe","🌐","Web"]].map(([tc,bg,em,lbl]) => (
          <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5, background:bg, padding:"7px 14px", borderRadius:99, cursor:"pointer" }}>
            <span style={{ fontSize:12 }}>{em}</span>
            <span style={{ fontSize:12, fontWeight:600, color:tc }}>{lbl}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height:1, background:"#f1f5f9", margin:"0 16px" }}/>

      {/* Social grid */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:14, padding:"14px 16px" }}>
        {SOCIALS.map(s => <SocialIcon key={s} platform={s} size={30}/>)}
      </div>

      {/* Save button */}
      <div style={{ padding:"4px 16px 18px" }}>
        <div style={{ background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", color:"#fff", textAlign:"center", fontWeight:700, fontSize:14, padding:"13px", borderRadius:14, cursor:"pointer", letterSpacing:"0.01em" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THEME 2 — OBSIDIAN
   Pure black luxury · neon green accent · minimal brutalist
══════════════════════════════════════════════════════════════════ */
function ThemeObsidian() {
  const ac = "#28DC4F";
  return (
    <div style={{ borderRadius:24, overflow:"hidden", background:"#080808", boxShadow:"0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px #1f1f1f" }}>
      {/* Accent strip */}
      <div style={{ height:3, background:`linear-gradient(90deg,${ac},#00ff88,${ac})` }}/>

      {/* Header: name left, avatar right */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"20px 20px 16px" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:ac, boxShadow:`0 0 8px ${ac}` }}/>
            <span style={{ fontSize:10, color:ac, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>Available</span>
          </div>
          <p style={{ margin:0, fontWeight:800, fontSize:21, color:"#f8fafc", letterSpacing:"-0.02em", lineHeight:1.2 }}>{S.firstName}<br/>{S.lastName}</p>
          <p style={{ margin:"6px 0 0", fontSize:12, color:"#64748b", fontWeight:500 }}>{S.designation}</p>
          <p style={{ margin:"3px 0 0", fontSize:11, color:"#374151" }}>{S.company} · {S.city}</p>
        </div>
        <div style={{ position:"relative" }}>
          <Avatar size={64} bg="#111" border={`1.5px solid #1f1f1f`} shadow={`0 0 20px ${ac}44, 0 0 0 1px ${ac}22`}/>
          {/* Corner badge */}
          <div style={{ position:"absolute", bottom:-2, right:-2, width:18, height:18, borderRadius:"50%", background:ac, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #080808" }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ margin:"0 20px 16px", padding:"10px 14px", borderRadius:10, background:"#0f0f0f", border:"1px solid #1a1a1a" }}>
        <p style={{ margin:0, fontSize:12, color:"#6b7280", lineHeight:1.6, fontStyle:"italic" }}>"{S.bio}"</p>
      </div>

      {/* Contact list */}
      <div style={{ padding:"0 20px" }}>
        {[[<Phone c={ac}/>,S.phone],[<Mail c={ac}/>,S.email],[<Globe c={ac}/>,S.website]].map(([icon,val],i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom: i<2 ? "1px solid #111" : "none" }}>
            <div style={{ width:30, height:30, borderRadius:8, background:"#0f0f0f", border:"1px solid #1f1f1f", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
            <span style={{ fontSize:12, color:"#cbd5e1", flex:1 }}>{val}</span>
            <ChevR c="#2d2d2d"/>
          </div>
        ))}
      </div>

      {/* Social */}
      <div style={{ display:"flex", gap:10, padding:"14px 20px", borderTop:"1px solid #111", marginTop:10 }}>
        {SOCIALS.map(s => (
          <div key={s} style={{ width:38, height:38, borderRadius:10, background:"#0f0f0f", border:"1px solid #1f1f1f", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <SocialIcon platform={s} size={22}/>
          </div>
        ))}
      </div>

      {/* Save */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ border:`1.5px solid ${ac}`, color:ac, textAlign:"center", fontWeight:700, fontSize:13, padding:"12px", borderRadius:12, cursor:"pointer", letterSpacing:"0.02em" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THEME 3 — FROSTED
   Light glass morphism · indigo · soft blur layers
══════════════════════════════════════════════════════════════════ */
function ThemeFrosted() {
  const ac = "#6366f1";
  return (
    <div style={{ borderRadius:24, overflow:"hidden", background:"linear-gradient(145deg,#f8faff,#f0f4ff)", boxShadow:"0 20px 60px rgba(99,102,241,0.15), 0 1px 3px rgba(99,102,241,0.1)" }}>
      {/* Pastel header with orbs */}
      <div style={{ height:110, background:"linear-gradient(135deg,#e0e7ff 0%,#ede9fe 50%,#fce7f3 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(99,102,241,0.15)" }}/>
        <div style={{ position:"absolute", bottom:-20, left:30, width:70, height:70, borderRadius:"50%", background:"rgba(236,72,153,0.1)" }}/>
        <div style={{ position:"absolute", top:10, left:"40%", width:40, height:40, borderRadius:"50%", background:"rgba(167,139,250,0.2)" }}/>
      </div>

      {/* Avatar + identity — side by side */}
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px 12px", borderBottom:"1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ position:"relative", marginTop:-28 }}>
          <div style={{ padding:3, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#a78bfa)", boxShadow:"0 6px 20px rgba(99,102,241,0.3)" }}>
            <Avatar size={60} bg="#ede9fe"/>
          </div>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ margin:0, fontWeight:800, fontSize:17, color:"#1e1b4b", letterSpacing:"-0.01em" }}>{S.name}</p>
          <p style={{ margin:"2px 0 0", fontSize:12, color:ac, fontWeight:600 }}>{S.designation}</p>
          <div style={{ display:"flex", gap:5, marginTop:5 }}>
            <span style={{ fontSize:10, color:"#fff", background:ac, padding:"2px 8px", borderRadius:99, fontWeight:600 }}>{S.company}</span>
            <span style={{ fontSize:10, color:ac, background:"#ede9fe", padding:"2px 8px", borderRadius:99, fontWeight:500 }}>{S.city}</span>
          </div>
        </div>
      </div>

      {/* Contact cards */}
      <div style={{ padding:"12px 18px", display:"flex", flexDirection:"column", gap:7 }}>
        {[[<Phone c={ac} s={13}/>,S.phone,"Call"],[<Mail c={ac} s={13}/>,S.email,"Email"],[<Globe c={ac} s={13}/>,S.website,"Website"]].map(([icon,val,lbl],i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:12, background:"rgba(255,255,255,0.7)", border:"1px solid rgba(99,102,241,0.12)", backdropFilter:"blur(8px)" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:10, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{lbl}</p>
              <p style={{ margin:0, fontSize:12, color:"#1e1b4b", fontWeight:500 }}>{val}</p>
            </div>
            <ChevR c="#c7d2fe"/>
          </div>
        ))}
      </div>

      {/* Social frosted row */}
      <div style={{ margin:"0 18px", padding:"10px 14px", borderRadius:14, background:"rgba(255,255,255,0.6)", border:"1px solid rgba(99,102,241,0.12)", backdropFilter:"blur(8px)", display:"flex", justifyContent:"center", gap:14 }}>
        {SOCIALS.map(s => <SocialIcon key={s} platform={s} size={28}/>)}
      </div>

      {/* Save */}
      <div style={{ padding:"12px 18px 18px" }}>
        <div style={{ background:"linear-gradient(90deg,#6366f1,#a78bfa)", color:"#fff", textAlign:"center", fontWeight:700, fontSize:13, padding:"13px", borderRadius:13, cursor:"pointer", boxShadow:"0 6px 18px rgba(99,102,241,0.35)" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THEME 4 — NEON EDGE
   Dark mesh grid · conic avatar glow ring · 2-col social cards
══════════════════════════════════════════════════════════════════ */
function ThemeNeonEdge() {
  const ac = "#00ff88";
  const ac2 = "#00aaff";
  return (
    <div style={{ borderRadius:24, overflow:"hidden", background:"#0a0a14", boxShadow:`0 20px 60px rgba(0,255,136,0.12), 0 0 0 1px rgba(0,255,136,0.08)` }}>
      {/* Mesh header */}
      <div style={{ height:120, position:"relative", background:"#0a0a14", overflow:"hidden" }}>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
          {Array.from({length:12},(_, i)=><line key={`v${i}`} x1={i*30} y1="0" x2={i*30} y2="120" stroke={ac} strokeWidth="0.4" opacity="0.15"/>)}
          {Array.from({length:7},(_, i)=><line key={`h${i}`} x1="0" y1={i*20} x2="340" y2={i*20} stroke={ac} strokeWidth="0.4" opacity="0.15"/>)}
        </svg>
        {/* Glow blobs */}
        <div style={{ position:"absolute", top:-40, left:"20%", width:130, height:130, borderRadius:"50%", background:`radial-gradient(circle,${ac}18,transparent 65%)` }}/>
        <div style={{ position:"absolute", top:-30, right:"15%", width:100, height:100, borderRadius:"50%", background:`radial-gradient(circle,${ac2}14,transparent 60%)` }}/>
        {/* Avatar with conic glow ring */}
        <div style={{ position:"absolute", bottom:-34, left:"50%", transform:"translateX(-50%)" }}>
          <div style={{ padding:3, borderRadius:"50%", background:`conic-gradient(${ac},${ac2},${ac})`, boxShadow:`0 0 0 4px #0a0a14, 0 0 28px ${ac}66` }}>
            <Avatar size={66} bg="#0f0f20"/>
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign:"center", paddingTop:44, paddingBottom:14, paddingLeft:18, paddingRight:18 }}>
        <p style={{ margin:0, fontWeight:800, fontSize:20, color:"#f0fdf4", letterSpacing:"-0.02em" }}>{S.name}</p>
        <p style={{ margin:"4px 0 0", fontSize:12, fontWeight:600, background:`linear-gradient(90deg,${ac},${ac2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{S.designation}</p>
        <p style={{ margin:"3px 0 0", fontSize:11, color:"#334155" }}>{S.company} · {S.city}</p>
      </div>

      {/* Action row */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, padding:"0 16px 14px" }}>
        {[["📞","Call",ac],["✉","Email",ac2],["🌐","Web","#a78bfa"]].map(([em,lbl,c]) => (
          <div key={lbl} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"10px 16px", borderRadius:14, border:`1px solid ${c}33`, background:`${c}0d`, cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>{em}</span>
            <span style={{ fontSize:10, color:c, fontWeight:700, letterSpacing:"0.05em" }}>{lbl}</span>
          </div>
        ))}
      </div>

      {/* Social 2-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:"0 16px 16px" }}>
        {SOCIALS.map(s => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, border:`1px solid rgba(0,255,136,0.1)`, background:"#0f0f20", cursor:"pointer" }}>
            <SocialIcon platform={s} size={24}/>
            <div>
              <p style={{ margin:0, fontSize:12, color:"#e2e8f0", fontWeight:600, textTransform:"capitalize" }}>{s}</p>
              <p style={{ margin:0, fontSize:10, color:"#334155" }}>@{S.firstName.toLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div style={{ padding:"0 16px 18px" }}>
        <div style={{ background:`linear-gradient(90deg,${ac},${ac2})`, color:"#000", textAlign:"center", fontWeight:800, fontSize:13, padding:"13px", borderRadius:13, cursor:"pointer", letterSpacing:"0.02em" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THEME 5 — EMBER
   Warm dark slate · amber-to-red gradient · tag badge chips
══════════════════════════════════════════════════════════════════ */
function ThemeEmber() {
  const ac = "#f59e0b";
  const ac2 = "#ef4444";
  return (
    <div style={{ borderRadius:24, overflow:"hidden", background:"#161b22", boxShadow:"0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px #21262d" }}>
      {/* Gradient strip + header */}
      <div style={{ position:"relative" }}>
        <div style={{ height:5, background:`linear-gradient(90deg,${ac},${ac2})` }}/>
        <div style={{ height:100, background:"linear-gradient(135deg,#1f2937 0%,#111827 100%)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-10, width:90, height:90, borderRadius:"50%", background:`radial-gradient(circle,${ac}18,transparent 65%)` }}/>
          <div style={{ position:"absolute", bottom:-15, left:20, width:60, height:60, borderRadius:"50%", background:`radial-gradient(circle,${ac2}12,transparent 60%)` }}/>
        </div>
        {/* Avatar overlapping */}
        <div style={{ position:"absolute", bottom:-28, left:20 }}>
          <div style={{ padding:3, borderRadius:"50%", background:`linear-gradient(135deg,${ac},${ac2})`, boxShadow:`0 4px 18px ${ac}55` }}>
            <Avatar size={56} bg="#1f2937"/>
          </div>
        </div>
      </div>

      {/* Name row */}
      <div style={{ paddingTop:36, paddingLeft:20, paddingRight:20, paddingBottom:12, borderBottom:"1px solid #21262d" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ margin:0, fontWeight:800, fontSize:19, color:"#f1f5f9", letterSpacing:"-0.015em" }}>{S.name}</p>
            <p style={{ margin:"3px 0 0", fontSize:12, color:ac, fontWeight:600 }}>{S.designation}</p>
            <p style={{ margin:"3px 0 0", fontSize:11, color:"#4b5563" }}>{S.company}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
            <span style={{ fontSize:10, color:ac, background:`${ac}15`, border:`1px solid ${ac}33`, padding:"3px 8px", borderRadius:99, fontWeight:600 }}>{S.city}</span>
            <span style={{ fontSize:10, color:"#6b7280", background:"#0d1117", border:"1px solid #21262d", padding:"3px 8px", borderRadius:99 }}>Open to connect</span>
          </div>
        </div>
      </div>

      {/* Contact list */}
      <div style={{ padding:"10px 20px" }}>
        {[[<Phone c={ac}/>,S.phone],[<Mail c={ac}/>,S.email],[<Globe c={ac}/>,S.website]].map(([icon,val],i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom: i<2 ? "1px solid #21262d" : "none" }}>
            <div style={{ width:30, height:30, borderRadius:9, background:"#0d1117", border:"1px solid #21262d", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
            <span style={{ fontSize:12, color:"#d1d5db", flex:1 }}>{val}</span>
            <ChevR c="#374151"/>
          </div>
        ))}
      </div>

      {/* Social row */}
      <div style={{ display:"flex", gap:8, padding:"10px 20px", borderTop:"1px solid #21262d" }}>
        {SOCIALS.map(s => (
          <div key={s} style={{ width:36, height:36, borderRadius:10, background:"#0d1117", border:"1px solid #21262d", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <SocialIcon platform={s} size={21}/>
          </div>
        ))}
      </div>

      {/* Save */}
      <div style={{ padding:"4px 20px 20px" }}>
        <div style={{ background:`linear-gradient(90deg,${ac},${ac2})`, color:"#000", textAlign:"center", fontWeight:800, fontSize:13, padding:"13px", borderRadius:13, cursor:"pointer", boxShadow:`0 6px 20px ${ac}44` }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

const THEMES = [
  { key:"aurora",    label:"Aurora",    sub:"Gradient banner · Floating avatar · Pill chips", dark:false, node:<ThemeAurora/>   },
  { key:"obsidian",  label:"Obsidian",  sub:"Pure black luxury · Neon green · Verified badge", dark:true,  node:<ThemeObsidian/> },
  { key:"frosted",   label:"Frosted",   sub:"Glass morphism · Indigo · Soft blur layers",      dark:false, node:<ThemeFrosted/>  },
  { key:"neon-edge", label:"Neon Edge", sub:"Mesh grid · Conic glow ring · 2-col socials",     dark:true,  node:<ThemeNeonEdge/> },
  { key:"ember",     label:"Ember",     sub:"Warm dark slate · Amber-red gradient · Badges",   dark:true,  node:<ThemeEmber/>    },
];

export default function ThemePreviewPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#060912", padding:"40px 24px 60px", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ maxWidth:1260, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0f172a", border:"1px solid #1e293b", borderRadius:99, padding:"6px 16px", marginBottom:16 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#28DC4F", boxShadow:"0 0 8px #28DC4F" }}/>
            <span style={{ fontSize:11, color:"#64748b", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Theme Preview</span>
          </div>
          <p style={{ margin:0, fontSize:30, fontWeight:900, color:"#f8fafc", letterSpacing:"-0.03em" }}>5 New Profile Themes</p>
          <p style={{ margin:"8px 0 0", fontSize:14, color:"#475569" }}>Pick any design to build into the real theme system</p>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:32 }}>
          {THEMES.map(({ key, label, sub, dark, node }) => (
            <div key={key}>
              {/* Label */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:28, height:28, borderRadius:8, background: dark ? "#0f172a" : "#f1f5f9", border: dark ? "1px solid #1e293b" : "1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:"linear-gradient(135deg,#28DC4F,#3b82f6)" }}/>
                </div>
                <div>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:"#f1f5f9" }}>{label}</p>
                  <p style={{ margin:0, fontSize:11, color:"#475569" }}>{sub}</p>
                </div>
              </div>
              {node}
            </div>
          ))}
        </div>

        <p style={{ textAlign:"center", marginTop:48, fontSize:11, color:"#1e293b" }}>
          Temporary — delete <code style={{ color:"#334155" }}>src/app/theme-preview/page.js</code> after approval
        </p>
      </div>
    </div>
  );
}

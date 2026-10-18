import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Download, Gamepad2, Home, Printer, RotateCcw, Star, Trophy } from "lucide-react";
import "../kpop.css";

type Activity={id:number;title:string;subject:string;emoji:string;avatar:string;bg:string;question:string;visual:string;answers:string[];correct:number;hint:string};
const activities:Activity[]=[
{id:1,title:"Conte as estrelas",subject:"Matemática",emoji:"⭐",avatar:"👩🏻‍🎤",bg:"#fff1ca",question:"Quantas estrelas estão no palco?",visual:"⭐ ⭐ ⭐ ⭐ ⭐",answers:["3","4","5"],correct:2,hint:"Aponte e conte uma estrela de cada vez."},
{id:2,title:"Primeira letra",subject:"Letras",emoji:"🔤",avatar:"👩🏽‍🎤",bg:"#f6e3ff",question:"Qual é a primeira letra de MÚSICA?",visual:"🎶 MÚSICA 🎶",answers:["A","M","S"],correct:1,hint:"Diga Mmmmúsica devagar."},
{id:3,title:"Luzes do show",subject:"Cores",emoji:"🎨",avatar:"👩🏼‍🎤",bg:"#ffe6f0",question:"Qual dessas cores é ROSA?",visual:"🩷 💙 💛",answers:["💙","🩷","💛"],correct:1,hint:"Rosa é a cor do coração do começo."},
{id:4,title:"Qual vem depois?",subject:"Lógica",emoji:"🧩",avatar:"👩🏻‍🎤",bg:"#e8f7ff",question:"Complete a sequência!",visual:"⭐ 🎵 ⭐ 🎵 ❓",answers:["⭐","🎵","🌙"],correct:0,hint:"Depois da nota musical aparece a estrela."},
{id:5,title:"Números em ordem",subject:"Matemática",emoji:"🔢",avatar:"👩🏼‍🎤",bg:"#fef0d8",question:"Qual número está faltando?",visual:"1 · 2 · ❓ · 4 · 5",answers:["5","3","6"],correct:1,hint:"Conte do um até o cinco."},
{id:6,title:"A letra A",subject:"Letras",emoji:"🅰️",avatar:"👩🏽‍🎤",bg:"#f0e9ff",question:"Onde está a letra A?",visual:"A  🎤  B  🎸  C",answers:["B","C","A"],correct:2,hint:"É a primeira letra do alfabeto."},
{id:7,title:"Formas do palco",subject:"Formas",emoji:"🔺",avatar:"👩🏻‍🎤",bg:"#fce9f4",question:"Qual figura tem três pontas?",visual:"🔵  🔺  🟪",answers:["Círculo","Triângulo","Quadrado"],correct:1,hint:"Conte as três pontinhas."},
{id:8,title:"Mais instrumentos",subject:"Matemática",emoji:"🥁",avatar:"👩🏼‍🎤",bg:"#e5f8ee",question:"Qual grupo tem MAIS instrumentos?",visual:"🎸 🎸     🥁 🥁 🥁",answers:["Violões","Tambores","Iguais"],correct:1,hint:"Conte dois violões e três tambores."},
{id:9,title:"A sombra certa",subject:"Atenção",emoji:"🔎",avatar:"👩🏽‍🎤",bg:"#fff2d9",question:"Qual desenho combina com 🎤?",visual:"🎤",answers:["🎸","🎤","🎧"],correct:1,hint:"Procure outro microfone igual."},
{id:10,title:"Sons e sílabas",subject:"Letras",emoji:"🎵",avatar:"👩🏻‍🎤",bg:"#f1eaff",question:"Qual destas palavras começa com MA?",visual:"MA 🎼",answers:["MALA","BOLA","PATO"],correct:0,hint:"MA como em MALA."},
{id:11,title:"Contando corações",subject:"Matemática",emoji:"💗",avatar:"👩🏼‍🎤",bg:"#ffe7f0",question:"Quanto é 2 corações mais 1 coração?",visual:"💗 💗 + 💗 = ❓",answers:["2","3","4"],correct:1,hint:"Conte todos os corações juntos."},
{id:12,title:"Grande final",subject:"Lógica",emoji:"🏆",avatar:"👩🏽‍🎤",bg:"#eee8ff",question:"O que usamos para ouvir música?",visual:"🎶 🎶 🎶",answers:["🎧","🧸","🪥"],correct:0,hint:"É algo que colocamos nas orelhas."}
];
const printables=[
{title:"Meu primeiro alfabeto",emoji:"🔤",kind:"letras",description:"Trace letras grandes e descubra palavras musicais."},
{title:"Contando estrelinhas",emoji:"⭐",kind:"numeros",description:"Conte, trace e associe quantidades até cinco."},
{title:"Cores e formas",emoji:"🎨",kind:"cores",description:"Pinte e reconheça formas divertidas."},
{title:"Caminho até o show",emoji:"🎤",kind:"caminhos",description:"Treine os movimentos das mãos seguindo os caminhos."}
];
type Tab="inicio"|"jogos"|"pdfs"|"premios";
function App(){
 const [tab,setTab]=useState<Tab>("inicio");
 const [active,setActive]=useState<number|null>(null);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [done,setDone]=useState<number[]>([]);
 const [childName,setChildName]=useState("");
 const [printKind,setPrintKind]=useState<string|null>(null);
 useEffect(()=>{try{const saved=window.localStorage.getItem("missao-kpop-progress-v1");if(saved){const p=JSON.parse(saved);setDone(Array.isArray(p.done)?p.done.filter((v:unknown)=>typeof v==="number"):[]);setChildName(typeof p.childName==="string"?p.childName:"");}}catch{/* browser without storage */}},[]);
 useEffect(()=>{try{window.localStorage.setItem("missao-kpop-progress-v1",JSON.stringify({done,childName}));}catch{/* optional storage */}},[done,childName]);
 const completed=done.length;
 const selected=activities.find(a=>a.id===active);
 const answer=selected?answers[selected.id]:undefined;
 const right=!!selected&&answer===selected.correct;
 const navigate=(where:Tab)=>{setTab(where);setActive(null);setPrintKind(null);window.scrollTo({top:0,behavior:"smooth"});};
 const openActivity=(id:number)=>{setActive(id);setTab("jogos");setAnswers(p=>{const n={...p};delete n[id];return n;});window.scrollTo({top:0,behavior:"smooth"});};
 const pick=(a:Activity,i:number)=>{setAnswers(p=>({...p,[a.id]:i}));if(i===a.correct)setDone(p=>p.includes(a.id)?p:[...p,a.id]);};
 const next=()=>{if(!selected)return;const idx=activities.findIndex(a=>a.id===selected.id);if(idx<activities.length-1)openActivity(activities[idx+1].id);else navigate("premios");};
 const print=(kind:string)=>{setPrintKind(kind);setTab("pdfs");setTimeout(()=>window.print(),100);};
 return <div className="kpop-app"><main className="kpop-shell">
 <header className="kpop-top"><div className="kpop-logo">✦ MISSÃO K-POP <small>KIDS · APRENDA BRINCANDO</small></div><div className="kpop-pill"><Star size={19} fill="#ffc75b" color="#eca846"/>{completed} / 12</div></header>
 {active!==null && selected ? <section className="kpop-game">
  <button className="kpop-back" onClick={()=>navigate("jogos")}><ArrowLeft size={16} style={{display:"inline",verticalAlign:"middle"}}/> Todas as missões</button>
  <div className="kpop-game-card">
   <div style={{display:"flex",justifyContent:"space-between",gap:10,fontWeight:900,fontSize:13,color:"#a77eb4"}}><span>MISSÃO {selected.id} DE 12</span><span>{selected.subject.toUpperCase()}</span></div>
   <div className="kpop-progress" style={{marginTop:12}}><div style={{width:`${completed/12*100}%`}}/></div>
   <div className="kpop-game-header"><div className="avatar">{selected.avatar}</div><div><h2>{selected.title}</h2><p>Vamos aprender juntos? ✨</p></div></div>
   <p className="kpop-task">{selected.question}</p>
   <div className="kpop-stage">{selected.visual}</div>
   <div className="kpop-option-grid">{selected.answers.map((value,i)=><button key={i} className={`kpop-option ${answer===i?(right?"good":"bad"):""}`} onClick={()=>pick(selected,i)} aria-label={`Responder ${value}`}>{value}</button>)}</div>
   {answer!==undefined&&<div role="status" className={`kpop-feedback ${right?"good":"bad"}`}>{right?"🌟 Muito bem! Você ganhou uma estrela!":"💡 Quase! "+selected.hint}</div>}
   <div className="kpop-actions"><button className="kpop-btn secondary" onClick={()=>setAnswers(p=>{const n={...p};delete n[selected.id];return n;})}><RotateCcw size={17}/> Tentar de novo</button><button className="kpop-btn" disabled={!right} onClick={next}>{selected.id===12?"Ver conquistas":"Próxima missão"} →</button></div>
  </div></section> : <>
 {tab==="inicio"&&<>
  <section className="kpop-hero"><div><span className="kpop-eyebrow">🎉 BEM-VINDO AO UNIVERSO POP!</span><h1>Pequenas estrelas,<br/>grandes descobertas! ✨</h1><p>Aprenda letras, números, cores e muito mais com missões cheias de música e diversão!</p><button className="kpop-btn" onClick={()=>navigate("jogos")}><Gamepad2 size={20}/> Começar a brincar →</button></div><div className="kpop-mascots" aria-label="Luna, Mia e Zoe, as estrelas do nosso universo"><div className="kpop-mascot">👩🏻‍🎤</div><div className="kpop-mascot">👩🏽‍🎤</div><div className="kpop-mascot">👩🏼‍🎤</div></div></section>
  <div className="kpop-heading"><div><h2>Seu progresso 🌈</h2><p>Cada missão concluída vale uma estrelinha!</p></div><strong>{Math.round(completed/12*100)}%</strong></div><div className="kpop-progress"><div style={{width:`${completed/12*100}%`}}/></div>
  <div className="kpop-heading"><div><h2>Escolha sua aventura</h2><p>Toque para começar a aprender</p></div></div>
  <div className="kpop-grid"><button className="kpop-card" onClick={()=>navigate("jogos")}><div className="picture" style={{background:"#f2e0ff"}}>🎮</div><strong>Jogos educativos</strong><p>12 missões de letras, números, cores e lógica</p><span className="tag">JOGAR AGORA →</span></button><button className="kpop-card" onClick={()=>navigate("pdfs")}><div className="picture" style={{background:"#ffe4f2"}}>🖍️</div><strong>Atividades para imprimir</strong><p>4 cadernos iniciais para brincar fora da tela</p><span className="tag">VER CADERNOS →</span></button><button className="kpop-card" onClick={()=>navigate("premios")}><div className="picture" style={{background:"#fff1cd"}}>🏆</div><strong>Minhas conquistas</strong><p>Seu progresso, estrelas e certificado</p><span className="tag">MINHAS ESTRELAS →</span></button></div>
 </>}
 {tab==="jogos"&&<><div className="kpop-heading"><div><h2>🎮 Minhas missões</h2><p>Escolha qualquer desafio. Você pode jogar quantas vezes quiser!</p></div></div><div className="kpop-grid">{activities.map(a=><button key={a.id} className="kpop-card" onClick={()=>openActivity(a.id)}><div className="picture" style={{background:a.bg}}>{a.emoji}</div><span className="tag">MISSÃO {a.id} · {a.subject.toUpperCase()}</span><strong>{a.title}</strong><p>{done.includes(a.id)?"✅ Estrela conquistada!":"Toque para começar"}</p></button>)}</div></>}
 {tab==="pdfs"&&<><div className="kpop-heading"><div><h2>🖍️ Biblioteca para imprimir</h2><p>Atividades complementares para fazer com lápis e papel, acompanhadas por um adulto.</p></div></div><div className="kpop-library">{printables.map(s=><article key={s.kind} className="kpop-sheet"><div className="emoji">{s.emoji}</div><h3>{s.title}</h3><p>{s.description}</p><button className="kpop-btn secondary" onClick={()=>print(s.kind)}><Printer size={18}/> Imprimir ou salvar PDF</button></article>)}</div><p className="kpop-note" style={{marginTop:20}}>Ao clicar, o navegador abre a impressão. Escolha “Salvar como PDF” para guardar o arquivo. As folhas são demonstrativas e serão ampliadas na próxima versão.</p></>}
 {tab==="premios"&&<><div className="kpop-heading"><div><h2>🏆 Minhas conquistas</h2><p>Um motivo especial para celebrar cada pequena descoberta.</p></div></div><div className="kpop-panel"><div style={{textAlign:"center",fontSize:55}}>🌟</div><h2 style={{textAlign:"center",fontSize:30,margin:8}}>{completed} de 12 estrelas conquistadas!</h2><div className="kpop-progress"><div style={{width:`${completed/12*100}%`}}/></div><p style={{textAlign:"center",color:"#957e9f"}}>{completed===12?"Parabéns! Todas as missões foram concluídas.":"Continue jogando para completar sua coleção de estrelas."}</p><div className="kpop-certificate"><div style={{fontSize:55}}>🏅</div><h2>Certificado de Superestrela</h2><p>Parabéns por completar as missões educativas!</p><input aria-label="Nome para o certificado" placeholder="Nome da criança (opcional)" value={childName} onChange={e=>setChildName(e.target.value)} className="kpop-input" maxLength={60}/><h3 style={{fontSize:26,color:"#9d5ab4"}}>{childName.trim()||"Nossa superestrela"}</h3><button className="kpop-btn" disabled={completed<12} onClick={()=>print("certificado")}><Download size={18}/> Imprimir certificado</button>{completed<12&&<p className="kpop-note">O certificado será liberado ao concluir as 12 missões.</p>}</div></div></>}
 </>}
 <nav className="kpop-tabs" aria-label="Navegação do aplicativo">{([{id:"inicio",label:"Início",icon:Home},{id:"jogos",label:"Jogos",icon:Gamepad2},{id:"pdfs",label:"Atividades",icon:BookOpen},{id:"premios",label:"Prêmios",icon:Trophy}] as const).map(t=><button className={`kpop-tab ${tab===t.id?"active":""}`} key={t.id} onClick={()=>navigate(t.id)}><t.icon size={20} style={{display:"block",margin:"0 auto 3px"}}/>{t.label}</button>)}</nav>
 <div className="print-area" style={{display:"none"}}>{printKind&&<div className="print-sheet"><h1>✦ MISSÃO K-POP KIDS</h1><p>Nome: _________________________ Data: ____/____/______</p>{printKind==="certificado"?<><h1>🏆 Certificado de Superestrela</h1><h2>{childName.trim()||"Nossa superestrela"}</h2><p>Concluiu as 12 missões educativas com dedicação e criatividade. Parabéns!</p></>:<><h2>{printables.find(s=>s.kind===printKind)?.title}</h2><p>Com ajuda de um adulto, complete as atividades:</p>{printKind==="numeros"?<><div className="print-large">⭐ ⭐ ⭐</div><p>Quantas estrelas? Circule: 1  2  3  4  5</p><div className="print-large">🎵 🎵</div><p>Quantas notas? Circule: 1  2  3  4  5</p></>:printKind==="letras"?<><p>Trace as letras e fale o som de cada uma.</p><div className="print-large">A  A  A  A</div><div className="print-large">M  M  M  M</div><div className="print-large">P  P  P  P</div></>:printKind==="cores"?<><p>Desenhe um círculo, um quadrado e um triângulo. Pinte cada um com uma cor diferente.</p><div className="print-large">◯　□　△</div><div className="print-line"/><div className="print-line"/></>:<><p>Trace o caminho entre o microfone e a nota musical.</p><div className="print-large">🎤 · · · · · · · 🎵</div><div className="print-large">🎸 ~ ~ ~ ~ ~ ~ ~ ⭐</div></>}</>}</div>}</div>
 </main></div>
}
export const Route=createFileRoute("/")({component:App});

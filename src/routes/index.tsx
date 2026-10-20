import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronDown, Gift, Heart, LockKeyhole, Palette, Printer, Scissors, Sparkles, Star, Trophy, X } from "lucide-react";
import "../kpop.css";

const MONTHS_PT = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];
const COUNTDOWN_KEY = "lp-countdown-ends";
const COUNTDOWN_MS = 15 * 60 * 1000;

function todayLabel(){
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS_PT[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}
function readEndsAt(){
  try{
    const stored = localStorage.getItem(COUNTDOWN_KEY);
    const value = stored ? Number(stored) : 0;
    if(Number.isFinite(value) && value > Date.now()) return value;
  }catch{ /* storage indisponível */ }
  const endsAt = Date.now() + COUNTDOWN_MS;
  try{ localStorage.setItem(COUNTDOWN_KEY, String(endsAt)); }catch{ /* ignore */ }
  return endsAt;
}
function CountdownBar(){
  const [remaining,setRemaining] = useState<number|null>(null);
  useEffect(()=>{
    setRemaining(Math.max(0, readEndsAt() - Date.now()));
    const timer = window.setInterval(()=>{
      let endsAt = readEndsAt();
      if(endsAt - Date.now() <= 0){ // reinicia o ciclo de 15 minutos
        endsAt = Date.now() + COUNTDOWN_MS;
        try{ localStorage.setItem(COUNTDOWN_KEY, String(endsAt)); }catch{ /* ignore */ }
      }
      setRemaining(Math.max(0, endsAt - Date.now()));
    },1000);
    return ()=>window.clearInterval(timer);
  },[]);
  const minutes = remaining===null?15:Math.floor(remaining/60000);
  const seconds = remaining===null?0:Math.floor((remaining%60000)/1000);
  const clock = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  return <div className="lp-urgency" role="status" aria-label={`Oferta válida só hoje, ${todayLabel()}. Termina em ${clock}`}>
    <span className="lp-urgency-msg">⚡ OFERTA VÁLIDA SÓ HOJE — {todayLabel()} ⚡</span>
    <span className="lp-urgency-timer"><Timer size={15}/> TERMINA EM <strong>{clock}</strong></span>
  </div>;
}

const bonus = [
 {name:"Caderno de Colorir",sub:"20 páginas para colorir e soltar a imaginação.",value:"R$ 19,90",emoji:"🎨",className:"color"},
 {name:"Recorte e Monte",sub:"10 atividades para desenvolver a coordenação motora.",value:"R$ 17,90",emoji:"✂️",className:"craft"},
 {name:"Jogos e Desafios",sub:"10 atividades divertidas com labirintos, caça-palavras e desafios.",value:"R$ 14,90",emoji:"🧩",className:"star"}
];
const faqs=[
 ["O material é físico ou digital?","É um material digital em PDF no formato A4. Você pode baixar e imprimir as páginas."],
 ["Para qual idade é indicado?","As atividades foram pensadas para crianças de 4 a 6 anos, com acompanhamento de um adulto."],
 ["Qual a diferença entre os planos?","O Básico inclui o livro principal com 50 atividades. O Completo inclui o mesmo livro e mais os três bônus especiais: Colorir, Recorte e Monte, Jogos e Desafios."],
 ["Preciso imprimir tudo de uma vez?","Não! Você pode escolher as páginas e imprimir conforme quiser."],
 ["Quando recebo o material?","O acesso digital será enviado conforme as instruções da plataforma de pagamento após a confirmação da compra."]
];
function Illustration({type="main",small=false}:{type?:string;small?:boolean}){
 const [imageFailed,setImageFailed]=useState(false);
 const sources:Record<string,string>={main:"/mk.webp",color:"/n1.webp",craft:"/n2.webp",star:"/n3.webp"};
 if(sources[type]&&!imageFailed){
  return <div className={`lp-asset-wrap ${small?"lp-asset-small":""} ${type==="main"?"lp-asset-main":""}`}>
   <img src={sources[type]} alt={type==="main"?"Professora apresentando o material Missão HUNTRIX Kids e seus três bônus":type==="color"?"Bônus 1: Caderno de Colorir":type==="craft"?"Bônus 2: Recorte e Monte":"Bônus 3: Jogos e Desafios"} loading={type==="main"?"eager":"lazy"} onError={()=>setImageFailed(true)}/>
  </div>;
 }
 const map:Record<string,{emoji:string;heading:string;detail:string}> = {
 main:{emoji:"🎤",heading:"MISSÃO HUNTRIX",detail:"KIDS • 50 ATIVIDADES"},
 color:{emoji:"🖍️",heading:"COLORIR",detail:"20 PÁGINAS"},
 craft:{emoji:"✂️",heading:"RECORTE E MONTE",detail:"10 ATIVIDADES"},
 star:{emoji:"🌟",heading:"SUPER ESTRELA",detail:"CONQUISTAS"},
 maze:{emoji:"🧩",heading:"LABIRINTOS",detail:"DESAFIOS DIVERTIDOS"},
 numbers:{emoji:"🔢",heading:"NÚMEROS",detail:"APRENDER BRINCANDO"},
 letters:{emoji:"🔤",heading:"LETRAS",detail:"PRIMEIRAS DESCOBERTAS"}
 };
 const item=map[type]||map.main;
 return <div className={`lp-book lp-book-${type} ${small?"lp-book-small":""}`} aria-label={`Ilustração provisória: ${item.heading}`}>
  <div className="lp-book-top">✦ ♪ ✦</div><div className="lp-book-emoji">{item.emoji}</div><span className="lp-book-title">{item.heading}</span><span className="lp-book-detail">{item.detail}</span><div className="lp-book-girls"><span>👩🏻‍🎤</span><span>👩🏽‍🎤</span><span>👩🏼‍🎤</span></div><div className="lp-book-bottom">✦ UM MUNDO DE DESCOBERTAS ✦</div>
 </div>;
}
const showcaseImages=[...Array.from({length:9},(_,i)=>`/E${i+1}.WEBP`),"/E10.png","/E11.png"];
function MaterialCarousel(){
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const [missing,setMissing]=useState<Record<number,boolean>>({});
 useEffect(()=>{if(paused)return;const timer=window.setInterval(()=>setActive(v=>(v+1)%showcaseImages.length),500);return ()=>window.clearInterval(timer)},[paused]);
 return <div className="lp-carousel" aria-label="Prévia das atividades do material" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={()=>setPaused(false)}>
 <div className="lp-carousel-track">
 {showcaseImages.map((src,i)=>{
  const raw=(i-active+showcaseImages.length)%showcaseImages.length;
  const offset=raw===0?0:raw<=5?raw:raw-showcaseImages.length;
  return <button type="button" key={src} className={`lp-slide ${offset===0?"is-center":Math.abs(offset)===1?"is-neighbor":"is-hidden"}`} style={{"--offset":offset} as React.CSSProperties} onClick={()=>setActive(i)} aria-label={`Ver atividade ${i+1} de 11`} aria-current={offset===0?"true":undefined} tabIndex={Math.abs(offset)>1?-1:0}>
   {missing[i]?<div className="lp-slide-fallback"><span>Atividade {i+1}</span><small>Imagem {src.slice(1)}</small></div>:<img src={src} alt={`Prévia da atividade ${i+1} do material Missão HUNTRIX Kids`} loading={Math.abs(offset)>2?"lazy":"eager"} onError={()=>setMissing(m=>({...m,[i]:true}))}/>}
  </button>;
 })}
 </div>
 <div className="lp-carousel-dots" aria-label="Selecionar imagem">{showcaseImages.map((_,i)=><button type="button" key={i} aria-label={`Ir para a imagem ${i+1}`} aria-current={active===i?"true":undefined} className={active===i?"on":""} onClick={()=>setActive(i)}/>)}</div>
 </div>;
}
function App(){
 const [faq,setFaq]=useState<number|null>(0);
 const [notice,setNotice]=useState(false);
 const buy=(plan:"basic"|"complete")=>{
  const url=plan==="basic"?import.meta.env.VITE_CHECKOUT_BASICO:import.meta.env.VITE_CHECKOUT_COMPLETO;
  if(typeof url==="string" && /^https:\/\//.test(url)){window.location.href=url;return;}
  setNotice(true);
 };
 const scrollPrices=()=>document.getElementById("planos")?.scrollIntoView({behavior:"smooth"});
 return <div className="lp">
  
  
  <main>
  <section id="inicio" className="lp-hero"><div className="lp-container lp-hero-grid"><div className="lp-hero-copy">
    <span className="lp-kicker">MATERIAL EDUCATIVO DIGITAL • 4 A 6 ANOS</span>
    <h1>Transforme o interesse pelo HUNTRIX em <em>aprendizado e diversão.</em></h1>
    <div className="lp-hero-art"><Illustration/></div>
    <p>50 atividades educativas para desenvolver atenção, criatividade, letras e números. Ideal para usar em casa ou complementar atividades na escola.</p>
    <div className="lp-hero-points"><span><Check size={16}/> Arquivo PDF A4</span><span><Check size={16}/> Pronto para imprimir</span><span><Check size={16}/> Pagamento único</span></div>
    <button className="lp-button lp-primary" onClick={scrollPrices}>QUERO GARANTIR MEU MATERIAL <ArrowRight size={18}/></button>
    <div className="lp-subcta"><LockKeyhole size={14}/> Produto digital • Entrega após confirmação do pagamento</div>
   </div></div></section>
  <section className="lp-section lp-product-section"><div className="lp-container lp-simple-product">
    <div><span className="lp-kicker">O QUE VOCÊ RECEBE</span><h2>Um material pronto para imprimir e usar</h2><p>Atividades educativas com temática HUNTRIX que ajudam a transformar momentos de brincadeira em oportunidades de aprendizado.</p></div>
    
  </div><div className="lp-container lp-gallery-heading"><strong>Veja algumas páginas do material</strong></div><MaterialCarousel/></section>
  <section id="bonus" className="lp-section lp-bonus-section"><div className="lp-container"><div className="lp-center"><span className="lp-kicker">BÔNUS DO KIT COMPLETO</span><h2>No Kit Completo você recebe mais 3 materiais</h2><p>Materiais complementares para ampliar as opções de atividades.</p></div><div className="lp-bonus-grid">{bonus.map((b,i)=><article className="lp-bonus-card" key={b.name}><span className="lp-bonus-index">BÔNUS 0{i+1}</span><Illustration type={b.className} small/><h3>{b.name}</h3><p>{b.sub}</p><div className="lp-bonus-value"><s>{b.value}</s><strong>GRÁTIS</strong></div></article>)}</div><div className="lp-bonus-total"><Gift size={32}/><div><strong>Total dos bônus: <s>R$ 52,70</s></strong><span>NO KIT COMPLETO, VOCÊ LEVA OS 3 GRÁTIS!</span></div></div><p className="lp-placeholder-note">Os valores individuais são sugestões de referência e não representam preços anteriores comprovados.</p></div></section>
  <section id="planos" className="lp-section lp-price-section"><div className="lp-container"><div className="lp-center"><span className="lp-kicker">ESCOLHA SEU PLANO</span><h2>Escolha o material ideal para você</h2><p>Pagamento único, sem mensalidade.</p></div><div className="lp-prices"><article className="lp-price-card"><h3>Kit Básico</h3><p>Para começar a aventura</p><div className="lp-oldprice">Valor de referência <s>R$ 67,90</s></div><div className="lp-newprice"><span>R$</span>12,90</div><span className="lp-payment">Pagamento único</span><ul><li><Check size={17}/>50 atividades educativas</li><li><Check size={17}/>PDF A4 para imprimir</li><li><Check size={17}/>Material digital</li><li className="lp-no"><X size={17}/>Não inclui os 3 bônus</li></ul><button className="lp-button lp-secondary" onClick={()=>buy("basic")}>QUERO O BÁSICO <ArrowRight size={18}/></button></article><article className="lp-price-card lp-featured"><span className="lp-popular">MAIS COMPLETO</span><h3>Kit Completo</h3><p>Todos os materiais e os bônus!</p><div className="lp-oldprice">Valor de referência <s>R$ 127,90</s></div><div className="lp-newprice"><span>R$</span>26,90</div><span className="lp-payment">Pagamento único</span><ul><li><Check size={17}/>50 atividades educativas</li><li><Check size={17}/>PDF A4 para imprimir</li><li><Check size={17}/>Caderno de Colorir</li><li><Check size={17}/>Recorte e Monte</li><li><Check size={17}/>Jogos e Desafios</li></ul><button className="lp-button lp-primary" onClick={()=>buy("complete")}>QUERO O COMPLETO <ArrowRight size={18}/></button></article></div><div className="lp-price-note">✨ Por apenas <strong>R$ 14,00 a mais</strong>, você leva os três bônus especiais!<br/><small>Os valores de referência não são anunciados como preços anteriores ou descontos comprovados.</small></div></div></section>
  <section className="lp-section lp-faq-section"><div className="lp-container lp-faq"><div className="lp-center"><span className="lp-kicker">DÚVIDAS FREQUENTES</span><h2>Ainda ficou alguma dúvida?</h2></div>{faqs.map(([q,a],i)=><div className="lp-faq-item" key={q}><button onClick={()=>setFaq(faq===i?null:i)} aria-expanded={faq===i}>{q}<ChevronDown size={19} className={faq===i?"lp-up":""}/></button>{faq===i&&<p>{a}</p>}</div>)}</div></section>
  <section className="lp-ending"><div className="lp-container"><h2>Vamos começar essa missão cheia de descobertas?</h2><p>Escolha seu kit e leve a magia HUNTRIX para as atividades do dia a dia!</p><button className="lp-button lp-yellow" onClick={scrollPrices}>QUERO GARANTIR MEU KIT <ArrowRight size={19}/></button></div></section>
  </main>
  <footer className="lp-footer"><strong>✦ MISSÃO HUNTRIX KIDS</strong><p>Material educativo digital • Indicado para crianças de 4 a 6 anos, com acompanhamento de um adulto.</p><small>© 2026 Missão HUNTRIX Kids. Todos os direitos reservados.</small></footer>
  <div className="lp-sticky"><span>Kit a partir de <strong>R$ 12,90</strong></span><button onClick={scrollPrices}>VER OFERTAS <ArrowRight size={16}/></button></div>
  {notice&&<div className="lp-modal-backdrop" role="presentation" onClick={()=>setNotice(false)}><div className="lp-modal" role="dialog" aria-modal="true" aria-label="Checkout em configuração" onClick={e=>e.stopPropagation()}><div className="lp-modal-icon">💗</div><h3>Checkout em configuração</h3><p>Os planos já estão prontos. Falta somente adicionar os links oficiais de pagamento antes de abrir as vendas.</p><button className="lp-button lp-primary" onClick={()=>setNotice(false)}>ENTENDI</button></div></div>}
 </div>
}
export const Route=createFileRoute("/")({component:App});

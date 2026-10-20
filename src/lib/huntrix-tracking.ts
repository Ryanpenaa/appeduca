/**
 * Client-side Meta Pixel and attribution bridge.
 * Pixel events run only after an explicit analytics consent.
 * Future webhook/CAPI integration should deduplicate Purchase with event_id.
 * No purchases are emitted by the landing page.
 */
export const META_PIXEL_ID = "2223111375217220";
const ATTR_KEY="huntrix-attribution-v1";
const CONSENT_KEY="huntrix-analytics-consent-v1";
const EVENT_KEY="huntrix-tracking-events-v1";
const KEYS=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","utm_id","fbclid","gclid"] as const;
type EventRecord={event_id:string;event_name:string;timestamp:string;plan?:string;value?:number;currency?:string;click_id:string;utm_source?:string;utm_medium?:string;utm_campaign?:string;utm_content?:string;utm_term?:string;utm_id?:string;fbclid?:string;fbp?:string;fbc?:string;checkout_url?:string};
type Attribution={click_id:string;landing_url:string;landing_referrer:string;first_seen:string;last_seen:string;params:Record<string,string>};
declare global {interface Window {fbq?:((...args:unknown[])=>void)&{callMethod?:(...args:unknown[])=>void;queue?:unknown[];loaded?:boolean;version?:string;push?:(...args:unknown[])=>void};_fbq?:Window["fbq"];}}
function uuid(){return typeof crypto!=="undefined"&&"randomUUID" in crypto?crypto.randomUUID():`ev_${Date.now()}_${Math.random().toString(36).slice(2)}`;}
function cookie(name:string){return document.cookie.split("; ").find(x=>x.startsWith(name+"="))?.slice(name.length+1)||"";}
function read<T>(key:string):T|null{try{const value=sessionStorage.getItem(key);return value?JSON.parse(value) as T:null}catch{return null}}
function save(key:string,value:unknown){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{/* optional storage */}}
export function analyticsConsent(){try{return localStorage.getItem(CONSENT_KEY)==="granted"}catch{return false}}
export function consentHasDecision(){try{return localStorage.getItem(CONSENT_KEY)!==null}catch{return false}}
export function setAnalyticsConsent(allowed:boolean){try{localStorage.setItem(CONSENT_KEY,allowed?"granted":"denied")}catch{/* storage unavailable */}if(allowed)startTracking()}
export function attribution():Attribution{
 const previous=read<Attribution>(ATTR_KEY);
 const query=new URLSearchParams(location.search);
 const params={...(previous?.params||{})};
 for(const key of KEYS){const val=query.get(key);if(val)params[key]=val.slice(0,400)}
 const now=new Date().toISOString();
 const data:Attribution={click_id:previous?.click_id||uuid(),landing_url:previous?.landing_url||location.href,landing_referrer:previous?.landing_referrer||document.referrer,first_seen:previous?.first_seen||now,last_seen:now,params};
 save(ATTR_KEY,data);
 return data;
}
function ensureFbclidCookie(){
 const fbclid=attribution().params.fbclid;
 if(!fbclid||cookie("_fbc"))return;
 const value=`fb.1.${Date.now()}.${fbclid}`;
 document.cookie=`_fbc=${encodeURIComponent(value)};path=/;max-age=7776000;SameSite=Lax;Secure`;
}
let pixelLoaded=false;
function initPixel(){
 if(!analyticsConsent()||typeof window==="undefined")return false;
 if(!window.fbq){
  const q=((...args:unknown[])=>{if(q.callMethod)q.callMethod(...args);else q.queue?.push(args)}) as NonNullable<Window["fbq"]>;
  q.queue=[];q.loaded=true;q.version="2.0";q.push=q;window.fbq=q;window._fbq=q;
  const script=document.createElement("script");script.async=true;script.src="https://connect.facebook.net/en_US/fbevents.js";document.head.appendChild(script);
 }
 if(!pixelLoaded){ensureFbclidCookie();window.fbq?.("init",META_PIXEL_ID);pixelLoaded=true;}
 return true;
}
function record(event:EventRecord){const existing=read<EventRecord[]>(EVENT_KEY)||[];save(EVENT_KEY,[...existing.slice(-49),event])}
let pageViewed=false;
export function startTracking(){
 if(typeof window==="undefined")return;
 const attr=attribution();
 if(!initPixel()||pageViewed)return;
 pageViewed=true;
 const event_id=uuid();
 const event:EventRecord={event_id,event_name:"PageView",timestamp:new Date().toISOString(),click_id:attr.click_id,...attr.params,fbp:cookie("_fbp")||undefined,fbc:decodeURIComponent(cookie("_fbc"))||undefined};
 record(event);
 window.fbq?.("track","PageView",{}, {eventID:event_id});
}
const VALUES={basic:12.9,upgrade:18.9,complete:26.9} as const;
export function trackCheckout(plan:keyof typeof VALUES,checkoutBase:string){
 const attr=attribution(),value=VALUES[plan],event_id=uuid();
 const url=new URL(checkoutBase);
 for(const key of KEYS){if(attr.params[key])url.searchParams.set(key,attr.params[key])}
 url.searchParams.set("click_id",attr.click_id);
 if(analyticsConsent()){
  initPixel();
  const event:EventRecord={event_id,event_name:"InitiateCheckout",timestamp:new Date().toISOString(),plan,value,currency:"BRL",click_id:attr.click_id,...attr.params,fbp:cookie("_fbp")||undefined,fbc:decodeURIComponent(cookie("_fbc"))||undefined,checkout_url:url.toString()};
  record(event);
  window.fbq?.("track","InitiateCheckout",{content_name:plan==="basic"?"Kit Básico HUNTRIX":"Kit Completo HUNTRIX",content_category:"educational_printables",content_type:"product",content_ids:[plan],num_items:1,value,currency:"BRL"},{eventID:event_id});
  // Future first-party collector: send event + event_id to server after permission and endpoint setup.
  // Do not emit Purchase on click; only payment-approved webhook should produce Purchase.
 }
 return url.toString();
}

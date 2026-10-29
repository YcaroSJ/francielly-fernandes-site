/* comportamentos comuns: menu, perguntas, manifesto, etapas, galeria, depoimentos, luz do mouse */
(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
setTimeout(()=>document.body.classList.remove("lock"),9000);
const nav=$('#nav');if(nav){addEventListener('scroll',()=>nav.classList.toggle('s',scrollY>40),{passive:true});}
const bg=$('#burger'),mn=$('#menu');
if(bg){bg.onclick=()=>{bg.classList.toggle('o');mn.classList.toggle('o')};$$('#menu a').forEach(a=>a.onclick=()=>{bg.classList.remove('o');mn.classList.remove('o')})}
$$('.q button').forEach(b=>b.addEventListener('click',()=>{const q=b.parentElement,was=q.classList.contains('open');
  $$('.q').forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});
  if(!was){q.classList.add('open');b.setAttribute('aria-expanded','true')}}));
const mf=$('#mf');
if(mf){mf.innerHTML=mf.textContent.trim().split(/\s+/).map(w=>`<span class="w">${w}</span>`).join(' ');
  const ws=$$('#mf .w');const upd=()=>{const r=mf.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.82-r.top)/(r.height+innerHeight*.3)));const k=Math.round(p*ws.length);ws.forEach((w,i)=>w.classList.toggle('on',i<k))};
  addEventListener('scroll',upd,{passive:true});upd()}
const st=$('#steps');if(st)new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.disconnect()}}),{threshold:.3}).observe(st);
$$('[data-draw]').forEach(el=>new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.disconnect()}}),{threshold:.3}).observe(el));
const rail=$('#rail');
if(rail){let down=false,sx=0,sl=0;
  rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=rail.scrollLeft;rail.classList.add('drag')});
  addEventListener('pointermove',e=>{if(down)rail.scrollLeft=sl-(e.clientX-sx)});
  addEventListener('pointerup',()=>{down=false;rail.classList.remove('drag')});
  const step=()=>Math.min(rail.clientWidth*.6,560);
  $('#next')&&($('#next').onclick=()=>rail.scrollBy({left:step(),behavior:'smooth'}));
  $('#prev')&&($('#prev').onclick=()=>rail.scrollBy({left:-step(),behavior:'smooth'}))}
const qs=$$('.qi'),ds=$$('#dots button');
if(qs.length){let qi=0,t;const go=n=>{qs[qi].classList.remove('on');ds[qi]&&ds[qi].classList.remove('on');qi=n;qs[qi].classList.add('on');ds[qi]&&ds[qi].classList.add('on')};
  const loop=()=>{clearInterval(t);t=setInterval(()=>go((qi+1)%qs.length),7000)};ds.forEach((b,i)=>b.onclick=()=>{go(i);loop()});loop()}
const g=$('#glow');
if(g&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){let x=0,y=0,tx=0,ty=0;addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.style.opacity=1});
  (function t(){x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(t)})()}
})();

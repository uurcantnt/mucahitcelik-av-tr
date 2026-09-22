/* Av. Mücahit Çelik — site betikleri ("DOSYA" tasarımı)
   Satır içi onclick çağrıları (toggleMenu, closeMenu, toggleSss, railMove,
   haritaYukle) üretilen sayfalarda gömülü olduğu için GLOBAL kalmalıdır. */

/* ─────────── mobil menü ─────────── */
function menuDurum(acik){
  var m=document.getElementById('mobileMenu');
  if(!m)return;
  m.classList.toggle('open',acik);
  var h=document.querySelector('.hamburger');
  if(h){
    h.classList.toggle('acik',acik);
    h.setAttribute('aria-expanded',acik?'true':'false');
    var tr=document.documentElement.lang!=='en';
    h.setAttribute('aria-label',acik?(tr?'Menüyü kapat':'Close menu'):(tr?'Menüyü aç':'Open menu'));
  }
}
function toggleMenu(){
  var m=document.getElementById('mobileMenu');
  menuDurum(!(m&&m.classList.contains('open')));
}
function closeMenu(){menuDurum(false)}

/* ─────────── SSS aç/kapa ─────────── */
function toggleSss(el){
  var it=el.parentElement;
  var acik=it.classList.toggle('open');
  el.setAttribute('aria-expanded',acik?'true':'false');
}

/* ─────────── yatay şerit okları ─────────── */
function railMove(dir){
  var r=document.getElementById('alanRail')||document.getElementById('yorumRail');
  if(!r)return;
  var adim=r.clientWidth*0.7;
  var kart=r.querySelector('.rcard-name,.rcard,.svc-card');
  if(kart)adim=kart.getBoundingClientRect().width+16;
  r.scrollBy({left:dir*adim,behavior:hareketKapali()?'auto':'smooth'});
}

/* ─────────── iletişim: harita yalnızca istenirse ─────────── */
function haritaYukle(){
  var kutu=document.getElementById('haritaKutu');
  if(!kutu) return;
  kutu.innerHTML='<iframe title="Büro konumu — Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen '+
    'src="https://www.google.com/maps?q=Toros%20Mahallesi%20Atat%C3%BCrk%20Bulvar%C4%B1%20Ba%C5%9Fak%20Apt%20No%3A11%20Konyaalt%C4%B1%20Antalya&output=embed"></iframe>';
  kutu.style.padding='0';
  kutu.style.minHeight='0';
}

function hareketKapali(){
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

(function(){
  "use strict";
  var root=document.documentElement;
  root.classList.add("js");
  var reduce=hareketKapali();
  var dizi=function(n){return Array.prototype.slice.call(n)};

  /* başlık: kaydırınca sıkışır */
  var shell=document.querySelector(".nav-shell");
  if(shell){
    var kompakt=function(){shell.classList.toggle("is-compact",window.scrollY>40)};
    kompakt();
    window.addEventListener("scroll",kompakt,{passive:true});
  }

  /* Esc ile mobil menü kapanır; bağlantıya tıklayınca da */
  document.addEventListener("keydown",function(e){
    var m=document.getElementById("mobileMenu");
    if(e.key==="Escape"&&m&&m.classList.contains("open")){
      closeMenu();
      var h=document.querySelector(".hamburger");
      if(h)h.focus();
    }
  });
  var mm=document.getElementById("mobileMenu");
  if(mm){
    mm.addEventListener("click",function(e){
      if(e.target.closest("a"))closeMenu();
    });
  }

  /* SSS: klavye erişimi (satır içi onclick zaten var) */
  dizi(document.querySelectorAll(".sss-q")).forEach(function(q){
    if(!q.hasAttribute("tabindex"))q.setAttribute("tabindex","0");
    if(!q.hasAttribute("role"))q.setAttribute("role","button");
    if(!q.hasAttribute("aria-expanded"))
      q.setAttribute("aria-expanded",q.parentElement.classList.contains("open")?"true":"false");
    q.addEventListener("keydown",function(e){
      if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleSss(q)}
    });
  });

  /* ─────────── anasayfa: dosya destesi ─────────── */
  var stack=document.getElementById("stack");
  if(stack){
    var cards=dizi(stack.querySelectorAll(".fcard"));
    var bar=document.getElementById("stackBar"),stackNo=document.getElementById("stackNo");
    var DUR=4200,LEAVE=520,order=cards.map(function(_,i){return i});
    var timer=null,paused=false,remaining=DUR,startedAt=0;
    var paint=function(){
      order.forEach(function(ci,pos){
        var c=cards[ci];
        c.setAttribute("data-pos",String(Math.min(pos,4)));
        var front=pos===0;
        c.tabIndex=front?0:-1;
        if(front)c.removeAttribute("aria-hidden");else c.setAttribute("aria-hidden","true");
      });
      if(stackNo)stackNo.textContent=("0"+(order[0]+1)).slice(-2)+" / "+("0"+cards.length).slice(-2);
    };
    var restartBar=function(){
      if(!bar)return;
      bar.classList.remove("run");void bar.offsetWidth;
      bar.style.setProperty("--dur",DUR+"ms");bar.classList.add("run");
    };
    var schedule=function(ms){
      clearTimeout(timer);remaining=ms;startedAt=Date.now();
      if(ms===DUR)restartBar();
      timer=setTimeout(next,ms);
    };
    var next=function(){
      var front=cards[order[0]];
      front.classList.add("leaving");
      setTimeout(function(){
        front.classList.remove("leaving");
        order.push(order.shift());
        paint();
        var nf=cards[order[0]];
        nf.classList.remove("swap-in");void nf.offsetWidth;nf.classList.add("swap-in");
        schedule(DUR);
      },LEAVE);
    };
    var pause=function(){
      if(paused)return;paused=true;stack.classList.add("paused");
      clearTimeout(timer);remaining=Math.max(0,remaining-(Date.now()-startedAt));
    };
    var resume=function(){
      if(!paused)return;paused=false;stack.classList.remove("paused");
      startedAt=Date.now();timer=setTimeout(next,remaining);
    };
    paint();
    if(!reduce&&cards.length>1){
      schedule(DUR);
      stack.addEventListener("mouseenter",pause);
      stack.addEventListener("mouseleave",resume);
      stack.addEventListener("focusin",pause);
      stack.addEventListener("focusout",resume);
      document.addEventListener("visibilitychange",function(){document.hidden?pause():resume()});
    }
  }

  /* ─────────── genel sekme yardımcısı ─────────── */
  function makeTabs(tabs,panels,opts){
    var current=0;
    function select(i,focus){
      tabs.forEach(function(t,k){
        var on=k===i;
        t.setAttribute("aria-selected",String(on));
        t.tabIndex=on?0:-1;
        if(!opts.isAccordion||!opts.isAccordion())panels[k].hidden=!on;
      });
      if(!opts.isAccordion||!opts.isAccordion()){
        panels[i].classList.remove("in");void panels[i].offsetWidth;panels[i].classList.add("in");
      }
      current=i;
      if(focus)tabs[i].focus();
      if(opts.onSelect)opts.onSelect(i);
    }
    tabs.forEach(function(t,i){
      t.addEventListener("click",function(){select(i,false)});
      t.addEventListener("keydown",function(e){
        var n=tabs.length,k=null;
        if(e.key===opts.nextKey||e.key===opts.nextKey2)k=(current+1)%n;
        else if(e.key===opts.prevKey||e.key===opts.prevKey2)k=(current-1+n)%n;
        else if(e.key==="Home")k=0;
        else if(e.key==="End")k=n-1;
        if(k!==null){e.preventDefault();select(k,true)}
      });
    });
    return {select:select,get current(){return current}};
  }

  /* ─────────── çalışma alanları: dikey sekme ↔ akordiyon ─────────── */
  var vtabs=dizi(document.querySelectorAll(".vtab"));
  var vpanels=dizi(document.querySelectorAll(".vpanel"));
  var mqAcc=window.matchMedia("(max-width: 860px)");
  if(vtabs.length&&vtabs.length===vpanels.length){
    var ind=document.getElementById("tabInd");
    var moveInd=function(i){if(ind)ind.style.transform="translateY("+vtabs[i].offsetTop+"px)"};
    var areaTabs=makeTabs(vtabs,vpanels,{
      nextKey:"ArrowDown",prevKey:"ArrowUp",nextKey2:"ArrowRight",prevKey2:"ArrowLeft",
      isAccordion:function(){return mqAcc.matches},onSelect:moveInd
    });
    var accBtns=vpanels.map(function(p){return p.querySelector(".acc-btn")});
    var bodies=vpanels.map(function(p){return p.querySelector(".pbody")});
    accBtns.forEach(function(b,i){
      if(!b)return;
      b.addEventListener("click",function(){
        var open=b.getAttribute("aria-expanded")==="true";
        b.setAttribute("aria-expanded",String(!open));
        bodies[i].hidden=open;
        if(!open){
          vpanels[i].classList.remove("in");void vpanels[i].offsetWidth;
          vpanels[i].classList.add("in");
        }
      });
    });
    var applyMode=function(){
      var acc=mqAcc.matches,cur=areaTabs.current;
      vpanels.forEach(function(p,i){
        if(acc){
          p.hidden=false;p.removeAttribute("role");p.removeAttribute("tabindex");
          var open=i===cur;
          if(accBtns[i])accBtns[i].setAttribute("aria-expanded",String(open));
          if(bodies[i])bodies[i].hidden=!open;
        }else{
          p.setAttribute("role","tabpanel");p.tabIndex=0;
          p.hidden=i!==cur;if(bodies[i])bodies[i].hidden=false;
        }
      });
      if(!acc)moveInd(cur);
    };
    applyMode();
    if(mqAcc.addEventListener)mqAcc.addEventListener("change",applyMode);
    else mqAcc.addListener(applyMode);
    window.addEventListener("resize",function(){if(!mqAcc.matches)moveInd(areaTabs.current)},
      {passive:true});
    if(document.fonts&&document.fonts.ready)
      document.fonts.ready.then(function(){if(!mqAcc.matches)moveInd(areaTabs.current)});
  }

  /* ─────────── klasör sekmeleri ─────────── */
  var ftabs=dizi(document.querySelectorAll(".ftab"));
  if(ftabs.length){
    var fpanels=ftabs.map(function(t){return document.getElementById(t.getAttribute("aria-controls"))});
    if(fpanels.every(Boolean))makeTabs(ftabs,fpanels,{nextKey:"ArrowRight",prevKey:"ArrowLeft"});
  }

  /* ─────────── süreç: yapışkan adım derinliği ─────────── */
  var steps=dizi(document.querySelectorAll(".step"));
  if(steps.length&&!reduce){
    var ticking=false;
    var depth=function(){
      ticking=false;
      if(mqAcc.matches){steps.forEach(function(s){s.style.transform=""});return}
      steps.forEach(function(s,i){
        var nx=steps[i+1];
        if(!nx){s.style.transform="";return}
        var a=s.getBoundingClientRect(),b=nx.getBoundingClientRect();
        var p=Math.min(1,Math.max(0,(a.bottom-b.top)/a.height));
        var kalan=steps.length-1-i;
        s.style.transform="scale("+(1-p*0.025*kalan).toFixed(4)+")";
      });
    };
    window.addEventListener("scroll",function(){
      if(!ticking){ticking=true;requestAnimationFrame(depth)}
    },{passive:true});
    depth();
  }

  /* ─────────── yorum şeridi okları ─────────── */
  var track=document.getElementById("yorumRail");
  var prev=document.getElementById("revPrev"),nextB=document.getElementById("revNext");
  if(track&&prev&&nextB){
    var syncArrows=function(){
      prev.disabled=track.scrollLeft<4;
      nextB.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-4;
    };
    track.addEventListener("scroll",syncArrows,{passive:true});
    window.addEventListener("resize",syncArrows,{passive:true});
    syncArrows();
  }

  /* ─────────── kaydırma ile beliriş ─────────── */
  var rvs=dizi(document.querySelectorAll(".rv"));
  if(reduce||!("IntersectionObserver" in window)){
    rvs.forEach(function(el){el.classList.add("on")});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add("on");io.unobserve(en.target)}
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:0.08});
    rvs.forEach(function(el){io.observe(el)});
  }
})();

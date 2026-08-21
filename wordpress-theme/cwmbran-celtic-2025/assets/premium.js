(function(){
  // Countdown to the next fixture kick-off (data-ko on #count), else next Saturday 14:30
  var cdEl=document.getElementById('count');
  if(cdEl&&document.getElementById('cd-d')){
    var ko=parseInt(cdEl.getAttribute('data-ko'),10),t;
    if(ko&&ko>0){t=ko;}else{var n=new Date();var d=new Date(n.getFullYear(),n.getMonth(),n.getDate(),14,30,0,0);var a=(6-d.getDay()+7)%7;if(a===0&&n>d)a=7;d.setDate(d.getDate()+a);t=d.getTime();}
    var pad=function(x){return String(x).padStart(2,'0');};
    var tick=function(){var s=Math.floor(Math.max(0,t-Date.now())/1000),e;
      if(e=document.getElementById('cd-d'))e.textContent=pad(Math.floor(s/86400));
      if(e=document.getElementById('cd-h'))e.textContent=pad(Math.floor(s%86400/3600));
      if(e=document.getElementById('cd-m'))e.textContent=pad(Math.floor(s%3600/60));
      if(e=document.getElementById('cd-s'))e.textContent=pad(s%60);};
    tick();setInterval(tick,1000);
  }
  // Tabs (fixtures / news) — with ARIA tab pattern
  (function(){
    var tabs=document.querySelectorAll('.tab');
    var list=document.querySelector('.tabs-in'); if(list) list.setAttribute('role','tablist');
    tabs.forEach(function(tb){
      tb.setAttribute('role','tab');
      tb.setAttribute('aria-selected', tb.classList.contains('on')?'true':'false');
      var panel=document.getElementById(tb.dataset.t);
      if(panel){tb.setAttribute('aria-controls',tb.dataset.t);panel.setAttribute('role','tabpanel');panel.setAttribute('tabindex','0');}
      tb.addEventListener('click',function(){
        // Scoped to this tab's own group. There are now three groups on the
        // fixtures page (men's, reserves, women's); clearing every .tab and
        // .panel on the document would switch one group and blank the others.
        var group=tb.closest('.tabs');
        var siblings=group?group.querySelectorAll('.tab'):tabs;
        siblings.forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false');});
        siblings.forEach(function(x){
          var p=x.dataset.t?document.getElementById(x.dataset.t):null;
          if(p)p.classList.remove('on');
        });
        tb.classList.add('on');tb.setAttribute('aria-selected','true');
        var el=document.getElementById(tb.dataset.t);
        if(el){el.classList.add('on');el.querySelectorAll('.reveal').forEach(function(r){r.classList.add('in');});}
      });
    });
  })();
  // Next Up rotator — one card per team, billed in turn.
  (function(){
    var root=document.querySelector('[data-nextup]'); if(!root) return;
    var slides=[].slice.call(root.querySelectorAll('.nextup-slide'));
    var dots=[].slice.call(root.querySelectorAll('.nextup-dots button'));
    if(slides.length<2) return;
    var i=0, timer=null;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    var wait=parseInt(root.getAttribute('data-interval'),10)||6500;

    function show(n){
      i=(n+slides.length)%slides.length;
      slides.forEach(function(s,x){
        var on=x===i;
        s.classList.toggle('on',on);
        // Hidden slides are taken out of the accessibility tree, or a screen
        // reader announces three next fixtures and only one of them is showing.
        if(on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden','true');
      });
      dots.forEach(function(d,x){
        d.classList.toggle('on',x===i);
        d.setAttribute('aria-selected',x===i?'true':'false');
      });
    }
    function start(){ if(reduce||timer) return; timer=setInterval(function(){show(i+1);},wait); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} }
    function jump(n){ stop(); show(n); start(); }

    dots.forEach(function(d,x){ d.addEventListener('click',function(){jump(x);}); });
    var prev=root.querySelector('.nextup-arw.prev'), next=root.querySelector('.nextup-arw.next');
    if(prev) prev.addEventListener('click',function(){jump(i-1);});
    if(next) next.addEventListener('click',function(){jump(i+1);});

    // Anyone reading or interacting is not waiting to be moved on.
    root.addEventListener('mouseenter',stop);
    root.addEventListener('mouseleave',start);
    root.addEventListener('focusin',stop);
    root.addEventListener('focusout',start);
    // Nor is a background tab worth animating.
    document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });

    show(0); start();
  })();

  // Category chips (news) - visual
  document.querySelectorAll('.cats button').forEach(function(b){b.addEventListener('click',function(){
    b.parentNode.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');});});
  // Scroll reveal
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion:reduce)').matches){els.forEach(function(e){e.classList.add('in');});}
  else{var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});}
  // Mailing-list signup -> Apps Script web app (cwmbran-celtic-mailing-list).
  // POSTs are fire-and-forget: an Apps Script web app can't send CORS headers,
  // so we can't read the reply cross-origin. We show optimistic success; the
  // row is still written server-side (honeypot + shared secret gate it there).
  var sf=document.getElementById('cc25-signup');
  if(sf){
    sf.addEventListener('submit',function(ev){
      ev.preventDefault();
      var msg=sf.querySelector('.cc25-signup-msg');
      var email=sf.querySelector('[name=email]');
      if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value||'')){if(msg){msg.textContent='Please enter a valid email address.';}return;}
      var url=sf.getAttribute('data-endpoint')||'';
      // Cross-origin no-cors POST can't read the server's result, so keep the
      // confirmation tentative rather than falsely claiming success.
      var done=function(){sf.innerHTML='<div class="signup-done" role="status">Thanks — we\'ve got your details. We\'ll be in touch with Celts news soon.</div>';};
      if(url.indexOf('http')!==0){done();return;}  // endpoint not configured yet
      var data=new URLSearchParams();
      data.append('name',(sf.querySelector('[name=name]')||{}).value||'');
      data.append('email',email.value);
      data.append('website',(sf.querySelector('[name=website]')||{}).value||'');
      data.append('secret',sf.getAttribute('data-secret')||'');
      var btn=sf.querySelector('button[type=submit]');if(btn){btn.disabled=true;}
      fetch(url,{method:'POST',mode:'no-cors',body:data}).then(done).catch(function(){if(msg){msg.textContent='Sorry — something went wrong. Please try again.';}if(btn){btn.disabled=false;}});
    });
  }

  // Mobile menu toggle + dropdown accordion
  var tgl=document.querySelector('.nav-toggle');
  if(tgl){
    var mob=window.matchMedia('(max-width:900px)');
    tgl.addEventListener('click',function(){
      var open=document.body.classList.toggle('nav-open');
      tgl.setAttribute('aria-expanded',open?'true':'false');
      tgl.setAttribute('aria-label',open?'Close menu':'Open menu');
      if(open){var f=document.querySelector('header.nav nav.main a');if(f)f.focus();}
    });
    // Escape closes the menu and returns focus to the toggle.
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&document.body.classList.contains('nav-open')){
        document.body.classList.remove('nav-open');
        tgl.setAttribute('aria-expanded','false');tgl.setAttribute('aria-label','Open menu');tgl.focus();
      }
    });
    // On mobile, tapping a parent item expands its submenu instead of navigating.
    document.querySelectorAll('header.nav nav.main li.menu-item-has-children>a').forEach(function(a){
      a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded','false');
      a.addEventListener('click',function(ev){
        if(mob.matches){ev.preventDefault();var open=a.parentNode.classList.toggle('open');a.setAttribute('aria-expanded',open?'true':'false');}
      });
    });
    // Following any real link closes the menu (but a parent tap on mobile only toggles).
    document.querySelectorAll('header.nav nav.main a').forEach(function(a){
      a.addEventListener('click',function(){
        if(mob.matches&&a.parentNode.classList.contains('menu-item-has-children'))return;
        document.body.classList.remove('nav-open');tgl.setAttribute('aria-expanded','false');
      });
    });
  }

  // Next-home-game takeover: show once per home fixture per visitor.
  function ccFireworks(cv){
    var ctx=cv.getContext('2d'),dpr=window.devicePixelRatio||1,W,H,parts=[],raf,run=true,spTo;
    function size(){W=cv.width=cv.offsetWidth*dpr;H=cv.height=cv.offsetHeight*dpr;}
    size();window.addEventListener('resize',size);
    var cols=['#f2c200','#ffffff','#2a4fb0','#6ea8ff','#ffd94a'];
    function burst(x,y){var n=36+((Math.random()*24)|0),c=cols[(Math.random()*cols.length)|0];
      for(var i=0;i<n;i++){var a=6.283*i/n,s=(1+Math.random()*3.2)*dpr;
        parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:c});}}
    function spawn(){if(!run)return;burst(Math.random()*W*0.8+W*0.1,Math.random()*H*0.5+H*0.08);spTo=setTimeout(spawn,350+Math.random()*450);}
    function frame(){if(!run)return;ctx.clearRect(0,0,W,H);
      for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.045*dpr;p.vx*=0.985;p.vy*=0.985;p.l-=0.012;
        if(p.l<=0){parts.splice(i,1);continue;}
        ctx.globalAlpha=p.l<0?0:p.l;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,2.3*dpr,0,6.29);ctx.fill();}
      ctx.globalAlpha=1;raf=requestAnimationFrame(frame);}
    burst(W*0.5,H*0.32);spawn();frame();
    return function(){run=false;if(spTo)clearTimeout(spTo);if(raf)cancelAnimationFrame(raf);window.removeEventListener('resize',size);ctx.clearRect(0,0,W,H);};
  }
  var sp=document.getElementById('cc25-splash');
  if(sp){
    var always=sp.hasAttribute('data-always');
    var key='cc25splash_'+(sp.getAttribute('data-key')||'x'),seen=false;
    try{seen=localStorage.getItem(key)==='1';}catch(e){}
    if(!seen||always){
      var lastFocus,iv,stopFw=null,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
      var pad=function(x){return String(x).padStart(2,'0');};
      var openSplash=function(){
        lastFocus=document.activeElement;
        sp.hidden=false;document.body.style.overflow='hidden';
        var x=sp.querySelector('.splash-x');if(x)x.focus();
        var fw=sp.querySelector('.splash-fw');if(fw&&!reduce)stopFw=ccFireworks(fw);
        var cEl=sp.querySelector('.splash-count'),ko=cEl?parseInt(cEl.getAttribute('data-ko'),10):0;
        if(ko&&ko>0){var tick=function(){var s=Math.floor(Math.max(0,ko-Date.now())/1000),e;
          if(e=sp.querySelector('[data-d]'))e.textContent=pad(Math.floor(s/86400));
          if(e=sp.querySelector('[data-h]'))e.textContent=pad(Math.floor(s%86400/3600));
          if(e=sp.querySelector('[data-m]'))e.textContent=pad(Math.floor(s%3600/60));
          if(e=sp.querySelector('[data-s]'))e.textContent=pad(s%60);};tick();iv=setInterval(tick,1000);}
      };
      var closeSplash=function(){
        sp.hidden=true;document.body.style.overflow='';if(iv)clearInterval(iv);
        if(stopFw){stopFw();stopFw=null;}
        if(!always){try{localStorage.setItem(key,'1');}catch(e){}}
        if(lastFocus&&lastFocus.focus)lastFocus.focus();
      };
      sp.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeSplash);});
      document.addEventListener('keydown',function(e){if(!sp.hidden&&e.key==='Escape')closeSplash();});
      sp.addEventListener('keydown',function(e){
        if(e.key!=='Tab'||sp.hidden)return;
        var f=sp.querySelectorAll('a[href],button');if(!f.length)return;
        var first=f[0],last=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      });
      setTimeout(openSplash,reduce?0:500);
    }
  }

  // Fixtures page: switch team (Men's First Team / Reserves / Women's).
  var switchTeam=function(t){
    var btn=document.querySelector('.teamsel button[data-team="'+t+'"]'), wrap=document.getElementById('team-'+t);
    if(!btn||!wrap)return;
    document.querySelectorAll('.teamsel button[data-team]').forEach(function(x){x.classList.toggle('on',x===btn);});
    document.querySelectorAll('.teamwrap').forEach(function(w){w.hidden=(w.id!=='team-'+t);});
    wrap.querySelectorAll('.reveal').forEach(function(r){r.classList.add('in');});
  };
  document.querySelectorAll('.teamsel button[data-team]').forEach(function(b){
    b.addEventListener('click',function(){switchTeam(b.getAttribute('data-team'));});
  });
  if(document.querySelector('.teamsel button[data-team]')){
    // Deep link, e.g. /fixtures/#womens_u19 from the main menu.
    var fromHash=function(scroll){
      var h=(location.hash||'').replace('#','');
      if(!h)return;
      switchTeam(h);
      // Arriving from another page the browser scrolls to the anchor itself, but
      // a same-page hash change does not, so the panel would swap out of sight.
      var w=scroll&&document.getElementById('team-'+h);
      if(w)w.scrollIntoView({behavior:'smooth',block:'start'});
    };
    fromHash(false);
    // Without this the menu is dead once you are already on the fixtures page:
    // changing only the hash never reloads the document, so the switcher above
    // ran once on load and never again, and Women's Reserves and Women's U19s —
    // whose menu items are the only way to reach them — did nothing at all.
    window.addEventListener('hashchange',function(){fromHash(true);});
  }

  // Player-card lightbox (Men's team page): click a card to enlarge.
  var lb=document.getElementById('pc-lightbox');
  if(lb){
    var lbImg=document.getElementById('pc-lb-img'), lbMeta=document.getElementById('pc-lb-meta'), lbLast;
    var openLb=function(b){lbLast=document.activeElement;var img=b.querySelector('img');
      lbImg.src=b.getAttribute('data-full');lbImg.alt=img?img.getAttribute('alt'):'';
      if(lbMeta){var name=b.getAttribute('data-name')||'',m='';
        if(name)m='<strong>'+name+'</strong>';
        if(b.hasAttribute('data-apps')){var pl=function(n,w){return n+' '+w+(n==='1'?'':'s');};m+='<span>'+pl(b.getAttribute('data-apps'),'app')+' &middot; '+pl(b.getAttribute('data-goals'),'goal')+' &middot; '+pl(b.getAttribute('data-assists'),'assist')+'</span>';}
        else if(name)m+='<span>No appearances yet this season</span>';
        lbMeta.innerHTML=m;}
      lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.pc-lb-close').focus();};
    var closeLb=function(){lb.hidden=true;lbImg.src='';if(lbMeta)lbMeta.innerHTML='';document.body.style.overflow='';if(lbLast&&lbLast.focus)lbLast.focus();};
    document.querySelectorAll('.pc-card').forEach(function(b){
      b.addEventListener('click',function(){openLb(b);});
    });
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('pc-lb-close'))closeLb();});
    document.addEventListener('keydown',function(e){if(!lb.hidden&&e.key==='Escape')closeLb();});
  }
})();

/* Match report: click a Cwmbran Celtic player's name -> season stats popup. */
(function () {
  var pop = document.getElementById('mr-statpop');
  if (!pop) return;
  var card = pop.querySelector('.mr-statcard');
  var season = pop.getAttribute('data-season') || 'This season';
  var lastStatTrigger = null;
  function stat(v, l) { return '<div class="mr-st"><b>' + (parseInt(v, 10) || 0) + '</b><span>' + l + '</span></div>'; }
  function open(btn) {
    var d = btn.dataset;
    var img = d.card ? '<div class="mr-stimgwrap"><img class="mr-stimg" src="' + d.card + '" alt="' + d.name + '"></div>' : '';
    card.innerHTML =
      '<button class="mr-stclose" type="button" aria-label="Close">&times;</button>' + img +
      '<div class="mr-stbody">' +
        '<div class="mr-stname">' + d.name + '</div>' +
        '<div class="mr-stseason">' + season + ' &middot; Ardal League South East</div>' +
        '<div class="mr-stgrid">' +
          stat(d.apps, 'Apps') + stat(d.goals, 'Goals') + stat(d.assists, 'Assists') +
          stat(d.yellows, 'Yellow') + stat(d.reds, 'Red') +
        '</div>' +
      '</div>';
    pop.hidden = false;
    document.body.style.overflow = 'hidden';
    var x = card.querySelector('.mr-stclose'); if (x) x.focus();
  }
  function close() { pop.hidden = true; document.body.style.overflow = ''; if (lastStatTrigger) { lastStatTrigger.focus(); lastStatTrigger = null; } }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.plname');
    if (b) { lastStatTrigger = b; open(b); return; }
    if (e.target === pop || e.target.closest('.mr-stclose')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) close(); });
})();

/* Splash shirt carousel — scroll-snap track with dots, arrows and autoplay. */
(function () {
  var car = document.querySelector('[data-carousel]');
  if (!car) return;
  var track = car.querySelector('.splash-track');
  var slides = car.querySelectorAll('.splash-slide');
  var dots = car.querySelectorAll('.splash-dots button');
  var nextB = car.querySelector('.splash-arw.next');
  var prevB = car.querySelector('.splash-arw.prev');
  if (!track || slides.length < 2) return;
  var idx = 0, n = slides.length, timer = null, st = null;
  function setDots() { for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('on', j === idx); }
  function go(i) { idx = (i + n) % n; track.scrollTo({ left: track.clientWidth * idx, behavior: 'smooth' }); setDots(); }
  function sync() { var w = track.clientWidth || 1, i = Math.round(track.scrollLeft / w); if (i >= 0 && i < n && i !== idx) { idx = i; setDots(); } }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  // Don't autoplay for users who prefer reduced motion.
  function start() { if (matchMedia('(prefers-reduced-motion:reduce)').matches) return; stop(); timer = setInterval(function () { go(idx + 1); }, 3200); }
  if (nextB) nextB.addEventListener('click', function (e) { e.preventDefault(); stop(); go(idx + 1); });
  if (prevB) prevB.addEventListener('click', function (e) { e.preventDefault(); stop(); go(idx - 1); });
  for (var d = 0; d < dots.length; d++) (function (b) { b.addEventListener('click', function () { stop(); go(parseInt(b.getAttribute('data-i'), 10) || 0); }); })(dots[d]);
  track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(sync, 90); });
  car.addEventListener('mouseenter', stop);
  car.addEventListener('touchstart', stop, { passive: true });
  car.addEventListener('focusin', stop);   // pause once keyboard focus enters the carousel
  start();
})();

/* Kit-launch: click a shirt to enlarge it — shows the high-res front + back. */
(function () {
  var lb = document.getElementById('shirt-lb');
  if (!lb) return;
  var imgs = document.getElementById('shirt-lb-imgs');
  var cap = document.getElementById('shirt-lb-cap');
  var buy = lb.querySelector('.shirt-lb-buy');
  var soon = lb.querySelector('.shirt-lb-soon');
  var lastShirtTrigger = null;
  function esc(s) { return String(s || '').replace(/"/g, '&quot;'); }
  function one(src, label, alt) {
    return '<figure class="shirt-lb-one"><img src="' + esc(src) + '" alt="' + esc(alt) + '">' + (label ? '<figcaption>' + label + '</figcaption>' : '') + '</figure>';
  }
  function open(btn) {
    var front = btn.getAttribute('data-front'), back = btn.getAttribute('data-back'), full = btn.getAttribute('data-full');
    var c = btn.getAttribute('data-cap') || '';
    var html = '';
    if (front || back) {
      if (front) html += one(front, 'Front', c + ' — front');
      if (back) html += one(back, 'Back', c + ' — back');
    } else {
      html = one(full, '', c);
    }
    imgs.innerHTML = html;
    imgs.className = 'shirt-lb-imgs' + ((front && back) ? ' two' : '');
    cap.textContent = c;
    var isSoon = btn.getAttribute('data-soon');
    if (buy) buy.hidden = !!isSoon;
    if (soon) soon.hidden = !isSoon;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    var x = lb.querySelector('.shirt-lb-x'); if (x) x.focus();
  }
  function close() { lb.hidden = true; imgs.innerHTML = ''; document.body.style.overflow = ''; if (lastShirtTrigger) { lastShirtTrigger.focus(); lastShirtTrigger = null; } }
  document.addEventListener('click', function (e) {
    var z = e.target.closest('.shirt-zoom');
    if (z) { e.preventDefault(); lastShirtTrigger = z; open(z); return; }
    if (e.target === lb || e.target.closest('.shirt-lb-x')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) close(); });
})();

/* Kit launch: feature a RANDOM shirt each visit (client-side so it works with
   full-page caching). Repopulates the featured slot + the three grid cards. */
(function () {
  var el = document.getElementById('kl-shirt-data');
  if (!el) return;
  var cfg;
  try { cfg = JSON.parse(el.textContent); } catch (e) { return; }
  var shirts = cfg && cfg.shirts, base = (cfg && cfg.base) || '';
  if (!shirts || shirts.length < 2) return;
  for (var i = shirts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = shirts[i]; shirts[i] = shirts[j]; shirts[j] = t; }
  function fill(scope, s, isFeat) {
    if (!scope) return;
    var img = scope.querySelector('img');
    if (img) { img.src = base + s.img; img.alt = "Cwmbran Celtic " + s.label + " shirt — " + s.band; }
    var zoom = scope.querySelector('.shirt-zoom');
    if (zoom) {
      zoom.setAttribute('data-full', base + s.img);
      zoom.setAttribute('data-cap', s.band + ' · ' + s.label);
      if (s.front) zoom.setAttribute('data-front', base + s.front); else zoom.removeAttribute('data-front');
      if (s.back) zoom.setAttribute('data-back', base + s.back); else zoom.removeAttribute('data-back');
    }
    var tag = scope.querySelector('.kl-tag'); if (tag) tag.textContent = s.label;
    var band = scope.querySelector(isFeat ? 'h3' : '.kl-band'); if (band) band.textContent = s.band;
    var origin = scope.querySelector('.kl-origin'); if (origin) origin.textContent = s.origin;
    if (isFeat) {
      var p = scope.querySelector('.kl-featshirt-body p'); if (p && s.blurb) p.textContent = s.blurb;
      var buy = scope.querySelector('.kl-feat-buy'); if (buy) buy.innerHTML = 'Pre-order the ' + s.label + ' shirt →';
    }
  }
  fill(document.querySelector('[data-kl-featured]'), shirts[0], true);
  var cards = document.querySelectorAll('.kl-shirts .kl-shirt');
  for (var c = 0; c < cards.length; c++) { if (shirts[c + 1]) fill(cards[c], shirts[c + 1], false); }
})();

/* Music Shirts countdown: reveal the kit at launch time, and self-recover if
   a STALE (cached) countdown page is loaded after launch — refresh once with a
   cache-buster so the reload bypasses the page cache/CDN and gets the live page. */
(function () {
  var c = document.querySelector('.splash.is-countdown .splash-count');
  if (!c) return;
  var ko = parseInt(c.getAttribute('data-ko'), 10);
  if (!ko) return;
  function reloadFresh() {
    try {
      if (sessionStorage.getItem('ms-cd-reloaded') === '1') return; // guard: once per tab session
      sessionStorage.setItem('ms-cd-reloaded', '1');
    } catch (e) {}
    try {
      var u = new URL(location.href);
      u.searchParams.set('_r', String(Date.now())); // cache-buster → skips cached copy
      location.replace(u.toString());
    } catch (e) { try { location.reload(); } catch (e2) {} }
  }
  var ms = ko - Date.now();
  if (ms > 0) {
    if (ms < 26 * 3600 * 1000) setTimeout(reloadFresh, ms + 1500); // before launch: flip at go-live
  } else {
    reloadFresh(); // already past launch but showing the countdown → recover now
  }
})();

/* Match photography lightbox. Prev/next because a gallery is a sequence, and the
 * credit travels with the photo — a shot cannot be viewed full-size without the
 * byline, which is the whole point of it being here. */
(function () {
  var lb = document.getElementById('mrg-lightbox');
  var grid = document.querySelector('[data-mrg]');
  if (!lb || !grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.mrg-item'));
  if (!items.length) return;

  var img = document.getElementById('mrg-lb-img');
  var capEl = lb.querySelector('.mrg-lb-cap');
  var creditEl = lb.querySelector('.mrg-lb-credit');
  var credit = grid.getAttribute('data-credit') || '';
  var i = 0, last = null;

  function show(n) {
    i = (n + items.length) % items.length;   // wraps both ways
    var b = items[i];
    img.src = b.getAttribute('data-full');
    var inner = b.querySelector('img');
    img.alt = inner ? (inner.getAttribute('alt') || '') : '';
    capEl.textContent = b.getAttribute('data-caption') || '';
    creditEl.textContent = credit ? 'Photograph by ' + credit : '';
  }
  function open(n) {
    last = document.activeElement;
    show(n);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.mrg-lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
    if (last && last.focus) last.focus();
  }

  items.forEach(function (b, n) {
    b.addEventListener('click', function () { open(n); });
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('mrg-lb-close')) close();
    if (e.target.classList.contains('prev')) show(i - 1);
    if (e.target.classList.contains('next')) show(i + 1);
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });

  // Swipe, since most people reading a report are on a phone at or near the ground.
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  }, { passive: true });
})();

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
  // Tabs (fixtures / news)
  document.querySelectorAll('.tab').forEach(function(tb){tb.addEventListener('click',function(){
    document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');});
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on');});
    tb.classList.add('on');var el=document.getElementById(tb.dataset.t);
    if(el){el.classList.add('on');el.querySelectorAll('.reveal').forEach(function(r){r.classList.add('in');});}
  });});
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
      var done=function(){sf.innerHTML='<div class="signup-done" role="status">🎉 Thanks — you\'re on the list! Watch your inbox for Celts news.</div>';};
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
    });
    // On mobile, tapping a parent item expands its submenu instead of navigating.
    document.querySelectorAll('header.nav nav.main li.menu-item-has-children>a').forEach(function(a){
      a.addEventListener('click',function(ev){
        if(mob.matches){ev.preventDefault();a.parentNode.classList.toggle('open');}
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
  var sp=document.getElementById('cc25-splash');
  if(sp){
    var key='cc25splash_'+(sp.getAttribute('data-key')||'x'),seen=false;
    try{seen=localStorage.getItem(key)==='1';}catch(e){}
    if(!seen){
      var lastFocus,iv;
      var pad=function(x){return String(x).padStart(2,'0');};
      var openSplash=function(){
        lastFocus=document.activeElement;
        sp.hidden=false;document.body.style.overflow='hidden';
        var x=sp.querySelector('.splash-x');if(x)x.focus();
        var ko=parseInt(sp.querySelector('.splash-count').getAttribute('data-ko'),10);
        if(ko&&ko>0){var tick=function(){var s=Math.floor(Math.max(0,ko-Date.now())/1000),e;
          if(e=sp.querySelector('[data-d]'))e.textContent=pad(Math.floor(s/86400));
          if(e=sp.querySelector('[data-h]'))e.textContent=pad(Math.floor(s%86400/3600));
          if(e=sp.querySelector('[data-m]'))e.textContent=pad(Math.floor(s%3600/60));
          if(e=sp.querySelector('[data-s]'))e.textContent=pad(s%60);};tick();iv=setInterval(tick,1000);}
      };
      var closeSplash=function(){
        sp.hidden=true;document.body.style.overflow='';if(iv)clearInterval(iv);
        try{localStorage.setItem(key,'1');}catch(e){}
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
      setTimeout(openSplash,matchMedia('(prefers-reduced-motion:reduce)').matches?0:500);
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
    var _h=(location.hash||'').replace('#','');
    if(_h)switchTeam(_h);   // deep-link e.g. /fixtures/#womens
  }

  // Player-card lightbox (Men's team page): click a card to enlarge.
  var lb=document.getElementById('pc-lightbox');
  if(lb){
    var lbImg=document.getElementById('pc-lb-img'), lbLast;
    var openLb=function(src,alt){lbLast=document.activeElement;lbImg.src=src;lbImg.alt=alt||'';lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.pc-lb-close').focus();};
    var closeLb=function(){lb.hidden=true;lbImg.src='';document.body.style.overflow='';if(lbLast&&lbLast.focus)lbLast.focus();};
    document.querySelectorAll('.pc-card').forEach(function(b){
      b.addEventListener('click',function(){var img=b.querySelector('img');openLb(b.getAttribute('data-full'),img?img.getAttribute('alt'):'');});
    });
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('pc-lb-close'))closeLb();});
    document.addEventListener('keydown',function(e){if(!lb.hidden&&e.key==='Escape')closeLb();});
  }
})();

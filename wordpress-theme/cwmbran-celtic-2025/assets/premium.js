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
  // Mobile menu toggle
  var tgl=document.querySelector('.nav-toggle');
  if(tgl){
    tgl.addEventListener('click',function(){
      var open=document.body.classList.toggle('nav-open');
      tgl.setAttribute('aria-expanded',open?'true':'false');
      tgl.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    document.querySelectorAll('header.nav nav.main a').forEach(function(a){
      a.addEventListener('click',function(){document.body.classList.remove('nav-open');tgl.setAttribute('aria-expanded','false');});
    });
  }
})();

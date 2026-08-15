/* Av. Mücahit Çelik — site betikleri */
function menuDurum(acik){
  document.getElementById('mobileMenu').classList.toggle('open',acik);
  const h=document.querySelector('.hamburger');
  if(h)h.classList.toggle('acik',acik);
  h&&h.setAttribute('aria-expanded',acik?'true':'false');
}
function toggleMenu(){menuDurum(!document.getElementById('mobileMenu').classList.contains('open'))}
function closeMenu(){menuDurum(false)}
function toggleSss(el){el.parentElement.classList.toggle('open')}
function railMove(dir){
  const rail=document.getElementById('alanRail');
  if(!rail)return;
  rail.scrollBy({left:dir*rail.clientWidth*0.7,behavior:'smooth'});
}

// ─────────── HESAPLAMA ARAÇLARI ───────────
/* İletişim sayfası: Google Haritalar yalnızca kullanıcı isterse yüklenir */
function haritaYukle(){
  var kutu=document.getElementById('haritaKutu');
  if(!kutu) return;
  kutu.innerHTML='<iframe title="Büro konumu — Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen '+
    'src="https://www.google.com/maps?q=Toros%20Mahallesi%20Atat%C3%BCrk%20Bulvar%C4%B1%20Ba%C5%9Fak%20Apt%20No%3A11%20Konyaalt%C4%B1%20Antalya&output=embed"></iframe>';
  kutu.style.padding='0';
  kutu.style.minHeight='0';
}

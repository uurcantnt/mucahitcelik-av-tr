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
const TL=v=>new Intl.NumberFormat('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)+' TL';
const calculators={
  kiraStopaj:{title:"Kira Stopaj Hesaplama",desc:"İşyeri kira ödemelerinde gelir vergisi stopajı kesintisi hesaplar. Mesken kiralarında stopaj uygulanmaz.",fields:[{id:'brut',label:'Brüt Aylık Kira (TL)',type:'number',placeholder:'25000'},{id:'oran',label:'Stopaj Oranı (%) — Genelde 20',type:'number',value:20}],calculate:v=>{const s=v.brut*v.oran/100;return [{label:'Brüt Kira',value:TL(v.brut)},{label:'Stopaj Kesintisi',value:TL(s)},{label:'Net Kira (Sahibine Ödenen)',value:TL(v.brut-s)}]}},
  kiraArtis:{title:"Kira Artış Oranı Hesaplama",desc:"Türk Borçlar Kanunu m.344 — Kira artışı, sözleşme yenileme ayında TÜİK tarafından açıklanan 12 aylık TÜFE ortalamasını aşamaz. (Örn. Mayıs 2026'da yenilenen sözleşmede Mayıs 2026 verileriyle açıklanan 12 aylık TÜFE ortalaması kullanılır.) Geçici %25 yasal üst sınır 1 Temmuz 2024 itibariyle yürürlükten kalkmıştır.",fields:[{id:'mevcut',label:'Mevcut Aylık Kira (TL)',type:'number',placeholder:'15000'},{id:'tufe',label:'Yenileme Ayının 12 Aylık TÜFE Ortalaması (%)',type:'number',placeholder:'38.50'}],calculate:v=>{const o=parseFloat(v.tufe);const y=v.mevcut*(1+o/100);return [{label:'Mevcut Kira',value:TL(v.mevcut)},{label:'12 Aylık TÜFE Ortalaması',value:'%'+o.toFixed(2)},{label:'Aylık Artış Farkı',value:TL(y-v.mevcut)},{label:'Yeni Aylık Kira',value:TL(y)}]}},
  infazYatar:{title:"İnfaz Yatar Süresi Hesaplama",desc:"Hapis cezasının fiilen ne kadar yatılacağını gösterir. Genel suçlarda 1/2, mükerrir/ağır suçlar 3/4 oran uygulanır (5275 sayılı Kanun).",fields:[{id:'sure',label:'Verilen Hapis Cezası (Ay)',type:'number',placeholder:'24'},{id:'tip',label:'Suç Tipi',type:'select',options:[{value:'genel',label:'Genel suçlar (1/2)'},{value:'agir',label:'Ağır/cinsel/terör (3/4)'},{value:'mukerrir',label:'Mükerrir (3/4)'}]}],calculate:v=>{const o=v.tip==='genel'?0.5:0.75;const y=v.sure*o;return [{label:'Toplam Ceza',value:v.sure+' ay ('+(v.sure/12).toFixed(1)+' yıl)'},{label:'İnfaz Oranı',value:'%'+(o*100)},{label:'Fiilen Yatılacak',value:y.toFixed(1)+' ay ('+(y/12).toFixed(1)+' yıl)'}]}},
  ihbarTazminat:{title:"İhbar Tazminatı Hesaplama",desc:"Bildirimsiz iş akdi feshinde işçinin alacağı ihbar tazminatı (İş Kanunu m.17 — kademeli haftalık).",fields:[{id:'sure',label:'Çalışma Süresi (Yıl)',type:'number',placeholder:'5'},{id:'gunluk',label:'Brüt Günlük Ücret (TL)',type:'number',placeholder:'666'}],calculate:v=>{let h=2;if(v.sure>=0.5&&v.sure<1.5)h=4;else if(v.sure>=1.5&&v.sure<3)h=6;else if(v.sure>=3)h=8;const t=v.gunluk*h*7;return [{label:'Çalışma Süresi',value:v.sure+' yıl'},{label:'İhbar Süresi',value:h+' hafta ('+(h*7)+' gün)'},{label:'İhbar Tazminatı (Brüt)',value:TL(t)}]}},
  kidem:{title:"Kıdem Tazminatı Hesaplama",desc:"İş Kanunu m.14 — En az 1 yıl çalışmış işçi haklı sebepsiz işten çıkarılırsa, her tam yıl için 30 günlük brüt giydirilmiş ücret tutarında tazminat alır. Yıllık tavan her yıl güncellenir (giydirilmiş ücret = çıplak ücret + yan haklar).",fields:[{id:'brut',label:'Brüt Giydirilmiş Aylık Ücret (TL)',type:'number',placeholder:'40000'},{id:'yil',label:'Çalışma Süresi (Yıl, kesirli yazılabilir örn: 5.5)',type:'number',placeholder:'5.5'},{id:'tavan',label:'Yasal Kıdem Tavanı (Aylık TL)',type:'number',value:41828.42}],calculate:v=>{if(v.yil<1)return [{label:'Çalışma Süresi',value:v.yil+' yıl'},{label:'Sonuç',value:'Hak edilmedi (en az 1 yıl gerekli)'}];const esas=Math.min(v.brut,v.tavan);const tazminat=esas*v.yil;const kapali=v.brut>v.tavan;return [{label:'Brüt Giydirilmiş Ücret',value:TL(v.brut)},{label:'Hesaplamaya Esas Ücret',value:TL(esas)+(kapali?' (tavan uygulandı)':'')},{label:'Çalışma Süresi',value:v.yil+' yıl'},{label:'Kıdem Tazminatı (Brüt)',value:TL(tazminat)}]}},
  islahHarci:{title:"Islah Harcı Hesaplama",desc:"Davanın ıslah edilmesinde nispi yargı harcı (binde 68,31).",fields:[{id:'eski',label:'İlk Talep Miktarı (TL)',type:'number',placeholder:'50000'},{id:'yeni',label:'Islahla Yeni Talep (TL)',type:'number',placeholder:'120000'}],calculate:v=>{const f=Math.max(0,v.yeni-v.eski);const h=f*0.06831;return [{label:'Talep Farkı',value:TL(f)},{label:'Nispi Harç Oranı',value:'‰68,31 (%6,831)'},{label:'Tahmini Islah Harcı',value:TL(h)}]}},
  issizlik:{title:"İşsizlik Maaşı Hesaplama",desc:"İŞKUR işsizlik ödeneği — son 4 ay brüt kazancın %40'ı (asgari ücretin %80 alt sınır, %150 üst sınır).",fields:[{id:'brut',label:'Son 4 Ay Brüt Aylık Maaş (TL)',type:'number',placeholder:'40000'},{id:'asgari',label:'Güncel Asgari Ücret (TL)',type:'number',value:17002}],calculate:v=>{const o=v.brut*0.40;const taban=v.asgari*0.80;const tavan=v.asgari*1.50;const f=Math.min(tavan,Math.max(taban,o));return [{label:'Brüt Maaş',value:TL(v.brut)},{label:'Hesaplanan Ödenek (%40)',value:TL(o)},{label:'Alt Sınır (asgari × 0.80)',value:TL(taban)},{label:'Üst Sınır (asgari × 1.50)',value:TL(tavan)},{label:'Aylık İşsizlik Maaşı',value:TL(f)}]}},
  nafaka:{title:"Nafaka Hesaplama",desc:"Tedbir/iştirak/yoksulluk nafakası tahmini (yükümlünün gelirinin %15-25'i, çocuk başına ek). Kesin tutar hâkim takdiriyle belirlenir.",fields:[{id:'gelir',label:'Yükümlünün Net Aylık Geliri (TL)',type:'number',placeholder:'30000'},{id:'cocuk',label:'Çocuk Sayısı',type:'number',value:0},{id:'esYoksul',label:'Eş İçin Yoksulluk Nafakası',type:'select',options:[{value:'hayir',label:'Hayır'},{value:'evet',label:'Evet'}]}],calculate:v=>{const c=v.gelir*0.15*v.cocuk;const e=v.esYoksul==='evet'?v.gelir*0.20:0;return [{label:'Çocuk Nafakası (Toplam)',value:TL(c)},{label:'Eş Yoksulluk Nafakası',value:TL(e)},{label:'Tahmini Aylık Toplam Nafaka',value:TL(c+e)}]}},
  trafikTazminat:{title:"Trafik Kazası Tazminatı Hesaplama",desc:"Sürekli iş göremezlikten doğan maddi tazminat tahmini (basit yaklaşım — kesin tutar aktüer raporuyla belirlenir).",fields:[{id:'maluliyet',label:'Maluliyet Oranı (%)',type:'number',placeholder:'20'},{id:'yillik',label:'Yıllık Net Gelir (TL)',type:'number',placeholder:'360000'},{id:'yas',label:'Yaş',type:'number',placeholder:'40'}],calculate:v=>{const k=Math.max(0,65-v.yas);const t=(v.maluliyet/100)*v.yillik*k*0.7;return [{label:'Maluliyet',value:'%'+v.maluliyet},{label:'Aktif Çalışma Yılı',value:k+' yıl'},{label:'Tahmini Maddi Tazminat',value:TL(t)}]}},
  dogumIzni:{title:"Doğum İzni Hesaplama",desc:"İş Kanunu m.74 uyarınca analık izni — 8 hafta önce + 8 hafta sonra = 16 hafta.",fields:[{id:'tarih',label:'Beklenen Doğum Tarihi',type:'date'}],calculate:v=>{if(!v.tarih)return [{label:'Hata',value:'Tarih seçiniz'}];const d=new Date(v.tarih);const b=new Date(d);b.setDate(b.getDate()-56);const s=new Date(d);s.setDate(s.getDate()+56);const fmt=x=>x.toLocaleDateString('tr-TR');return [{label:'İzin Başlangıcı',value:fmt(b)},{label:'Beklenen Doğum',value:fmt(d)},{label:'İzin Bitişi',value:fmt(s)},{label:'Toplam İzin Süresi',value:'16 hafta (112 gün)'}]}},
  askerlikBorc:{title:"Askerlik Borçlanması Hesaplama",desc:"SGK'ya askerlik süresi için ödenecek borçlanma tutarı (asgari ücretin %32'si).",fields:[{id:'gun',label:'Askerlik Süresi (Gün)',type:'number',placeholder:'180'},{id:'asgari',label:'Aylık Asgari Ücret (TL)',type:'number',value:17002}],calculate:v=>{const g=v.asgari/30;const t=v.gun*g*0.32;return [{label:'Askerlik Süresi',value:v.gun+' gün'},{label:'Günlük Asgari Ücret',value:TL(g)},{label:'Borçlanma Tutarı (%32)',value:TL(t)}]}},
  yillikIzin:{title:"Yıllık İzin Ücreti Hesaplama",desc:"Kullanılmayan yıllık izinlerin parasal karşılığı (İş Kanunu m.53 — kademeli izin günü).",fields:[{id:'sure',label:'Çalışma Süresi (Yıl)',type:'number',placeholder:'7'},{id:'kullanilmayan',label:'Kullanılmayan İzin (Gün)',type:'number',placeholder:'20'},{id:'gunluk',label:'Brüt Günlük Ücret (TL)',type:'number',placeholder:'666'}],calculate:v=>{let y=14;if(v.sure>=5&&v.sure<15)y=20;else if(v.sure>=15)y=26;const t=v.kullanilmayan*v.gunluk;return [{label:'Yasal Yıllık İzin Hakkı',value:y+' gün/yıl'},{label:'Birikmiş Kullanılmayan',value:v.kullanilmayan+' gün'},{label:'Yıllık İzin Ücreti (Brüt)',value:TL(t)}]}},
  isKazasi:{title:"İş Kazası Tazminatı Hesaplama",desc:"İş kazasından doğan iş göremezlik tazminatı tahmini.",fields:[{id:'maluliyet',label:'Maluliyet Oranı (%)',type:'number',placeholder:'15'},{id:'yillik',label:'Yıllık Brüt Gelir (TL)',type:'number',placeholder:'300000'},{id:'yas',label:'Yaş',type:'number',placeholder:'35'}],calculate:v=>{const k=Math.max(0,60-v.yas);const t=(v.maluliyet/100)*v.yillik*k*0.65;return [{label:'Maluliyet',value:'%'+v.maluliyet},{label:'Kalan Çalışma Süresi',value:k+' yıl'},{label:'Tahmini Tazminat',value:TL(t)}]}},
  emekliMaasi:{title:"Emekli Maaşı Hesaplama",desc:"SGK emeklilik maaşı tahmini (ortalama kazanç × bağlama oranı).",fields:[{id:'gun',label:'Toplam Prim Gün Sayısı',type:'number',placeholder:'7200'},{id:'kazanc',label:'Ortalama Aylık Brüt Kazanç (TL)',type:'number',placeholder:'25000'}],calculate:v=>{let o=0.50;const f=Math.max(0,v.gun-7200);o+=(f/360)*0.02;if(o>0.85)o=0.85;const m=v.kazanc*o;return [{label:'Bağlama Oranı',value:'%'+(o*100).toFixed(2)},{label:'Tahmini Brüt Maaş',value:TL(m)},{label:'Tahmini Net Maaş',value:TL(m*0.85)}]}},
  tapuHarci:{title:"Tapu Harcı Hesaplama",desc:"Gayrimenkul devirlerinde alıcı ve satıcının ödediği tapu harcı (Harçlar Kanunu — taraflar %2 + %2 = toplam %4).",fields:[{id:'bedel',label:'Satış Bedeli (TL)',type:'number',placeholder:'3500000'}],calculate:v=>{const a=v.bedel*0.02;return [{label:'Satış Bedeli',value:TL(v.bedel)},{label:'Alıcı Tapu Harcı (%2)',value:TL(a)},{label:'Satıcı Tapu Harcı (%2)',value:TL(a)},{label:'Toplam Tapu Harcı (%4)',value:TL(a*2)}]}},
  aracDeger:{title:"Araç Değer Kaybı Hesaplama",desc:"Trafik kazasında aracın uğradığı değer kaybı tahmini (yaş ve hasar oranı katsayılı).",fields:[{id:'piyasa',label:"Aracın Kazadan Önceki Değeri (TL)",type:'number',placeholder:'500000'},{id:'hasar',label:'Onarım Bedeli (TL)',type:'number',placeholder:'60000'},{id:'yas',label:'Aracın Yaşı',type:'number',placeholder:'5'}],calculate:v=>{let k=0.20;if(v.yas<=2)k=0.30;else if(v.yas>=8)k=0.10;const o=(v.hasar/v.piyasa)*k;const ka=v.piyasa*o;return [{label:'Hasar/Değer Oranı',value:'%'+((v.hasar/v.piyasa)*100).toFixed(2)},{label:'Yaş Katsayısı',value:k.toFixed(2)},{label:'Tahmini Değer Kaybı',value:TL(ka)}]}},
  nafakaArtis:{title:"Nafaka Artış Oranı Hesaplama",desc:"Mevcut nafakanın TÜFE oranına göre artırılmış tutarı.",fields:[{id:'mevcut',label:'Mevcut Aylık Nafaka (TL)',type:'number',placeholder:'5000'},{id:'tufe',label:'Yıllık TÜFE Oranı (%)',type:'number',placeholder:'60'}],calculate:v=>{const y=v.mevcut*(1+v.tufe/100);return [{label:'Mevcut Nafaka',value:TL(v.mevcut)},{label:'TÜFE Oranı',value:'%'+v.tufe},{label:'Aylık Artış Farkı',value:TL(y-v.mevcut)},{label:'Yeni Nafaka',value:TL(y)}]}},
  fazlaMesai:{title:"Fazla Mesai Ücreti Hesaplama",desc:"Haftalık 45 saatten fazla çalışma için fazla mesai ücreti (saat ücreti × 1,5).",fields:[{id:'aylik',label:'Aylık Brüt Maaş (TL)',type:'number',placeholder:'20000'},{id:'haftalik',label:'Haftalık Fazla Çalışma (Saat)',type:'number',placeholder:'5'},{id:'hafta',label:'Toplam Süre (Hafta)',type:'number',placeholder:'4'}],calculate:v=>{const s=v.aylik/225;const fs=s*1.5;const t=fs*v.haftalik*v.hafta;return [{label:'Saat Ücreti',value:TL(s)},{label:'Fazla Mesai Saat Ücreti (×1,5)',value:TL(fs)},{label:'Toplam Fazla Mesai (Brüt)',value:TL(t)}]}},
  davaHarci:{title:"Dava Harcı Hesaplama",desc:"Hukuk davalarında nispi yargı harcı (binde 68,31). Dava açılırken peşin olarak 1/4 ödenir.",fields:[{id:'deger',label:'Dava Değeri (TL)',type:'number',placeholder:'100000'}],calculate:v=>{const n=v.deger*0.06831;const p=n/4;return [{label:'Karar Harcı (Toplam)',value:TL(n)},{label:'Peşin Ödenecek (1/4)',value:TL(p)},{label:'Dava Açarken Ödenecek',value:TL(p)}]}}
};
let _calcKey=null;
function openCalc(key){
  const c=calculators[key];if(!c)return;_calcKey=key;
  document.getElementById('calcTitle').textContent=c.title;
  document.getElementById('calcDesc').textContent=c.desc;
  const f=document.getElementById('calcFields');f.innerHTML='';
  c.fields.forEach(fd=>{
    const d=document.createElement('div');d.className='calc-field';
    let inp='';
    if(fd.type==='select'){
      inp='<select id="calc-'+fd.id+'">'+fd.options.map(o=>'<option value="'+o.value+'">'+o.label+'</option>').join('')+'</select>';
    } else {
      const t=fd.type||'number';
      inp='<input type="'+t+'" id="calc-'+fd.id+'" placeholder="'+(fd.placeholder||'')+'" value="'+(fd.value!==undefined?fd.value:'')+'">';
    }
    d.innerHTML='<label>'+fd.label+'</label>'+inp;
    f.appendChild(d);
  });
  document.getElementById('calcResults').classList.remove('show');
  document.getElementById('calcModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCalc(){
  document.getElementById('calcModal').classList.remove('open');
  document.body.style.overflow='';
  _calcKey=null;
}
function runCalc(){
  if(!_calcKey)return;
  const c=calculators[_calcKey];const v={};
  c.fields.forEach(fd=>{
    const el=document.getElementById('calc-'+fd.id);
    if(fd.type==='select'||fd.type==='date')v[fd.id]=el.value;
    else v[fd.id]=parseFloat(el.value)||0;
  });
  const r=c.calculate(v);
  document.getElementById('calcResultRows').innerHTML=r.map(x=>'<div class="calc-result-row"><span class="calc-result-label">'+x.label+'</span><span class="calc-result-value">'+x.value+'</span></div>').join('');
  document.getElementById('calcResults').classList.add('show');
  document.getElementById('calcResults').scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* İletişim sayfası: Google Haritalar yalnızca kullanıcı isterse yüklenir */
function haritaYukle(){
  var kutu=document.getElementById('haritaKutu');
  if(!kutu) return;
  kutu.innerHTML='<iframe title="Büro konumu — Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen '+
    'src="https://www.google.com/maps?q=Toros%20Mahallesi%20Atat%C3%BCrk%20Bulvar%C4%B1%20Ba%C5%9Fak%20Apt%20No%3A11%20Konyaalt%C4%B1%20Antalya&output=embed"></iframe>';
  kutu.style.padding='0';
  kutu.style.minHeight='0';
}

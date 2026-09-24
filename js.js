let active = null;

function toggle(img) {
  if (active === img) {
    img.classList.remove('scale-150', 'blur-0', 'opacity-100', 'z-10');
    img.classList.add('scale-75', 'blur-sm', 'opacity-50');
    active = null;
    return;
  }

  if (active) {
    active.classList.remove('scale-150', 'blur-0', 'opacity-100', 'z-10');
    active.classList.add('scale-75', 'blur-sm', 'opacity-50');
  }

  img.classList.remove('scale-75', 'blur-sm', 'opacity-50');
  img.classList.add('scale-150', 'blur-0', 'opacity-100', 'z-10');

  img.scrollIntoView({
    behavior: 'smooth',
    inline: 'center',
    block: 'nearest'
  });

  active = img;
}

function openSection(id, izPovijesti = false) {
  document.querySelectorAll('.radovi-section').forEach(sec => {
    sec.classList.add('hidden');
  });

  const target = document.getElementById(id);
  target.classList.remove('hidden');

  target.scrollIntoView({ behavior: 'smooth' });

  // Zapiši u povijest preglednika da "natrag" radi
  if (!izPovijesti && id !== 'radovi') {
    history.pushState({ section: id }, '');
  }
}

// Reagiraj na "natrag" u pregledniku ili swipe na mobitelu
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.section) {
    openSection(e.state.section, true);
    return;
  }

  // Ako je otvorena galerija, projekti ili video, vrati na radove
  const otvorena = document.querySelector('.radovi-section:not(.hidden):not(#radovi)');
  if (otvorena) {
    openSection('radovi', true);
  }
});



function sakrivaj() {
  const arrow = document.getElementById('gore');
  const naslovna = document.getElementById('naslovna');

  // Ako smo na naslovnoj, sakrij strelicu
  if (window.scrollY === 0) {
    arrow.style.display = 'none';
  } else {
    arrow.style.display = 'inline-block'; // pokaži strelicu na drugim sekcijama
  }
}

// pozovi funkciju na load i scroll
window.addEventListener('load', sakrivaj);
window.addEventListener('scroll', sakrivaj);




window.onload = function() {

  // Kreiraj modal div u body-u
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center hidden z-50';
  modal.innerHTML = `
    <div class="relative">
      <img id="modal-img" src="" class="max-h-[90vh] max-w-[90vw] object-contain cursor-pointer">
      <button aria-label="Zatvori"
              class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white text-2xl leading-none hover:bg-black/80 transition">
        &times;
      </button>
    </div>
  `;
  document.body.appendChild(modal);

   // Preglednik ne smije sam skrolati/zumirati kad se prst miče po modalu
  modal.style.touchAction = 'none';
  modal.style.overscrollBehavior = 'contain';

  // Za iPhone: blokiraj pomicanje stranice dok je prst na modalu
  modal.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  const modalImg = document.getElementById('modal-img');
  let slike = [];     // sve slike iz sekcije u kojoj si kliknula
  let trenutna = 0;   // koja je slika trenutno otvorena

  // Prikaži sliku po broju (nakon zadnje ide opet prva)
  function prikazi(i) {
    trenutna = (i + slike.length) % slike.length;
    modalImg.src = slike[trenutna].src;
  }

  // Otvaranje slike
  window.openModal = function(img) {
    slike = Array.from(img.closest('.grid').querySelectorAll('img'));
    prikazi(slike.indexOf(img));
    modal.classList.remove('hidden');
     document.body.style.overflow = 'hidden'; 
  };

  function zatvori() {
    modal.classList.add('hidden');
     document.body.style.overflow = ''; 
  }

  // Klik bilo gdje (i na iksić) zatvara
  modal.addEventListener('click', zatvori);

  // Strelice na tipkovnici
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') prikazi(trenutna + 1);
    if (e.key === 'ArrowLeft')  prikazi(trenutna - 1);
    if (e.key === 'Escape')     zatvori();
  });

  // Swipe na mobitelu
  let startX = 0;
  modal.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const razlika = e.changedTouches[0].clientX - startX;
    if (Math.abs(razlika) > 50) {
      if (razlika < 0) prikazi(trenutna + 1); // swipe ulijevo = sljedeća
      else             prikazi(trenutna - 1); // swipe udesno = prethodna
    }
  });

};










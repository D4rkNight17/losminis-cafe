// Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Nav móvil
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
  })
);

// Tabs de menú
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-category').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('cat-' + tab.dataset.cat).classList.add('active');
  });
});

// Calendario personalizado (solo Vie · Sáb · Dom)
(function () {
  const OPEN_DAYS = new Set([5, 6, 0]); // Viernes, Sábado, Domingo
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  // Semana empieza en lunes: [Lu Ma Mi Ju Vi Sá Do]
  const WD_LABELS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
  const WD_OPEN   = [false, false, false, false, true, true, true];

  let vYear, vMonth, selected = null;
  const today = new Date(); today.setHours(0,0,0,0);
  vYear = today.getFullYear(); vMonth = today.getMonth();

  const trigger  = document.getElementById('calTrigger');
  const panel    = document.getElementById('calPanel');
  const display  = document.getElementById('calDisplay');
  const hidden   = document.getElementById('rFecha');
  const title    = document.getElementById('calTitle');
  const wdGrid   = document.getElementById('calWeekdays');
  const daysGrid = document.getElementById('calDays');

  // Encabezados de días (fijos)
  WD_LABELS.forEach((lbl, i) => {
    const el = document.createElement('span');
    el.className = 'cal-wd' + (WD_OPEN[i] ? ' open-day' : '');
    el.textContent = lbl;
    wdGrid.appendChild(el);
  });

  function render() {
    title.textContent = `${MONTHS[vMonth]} ${vYear}`;
    daysGrid.innerHTML = '';

    const firstJS  = new Date(vYear, vMonth, 1).getDay(); // 0=Dom
    const firstMon = (firstJS + 6) % 7;                   // 0=Lun
    const total    = new Date(vYear, vMonth + 1, 0).getDate();

    for (let i = 0; i < firstMon; i++) {
      const el = document.createElement('button'); el.className = 'cal-day empty';
      daysGrid.appendChild(el);
    }

    for (let d = 1; d <= total; d++) {
      const date = new Date(vYear, vMonth, d); date.setHours(0,0,0,0);
      const btn  = document.createElement('button');
      btn.type = 'button'; btn.textContent = d;

      const isOpen = OPEN_DAYS.has(date.getDay());
      const isPast = date < today;

      if (isPast || !isOpen) {
        btn.className = 'cal-day unavailable';
      } else {
        btn.className = 'cal-day open-day';
        if (selected && date.toDateString() === selected.toDateString())
          btn.classList.add('selected');
        if (date.toDateString() === today.toDateString())
          btn.classList.add('today');
        btn.addEventListener('click', () => pick(date));
      }
      daysGrid.appendChild(btn);
    }
  }

  function pick(date) {
    selected = date;
    const pad = n => String(n).padStart(2, '0');
    hidden.value = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
    const dayNames = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    display.textContent = `${dayNames[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()].toLowerCase()} ${date.getFullYear()}`;
    display.classList.add('has-value');
    close();
    render();
  }

  function open()  { panel.classList.add('open'); trigger.classList.add('open'); trigger.setAttribute('aria-expanded','true'); render(); }
  function close() { panel.classList.remove('open'); trigger.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }

  trigger.addEventListener('click', e => { e.stopPropagation(); panel.classList.contains('open') ? close() : open(); });
  document.addEventListener('click', e => { if (!trigger.closest('.cal-wrapper').contains(e.target)) close(); });

  document.getElementById('calPrev').addEventListener('click', e => {
    e.stopPropagation();
    if (--vMonth < 0) { vMonth = 11; vYear--; }
    render();
  });
  document.getElementById('calNext').addEventListener('click', e => {
    e.stopPropagation();
    if (++vMonth > 11) { vMonth = 0; vYear++; }
    render();
  });
})();

// Reservación vía WhatsApp
function reservar() {
  const nombre   = document.getElementById('rNombre').value.trim();
  const fecha    = document.getElementById('rFecha').value;
  const hora     = document.getElementById('rHora').value;
  const personas = document.getElementById('rPersonas').value;
  const wa       = document.getElementById('rWA').value.trim();

  if (!nombre || !fecha || !hora || !personas || !wa) {
    alert('Por favor completa todos los campos para continuar.');
    return;
  }

  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [y, m, d] = fecha.split('-');
  const fechaES = `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;

  const msg =
`¡Hola Los Minis! Me gustaría hacer una reservación:

*Nombre:* ${nombre}
*Fecha:* ${fechaES}
*Hora:* ${hora} hrs
*Personas:* ${personas}
*Mi WhatsApp:* ${wa}

¡Muchas gracias!`;

  window.open(`https://wa.me/529961442564?text=${encodeURIComponent(msg)}`, '_blank');
}

// Animación de entrada al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: .1 });

document.querySelectorAll('.menu-card, .gallery-item, .feature-card, .res-form').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(16px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  io.observe(el);
});

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

// Fecha mínima de reservación = hoy
(function () {
  const d = new Date(), pad = n => String(n).padStart(2, '0');
  document.getElementById('rFecha').min =
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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
`¡Hola Los Minis! 👋 Me gustaría hacer una reservación:

📋 *Nombre:* ${nombre}
📅 *Fecha:* ${fechaES}
🕐 *Hora:* ${hora} hrs
👥 *Personas:* ${personas}
📱 *Mi WhatsApp:* ${wa}

¡Muchas gracias! ☕🌿`;

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

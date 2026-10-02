const WHATSAPP_NUMBER = "59172558600";
const BUSINESS_PHONE = "+591 72558600";
function wa(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}

const humanGate = document.getElementById("humanGate");
const humanCheckForm = document.getElementById("humanCheckForm");
const humanCheck = document.getElementById("humanCheck");
const humanCheckSubmit = document.getElementById("humanCheckSubmit");
const gatedPageElements = [
  document.getElementById("header"),
  document.querySelector("main"),
  document.querySelector("footer"),
  document.getElementById("waBot"),
  document.getElementById("floatingWA")
].filter(Boolean);

document.body.classList.add("human-gate-open");
gatedPageElements.forEach(element => { element.inert = true; });
humanCheck.checked = false;
humanCheckSubmit.disabled = true;
humanCheck.focus();

humanCheck.addEventListener("change", () => {
  humanCheckSubmit.disabled = !humanCheck.checked;
});

humanCheckForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!humanCheck.checked) return;

  humanCheckSubmit.disabled = true;
  humanGate.classList.add("is-accepted");
  gatedPageElements.forEach(element => { element.inert = false; });
  document.body.classList.remove("human-gate-open");
  window.setTimeout(() => {
    humanGate.hidden = true;
  }, 350);
});

[
  "headerWhatsApp", "heroWA1", "heroWA2", "heroWA3", "heroWA4", "heroWA5", "contactWA"
].forEach(id=>{
  const link = document.getElementById(id);
  if(link) {
    link.href = wa("Hola NICODE, quiero información sobre sus servicios informáticos.");
    link.rel = "noopener noreferrer";
  }
});
const slides = [...document.querySelectorAll(".slide")];
const dots = document.getElementById("dots");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = 0;
let timer = null;

slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", `Ir al slide ${i+1}`);
  b.onclick = () => showSlide(i);
  dots.appendChild(b);
});
function showSlide(i){
  current = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("active", n === current));
  [...dots.children].forEach((d,n) => d.classList.toggle("active", n === current));
}
function next(){ showSlide(current + 1); }
document.querySelector(".next").onclick = next;
document.querySelector(".prev").onclick = () => showSlide(current - 1);
function stop(){ clearInterval(timer); timer = null; }
function start(){
  if (!prefersReducedMotion && !document.hidden && timer === null) timer = setInterval(next, 4500);
}
showSlide(0);
start();
document.querySelector(".hero").addEventListener("mouseenter", stop);
document.querySelector(".hero").addEventListener("mouseleave", start);
document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());

const header = document.getElementById("header");
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",window.scrollY>15));

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}));

document.querySelectorAll(".quote-service").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.getElementById("service").value=btn.dataset.service;
    document.getElementById("formulario").scrollIntoView({behavior:"smooth"});
  });
});

const quoteForm = document.getElementById("quoteForm");
const quoteStatus = document.getElementById("quoteStatus");
quoteForm.addEventListener("submit",e=>{
  e.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const name=document.getElementById("name").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const service=document.getElementById("service").value;
  const message=document.getElementById("message").value.trim();
  const text = [
    "Hola NICODE, quiero solicitar una cotización.",
    "",
    `*Nombre:* ${name}`,
    `*WhatsApp:* ${phone}`,
    `*Servicio:* *${service}*`,
    `*Necesidad:* ${message}`
  ].join("\n");
  const whatsappWindow = window.open(wa(text), "_blank");
  if (!whatsappWindow) {
    quoteStatus.textContent = "No se pudo abrir WhatsApp. Permite las ventanas emergentes e inténtalo de nuevo.";
    return;
  }
  whatsappWindow.opener = null;
  quoteStatus.textContent = "Se abrió WhatsApp con tu solicitud. Envíala para que NICODE la reciba.";
  quoteForm.reset();
});

const testimonialEntries = [
  {
    quote: "Me explicaron cada paso y dejaron mi computadora funcionando mucho mejor.",
    name: "Andrea Rojas",
    service: "Soporte técnico",
    rating: 5
  },
  {
    quote: "La conexión de la oficina quedó estable y ahora podemos trabajar sin interrupciones.",
    name: "Diego Vargas",
    service: "Redes y conectividad",
    rating: 5
  },
  {
    quote: "Recibí un mantenimiento completo y consejos útiles para cuidar mi laptop.",
    name: "Camila Flores",
    service: "Mantenimiento de equipos",
    rating: 5
  },
  {
    quote: "La impresora volvió a funcionar y también quedó configurada para toda la oficina.",
    name: "Mateo Salazar",
    service: "Soporte de impresoras",
    rating: 5
  },
  {
    quote: "Me ayudaron a instalar los programas que necesitaba de forma rápida y clara.",
    name: "Valeria Quiroga",
    service: "Instalación de software",
    rating: 5
  },
  {
    quote: "Mi equipo estaba muy lento; después de la optimización volvió a responder bien.",
    name: "Gabriel Méndez",
    service: "Optimización de equipos",
    rating: 5
  }
];
const testimonialAvatarImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
];
const testimonialCarousel = document.getElementById("testimonialCarousel");
const testimonialQuote = document.getElementById("testimonialQuote");
const testimonialName = document.getElementById("testimonialName");
const testimonialService = document.getElementById("testimonialService");
const testimonialAvatar = document.getElementById("testimonialAvatar");
const testimonialStars = document.getElementById("testimonialStars");
const testimonialCounter = document.getElementById("testimonialCounter");
const testimonialDots = document.getElementById("testimonialDots");
const testimonialReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeTestimonial = 0;
let testimonialTimer = null;
let testimonialInView = false;
let previousTestimonialAvatar = "";
let testimonialTransitionTimer = null;

function randomTestimonialAvatar() {
  const availableImages = testimonialAvatarImages.filter(image => image !== previousTestimonialAvatar);
  const image = availableImages[Math.floor(Math.random() * availableImages.length)];
  previousTestimonialAvatar = image;
  return image;
}

function renderTestimonial(index) {
  activeTestimonial = (index + testimonialEntries.length) % testimonialEntries.length;
  const entry = testimonialEntries[activeTestimonial];
  window.clearTimeout(testimonialTransitionTimer);
  testimonialCarousel.classList.add("is-changing");
  testimonialTransitionTimer = window.setTimeout(() => {
    testimonialQuote.textContent = `“${entry.quote}”`;
    testimonialName.textContent = entry.name;
    testimonialService.textContent = entry.service;
    testimonialAvatar.src = randomTestimonialAvatar();
    testimonialStars.textContent = "★".repeat(entry.rating) + "☆".repeat(5 - entry.rating);
    testimonialStars.setAttribute("aria-label", `${entry.rating} de 5 estrellas, calificación ficticia`);
    testimonialCounter.textContent = `${String(activeTestimonial + 1).padStart(2, "0")} / ${String(testimonialEntries.length).padStart(2, "0")}`;
    [...testimonialDots.children].forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeTestimonial;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => testimonialCarousel.classList.remove("is-changing"));
    });
  });
}

function stopTestimonialRotation() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = null;
}

function startTestimonialRotation() {
  if (
    testimonialTimer === null &&
    testimonialInView &&
    !document.hidden &&
    !testimonialReducedMotion.matches &&
    !testimonialCarousel.matches(":hover") &&
    !testimonialCarousel.contains(document.activeElement)
  ) {
    testimonialTimer = window.setInterval(() => {
      renderTestimonial(activeTestimonial + 1);
    }, 4500);
  }
}

testimonialEntries.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "testimonial-dot";
  dot.setAttribute("aria-label", `Mostrar opinión ${index + 1} de ${testimonialEntries.length}`);
  dot.addEventListener("click", () => {
    renderTestimonial(index);
    stopTestimonialRotation();
    startTestimonialRotation();
  });
  testimonialDots.appendChild(dot);
});
document.getElementById("testimonialPrev").addEventListener("click", () => {
  renderTestimonial(activeTestimonial - 1);
  stopTestimonialRotation();
  startTestimonialRotation();
});
document.getElementById("testimonialNext").addEventListener("click", () => {
  renderTestimonial(activeTestimonial + 1);
  stopTestimonialRotation();
  startTestimonialRotation();
});
testimonialCarousel.addEventListener("mouseenter", stopTestimonialRotation);
testimonialCarousel.addEventListener("mouseleave", startTestimonialRotation);
testimonialCarousel.addEventListener("focusin", stopTestimonialRotation);
testimonialCarousel.addEventListener("focusout", event => {
  if (!testimonialCarousel.contains(event.relatedTarget)) startTestimonialRotation();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopTestimonialRotation();
  else startTestimonialRotation();
});
testimonialReducedMotion.addEventListener("change", () => {
  if (testimonialReducedMotion.matches) stopTestimonialRotation();
  else startTestimonialRotation();
});
new IntersectionObserver(entries => {
  testimonialInView = entries.some(entry => entry.isIntersecting);
  if (testimonialInView) startTestimonialRotation();
  else stopTestimonialRotation();
}, {threshold: 0.35}).observe(testimonialCarousel);
renderTestimonial(0);

const waBot = document.getElementById("waBot");
const waBotMessages = document.getElementById("waBotMessages");
const waBotOptions = document.getElementById("waBotOptions");
const waBotForm = document.getElementById("waBotForm");
const waBotInput = document.getElementById("waBotInput");
const floatingWA = document.getElementById("floatingWA");
const waBotClose = document.getElementById("waBotClose");
let botStep = "service";
let botLead = {};

function botMessage(text, author = "bot") {
  const message = document.createElement("p");
  message.className = `wa-bot-message ${author}`;
  message.textContent = text;
  waBotMessages.appendChild(message);
  waBotMessages.scrollTop = waBotMessages.scrollHeight;
}

function botOptions(options) {
  waBotOptions.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", option.action);
    waBotOptions.appendChild(button);
  });
}

function askForPriority(service) {
  botLead.service = service;
  botStep = "priority";
  botMessage(service, "user");
  botMessage(`Entendido. Te ayudaré con ${service.toLowerCase()}. ¿Qué tan urgente es tu solicitud?`);
  botOptions(["Hoy mismo", "Esta semana", "Solo quiero cotizar"].map(priority => ({
    label: priority,
    action: () => askForEquipment(priority)
  })));
}

function askForEquipment(priority) {
  botLead.priority = priority;
  botStep = "equipment";
  botMessage(priority, "user");
  const equipmentQuestion = botLead.service === "Redes informáticas"
    ? "¿Cuántos equipos o puntos de conexión necesitas atender?"
    : botLead.service === "Impresoras"
      ? "¿Qué marca y modelo tiene tu impresora?"
      : "¿En qué equipo necesitas ayuda? Indica, si puedes, marca y modelo.";
  botMessage("Gracias por indicarme la prioridad.");
  botMessage(equipmentQuestion);
  botOptions([]);
  waBotInput.focus();
}

function askForName(equipment) {
  botLead.equipment = equipment;
  botStep = "name";
  botMessage(equipment, "user");
  botMessage("Perfecto. ¿Cuál es tu nombre para registrarte?");
  waBotInput.focus();
}

function askForPhone(name) {
  botLead.name = name;
  botStep = "phone";
  botMessage(name, "user");
  botMessage(`Mucho gusto, ${name}. ¿A qué número podemos contactarte por WhatsApp?`);
  waBotInput.focus();
}

function askForDetails(phone) {
  botLead.phone = phone;
  botStep = "details";
  botMessage(phone, "user");
  botMessage("Gracias. Para orientarte mejor, cuéntame brevemente qué problema necesitas resolver o qué resultado esperas.");
  waBotInput.focus();
}

function openBotWhatsApp() {
  const text = botLead.service
    ? [
        "Hola NICODE, quiero solicitar ayuda.", "",
        `*Nombre:* ${botLead.name}`,
        `*WhatsApp:* ${botLead.phone}`,
        `*Servicio:* *${botLead.service}*`,
        `*Prioridad:* ${botLead.priority}`,
        `*Equipo o referencia:* ${botLead.equipment}`,
        `*Necesidad:* ${botLead.details}`
      ].join("\n")
    : "Hola NICODE, quisiera hablar con un asesor.";
  const whatsappWindow = window.open(wa(text), "_blank");
  if (!whatsappWindow) {
    botMessage("No se pudo abrir WhatsApp. Permite las ventanas emergentes e inténtalo de nuevo.");
    return;
  }
  whatsappWindow.opener = null;
}

function finishBot(details) {
  botLead.details = details;
  botStep = "done";
  botMessage(details, "user");
  botMessage("Gracias, ya tengo la información principal para preparar tu atención.");
  botMessage(`Resumen: ${botLead.service} para ${botLead.equipment}, con prioridad ${botLead.priority}.`);
  botMessage("Al abrir WhatsApp, revisa y envía el mensaje para que nuestro equipo continúe contigo.");
  botOptions([
    {label: "Abrir WhatsApp", action: openBotWhatsApp},
    {label: "Comenzar de nuevo", action: resetBot}
  ]);
  waBotInput.disabled = true;
}

function resetBot() {
  botStep = "service";
  botLead = {};
  waBotMessages.innerHTML = "";
  waBotInput.value = "";
  waBotInput.disabled = false;
  botMessage("¡Hola! Soy el asistente virtual de NICODE. Te ayudo a identificar el servicio que necesitas.");
  botMessage(`Elige una opción o escribe a nuestro equipo por WhatsApp: ${BUSINESS_PHONE}.`);
  botOptions([
    {label: "Hablar con un asesor", action: openBotWhatsApp},
    ...[
      "Soporte técnico", "Mantenimiento de PC", "Instalación de software",
      "Redes informáticas", "Impresoras", "Optimización de equipos"
    ].map(service => ({label: service, action: () => askForPriority(service)}))
  ]);
}

function toggleBot(open) {
  const shouldOpen = typeof open === "boolean" ? open : waBot.getAttribute("aria-hidden") === "true";
  waBot.setAttribute("aria-hidden", String(!shouldOpen));
  waBot.inert = !shouldOpen;
  floatingWA.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) waBotInput.focus();
  else floatingWA.focus();
}

floatingWA.addEventListener("click", () => {
  const isClosed = waBot.getAttribute("aria-hidden") === "true";
  if (isClosed && !waBotMessages.children.length) resetBot();
  toggleBot(isClosed);
});
waBotClose.addEventListener("click", () => toggleBot(false));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && waBot.getAttribute("aria-hidden") === "false") toggleBot(false);
});
waBotForm.addEventListener("submit", event => {
  event.preventDefault();
  const value = waBotInput.value.trim();
  if (!value || botStep === "service" || botStep === "done") return;
  waBotInput.value = "";
  if (botStep === "equipment") askForName(value);
  else if (botStep === "name") askForPhone(value);
  else if (botStep === "phone") askForDetails(value);
  else if (botStep === "details") finishBot(value);
});

// Animaciones de entrada al aparecer cada sección en pantalla.
const revealItems = document.querySelectorAll(".section, .card, .why-grid > div");
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {rootMargin: "0px 0px -8% 0px", threshold: 0.05});
revealItems.forEach(item => {
  item.classList.add("reveal-item");
  revealObserver.observe(item);
});

function revealVisibleItems() {
  revealItems.forEach(item => {
    const bounds = item.getBoundingClientRect();
    if (bounds.top < window.innerHeight * .92 && bounds.bottom > 0) {
      item.classList.add("is-visible");
    }
  });
}
window.addEventListener("scroll", revealVisibleItems, {passive: true});
window.addEventListener("resize", revealVisibleItems);
revealVisibleItems();

// Marca en el encabezado la sección que el visitante está leyendo.
const navLinks = [...document.querySelectorAll(".nav a")];
const trackedSections = navLinks
  .map(link => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${entry.target.id}`
    ));
  });
}, {rootMargin: "-20% 0px -55% 0px", threshold: 0});
trackedSections.forEach(section => sectionObserver.observe(section));

function updateActiveNav() {
  const currentSection = trackedSections.reduce((closest, section) => {
    const distance = Math.abs(section.getBoundingClientRect().top - 110);
    return distance < closest.distance ? {section, distance} : closest;
  }, {section: null, distance: Infinity}).section;
  if (!currentSection) return;
  navLinks.forEach(link => link.classList.toggle(
    "active",
    link.getAttribute("href") === `#${currentSection.id}`
  ));
}
window.addEventListener("scroll", updateActiveNav, {passive: true});
updateActiveNav();

// Convierte valores como "+50" y "100%" en contadores animados.
function animateStat(stat) {
  if (stat.dataset.animated) return;
  stat.dataset.animated = "true";
  const original = stat.textContent.trim();
  const match = original.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return;
  const prefix = match[1];
  const target = Number(match[2]);
  const suffix = match[3];
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    stat.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll("strong").forEach(animateStat);
    statObserver.unobserve(entry.target);
  });
}, {threshold: 0.5});
document.querySelectorAll(".stats").forEach(stats => statObserver.observe(stats));

// Permite cambiar el hero con swipe en pantallas táctiles y con el teclado.
let touchStartX = 0;
const hero = document.querySelector(".hero");
hero.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, {passive: true});
hero.addEventListener("touchend", event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) < 45) return;
  showSlide(current + (distance < 0 ? 1 : -1));
  reset();
}, {passive: true});
document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") showSlide(current + 1);
  if (event.key === "ArrowLeft") showSlide(current - 1);
});

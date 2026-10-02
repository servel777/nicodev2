const WHATSAPP_NUMBER = "59172558600";
const BUSINESS_PHONE = "+591 72558600";
function wa(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}

const captchaCanvas = document.getElementById("captchaCanvas");
const captchaContext = captchaCanvas.getContext("2d");
const captchaImage = document.createElement("canvas");
captchaImage.width = captchaCanvas.width;
captchaImage.height = captchaCanvas.height;
const captchaImageContext = captchaImage.getContext("2d");
const captchaGate = document.getElementById("captchaGate");
const captchaSlider = document.getElementById("captchaSlider");
const captchaStatus = document.getElementById("captchaStatus");
const captchaRefresh = document.getElementById("captchaRefresh");
const captchaPageElements = [
  document.getElementById("header"),
  document.querySelector("main"),
  document.querySelector("footer"),
  document.getElementById("waBot"),
  document.getElementById("floatingWA")
].filter(Boolean);
const captchaPieceSize = 48;
let captchaTarget = 0;
let captchaSolved = false;

document.body.classList.add("captcha-gate-open");
captchaPageElements.forEach(element => { element.inert = true; });

function tracePuzzlePiece(context, x, y) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 15, y);
  context.bezierCurveTo(x + 11, y - 16, x + 37, y - 16, x + 33, y);
  context.lineTo(x + captchaPieceSize, y);
  context.lineTo(x + captchaPieceSize, y + captchaPieceSize);
  context.lineTo(x, y + captchaPieceSize);
  context.closePath();
}

function drawCaptcha() {
  const context = captchaImageContext;
  const image = captchaImage;
  const gradient = context.createLinearGradient(0, 0, image.width, image.height);
  gradient.addColorStop(0, "#d5eef0");
  gradient.addColorStop(1, "#f6d7ad");
  context.fillStyle = gradient;
  context.fillRect(0, 0, image.width, image.height);

  context.fillStyle = "#2d7b78";
  context.beginPath();
  context.arc(286, 38, 19, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f5a65b";
  context.beginPath();
  context.moveTo(0, 126);
  context.lineTo(105, 65);
  context.lineTo(213, 126);
  context.lineTo(310, 76);
  context.lineTo(360, 111);
  context.lineTo(360, 160);
  context.lineTo(0, 160);
  context.fill();
  context.fillStyle = "#28666d";
  context.fillRect(0, 135, image.width, 25);

  for (let index = 0; index < 7; index += 1) {
    const x = 22 + index * 47;
    context.strokeStyle = "rgba(255,255,255,0.38)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 16, 26);
    context.lineTo(x + 5, 49);
    context.stroke();
  }

  captchaContext.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
  captchaContext.drawImage(image, 0, 0);
  tracePuzzlePiece(captchaContext, captchaTarget, 57);
  captchaContext.fillStyle = "rgba(15, 37, 51, 0.48)";
  captchaContext.fill();
  captchaContext.strokeStyle = "rgba(255,255,255,0.9)";
  captchaContext.setLineDash([5, 4]);
  captchaContext.stroke();
  captchaContext.setLineDash([]);

  const position = Number(captchaSlider.value);
  tracePuzzlePiece(captchaContext, position, 57);
  captchaContext.save();
  captchaContext.clip();
  captchaContext.drawImage(image, position - captchaTarget, 0);
  captchaContext.restore();
  tracePuzzlePiece(captchaContext, position, 57);
  captchaContext.strokeStyle = "#fff";
  captchaContext.lineWidth = 2;
  captchaContext.stroke();
}

function buildCaptcha() {
  captchaTarget = 120 + Math.floor(Math.random() * 130);
  captchaSolved = false;
  captchaSlider.disabled = false;
  captchaRefresh.disabled = false;
  captchaSlider.value = "0";
  captchaStatus.textContent = "Mueve el control para encajar la pieza.";
  captchaStatus.classList.remove("is-solved");
  drawCaptcha();
}

captchaSlider.addEventListener("input", () => {
  captchaSolved = Math.abs(Number(captchaSlider.value) - captchaTarget) <= 6;
  captchaStatus.textContent = captchaSolved
    ? "Verificación completada. Bienvenido a NICODE."
    : "Mueve el control para encajar la pieza.";
  captchaStatus.classList.toggle("is-solved", captchaSolved);
  drawCaptcha();

  if (captchaSolved) {
    captchaSlider.disabled = true;
    captchaRefresh.disabled = true;
    captchaGate.classList.add("is-accepted");
    captchaPageElements.forEach(element => { element.inert = false; });
    document.body.classList.remove("captcha-gate-open");
    window.setTimeout(() => {
      captchaGate.hidden = true;
      captchaSlider.disabled = false;
    }, 450);
  }
});
captchaRefresh.addEventListener("click", buildCaptcha);
buildCaptcha();
captchaSlider.focus();

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

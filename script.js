const milestones = [["August 2025","up","compact","photo","first-date-snapchat.png","26 Aug 2025 · planning our first date"],["August 2025","down","compact","photo","after-first-date.jpeg","Before we met"],["August 2025","up","compact","photo","first-imessage.png","27 Aug 2025 · your first message"],["November 2025","down","compact","photo"],["December 2025","up","wide","hidden"],["January 2026","down","tall","visible"],["February 2026","up","compact","photo"],["March 2026","down","wide","visible"],["April 2026","up","tall","hidden"],["May 2026","down","compact","photo"],["June 2026","up","wide","visible"],["July 2026","down","tall","hidden"],["August 2026","up","compact","photo"],["September 2026","down","wide","visible"],["October 2026","up","tall","hidden"]];

const items = document.querySelector("#timeline-items");
const shell = document.querySelector(".timeline-shell");
const canvas = document.querySelector(".timeline-canvas");
const monthIndicator = document.querySelector("#current-month");
const intro = document.querySelector(".intro");
const finale = document.querySelector(".finale");
const mobileQuery = window.matchMedia("(max-width: 700px)");
let mobileFinaleStart = 0;
let mobileFinaleRange = 1;

function memoryCard(date, direction, size, type, image, caption, index) {
  const x = [680, 1085, 1400, 1735, 1980, 2415, 2760, 3025, 3375, 3760, 4090, 4515, 4780, 5165, 5530][index];
  const gap = [20, 14, 38, 24, 32, 20, 28, 36, 24, 18, 34, 26, 22, 30, 28][index];
  const cardWidth = { compact: 300, wide: 340, tall: 320 }[size];
  const content = type === "photo"
    ? image
      ? `<figure class="photo-moment"><img src="assets/${image}" alt="${caption}"><figcaption>${caption}</figcaption></figure>`
      : `<div class="photo-placeholder">Photo goes here</div>`
    : type === "hidden"
      ? `<span class="note-copy">A private little note can live here. Replace this placeholder with something only the two of you know.</span>`
      : `<div class="visible-note"><span>Visible note</span><p>A little message can live here, ready to be read straight away.</p></div>`;
  const label = type === "photo" ? "photo placeholder" : type === "hidden" ? "hidden note" : "visible note";
  const card = type === "hidden"
    ? `<button class="memory-card ${size} hidden-card note-reveal" type="button" aria-pressed="false" aria-label="Reveal hidden note">${content}</button>`
    : `<div class="memory-card ${size} ${type}-card">${content}</div>`;
  return `<article class="timeline-item ${direction}" data-gap="${gap}" style="--x:${x}px;--card-width:${cardWidth}px" aria-label="${label}">${card}</article>`;
}

items.innerHTML = milestones.map(([date, direction, size, type, image, caption], index) => memoryCard(date, direction, size, type, image, caption, index)).join("");

function isMobile() {
  return mobileQuery.matches;
}

function alignDesktopTimeline() {
  const lineY = canvas.clientHeight * 0.52;
  document.querySelectorAll(".timeline-item").forEach((item) => {
    const card = item.querySelector(".memory-card");
    const gap = Number.parseFloat(item.dataset.gap);
    const top = item.classList.contains("up") ? lineY - card.offsetHeight - gap : lineY + gap;
    const cardWidth = card.classList.contains("wide") ? 340 : card.classList.contains("tall") ? 320 : 300;
    item.style.setProperty("--card-width", `${cardWidth}px`);
    item.style.left = item.style.getPropertyValue("--x");
    item.style.top = `${top}px`;
    item.style.setProperty("--branch", `${gap}px`);
    item.classList.remove("mobile-left", "mobile-right");
  });
}

function alignMobileTimeline() {
  const railX = canvas.clientWidth / 2;
  const cardWidth = Math.min(canvas.clientWidth * 0.44, 260);
  const railStart = intro.offsetTop + intro.offsetHeight + 70;
  let cursor = railStart + 36;

  document.querySelectorAll(".timeline-item").forEach((item, index) => {
    const card = item.querySelector(".memory-card");
    const isLeft = index % 2 === 0;
    const gap = 14 + (index % 3) * 6;
    const left = isLeft ? railX - cardWidth - gap : railX + gap;

    item.style.setProperty("--card-width", `${cardWidth}px`);
    item.style.left = `${left}px`;
    item.style.top = `${cursor}px`;
    item.style.setProperty("--branch", `${gap}px`);
    item.classList.toggle("mobile-left", isLeft);
    item.classList.toggle("mobile-right", !isLeft);
    cursor += card.offsetHeight + 78 + (index % 3) * 12;
  });

  const lastItem = items.lastElementChild;
  const lastCard = lastItem.querySelector(".memory-card");
  const lastBottom = lastItem.offsetTop + lastCard.offsetHeight;
  const runway = window.innerHeight * 0.8;
  canvas.style.minHeight = `${lastBottom + window.innerHeight + runway}px`;
  canvas.style.setProperty("--rail-start", `${railStart}px`);
  canvas.style.setProperty("--rail-height", `${lastBottom - railStart + 28}px`);
  mobileFinaleStart = canvas.offsetTop + lastBottom + 32;
  mobileFinaleRange = Math.max(1, runway);
}

function resetHiddenNotes() {
  document.querySelectorAll(".note-reveal.is-revealed").forEach((note) => {
    note.classList.remove("is-revealed");
    note.setAttribute("aria-pressed", "false");
  });
}

function updateDesktopFinale() {
  const maxScroll = shell.scrollWidth - shell.clientWidth;
  const lastItem = items.lastElementChild;
  const lastCard = lastItem.querySelector(".memory-card");
  const finaleStart = lastItem.offsetLeft + lastCard.offsetWidth + 20;
  const finaleRange = Math.max(1, maxScroll - finaleStart);
  const progress = Math.max(0, Math.min(1, (shell.scrollLeft - finaleStart) / finaleRange));
  finale.style.opacity = progress;
  finale.style.transform = `translateX(${(1 - progress) * 22}vw) scale(${0.9 + progress * 0.1})`;
  finale.setAttribute("aria-hidden", String(progress < 0.98));
  shell.style.opacity = String(1 - progress);
  shell.style.filter = `blur(${progress * 3}px)`;
  monthIndicator.style.opacity = String(1 - progress);
}

function updateDesktopMonth() {
  const index = Math.min(milestones.length - 1, Math.floor((shell.scrollLeft + 120) / 315));
  monthIndicator.textContent = milestones[index][0];
}

function updateDesktopIntro() {
  const progress = Math.min(1, shell.scrollLeft / 240);
  intro.style.opacity = String(1 - progress);
  intro.style.transform = `translate(${-progress * 8}vw, -50%) scale(${1 - progress * 0.05})`;
  if (shell.scrollLeft < 240) monthIndicator.style.opacity = String(progress);
}

function updateMobileFinale() {
  const progress = Math.max(0, Math.min(1, (window.scrollY - mobileFinaleStart) / mobileFinaleRange));
  finale.style.opacity = progress;
  finale.style.transform = `translateY(${(1 - progress) * 18}vh) scale(${0.92 + progress * 0.08})`;
  finale.setAttribute("aria-hidden", String(progress < 0.98));
  shell.style.opacity = String(1 - progress);
  shell.style.filter = `blur(${progress * 3}px)`;
  monthIndicator.style.opacity = String(1 - progress);
}

function updateMobileMonth() {
  const localY = window.scrollY - canvas.offsetTop + window.innerHeight * 0.25;
  let monthIndex = 0;
  document.querySelectorAll(".timeline-item").forEach((item, index) => {
    if (item.offsetTop <= localY) monthIndex = index;
  });
  monthIndicator.textContent = milestones[monthIndex][0];
}

function updateMobileIntro() {
  const progress = Math.min(1, window.scrollY / Math.max(180, intro.offsetHeight * 0.55));
  intro.style.opacity = String(1 - progress);
  intro.style.transform = `translateY(${-progress * 2}rem) scale(${1 - progress * 0.04})`;
  if (progress < 1) monthIndicator.style.opacity = String(progress);
}

function updateLayout() {
  document.body.classList.toggle("mobile-timeline", isMobile());
  canvas.style.minHeight = "";
  if (isMobile()) {
    alignMobileTimeline();
    updateMobileFinale();
    updateMobileMonth();
    updateMobileIntro();
  } else {
    alignDesktopTimeline();
    updateDesktopFinale();
    updateDesktopMonth();
    updateDesktopIntro();
  }
}

document.querySelectorAll(".note-reveal").forEach((button) => button.addEventListener("click", () => {
  const revealed = button.classList.toggle("is-revealed");
  button.setAttribute("aria-pressed", String(revealed));
}));

shell.addEventListener("wheel", (event) => {
  if (isMobile() || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || shell.scrollWidth <= shell.clientWidth) return;
  event.preventDefault();
  shell.scrollLeft += event.deltaY;
}, { passive: false });

shell.addEventListener("scroll", () => {
  if (isMobile()) return;
  resetHiddenNotes();
  updateDesktopFinale();
  updateDesktopMonth();
  updateDesktopIntro();
}, { passive: true });

window.addEventListener("scroll", () => {
  if (!isMobile()) return;
  resetHiddenNotes();
  updateMobileFinale();
  updateMobileMonth();
  updateMobileIntro();
}, { passive: true });

window.addEventListener("resize", updateLayout);
mobileQuery.addEventListener("change", updateLayout);
window.addEventListener("load", updateLayout);
updateLayout();

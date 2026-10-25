const milestones = [["August 2025","up","compact","photo","first-date-snapchat.png","26 Aug 2025 · planning our first date"],["August 2025","down","compact","photo","after-first-date.jpeg","Before we met"],["August 2025","up","compact","photo","first-imessage.png","27 Aug 2025 · your first message"],["November 2025","down","compact","photo"],["December 2025","up","wide","hidden"],["January 2026","down","tall","visible"],["February 2026","up","compact","photo"],["March 2026","down","wide","visible"],["April 2026","up","tall","hidden"],["May 2026","down","compact","photo"],["June 2026","up","wide","visible"],["July 2026","down","tall","hidden"],["August 2026","up","compact","photo"],["September 2026","down","wide","visible"],["October 2026","up","tall","hidden"]];
const items = document.querySelector("#timeline-items");
const shell = document.querySelector(".timeline-shell");
const canvas = document.querySelector(".timeline-canvas");
const monthIndicator = document.querySelector("#current-month");
const intro = document.querySelector(".intro");
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
const cards = milestones.map(([date,direction,size,type,image,caption],index) => memoryCard(date,direction,size,type,image,caption,index));
items.innerHTML = cards.join("");
function alignTimelineConnectors() {
  const lineY = canvas.clientHeight * 0.52;
  document.querySelectorAll(".timeline-item").forEach((item) => {
    const card = item.querySelector(".memory-card");
    const gap = Number.parseFloat(item.dataset.gap);
    const isUp = item.classList.contains("up");
    const top = isUp ? lineY - card.offsetHeight - gap : lineY + gap;
    item.style.top = `${top}px`;
    item.style.setProperty("--branch", `${gap}px`);
  });
}
alignTimelineConnectors();
window.addEventListener("resize", alignTimelineConnectors);
document.querySelectorAll(".note-reveal").forEach((button) => button.addEventListener("click", () => { const revealed = button.classList.toggle("is-revealed"); button.setAttribute("aria-pressed", String(revealed)); }));
shell.addEventListener("wheel", (event) => { if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || shell.scrollWidth <= shell.clientWidth) return; event.preventDefault(); shell.scrollLeft += event.deltaY; }, { passive:false });
const finale = document.querySelector(".finale");
function updateFinale() {
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
function updateMonthIndicator() {
  const index = Math.min(milestones.length - 1, Math.floor((shell.scrollLeft + 120) / 315));
  monthIndicator.textContent = milestones[index][0];
}
function updateIntro() {
  const progress = Math.min(1, shell.scrollLeft / 240);
  intro.style.opacity = String(1 - progress);
  intro.style.transform = `translate(${-progress * 8}vw, -50%) scale(${1 - progress * 0.05})`;
  if (shell.scrollLeft < 240) monthIndicator.style.opacity = String(progress);
}
shell.addEventListener("scroll", () => {
  document.querySelectorAll(".note-reveal.is-revealed").forEach((note) => {
    note.classList.remove("is-revealed");
    note.setAttribute("aria-pressed", "false");
  });
  updateFinale();
  updateMonthIndicator();
  updateIntro();
}, { passive:true });
updateFinale();
updateMonthIndicator();
updateIntro();

import { memories } from "./memories.js?v=0.5";

const box = document.querySelector("#box");
const lid = box.querySelector(".lid");
const lift = document.querySelector("#lift");
const inside = document.querySelector("#keepsakes");
const closeLid = document.querySelector("#close-lid");
const reader = document.querySelector(".reader");
const pages = reader.querySelector(".pages");
const controls = reader.querySelector(".reader-controls");
const thumbs = reader.querySelector(".contact-sheet");
const previous = reader.querySelector(".previous");
const next = reader.querySelector(".next");

const notesFor = key => memories.filter(memory => memory.object === key && memory.body);
const backs = new Map(memories.filter(memory => memory.backOf).map(memory => [memory.backOf, memory.body]));
const firsts = memories.filter(memory => memory.object === "firsts").flatMap(memory => memory.prints);
const photos = memories.filter(memory => memory.prints && memory.object !== "firsts").flatMap(memory => memory.prints);
const birthday = notesFor("receipt");
const letterNotes = notesFor("anniversary");
const objects = {
  fit: { title: "I did watch them btw.", pages: notesFor("fit") },
  firsts: { title: "Before we met", pages: firsts },
  receipt: { title: "The birthday receipt", pages: [{ body: [birthday[0].body + " " + birthday[1].body, ...birthday.slice(2).map(m => m.body)].join("\n\n") }] },
  photos: { title: "Our photo pile", pages: photos },
  letters: { title: "Little letters", pages: notesFor("letters") },
  anniversary: { title: "7 November", pages: letterNotes.filter(memory => memory.letter) }
};
const bookmarks = new Map();
let pickedUp;
let pageIndex = 0;
let reverse = false;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(text, action, className) {
  const node = element("button", className, text);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}

lift.addEventListener("click", async () => {
  if (lid.classList.contains("lifting")) return;
  lid.classList.add("lifting");
  await Promise.allSettled(lid.getAnimations().map(animation => animation.finished));
  lid.hidden = true;
  lid.classList.remove("lifting");
  inside.hidden = false;
  box.classList.add("is-open");
  lift.setAttribute("aria-expanded", "true");
  inside.querySelector(".object").focus({ preventScroll: true });
});
closeLid.addEventListener("click", () => {
  inside.hidden = true;
  box.classList.remove("is-open");
  lid.hidden = false;
  lift.setAttribute("aria-expanded", "false");
  lift.focus({ preventScroll: true });
});

function turnOver() {
  reverse = !reverse;
  render();
  pages.querySelector(".turn").focus({ preventScroll: true });
  reader.scrollTop = 0;
}

function printPage(print) {
  const notes = backs.get(print.file);
  const url = "assets/" + print.file;
  if (reverse && notes) {
    const paper = element("div", "sheet");
    paper.append(element("p", "", notes));
    pages.append(paper);
  } else {
    const figure = element("figure", "print");
    const image = element("img");
    image.src = url;
    image.alt = print.alt;
    image.width = print.width;
    image.height = print.height;
    figure.append(image, element("figcaption", "", print.caption));
    pages.append(figure);
  }
  const actions = element("div", "print-actions");
  if (notes) actions.append(button(reverse ? "See the photo" : "Read the back", turnOver, "turn"));
  const original = element("a", "original", "Full size ↗");
  original.href = url;
  original.target = "_blank";
  original.rel = "noopener";
  actions.append(original);
  pages.append(actions);
}

function anniversaryLetter() {
  const paper = element("article", reverse ? "sheet letter-back" : "sheet");
  if (reverse) {
    paper.append(element("p", "", "A lifetime won’t be enough to spend with you."));
  } else {
    for (const note of letterNotes) {
      if (note.fold) paper.append(element("h3", "paper-title", note.fold));
      if (note.letter) {
        paper.append(element("h3", "paper-title", note.title));
        const [message, question] = note.body.split("\n");
        paper.append(element("p", "", message), element("p", "question", question));
      } else {
        paper.append(element("p", "", note.body));
      }
    }
  }
  const actions = element("div", "print-actions");
  actions.append(button(reverse ? "Read the letter" : "Turn the letter over", turnOver, "turn"));
  pages.append(paper, actions);
}

function drawThumbs(collection) {
  thumbs.replaceChildren();
  thumbs.hidden = !collection.pages[0].file;
  if (thumbs.hidden) return;
  collection.pages.forEach((print, index) => {
    const thumb = button("", () => gotoPage(index));
    thumb.setAttribute("aria-label", print.caption);
    const img = element("img");
    img.alt = "";
    img.src = "assets/" + print.file;
    img.loading = "lazy";
    thumb.append(img);
    thumbs.append(thumb);
  });
}

function render() {
  const key = pickedUp.dataset.object;
  const collection = objects[key];
  const page = collection.pages[pageIndex];
  pages.replaceChildren();
  if (page.file) {
    printPage(page);
  } else if (key === "anniversary") {
    anniversaryLetter();
  } else {
    const paper = element("article", key === "receipt" ? "sheet receipt-back" : "sheet");
    if (key === "receipt") paper.append(element("h3", "paper-title", "Krispy Kreme"));
    if (key === "letters") paper.append(element("h3", "paper-title", page.fold || page.period));
    paper.append(element("p", "", page.body));
    pages.append(paper);
  }
  controls.hidden = collection.pages.length <= 1;
  reader.querySelector(".position").textContent = `${pageIndex + 1} / ${collection.pages.length}`;
  previous.disabled = pageIndex === 0;
  next.disabled = pageIndex === collection.pages.length - 1;
  for (const [i, thumb] of Array.from(thumbs.children).entries()) {
    thumb.setAttribute("aria-current", String(i === pageIndex));
  }
  const active = thumbs.children[pageIndex];
  if (active) thumbs.scrollLeft += active.getBoundingClientRect().left - thumbs.getBoundingClientRect().left - (thumbs.clientWidth - active.offsetWidth) / 2;
}

function gotoPage(index) {
  const count = objects[pickedUp.dataset.object].pages.length;
  if (index < 0 || index >= count) return;
  pageIndex = index;
  bookmarks.set(pickedUp.dataset.object, pageIndex);
  reverse = false;
  render();
  reader.scrollTop = 0;
}

inside.querySelectorAll(".object").forEach(object => {
  object.setAttribute("aria-haspopup", "dialog");
  object.addEventListener("click", () => {
    pickedUp = object;
    const key = object.dataset.object;
    pageIndex = bookmarks.get(key) || 0;
    reverse = false;
    reader.querySelector("h2").textContent = objects[key].title;
    drawThumbs(objects[key]);
    reader.showModal();
    render();
    reader.scrollTop = 0;
    reader.querySelector(".put-back").focus({ preventScroll: true });
  });
});
previous.addEventListener("click", () => gotoPage(pageIndex - 1));
next.addEventListener("click", () => gotoPage(pageIndex + 1));
reader.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  gotoPage(pageIndex + (event.key === "ArrowRight" ? 1 : -1));
});
function putBack() {
  reader.close();
  pickedUp.classList.add("returned");
  pickedUp.focus({ preventScroll: true });
}
reader.querySelector(".put-back").addEventListener("click", putBack);
reader.addEventListener("cancel", event => {
  event.preventDefault();
  putBack();
});
reader.addEventListener("click", event => {
  if (event.target !== reader) return;
  const r = reader.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) putBack();
});

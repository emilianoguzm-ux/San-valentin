function splitText(element) {
  const text = element.innerText;
  element.innerHTML = "";
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.innerHTML = ch === " " ? "&nbsp;" : ch;
    element.appendChild(span);
  });
}
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }


function spawnHeart() {
  const layer = document.getElementById("hearts-layer");
  const heart = document.createElement("div");
  layer.appendChild(heart);

  const size = rand(10, 28);
  const startX = rand(0, window.innerWidth);
  const duration = rand(4.5, 8.5);
  const drift = rand(-120, 120);

  heart.style.cssText = `
    width:${size}px;height:${size}px;left:${startX}px;bottom:-40px;
    position:fixed;pointer-events:none;z-index:1;
    background:rgba(255,45,85,0.9);
    transform:rotate(45deg);border-radius:4px;
  `;

  const a = document.createElement("div");
  const b = document.createElement("div");
  [a, b].forEach((el) => {
    el.style.position = "absolute";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.background = "inherit";
    el.style.borderRadius = "50%";
  });
  a.style.left = "-50%"; a.style.top = "0";
  b.style.left = "0";   b.style.top = "-50%";
  heart.appendChild(a); heart.appendChild(b);

  gsap.to(heart, {
    y: -(window.innerHeight + 140),
    x: drift,
    duration,
    ease: "none",
    onComplete: () => heart.remove()
  });
}
function burstHearts(n = 18) { for (let i = 0; i < n; i++) setTimeout(spawnHeart, i * 25); }
function startFloatingHearts() {
  for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 120);
  return setInterval(spawnHeart, 170);
}

const IMAGES = ["data/8b281ed3-6405-44c3-9417-655f5da03185.JPG", "data/9a2a2670-822c-4ecb-b449-7c279a9199c7.JPG", "data/9e305568-7629-4f4c-b7e7-f00b76c41c91.JPG", "data/9e305568-7629-4f4c-b7e7-f00b76c41c91.JPG", "data/668cfcd4-ad86-44da-b155-74c740f6cddf.JPG"];
let imgIndex = 0;

function spawnImageCrazy() {
  const layer = document.getElementById("image-layer");
  const img = document.createElement("img");
  img.className = "pop-img";
  img.src = IMAGES[imgIndex % IMAGES.length];
  imgIndex++;
  layer.appendChild(img);

  const w = Math.min(240, window.innerWidth * 0.42);
  const margin = 16;
  img.style.left = `${rand(margin, window.innerWidth - w - margin)}px`;
  img.style.top = `${rand(60, window.innerHeight - 260)}px`;

  gsap.fromTo(img, { opacity: 0, scale: 0.08, rotation: rand(-28, 28) },
                  { opacity: 0.95, scale: rand(0.45, 0.95), duration: 0.45, ease: "back.out(2.6)" });
}

function removeAllImagesThen(cb) {
  const imgs = Array.from(document.querySelectorAll("#image-layer .pop-img"));
  if (imgs.length === 0) { cb?.(); return; }
  gsap.to(imgs, {
    opacity: 0,
    scale: 0.7,
    duration: 0.25,
    stagger: 0.03,
    onComplete: () => { imgs.forEach((i) => i.remove()); cb?.(); }
  });
}

function randomSpot(btnW = 150, btnH = 130) {
  const marginX = 30, marginY = 30;
  const minX = marginX + btnW/2, maxX = window.innerWidth - marginX - btnW/2;
  const minY = marginY + btnH/2, maxY = window.innerHeight - marginY - btnH/2;
  return { x: rand(minX, maxX), y: rand(minY, maxY) };
}
function chaosMoveNo(btn, scale) {
  const rect = btn.getBoundingClientRect();
  const { x, y } = randomSpot(rect.width || 150, rect.height || 130);
  gsap.to(btn, { left: x, top: y, scale, rotation: rand(-35, 35), duration: rand(0.16, 0.32), ease: "bounce.out" });
}

function showMessageReplaceTitles(msg) {
  gsap.to(["#title", "#subtitle"], {
    opacity: 0, y: -10, duration: 0.18,
    onComplete: () => {
      document.getElementById("title").style.display = "none";
      document.getElementById("subtitle").style.display = "none";
    }
  });

  result.textContent = msg;
  result.classList.remove("hidden");
  gsap.fromTo(result, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
}

const videoOverlay = document.getElementById("videoOverlay");
const valentinVideo = document.getElementById("valentinVideo");
const closeVideoBtn = document.getElementById("closeVideo");

function hardHideOverlayOnLoad() {
  videoOverlay.classList.add("hidden");
  videoOverlay.setAttribute("aria-hidden", "true");
  videoOverlay.style.opacity = "0";
}
hardHideOverlayOnLoad();

function openVideoOverlay() {
  videoOverlay.classList.remove("hidden");
  videoOverlay.setAttribute("aria-hidden", "false");
  gsap.to(videoOverlay, { opacity: 1, duration: 0.2, ease: "power2.out" });
}

function closeVideoOverlay() {
  try { valentinVideo.pause(); } catch {}
  gsap.to(videoOverlay, {
    opacity: 0,
    duration: 0.18,
    ease: "power2.out",
    onComplete: () => {
      videoOverlay.classList.add("hidden");
      videoOverlay.setAttribute("aria-hidden", "true");
    }
  });
}

async function playValentinVideo() {
  openVideoOverlay();
  valentinVideo.currentTime = 0;

  valentinVideo.muted = false;
  try { await valentinVideo.play(); return; } catch {}

  valentinVideo.muted = true;
  try { await valentinVideo.play(); } catch {}
}

videoOverlay.addEventListener("click", (e) => { if (e.target === videoOverlay) closeVideoOverlay(); });
closeVideoBtn.addEventListener("click", closeVideoOverlay);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !videoOverlay.classList.contains("hidden")) closeVideoOverlay();
});
valentinVideo.addEventListener("ended", closeVideoOverlay);

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const textBlock = document.getElementById("textBlock");
const buttons = document.getElementById("buttons");
const result = document.getElementById("result");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");

splitText(title);
splitText(subtitle);

let heartsInterval = null;
let noClicks = 0;
let noScale = 1;

const tl = gsap.timeline();
tl.fromTo("#title .char", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: "back.out(1.7)" });
tl.fromTo("#subtitle .char", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.045, ease: "elastic.out(1, 0.45)" }, "+=0.25");
tl.add(() => { heartsInterval = startFloatingHearts(); }, "+=0.1");
tl.to(textBlock, { y: -90, duration: 0.7, ease: "power2.out" }, "+=0.6");
tl.add(() => { buttons.classList.remove("hidden"); }, "-=0.05");
tl.fromTo([btnYes, btnNo], { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: "back.out(1.9)" });

btnYes.addEventListener("click", () => {
  showMessageReplaceTitles("yupii Tendremos una miffy cita de miffy san valentin! 🥰");
  burstHearts(50);

  gsap.to(btnNo, { scale: 0, opacity: 0, duration: 0.28, ease: "back.in(1.4)" });
  btnNo.disabled = true;
  btnYes.disabled = true;

  removeAllImagesThen(() => playValentinVideo());
});

btnNo.addEventListener("click", () => {
  noClicks++;
  spawnImageCrazy();

  noScale = clamp(noScale * 0.78, 0.12, 1);
  chaosMoveNo(btnNo, noScale);

  const msgs = ["Porque noooo? 😳", "jajaja me odias verdad?", "que mal plan jaja otra vez?", "ya dale que sii", "jaja este mensaje ya es infinito hasta que le des si"];
  showMessageReplaceTitles(msgs[Math.min(noClicks - 1, msgs.length - 1)]);
});


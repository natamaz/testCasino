import '../scss/style.scss'
import {gsap} from "gsap";
window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});


//preloader
const preloader = document.getElementById("preloader");
const fireworks = document.getElementById("fireworks");
const text = preloader.textContent.trim();
preloader.textContent = "";
text.split("").forEach(char => {
  const span = document.createElement("span");
  span.textContent = char === " " ? "\u00A0" : char;
  span.classList.add("letter");
  preloader.appendChild(span);
});
gsap.to(".letter", {
  opacity: 1,
  y: 0,
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.05,
  onComplete: () => {
    launchSparkFireworksInWaves(40, 70);
    setTimeout(() => {
      gsap.to("#preloader", {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          preloader.style.display = "none";
          const main = document.getElementById("wrapper");
          main.style.display = "flex";
          gsap.to(main, { opacity: 1, y: -10, duration: 1 });
        }
      });
    }, 3000);
  }
});
function launchSparkFireworksInWaves(total = 3000, delay = 80) {
  let launched = 0;
  const interval = setInterval(() => {
    if (launched >= total) {
      clearInterval(interval);
      return;
    }
    launchOneFirework();
    launched++;
  }, delay);
}
function launchOneFirework() {
  const firework = document.createElement("div");
  firework.classList.add("firework");
  firework.style.left = Math.random() * window.innerWidth + "px";
  firework.style.top = Math.random() * window.innerHeight * 0.6 + "px";

  const sparkCount = 24;
  for (let j = 0; j < sparkCount; j++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.transform = `rotate(${(360 / sparkCount) * j}deg)`;
    spark.style.backgroundColor = randomColor();
    firework.appendChild(spark);
  }

  fireworks.appendChild(firework);
  setTimeout(() => firework.remove(), 1000);
}
function randomColor() {
  const colors = ["#bf953f", "#fcf6ba", "#b38728", "#fbf5b7", "#aa771c"];
  return colors[Math.floor(Math.random() * colors.length)];
}

//slot
let spinCount = 0;
const symbols = ["cherry", "lemon", "banan", "seven", "watermelon"];
const result = document.getElementById("result");
const spinBtn = document.getElementById("btn-play");
const reels = Array.from({length: 5}, (_, i) => document.getElementById(`reel${i + 1}`));
function spin() {
  result.textContent = "";
  spinBtn.disabled = true;
  const symbolHeight = 180;
  const symbolsPerReel = 50;
  reels.forEach((reel, i) => {
    reel.innerHTML = "";
    for (let j = 0; j < symbolsPerReel; j++) {
      const img = document.createElement("img");
      const name = symbols[Math.floor(Math.random() * symbols.length)];
      img.src = `/img/${name}.png`;
      img.className = "symbol";
      img.alt = name;
      reel.appendChild(img);
    }
    const stopIndex = 2 + Math.floor(Math.random() * (symbolsPerReel - 4));
    const targetOffset = -(stopIndex * symbolHeight);
    const duration = 2 + Math.random();
    gsap.to(reel, {
      y: targetOffset,
      duration,
      ease: "power3.out",
      onComplete: i === 4 ? checkWin : undefined
    });
  });
}
function checkWin() {
  const symbolHeight = 180;
  const finalSymbols = reels.map(reel => {
    const transform = gsap.getProperty(reel, "y");
    const index = Math.round(Math.abs(transform) / symbolHeight);
    const img = reel.children[index];
    const name = img?.src.split('/').pop().replace('.png', '');
    return { value: name, el: img };
  });
  const counts = {};
  finalSymbols.forEach(({ value }) => {
    counts[value] = (counts[value] || 0) + 1;
  });
  const [winningSymbol, count] = Object.entries(counts).reduce(
    (max, entry) => entry[1] > max[1] ? entry : max,
    ["", 0]
  );

  if (count >= 3) {
    let message = "";
    if (count === 3) message = "WIN!";
    else if (count === 4) message = "BIG WIN!";
    else if (count === 5) message = "JACKPOT!";
    result.textContent = message;
    finalSymbols.forEach(f => {
      if (f.value === winningSymbol) {
        const winningEls = finalSymbols.filter(f => f.value === winningSymbol).map(f => f.el);
        blinkSymbols(winningEls, "white");
      }
    });
    if (count === 5){
      flashScreen();
      showJackpotAnimation();
      showFallingStars();
    }

  } else {
    result.textContent = "Try again!";
  }
  spinBtn.disabled = false;
}
function blinkSymbols(elements, color) {
  elements.forEach(el => {
    gsap.fromTo(el,
      { filter: "brightness(1)" },
      { filter: "brightness(2)", repeat: 5, yoyo: true, duration: 1 }
    );
  });
}
function showFallingStars() {
  const count = 30;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "falling-star";
    document.body.appendChild(star);
    const size = Math.random() * 10 + 10;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 2 + 2;
    gsap.set(star, {
      width: size + "px",
      height: size + "px",
      background: "linear-gradient(45deg, #bf953f, #fcf6ba)",
      borderRadius: "50%",
      position: "fixed",
      top: -50,
      left: startX,
      opacity: 0.8,
      zIndex: 9999,
      boxShadow: "0 0 8px #fcf6ba",
    });

    gsap.to(star, {
      y: window.innerHeight + 100,
      x: "+=" + (Math.random() * 100 - 50),
      rotation: Math.random() * 360,
      duration: duration,
      ease: "power1.out",
      onComplete: () => star.remove()
    });
  }
}
function showJackpotAnimation() {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9998;
  overlay.style.opacity = 0;
  document.body.appendChild(overlay);

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  overlay.appendChild(container);


  const jackpot = document.createElement("div");
  jackpot.textContent = "JACKPOT!";
  jackpot.style.fontSize = "90px";
  jackpot.style.color = "#fbf5b7";
  jackpot.style.fontWeight = "bold";
  jackpot.style.textShadow = "0 0 20px #fbf5b7, 0 0 40px orange";
  jackpot.style.zIndex = 9999;
  container.appendChild(jackpot);


  for (let i = 0; i < 12; i++) {
    const spark = document.createElement("div");
    spark.style.position = "absolute";
    spark.style.width = "10px";
    spark.style.height = "10px";
    spark.style.borderRadius = "50%";
    spark.style.background = "radial-gradient(white, #fbf5b7)";
    spark.style.boxShadow = "0 0 8px #fbf5b7";
    container.appendChild(spark);

    const angle = (i / 12) * 360;
    const radius = 100;

    gsap.set(spark, {
      x: Math.cos(angle * Math.PI / 180) * radius,
      y: Math.sin(angle * Math.PI / 180) * radius,
    });

  }
  gsap.to(overlay, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => {
      // Убрать через 2.5 сек
      explodeConfetti();
      gsap.to(overlay, {
        delay: 2,
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => overlay.remove()
      });
    }
  });
}
function flashScreen() {
  const flash = document.createElement("div");
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.backgroundColor = "white";
  flash.style.opacity = 0;
  flash.style.zIndex = 999;
  document.body.appendChild(flash);
  gsap.to(flash, {
    opacity: 0.9,
    duration: 0.15,
    yoyo: true,
    repeat: 1,
    onComplete: () => flash.remove()
  });
}
function explodeConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.height = "100%";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 9999;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const confettiCount = 200;
  const confetti = [];
  const colors = ["#FFD700", "#FF4500", "#00FF7F", "#1E90FF", "#FF69B4"];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: Math.random() * 6 - 3,
      velocityY: Math.random() * 6 + 4,
      angle: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
      p.x += p.velocityX;
      p.y += p.velocityY;
      p.angle += p.rotationSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  animate();

  // Удалить canvas после 3 сек
  setTimeout(() => {
    canvas.remove();
  }, 3000);
}



//stars-background
function generateStars(count = 120) {
  const container = document.getElementById('stars-background');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.width = star.style.height = `${Math.random() * 2 + 1}px`;
    container.appendChild(star);
  }
}
generateStars();

function responsiveScale() {
  const machine = document.getElementById("wrapper");
  if (!machine) return;
  let scale = 1;

  if (window.innerWidth < 480) scale = 0.75;
  else if (window.innerWidth < 768) scale = 0.9;

  gsap.to(machine, {
    scale: scale,
    duration: 0.6,
    ease: "power2.out"
  });
}

window.addEventListener("resize", responsiveScale);
window.addEventListener("load", responsiveScale);

spinBtn.addEventListener("click", spin);
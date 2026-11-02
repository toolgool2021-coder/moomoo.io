```javascript
document.addEventListener("DOMContentLoaded", () => {
  const d = PLAYER_DATA;
  const $ = id => document.getElementById(id);

  $("playerName").textContent = d.player;
  $("updated").textContent = d.updated;
  $("footerDate").textContent = d.updated;

  // Боевая статистика
  const combat = [
    ["Убийства", d.combat.kills, "TOTAL KILLS", "#55c7ff"],
    ["Смерти", d.combat.deaths, "TOTAL DEATHS", "rgba(255,105,105,.15)"],
    ["Урон", d.combat.damage, "DAMAGE DEALT", "rgba(154,130,255,.16)"],
    ["Лечение", d.combat.healing, "HEALING", "rgba(93,224,173,.15)"],
    ["K/D", d.combat.kd.toFixed(2), "KILL / DEATH", "rgba(232,189,112,.16)"]
  ];

  $("combatGrid").innerHTML = combat.map(([label, value, unit, glow]) =>
    `<article class="stat-card" style="--glow:${glow}">
      <div class="stat-label">${label}</div>
      <strong class="stat-value">${value}</strong>
      <div class="stat-unit">${unit}</div>
    </article>`
  ).join("");

  // K/D
  $("kdValue").textContent = d.combat.kd.toFixed(2);
  $("kdFill").style.width =
    `${Math.min(100, d.combat.kd / 2 * 100)}%`;

  $("kdStatus").textContent =
    d.combat.kd >= 1 ? "POSITIVE RATIO" : "BELOW 1.00";

  // Ресурсы
  const maxResource = Math.max(
    ...d.resources.map(x => x.amount)
  );

  $("resourceGrid").innerHTML = d.resources.map(r =>
    `<article class="resource-card">
      <div class="resource-icon">${r.icon}</div>
      <div class="resource-label">${r.label}</div>
      <div class="resource-value">${r.value}</div>
      <div class="resource-bar">
        <span data-width="${r.amount / maxResource * 100}"></span>
      </div>
    </article>`
  ).join("");

  // Достижения
  $("achievementGrid").innerHTML =
    d.achievements.map(a =>
      `<article class="achievement-card">
        <span>${a.label}</span>
        <strong>${a.value}</strong>
      </article>`
    ).join("");

  // Активность
  $("activityList").innerHTML =
    d.activity.map(a =>
      `<article class="activity-row">
        <div class="activity-period">${a.label}</div>
        <div class="activity-number">
          <strong>${a.kills}</strong>
          <small>УБИЙСТВ</small>
        </div>
        <div class="activity-score">
          <strong>${a.score}</strong>
          <small>ЛУЧШИЙ СЧЁТ</small>
        </div>
      </article>`
    ).join("");

  // Анимация появления блоков
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        entry.target
          .querySelectorAll(".resource-bar span")
          .forEach(bar => {
            bar.style.width = bar.dataset.width + "%";
          });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });

  // Фоновые частицы
  const canvas = $("particles");
  const ctx = canvas.getContext("2d");

  let w, h, dots = [];

  function resize() {
    w = canvas.width = innerWidth * devicePixelRatio;
    h = canvas.height = innerHeight * devicePixelRatio;

    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";

    dots = Array.from({
      length: Math.min(65, Math.floor(innerWidth / 18))
    }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      v: Math.random() * 0.22 + 0.06,
      a: Math.random() * 0.45 + 0.12
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    dots.forEach(p => {
      p.y -= p.v * devicePixelRatio;

      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }

      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        p.r * devicePixelRatio,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(111,196,238,${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  addEventListener("resize", resize);
  draw();
});
```

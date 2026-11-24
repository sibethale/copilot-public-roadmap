"use strict";

const appearanceKey = "copilotRoadmapAppearance";
const themeGroups = [
  ["Basic", [
    ["system", "System", "Follow your device"], ["light", "Light", "Plain light"],
    ["dark", "Dark", "Plain dark"], ["synthwave", "Synthwave", "Retro neon"],
  ]],
  ["Classic", [
    ["aurora", "Aurora", "Soft pastel light"], ["carbon", "Carbon", "Industrial and square"],
    ["learn", "Learn", "Clear and readable"], ["midnight", "Midnight", "Dark indigo"],
    ["sakura", "Sakura", "Rose and editorial type"], ["solaris", "Solaris", "Warm sunrise"],
  ]],
  ["Space", [
    ["blueprint", "Blueprint", "Technical drafting grid"], ["nebula", "Nebula", "Deep-space blue"],
    ["orbit", "Orbit", "Mission-control amber"], ["terminal", "Terminal", "Phosphor-green console"],
  ]],
  ["Animated", [
    ["abyss", "Abyss", "Deep-water light"], ["arcane", "Arcane", "Violet and gold"],
    ["hyperdrive", "Hyperdrive", "Lightspeed trails"],
    ["midnight-aurora", "Midnight Aurora", "Northern lights at night"],
    ["prism", "Prism", "Iridescent light"], ["supernova", "Supernova", "Warm stellar bloom"],
  ]],
];
const themeChoices = new Map(themeGroups.flatMap(([, themes]) => themes.map(([id, name]) => [id, name])));
const darkThemes = new Set([
  "dark", "synthwave", "midnight", "blueprint", "nebula", "orbit", "terminal",
  "abyss", "arcane", "hyperdrive", "midnight-aurora", "prism", "supernova",
]);
const motionChoices = [
  ["intro", "Opening intro", "The page mark settles into place without hiding the content."],
  ["build", "Build-up", "Page sections settle in when you open a source tab."],
  ["count", "Counting numbers", "Navigation and summary totals count up once after loading."],
  ["cards", "Cards slide in", "Takeaways slide into place when you expand session details."],
  ["panel", "Panel swing", "The appearance chooser swings open and closed."],
  ["busy", "Busy indicator", "A small indicator moves while the public snapshot loads."],
  ["background", "Theme backgrounds", "Ambient light and trails move in the animated themes."],
];

function appearancePreferences(value) {
  const parsed = value === null ? {} : JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Saved appearance preferences have an invalid format.");
  }
  return {
    theme: themeChoices.has(parsed.theme) ? parsed.theme : "system",
    motion: Object.fromEntries(motionChoices.map(([key]) =>
      [key, typeof parsed.motion?.[key] === "boolean" ? parsed.motion[key] : true])),
  };
}

function resolvedTheme(choice, prefersDark) {
  return choice === "system" ? (prefersDark ? "dark" : "light") : choice;
}

function startAppearance() {
  const root = document.documentElement;
  const dialog = document.getElementById("appearance-panel");
  const trigger = document.getElementById("appearance-open");
  const message = document.getElementById("appearance-message");
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let preferences = appearancePreferences(null);
  const running = new Set();
  const counters = new Map();
  let closing = false;
  let storageProblem = false;

  function reportStorage(error) {
    storageProblem = true;
    console.warn("Appearance preferences could not be restored or saved:", error);
    updateMessage();
  }

  function updateMessage() {
    message.textContent = [
      reducedMotion.matches ? "Your device requests reduced motion. All animations are off." : "",
      storageProblem ? "Preferences could not be saved or restored. Changes apply to this page only." : "",
    ].filter(Boolean).join(" ");
    message.hidden = !message.textContent;
  }

  try {
    preferences = appearancePreferences(localStorage.getItem(appearanceKey));
  } catch (error) {
    reportStorage(error);
  }
  const requestedTheme = new URLSearchParams(location.search).get("clawpilotTheme");
  if (themeChoices.has(requestedTheme)) preferences.theme = requestedTheme;

  function enabled(key) {
    return !reducedMotion.matches && preferences.motion[key];
  }

  function animate(node, key, frames, options, finish) {
    if (!enabled(key)) {
      finish?.();
      return;
    }
    const animation = node.animate(frames, options);
    const record = { key, animation };
    running.add(record);
    const complete = () => {
      running.delete(record);
      finish?.();
    };
    animation.onfinish = complete;
    animation.oncancel = complete;
  }

  function stopMotion(key) {
    for (const record of [...running]) {
      if (record.key === key) record.animation.cancel();
    }
    if (key === "count") {
      for (const [node, { frame, value }] of counters) {
        cancelAnimationFrame(frame);
        node.textContent = value;
      }
      counters.clear();
    }
  }

  function apply() {
    const theme = resolvedTheme(preferences.theme, systemDark.matches);
    root.dataset.theme = theme;
    root.dataset.themeChoice = preferences.theme;
    root.dataset.colorScheme = darkThemes.has(theme) ? "dark" : "light";
    document.getElementById("appearance-current").textContent = themeChoices.get(preferences.theme);
    dialog.querySelectorAll('input[name="appearance-theme"]').forEach((input) => {
      input.checked = input.value === preferences.theme;
    });
    for (const [key] of motionChoices) {
      root.setAttribute(`data-motion-${key}`, enabled(key) ? "on" : "off");
      const input = document.getElementById(`motion-${key}`);
      if (input) {
        input.checked = enabled(key);
        input.disabled = reducedMotion.matches;
      }
      if (!enabled(key)) stopMotion(key);
    }
    document.getElementById("motion-all-on").disabled = reducedMotion.matches;
    document.getElementById("intro-replay").disabled = !enabled("intro");
    const count = motionChoices.filter(([key]) => enabled(key)).length;
    document.getElementById("motion-enabled-count").textContent = `${count} of ${motionChoices.length} on`;
    updateMessage();
  }

  function save() {
    try {
      localStorage.setItem(appearanceKey, JSON.stringify(preferences));
      storageProblem = false;
    } catch (error) {
      reportStorage(error);
    }
    apply();
  }

  for (const [group, themes] of themeGroups) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = group;
    const grid = document.createElement("div");
    grid.className = "theme-options";
    fieldset.append(legend, grid);
    for (const [id, name, description] of themes) {
      const label = document.createElement("label");
      label.className = "theme-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "appearance-theme";
      input.value = id;
      const preview = document.createElement("span");
      preview.className = "theme-swatch";
      preview.dataset.preview = id;
      preview.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = name;
      const detail = document.createElement("small");
      detail.textContent = description;
      text.append(title, detail);
      label.append(input, preview, text);
      input.addEventListener("change", () => {
        preferences.theme = id;
        const url = new URL(location.href);
        if (url.searchParams.has("clawpilotTheme")) {
          url.searchParams.set("clawpilotTheme", id);
          history.replaceState(null, "", url);
        }
        save();
      });
      grid.append(label);
    }
    document.getElementById("theme-groups").append(fieldset);
  }

  for (const [key, name, description] of motionChoices) {
    const label = document.createElement("label");
    label.className = "motion-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `motion-${key}`;
    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = name;
    const detail = document.createElement("small");
    detail.textContent = description;
    text.append(title, detail);
    label.append(input, text);
    input.addEventListener("change", () => {
      preferences.motion[key] = input.checked;
      save();
    });
    document.getElementById("motion-options").append(label);
  }

  function playIntro() {
    animate(document.querySelector(".mark"), "intro", [
      { transform: "translateY(4px) scale(.8) rotate(-8deg)", filter: "blur(2px)" },
      { transform: "translateY(0) scale(1) rotate(0)", filter: "blur(0)" },
    ], { duration: 540, easing: "cubic-bezier(.16, 1, .3, 1)" });
  }

  function playBuild() {
    stopMotion("build");
    document.querySelectorAll(".intro, .policy, .filter-panel, .ignite-banner").forEach((node, index) => {
      animate(node, "build", [
        { transform: "translateY(6px)", clipPath: "inset(0 0 6px)" },
        { transform: "translateY(0)", clipPath: "inset(0)" },
      ], { duration: 320, delay: index * 35, easing: "cubic-bezier(.16, 1, .3, 1)" });
    });
  }

  function countTotals() {
    if (!enabled("count")) return;
    document.querySelectorAll("[data-count]").forEach((node) => {
      const value = node.textContent;
      const target = Number(value);
      if (!Number.isFinite(target)) return;
      let start;
      const step = (now) => {
        start ??= now;
        const progress = Math.max(0, Math.min(1, (now - start) / 420));
        node.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
        if (progress < 1) counters.set(node, { frame: requestAnimationFrame(step), value });
        else {
          node.textContent = value;
          counters.delete(node);
        }
      };
      counters.set(node, { frame: requestAnimationFrame(step), value });
    });
  }

  trigger.addEventListener("click", () => {
    if (dialog.open) return;
    dialog.showModal();
    trigger.setAttribute("aria-expanded", "true");
    animate(dialog, "panel", [
      { transform: "perspective(1000px) rotateY(-9deg) translateX(-8px)", opacity: .7 },
      { transform: "perspective(1000px) rotateY(0) translateX(0)", opacity: 1 },
    ], { duration: 240, easing: "cubic-bezier(.16, 1, .3, 1)" });
  });

  function closePanel() {
    if (closing || !dialog.open) return;
    closing = true;
    stopMotion("panel");
    animate(dialog, "panel", [
      { transform: "perspective(1000px) rotateY(0)", opacity: 1 },
      { transform: "perspective(1000px) rotateY(-7deg)", opacity: .7 },
    ], { duration: 150, easing: "ease-in" }, () => {
      dialog.close();
      closing = false;
    });
  }
  document.getElementById("appearance-close").addEventListener("click", closePanel);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePanel();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) closePanel();
  });
  dialog.addEventListener("close", () => {
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus({ preventScroll: true });
  });
  for (const [id, value] of [["motion-all-on", true], ["motion-all-off", false]]) {
    document.getElementById(id).addEventListener("click", () => {
      for (const [key] of motionChoices) preferences.motion[key] = value;
      save();
    });
  }
  document.getElementById("intro-replay").addEventListener("click", playIntro);
  document.addEventListener("toggle", (event) => {
    if (!(event.target instanceof HTMLDetailsElement) ||
        !event.target.matches(".session-details") || !event.target.open) return;
    event.target.querySelectorAll("li").forEach((node, index) => {
      animate(node, "cards", [
        { transform: "translateX(-6px)", opacity: .6 },
        { transform: "translateX(0)", opacity: 1 },
      ], { duration: 240, delay: index * 45, easing: "cubic-bezier(.16, 1, .3, 1)" });
    });
  }, true);
  document.addEventListener("roadmap:ready", () => {
    countTotals();
    playBuild();
  }, { once: true });
  document.addEventListener("roadmap:view", playBuild);
  systemDark.addEventListener("change", apply);
  reducedMotion.addEventListener("change", apply);
  apply();
  trigger.disabled = false;
  playIntro();
}

startAppearance();

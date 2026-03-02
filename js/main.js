const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");
const asciiCatFrame = document.getElementById("ascii-cat-frame");
const navCommandLinks = document.querySelectorAll("header [data-command]");
const magnumShowcaseId = "magnum-showcase";
const magnumCardInitialDelayMs = 45;
const magnumCardIntraDelayMs = 130;
const magnumCardRevealDurationMs = 180;
const magnumCardRowGapMs = 92;
const magnumAnimationCleanupBufferMs = 40;
const magnumDesktopCaptionFadeLagMs = 360;
let magnumVideoObserver = null;
let magnumBackgroundPreloadStarted = false;
const magnumBackgroundPreloaders = [];
let magnumShowcaseAnimationTimer = null;
const magnumShowcaseScrollStepTimers = [];

let git = 0;
let pw = false;
const commands = [];
let isThoughtsMode = false;
const clearBeforeCommands = new Set([
  "about",
  "aboutme",
  "projects",
  "magnum",
  "contact",
  "social",
  "help",
]);
const commandLineDelay = 80;
const projectsSecondItemExtraDelayMs = 120;
const buttonPreviewDuration = 700;
const previewedButtonKeys = new Set();
const helpHintText =
  '<span class="cli-run-command cli-run-item" data-run-command="help">← Back<br>(Type <u>help</u> to return to the list of supported commands)</span>';
const defaultPrompt = "[keoni@me]~$";
const thoughtsPrompt = "> ";
const mobileTypingMediaQuery = window.matchMedia("(max-width: 726px)");

function isTypingEnabled() {
  return !mobileTypingMediaQuery.matches;
}

function setPromptPrefix(prefix) {
  if (!liner) return;
  liner.setAttribute("data-prompt", prefix);
}

function focusInput(options = {}) {
  if (!textarea) return;
  const allowMobile = Boolean(options.allowMobile);
  if (mobileTypingMediaQuery.matches && !allowMobile) return;
  try {
    textarea.focus({ preventScroll: true });
  } catch (_err) {
    textarea.focus();
  }
}

function scrollToBottom(options = {}) {
  if (!contentscroll) return;
  contentscroll.scrollTop = contentscroll.scrollHeight;
}

function clearTerminalLines() {
  if (!terminal) return;
  const lines = terminal.querySelectorAll(":scope > p");
  lines.forEach((line) => line.remove());
}

function getMagnumVideoSources() {
  const fallbackSources = [
    "assets/1.mp4",
    "assets/2.mp4",
    "assets/3.mp4",
    "assets/4.mp4",
    "assets/5.mp4",
    "assets/6.mp4",
  ];
  const items =
    typeof magnumGalleryItems !== "undefined" &&
    Array.isArray(magnumGalleryItems) &&
    magnumGalleryItems.length
      ? magnumGalleryItems
      : fallbackSources.map((src) => ({ src }));

  const videoSources = items
    .map((item) => (item && item.src ? String(item.src) : ""))
    .filter((src) => /\.(mp4|webm|ogg)(?:$|[?#])/i.test(src));

  return Array.from(new Set(videoSources));
}

function startMagnumBackgroundPreload() {
  if (magnumBackgroundPreloadStarted) return;
  magnumBackgroundPreloadStarted = true;

  const sources = getMagnumVideoSources();
  sources.forEach(function (src) {
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "video";
    preloadLink.href = src;
    document.head.appendChild(preloadLink);

    const loader = document.createElement("video");
    loader.preload = "auto";
    loader.muted = true;
    loader.playsInline = true;
    loader.src = src;
    loader.load();
    magnumBackgroundPreloaders.push(loader);
  });
}

function queueMagnumBackgroundPreload() {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(function () {
      startMagnumBackgroundPreload();
    });
    return;
  }
  setTimeout(function () {
    startMagnumBackgroundPreload();
  }, 800);
}

setTimeout(function () {
  loopLines(banner, "", 80);
  focusInput();
  scrollToBottom();

  setTimeout(function () {
    const initialCommand = "help";
    setActiveNavCommand(initialCommand);
    autoTypeAndSubmitCommand(initialCommand);
  }, banner.length * 80 + 250);
}, 100);

startAsciiCatBlinkAnimation();
queueMagnumBackgroundPreload();

window.addEventListener("keyup", function (e) {
  if (mobileTypingMediaQuery.matches) return;
  enterKey(e);
});

textarea.addEventListener("keydown", function (e) {
  if (!mobileTypingMediaQuery.matches) return;
  const keyCode = e.keyCode || e.which;
  if (e.key === "Enter" || keyCode === 13) {
    e.preventDefault();
    enterKey(e);
  }
});

document.addEventListener("click", function (e) {
  if (e.target && e.target.closest && e.target.closest(".charcoal-overlay")) {
    return;
  }
  focusInput();
});

terminal.addEventListener("click", function (e) {
  const runCommandElement = e.target.closest("[data-run-command]");
  if (runCommandElement) {
    e.preventDefault();
    const cmd = runCommandElement.getAttribute("data-run-command");
    if (!cmd) return;
    runCommandFromNavigation(cmd);
    return;
  }
  focusInput();
});

navCommandLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const cmd = link.getAttribute("data-command");
    if (!cmd) return;
    runCommandFromNavigation(cmd);
  });
});

textarea.value = "";
command.innerHTML = "Loading...";
setPromptPrefix(defaultPrompt);

function enterKey(e) {
  const programmatic = Boolean(e && e.programmatic);
  const keyCode = (e && (e.keyCode || e.which)) || 0;
  const isEnterPressed = (e && e.key === "Enter") || keyCode === 13;
  if (!isTypingEnabled() && !programmatic && !isEnterPressed) {
    return;
  }
  if (isEnterPressed) {
    const wasMagnumModeActive = document.body.classList.contains("magnum-mode");
    const rawInput = command.innerHTML.trim();
    const isMagnumModeActive = document.body.classList.contains("magnum-mode");
    if (!rawInput && isMagnumModeActive) {
      return;
    }
    const input = rawInput.toLowerCase();
    const typedPrompt = isThoughtsMode ? thoughtsPrompt : defaultPrompt;
    const shouldEchoTypedLine =
      input !== "charcoal" &&
      input !== "magnum" &&
      !clearBeforeCommands.has(input);
    if (shouldEchoTypedLine) {
      addLine(typedPrompt + " " + command.innerHTML, "no-animation", 0);
    }

    commands.push(command.innerHTML);
    git = commands.length;
    commander(input);

    command.innerHTML = "";
    textarea.value = "";
    focusInput();
    if (input === "charcoal" && wasMagnumModeActive) {
      // Preserve current viewport position for the Magnum -> Charcoal exception.
    } else {
      scrollToBottom();
    }
  }

  if (keyCode === 38 && git !== 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
    scrollToBottom();
  }

  if (keyCode === 40 && git !== commands.length) {
    git += 1;
    textarea.value = commands[git] || "";
    command.innerHTML = textarea.value;
    scrollToBottom();
  }
}

function commander(cmd) {
  if (!cmd) {
    return;
  }
  const isMagnumModeActive = document.body.classList.contains("magnum-mode");
  const isMagnumToCharcoalException = isMagnumModeActive && cmd === "charcoal";
  if (cmd !== "magnum" && !isMagnumToCharcoalException) {
    hideMagnumShowcase();
  }
  if (isThoughtsMode) {
    if (cmd === "q" || /^\d+$/.test(cmd)) {
      handleThoughtsInput(cmd);
    } else {
      addLine("Invalid choice. Enter 1 or q.", "output-blue", commandLineDelay);
      addLine("<br>", "", commandLineDelay * 2);
      scrollToBottom();
    }
    return;
  }
  let outputLines = 0;
  let showFooterHint = true;
  const preserveTerminalHistory = cmd === "charcoal";
  if (clearBeforeCommands.has(cmd) && !preserveTerminalHistory) {
    clearTerminalLines();
  }
  switch (cmd) {
    case "help":
      setActiveNavCommand("help");
      outputLines = help.length;
      showFooterHint = false;
      loopLines(help, "", commandLineDelay, {
        previewClickableItems: true,
        previewDuration: buttonPreviewDuration,
      });
      break;
    case "about":
    case "aboutme":
      setActiveNavCommand("about");
      outputLines = aboutme.length;
      loopLines(aboutme, "", commandLineDelay, {
        previewClickableItems: true,
        previewDuration: buttonPreviewDuration,
      });
      break;
    case "projects":
      setActiveNavCommand("projects");
      outputLines = projects.length;
      loopLines(projects, "", commandLineDelay, {
        previewClickableItems: true,
        previewDuration: buttonPreviewDuration,
        getLineDelay: function (index) {
          return index === projects.length - 1 ? projectsSecondItemExtraDelayMs : 0;
        },
      });
      break;
    case "charcoal":
      setActiveNavCommand("projects");
      openCharcoalOverlay();
      return;
    case "magnum":
      setActiveNavCommand("projects");
      showMagnumShowcase();
      return;
    case "contact":
    case "social":
      setActiveNavCommand("contact");
      outputLines = social.length;
      loopLines(social, "", commandLineDelay, {
        previewClickableItems: true,
        previewDuration: buttonPreviewDuration,
      });
      break;
    default:
      outputLines = 2;
      showFooterHint = false;
      addLine("<br>", "", commandLineDelay);
      addLine(
        '<span class="cli-run-command cli-run-item" data-run-command="help" data-preview-key="unknown:help-full"><span class="command">Unknown command - Type <u>help</u> to see a list of supported commands</span></span>',
        "output-blue",
        commandLineDelay * 2,
        function (lineNode) {
          applyTemporaryButtonPreview(lineNode, buttonPreviewDuration);
        },
      );
      break;
  }
  if (showFooterHint) {
    addLine("<br>", "", (outputLines + 1) * commandLineDelay);
    addLine(
      helpHintText,
      "tertiary",
      (outputLines + 2) * commandLineDelay,
      function (lineNode) {
        applyTemporaryButtonPreview(lineNode, buttonPreviewDuration);
      },
    );
    addLine("<br>", "", (outputLines + 3) * commandLineDelay);
  } else {
    addLine("<br>", "", (outputLines + 1) * commandLineDelay);
  }
  scrollToBottom();
}

function setActiveNavCommand(cmd) {
  navCommandLinks.forEach(function (link) {
    const linkCommand = link.getAttribute("data-command");
    link.classList.toggle("active", linkCommand === cmd);
  });
}

function runCommandFromNavigation(cmd, options = {}) {
  if (!cmd) return;
  if (isThoughtsMode) {
    isThoughtsMode = false;
    setPromptPrefix(defaultPrompt);
  }
  setActiveNavCommand(cmd);
  autoTypeAndSubmitCommand(cmd, options);
}

function handleThoughtsInput(cmd) {
  switch (cmd) {
    case "1":
      const automationWithMenu = thoughtsAutomation.concat(thoughts);
      loopLines(automationWithMenu, "", commandLineDelay);
      addLine("<br>", "", (automationWithMenu.length + 1) * commandLineDelay);
      break;
    case "q":
      isThoughtsMode = false;
      setPromptPrefix(defaultPrompt);
      addLine("Exited thoughts.", "output-blue", commandLineDelay);
      addLine("<br>", "", commandLineDelay * 2);
      setTimeout(function () {
        autoTypeAndSubmitCommand("help");
      }, commandLineDelay * 3);
      break;
    default:
      addLine("Invalid choice. Enter 1 or q.", "output-blue", commandLineDelay);
      addLine("<br>", "", commandLineDelay * 2);
      break;
  }
  scrollToBottom();
}

function close_window() {
  const terminalWindow = document.querySelector(".terminal-window");
  if (!terminalWindow) return;
  terminalWindow.style.display = "none";
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time, onRendered) {
  let t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === " " && text.charAt(i + 1) === " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }

  setTimeout(function () {
    const next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    scrollToBottom();
    if (typeof onRendered === "function") {
      onRendered(next);
    }
  }, time);
}

function applyTemporaryButtonPreview(lineNode, previewDuration) {
  if (!lineNode) return;
  const previewNodes = lineNode.querySelectorAll(".cli-run-command");
  if (!previewNodes.length) return;
  previewNodes.forEach(function (previewNode) {
    const explicitKey = previewNode.getAttribute("data-preview-key");
    const commandKey = previewNode.getAttribute("data-run-command") || "";
    const labelKey = (previewNode.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const previewKey = explicitKey || `${commandKey}|${labelKey}`;
    if (!previewKey || previewedButtonKeys.has(previewKey)) return;
    previewedButtonKeys.add(previewKey);
    previewNode.classList.add("cli-preview-active");
    setTimeout(function () {
      previewNode.classList.remove("cli-preview-active");
    }, previewDuration);
  });
}

function loopLines(name, style, time, options = {}) {
  const previewClickableItems = Boolean(options.previewClickableItems);
  const previewDuration = options.previewDuration || time;
  const getLineDelay =
    typeof options.getLineDelay === "function" ? options.getLineDelay : null;
  let maxLineDelay = 0;
  name.forEach(function (item, index) {
    const extraDelay = getLineDelay ? Number(getLineDelay(index, item, name)) || 0 : 0;
    const lineDelay = index * time + Math.max(0, extraDelay);
    if (lineDelay > maxLineDelay) {
      maxLineDelay = lineDelay;
    }
    addLine(item, style, lineDelay, function (lineNode) {
      if (!previewClickableItems) return;
      applyTemporaryButtonPreview(lineNode, previewDuration);
    });
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    maxLineDelay + 50,
  );
}

function attemptPlayVideo(video) {
  if (!video || !video.paused) return;
  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(function () {});
  }
}

function hydrateMagnumVideo(video, preloadValue = "metadata") {
  if (!video || video.dataset.hydrated === "true") return;
  const src = video.dataset.src;
  if (!src) return;
  video.preload = preloadValue;
  video.src = src;
  video.dataset.hydrated = "true";
  video.load();
}

function observeMagnumVideo(video) {
  if (!video || typeof IntersectionObserver === "undefined") {
    hydrateMagnumVideo(video, "metadata");
    return;
  }
  if (!magnumVideoObserver) {
    magnumVideoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const targetVideo = entry.target;
          hydrateMagnumVideo(targetVideo, "metadata");
          attemptPlayVideo(targetVideo);
          magnumVideoObserver.unobserve(targetVideo);
        });
      },
      { root: null, rootMargin: "220px 0px", threshold: 0.01 },
    );
  }
  magnumVideoObserver.observe(video);
}

function primeMagnumVideos(showcase, maxCount = 2) {
  if (!showcase) return;
  const videos = showcase.querySelectorAll(".magnum-gif-video");
  let hydrated = 0;
  videos.forEach(function (video) {
    if (hydrated >= maxCount) return;
    hydrateMagnumVideo(video, "metadata");
    attemptPlayVideo(video);
    hydrated += 1;
  });
}

function triggerMagnumShowcaseAnimation(showcase) {
  if (!showcase) return;
  showcase.classList.remove("is-animating");
  if (magnumShowcaseAnimationTimer) {
    clearTimeout(magnumShowcaseAnimationTimer);
    magnumShowcaseAnimationTimer = null;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  // Force reflow so stagger animation retriggers every time Magnum opens.
  void showcase.offsetWidth;
  showcase.classList.add("is-animating");

  const cards = Array.from(showcase.querySelectorAll(".magnum-gif-card"));
  const keepSpawnCaptionsVisible = window.matchMedia("(max-width: 726px)").matches;
  const captionFadeLagMs = keepSpawnCaptionsVisible ? 0 : magnumDesktopCaptionFadeLagMs;
  let previousActiveCard = null;
  while (magnumShowcaseScrollStepTimers.length) {
    clearTimeout(magnumShowcaseScrollStepTimers.pop());
  }
  cards.forEach(function (card) {
    card.classList.remove("is-spawn-active");
    card.style.display = "none";
  });
  cards.forEach(function (card) {
    const rawDelay = card.style.getPropertyValue("--magnum-card-delay") || "0";
    const parsedDelay = Number.parseInt(rawDelay, 10);
    const safeDelay = Number.isFinite(parsedDelay) ? parsedDelay : 0;
    const stepTimer = setTimeout(function () {
      if (
        !keepSpawnCaptionsVisible &&
        previousActiveCard &&
        previousActiveCard !== card
      ) {
        const cardToFade = previousActiveCard;
        const fadeTimer = setTimeout(function () {
          cardToFade.classList.remove("is-spawn-active");
        }, captionFadeLagMs);
        magnumShowcaseScrollStepTimers.push(fadeTimer);
      }
      card.classList.add("is-spawn-active");
      previousActiveCard = card;
      card.style.display = "";
      scrollToBottom({ force: true });
    }, safeDelay + 12);
    magnumShowcaseScrollStepTimers.push(stepTimer);
  });

  const maxDelayMs = cards.reduce(function (maxDelay, card) {
    const rawDelay = card.style.getPropertyValue("--magnum-card-delay") || "0";
    const parsedDelay = Number.parseInt(rawDelay, 10);
    const safeDelay = Number.isFinite(parsedDelay) ? parsedDelay : 0;
    return Math.max(maxDelay, safeDelay);
  }, 0);
  const cleanupDelayMs =
    maxDelayMs + magnumCardRevealDurationMs + magnumAnimationCleanupBufferMs;
  magnumShowcaseAnimationTimer = setTimeout(function () {
    cards.forEach(function (card) {
      card.classList.remove("is-spawn-active");
      card.style.display = "";
    });
    showcase.classList.remove("is-animating");
    magnumShowcaseAnimationTimer = null;
  }, cleanupDelayMs);
}

function getMagnumShowcaseColumnCount() {
  if (window.matchMedia("(max-width: 726px)").matches) return 1;
  if (window.matchMedia("(max-width: 1080px)").matches) return 2;
  return 3;
}

function applyMagnumShowcaseStagger(showcase) {
  if (!showcase) return;
  const cards = Array.from(showcase.querySelectorAll(".magnum-gif-card"));
  if (!cards.length) return;

  const isMobileWidth = window.matchMedia("(max-width: 726px)").matches;
  const columns = Math.max(1, getMagnumShowcaseColumnCount());
  const totalCards = cards.length;
  const intraDelayMs = isMobileWidth ? Math.max(34, magnumCardIntraDelayMs - 78) : magnumCardIntraDelayMs;
  const rowGapMs = isMobileWidth ? Math.max(6, magnumCardRowGapMs - 68) : magnumCardRowGapMs;
  const minIntraDelayMs = 84;
  const intraDelayRangeMs = Math.max(0, intraDelayMs - minIntraDelayMs);
  const delayByColumn = Array.from({ length: columns }, function (_, colIndex) {
    if (colIndex === 0) return 0;
    const localProgress = columns <= 1 ? 1 : colIndex / (columns - 1);
    const eased = Math.pow(localProgress, 0.84);
    return Math.round(colIndex * (intraDelayMs - intraDelayRangeMs * eased));
  });
  const maxColumnDelay = delayByColumn.length ? delayByColumn[delayByColumn.length - 1] : 0;
  const rowCycleMs =
    maxColumnDelay +
    magnumCardRevealDurationMs +
    rowGapMs;

  cards.forEach(function (card, index) {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const globalProgress = totalCards <= 1 ? 1 : index / (totalCards - 1);
    const perCardAccelerationMs = Math.round(globalProgress * 36);
    const delayMs =
      magnumCardInitialDelayMs +
      row * rowCycleMs +
      delayByColumn[column] -
      perCardAccelerationMs;
    card.style.setProperty("--magnum-card-delay", `${delayMs}ms`);
  });
}

function createMagnumShowcaseCard(item) {
  const titleText = (item && item.title) || "Magnum Workflow";
  const descriptionText =
    (item && item.description) || "Placeholder GIF preview.";
  const src = (item && item.src) || "assets/cat.gif";
  const isVideo = /\.(mp4|webm|ogg)(?:$|[?#])/i.test(src);

  const card = document.createElement("article");
  card.className = "magnum-gif-card";
  card.tabIndex = 0;

  if (isVideo) {
    const video = document.createElement("video");
    video.className = "magnum-gif-video";
    video.dataset.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute("aria-label", `${titleText} preview video`);
    card.appendChild(video);

    const forcePlay = function () {
      hydrateMagnumVideo(video, "metadata");
      attemptPlayVideo(video);
    };

    // Try to play once video data is loaded
    video.addEventListener("loadeddata", function () {
      attemptPlayVideo(video);
    });
    video.addEventListener("canplay", function () {
      attemptPlayVideo(video);
    });

    // Also try on mouseenter and focus
    const keepPlaying = function () {
      forcePlay();
    };
    card.addEventListener("mouseenter", keepPlaying);
    card.addEventListener("focus", keepPlaying);
    card.addEventListener("touchstart", keepPlaying, { passive: true });
    observeMagnumVideo(video);
  } else {
    const image = document.createElement("img");
    image.className = "magnum-gif-image";
    image.src = src;
    image.alt = `${titleText} placeholder GIF`;
    image.loading = "lazy";
    image.decoding = "async";
    card.appendChild(image);
  }

  const overlay = document.createElement("div");
  overlay.className = "magnum-gif-overlay";

  const title = document.createElement("h3");
  title.className = "magnum-gif-title";
  title.textContent = titleText;

  const description = document.createElement("p");
  description.className = "magnum-gif-description";
  description.textContent = descriptionText;

  overlay.appendChild(title);
  overlay.appendChild(description);
  card.appendChild(overlay);

  return card;
}

function ensureMagnumShowcase() {
  let showcase = document.getElementById(magnumShowcaseId);
  if (showcase) return showcase;

  showcase = document.createElement("section");
  showcase.id = magnumShowcaseId;
  showcase.className = "magnum-showcase";
  showcase.setAttribute("aria-label", "Magnum GIF previews");

  const grid = document.createElement("div");
  grid.className = "magnum-showcase-grid";

  const fallbackItems = [
    {
      title: "Phase 1: Lead generation",
      description:
        "Scrapers find hundreds of businesses that do not own websites from Google maps.",
      src: "assets/1.mp4",
    },
    {
      title: "Phase 2: Lead qualification",
      description:
        "AI agents review each business and determine if they'd benefit from a website or not.",
      src: "assets/2.mp4",
    },
    {
      title: "Phase 3: Web design research",
      description:
        "AI agents find and analyze real business websites to identify best practices for each industry.",
      src: "assets/3.mp4",
    },
    {
      title: "Phase 4: Generate website templates",
      description:
        "AI generates new templates after each successful sale: no sale, no expenses.",
      src: "assets/4.mp4",
    },
    {
      title: "Phase 5: Deploy full websites",
      description:
        "Each website is deployed on Cloudflare Pages with real photos, hours, and contact info.",
      src: "assets/5.mp4",
    },
    {
      title: "Phase 6: Sell to small businesses",
      description:
        "A human makes sales calls with one-click for OpenPhone and fully integrated Stripe payments.",
      src: "assets/6.mp4",
    },
  ];

  const sourceItems =
    typeof magnumGalleryItems !== "undefined" &&
    Array.isArray(magnumGalleryItems) &&
    magnumGalleryItems.length
      ? magnumGalleryItems
      : fallbackItems;
  const items = sourceItems.slice(0, 6);

  items.forEach(function (item) {
    const card = createMagnumShowcaseCard(item);
    grid.appendChild(card);
  });

  showcase.appendChild(grid);
  primeMagnumVideos(showcase, 2);

  const backHint = document.createElement("button");
  backHint.className = "magnum-back-hint cli-run-command cli-run-item";
  backHint.type = "button";
  const backLabel = document.createElement("span");
  backLabel.className = "command";
  backLabel.innerHTML =
    "<- Back<br>(Type <u>projects</u> to return to the list of projects)";
  backHint.appendChild(backLabel);
  backHint.addEventListener("click", function (e) {
    e.preventDefault();
    runCommandFromNavigation("projects", { suppressAutoTypeScroll: true });
  });
  showcase.appendChild(backHint);

  if (contentscroll) {
    contentscroll.insertBefore(showcase, terminal);
  }

  return showcase;
}

function showMagnumShowcase() {
  closeCharcoalOverlay();
  const showcase = ensureMagnumShowcase();
  if (!showcase) return;
  primeMagnumVideos(showcase, 2);
  applyMagnumShowcaseStagger(showcase);
  showcase.classList.add("is-visible");
  document.body.classList.add("magnum-mode");
  triggerMagnumShowcaseAnimation(showcase);
}

function hideMagnumShowcase() {
  const showcase = document.getElementById(magnumShowcaseId);
  if (magnumShowcaseAnimationTimer) {
    clearTimeout(magnumShowcaseAnimationTimer);
    magnumShowcaseAnimationTimer = null;
  }
  while (magnumShowcaseScrollStepTimers.length) {
    clearTimeout(magnumShowcaseScrollStepTimers.pop());
  }
  if (showcase) {
    const cards = showcase.querySelectorAll(".magnum-gif-card");
    cards.forEach(function (card) {
      card.classList.remove("is-spawn-active");
      card.style.display = "";
    });
    showcase.classList.remove("is-visible");
    showcase.classList.remove("is-animating");
  }
  document.body.classList.remove("magnum-mode");
}

function closeCharcoalOverlay() {
  const overlay = document.getElementById("charcoal-overlay");
  if (!overlay) return;
  if (typeof overlay.__charcoalCleanup === "function") {
    overlay.__charcoalCleanup();
    overlay.__charcoalCleanup = null;
  }
  overlay.classList.remove("is-open");
}

function openCharcoalOverlay() {
  const overlayId = "charcoal-overlay";
  let overlay = document.getElementById(overlayId);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.className = "charcoal-overlay";
    document.body.appendChild(overlay);
  }
  if (typeof overlay.__charcoalCleanup === "function") {
    overlay.__charcoalCleanup();
    overlay.__charcoalCleanup = null;
  }

  overlay.innerHTML = `<div class="charcoal-overlay-panel">${charcoalProjectBrowserMock}</div>`;
  overlay.classList.add("is-open");

  const charcoalProject = overlay.querySelector(".charcoal-project");
  if (!charcoalProject) return;

  const tabCloseButton = charcoalProject.querySelector(".chrome-tab-close");
  const windowCloseButton = charcoalProject.querySelector(".chrome-window-close");

  if (tabCloseButton) {
    tabCloseButton.addEventListener("click", closeCharcoalOverlay);
  }
  if (windowCloseButton) {
    windowCloseButton.addEventListener("click", closeCharcoalOverlay);
  }

  const cleanupJourney = initCharcoalProjectJourney(charcoalProject);
  if (typeof cleanupJourney === "function") {
    overlay.__charcoalCleanup = cleanupJourney;
  }
}

function initCharcoalProjectJourney(charcoalProject) {
  if (!charcoalProject) return;

  const urlEl = charcoalProject.querySelector(".chrome-url");
  const omniboxEl = charcoalProject.querySelector(".chrome-omnibox");
  const frameEl = charcoalProject.querySelector(".chrome-viewport iframe");
  const splashEl = charcoalProject.querySelector(".chrome-viewport-splash");
  const homeSearchTextEl = splashEl
    ? splashEl.querySelector(".google-search-text")
    : null;
  const resultsQueryEl = splashEl
    ? splashEl.querySelector(".google-results-query")
    : null;
  const resultsSearchShellEl = splashEl
    ? splashEl.querySelector(".google-search-shell-results")
    : null;
  const primaryResultEl = splashEl
    ? splashEl.querySelector(".google-result-primary")
    : null;
  const cursorEl = splashEl ? splashEl.querySelector(".google-mock-cursor") : null;
  const initialUrlText = charcoalProject.dataset.initialUrl || "google.com";
  const targetUrlText =
    charcoalProject.dataset.targetUrl || "charcoal.keoni.me";
  const targetFrameSrc =
    charcoalProject.dataset.targetSrc || "https://charcoal.keoni.me/";
  const targetOrigin = (() => {
    try {
      return new URL(targetFrameSrc).origin;
    } catch (error) {
      return "";
    }
  })();
  const queryText = splashEl
    ? (splashEl.dataset.query || "Obsidian alternatives for web").trim()
    : "Obsidian alternatives for web";
  const defaultHomeSearchText = homeSearchTextEl
    ? (homeSearchTextEl.textContent || "").trim()
    : "";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const gsapRef = window.gsap;
  const INITIAL_SEQUENCE_TIMING = {
    queryTypingMs: 92,
    startDelayMs: 700,
    resultsRevealDelayMs: 480,
    cursorStartDelayMs: 240,
    cursorMoveDelayMs: 25,
    postClickDelayMs: 360,
    cursorClickHoldMs: 230,
    cursorTravelSeconds: 3.2,
  };
  let isSequenceRunning = false;
  let hasLoadedFrame = false;
  let typingTimer = null;
  let cursorTween = null;
  let cursorRafId = null;
  let isDisposed = false;
  const stepTimers = [];
  const omniboxMeasureCanvas = document.createElement("canvas");
  const omniboxMeasureContext = omniboxMeasureCanvas.getContext("2d");
  const getOmniboxTextWidth = (text) => {
    if (!urlEl || !omniboxMeasureContext) return String(text || "").length * 8;
    const computed = window.getComputedStyle(urlEl);
    omniboxMeasureContext.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
    return omniboxMeasureContext.measureText(String(text || "")).width;
  };
  const clampOmniboxUrl = (value) => {
    const normalized = String(value || "").trim();
    if (!normalized) return targetUrlText;
    if (!urlEl) return normalized;
    const availableWidth = urlEl.clientWidth - 2;
    if (availableWidth <= 40) return normalized;
    if (getOmniboxTextWidth(normalized) <= availableWidth) return normalized;
    const suffix = "...";
    let low = 1;
    let high = normalized.length;
    let best = 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = `${normalized.slice(0, mid)}${suffix}`;
      if (getOmniboxTextWidth(candidate) <= availableWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return `${normalized.slice(0, best)}${suffix}`;
  };

  const formatUrlForOmnibox = (rawUrl) => {
    if (!rawUrl) return targetUrlText;
    try {
      const parsed = new URL(rawUrl, targetFrameSrc);
      if (targetOrigin && parsed.origin !== targetOrigin) {
        return targetUrlText;
      }
      const path = parsed.pathname === "/" ? "" : parsed.pathname;
      return clampOmniboxUrl(
        `${parsed.host}${path}${parsed.search}${parsed.hash}` || targetUrlText,
      );
    } catch (error) {
      return clampOmniboxUrl(
        String(rawUrl)
          .trim()
          .replace(/^https?:\/\//i, "")
          .replace(/\/$/, "") || targetUrlText,
      );
    }
  };

  const setDisplayedUrl = (rawUrl) => {
    if (!urlEl) return;
    urlEl.classList.remove("is-typing");
    urlEl.textContent = formatUrlForOmnibox(rawUrl);
  };

  const extractUrlFromMessageData = (data) => {
    if (typeof data === "string") {
      return data;
    }
    if (!data || typeof data !== "object") {
      return "";
    }
    if (typeof data.url === "string") {
      return data.url;
    }
    if (typeof data.href === "string") {
      return data.href;
    }
    if (typeof data.value === "string") {
      return data.value;
    }
    return "";
  };

  const handleFrameLoad = () => {
    if (!frameEl || isDisposed) return;
    const frameSrc = frameEl.getAttribute("src") || frameEl.src || "";
    if (!frameSrc || frameSrc === "about:blank") return;
    setDisplayedUrl(frameSrc);
  };

  const handleFrameMessage = (event) => {
    if (!frameEl || isDisposed) return;
    if (frameEl.contentWindow && event.source !== frameEl.contentWindow) return;
    if (targetOrigin && event.origin !== targetOrigin) return;
    const navigatedUrl = extractUrlFromMessageData(event.data);
    if (!navigatedUrl) return;
    setDisplayedUrl(navigatedUrl);
  };

  const selectUrlText = () => {
    if (!urlEl) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(urlEl);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleUrlPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectUrlText();
  };

  const handleUrlClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectUrlText();
  };

  if (urlEl) {
    urlEl.addEventListener("pointerdown", handleUrlPointerDown);
    urlEl.addEventListener("click", handleUrlClick);
  }
  if (omniboxEl) {
    omniboxEl.addEventListener("pointerdown", handleUrlPointerDown);
    omniboxEl.addEventListener("click", handleUrlClick);
  }
  if (frameEl) {
    frameEl.addEventListener("load", handleFrameLoad);
  }
  window.addEventListener("message", handleFrameMessage);

  const queueStep = (fn, delay) => {
    const timer = setTimeout(() => {
      const timerIndex = stepTimers.indexOf(timer);
      if (timerIndex >= 0) {
        stepTimers.splice(timerIndex, 1);
      }
      if (isDisposed) return;
      fn();
    }, delay);
    stepTimers.push(timer);
    return timer;
  };

  const clearCharcoalTimers = () => {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    while (stepTimers.length) {
      clearTimeout(stepTimers.pop());
    }
    if (cursorTween && typeof cursorTween.kill === "function") {
      cursorTween.kill();
      cursorTween = null;
    }
    if (cursorRafId) {
      cancelAnimationFrame(cursorRafId);
      cursorRafId = null;
    }
  };

  const setCursorState = (x, y, opacity) => {
    if (!cursorEl) return;
    if (gsapRef && typeof gsapRef.set === "function") {
      gsapRef.set(cursorEl, { x, y, opacity });
      return;
    }
    cursorEl.style.opacity = String(opacity);
    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
  };

  const resetMockState = () => {
    if (!splashEl) return;
    splashEl.classList.remove("is-hidden", "is-results");
    if (homeSearchTextEl) {
      homeSearchTextEl.classList.remove("is-typing");
      homeSearchTextEl.textContent = defaultHomeSearchText;
    }
    if (resultsQueryEl) {
      resultsQueryEl.textContent = queryText;
    }
    if (primaryResultEl) {
      primaryResultEl.classList.remove("is-clicked");
    }
    if (cursorEl) {
      cursorEl.classList.remove("is-clicking");
      setCursorState(0, 0, 0);
    }
  };

  const loadCharcoal = () => {
    if (!urlEl || !frameEl) return;
    setDisplayedUrl(targetFrameSrc);
    if (splashEl) {
      splashEl.classList.add("is-hidden");
    }
    if (!hasLoadedFrame) {
      frameEl.src = targetFrameSrc;
      hasLoadedFrame = true;
    }
    isSequenceRunning = false;
  };

  const typeGoogleQuery = (onDone, typingMs) => {
    if (!homeSearchTextEl) {
      if (typeof onDone === "function") onDone();
      return;
    }
    homeSearchTextEl.classList.add("is-typing");
    homeSearchTextEl.textContent = "";
    let i = 0;

    const step = () => {
      if (isDisposed) {
        typingTimer = null;
        return;
      }
      if (i <= queryText.length) {
        homeSearchTextEl.textContent = queryText.slice(0, i);
        i += 1;
        typingTimer = setTimeout(step, typingMs);
        return;
      }
      typingTimer = null;
      homeSearchTextEl.classList.remove("is-typing");
      if (typeof onDone === "function") onDone();
    };

    step();
  };

  const animateCursorClick = (
    onDone,
    cursorTravelSeconds,
    cursorClickHoldMs,
    cursorMoveDelayMs,
  ) => {
    if (!splashEl || !cursorEl || !primaryResultEl) {
      if (typeof onDone === "function") onDone();
      return;
    }
    const splashRect = splashEl.getBoundingClientRect();
    const originRect = (resultsSearchShellEl || primaryResultEl).getBoundingClientRect();
    const targetRect = primaryResultEl.getBoundingClientRect();
    const originX =
      originRect.left -
      splashRect.left +
      Math.min(originRect.width * 0.86, originRect.width - 24);
    const originY = originRect.top - splashRect.top + originRect.height * 0.66;
    const targetX =
      targetRect.left - splashRect.left + Math.min(188, targetRect.width * 0.52);
    const targetY =
      targetRect.top - splashRect.top + Math.min(36, targetRect.height * 0.56);

    cursorEl.classList.remove("is-clicking");
    setCursorState(originX, originY, 1);

    const startCursorMove = () => {
      if (gsapRef && typeof gsapRef.to === "function") {
        cursorTween = gsapRef.to(cursorEl, {
          x: targetX,
          y: targetY,
          duration: cursorTravelSeconds,
          ease: "power2.inOut",
          onComplete: () => {
            cursorTween = null;
            cursorEl.classList.add("is-clicking");
            primaryResultEl.classList.add("is-clicked");
            queueStep(() => {
              cursorEl.classList.remove("is-clicking");
              if (typeof onDone === "function") onDone();
            }, cursorClickHoldMs);
          },
        });
        return;
      }

      const startTime = performance.now();
      const durationMs = cursorTravelSeconds * 1000;
      const deltaX = targetX - originX;
      const deltaY = targetY - originY;

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const stepCursor = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = easeInOutCubic(progress);
        setCursorState(originX + deltaX * eased, originY + deltaY * eased, 1);

        if (progress < 1) {
          cursorRafId = requestAnimationFrame(stepCursor);
          return;
        }

        cursorRafId = null;
        cursorEl.classList.add("is-clicking");
        primaryResultEl.classList.add("is-clicked");
        queueStep(() => {
          cursorEl.classList.remove("is-clicking");
          if (typeof onDone === "function") onDone();
        }, cursorClickHoldMs);
      };

      cursorRafId = requestAnimationFrame(stepCursor);
    };

    queueStep(startCursorMove, cursorMoveDelayMs || 0);
  };

  const runCharcoalSequence = () => {
    if (isDisposed || isSequenceRunning || !urlEl || !frameEl) return;
    isSequenceRunning = true;
    clearCharcoalTimers();
    urlEl.textContent = initialUrlText;
    if (!hasLoadedFrame) {
      frameEl.src = "about:blank";
    }
    resetMockState();

    if (prefersReducedMotion) {
      if (homeSearchTextEl) {
        homeSearchTextEl.textContent = queryText;
      }
      if (splashEl) {
        splashEl.classList.add("is-results");
      }
      loadCharcoal();
      return;
    }

    const timing = INITIAL_SEQUENCE_TIMING;

    queueStep(() => {
      typeGoogleQuery(() => {
        queueStep(() => {
          if (resultsQueryEl) {
            resultsQueryEl.textContent = queryText;
          }
          if (splashEl) {
            splashEl.classList.add("is-results");
          }
          queueStep(() => {
            animateCursorClick(() => {
              queueStep(() => {
                loadCharcoal();
              }, timing.postClickDelayMs);
            }, timing.cursorTravelSeconds, timing.cursorClickHoldMs, timing.cursorMoveDelayMs);
          }, timing.cursorStartDelayMs);
        }, timing.resultsRevealDelayMs);
      }, timing.queryTypingMs);
    }, timing.startDelayMs);
  };

  runCharcoalSequence();

  const cleanupCharcoalJourney = () => {
    if (isDisposed) return;
    isDisposed = true;
    clearCharcoalTimers();
    if (urlEl) {
      urlEl.removeEventListener("pointerdown", handleUrlPointerDown);
      urlEl.removeEventListener("click", handleUrlClick);
    }
    if (omniboxEl) {
      omniboxEl.removeEventListener("pointerdown", handleUrlPointerDown);
      omniboxEl.removeEventListener("click", handleUrlClick);
    }
    if (frameEl) {
      frameEl.removeEventListener("load", handleFrameLoad);
    }
    window.removeEventListener("message", handleFrameMessage);
  };

  return cleanupCharcoalJourney;
}

function autoTypeAndSubmitCommand(autoCommand, options = {}) {
  const suppressAutoTypeScroll = Boolean(options.suppressAutoTypeScroll);
  let index = 0;
  textarea.value = "";
  command.innerHTML = "";

  const typeNext = function () {
    if (index < autoCommand.length) {
      index += 1;
      const current = autoCommand.slice(0, index);
      textarea.value = current;
      command.innerHTML = current;
      if (!suppressAutoTypeScroll) {
        scrollToBottom();
      }
      setTimeout(typeNext, 110);
      return;
    }

    setTimeout(function () {
      enterKey({ keyCode: 13, programmatic: true });
    }, 140);
  };

  typeNext();
}

function startAsciiCatBlinkAnimation() {
  if (!asciiCatFrame) return;

  const catEyesClosed = `             ＿＿
　　　　 　＞　 　フ  
　　　　　| 　_　 _| 
　 　　　／\` ミ_wノ
　　 　 /　　　 　 |
　　　 /　 ヽ　　 ﾉ
　 　 │　　|　|　|
　／￣|　　 |　|　|
　| (￣ヽ＿_ヽ_)__)
　＼二つ`;

  const catEyesOpen = `             ＿＿
　　　　 　＞　 　フ  
　　　　　| 　o　 o| 
　 　　　／\` ミ_wノ
　　 　 /　　　 　 |
　　　 /　 ヽ　　 ﾉ
　 　 │　　|　|　|
　／￣|　　 |　|　|
　| (￣ヽ＿_ヽ_)__)
　＼二つ`;

  asciiCatFrame.textContent = catEyesClosed;

  const animateBlink = function () {
    asciiCatFrame.textContent = catEyesOpen;
    setTimeout(function () {
      asciiCatFrame.textContent = catEyesClosed;
      const nextPause = 2200 + Math.floor(Math.random() * 1800);
      setTimeout(animateBlink, nextPause);
    }, 260);
  };

  setTimeout(animateBlink, 1800);
}



const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");
const asciiCatFrame = document.getElementById("ascii-cat-frame");
const navCommandLinks = document.querySelectorAll(".top-nav a[data-command]");

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
  "home",
]);
const commandLineDelay = 80;
const buttonPreviewDuration = 250;
const previewedButtonKeys = new Set();
const homeHintText =
  '<span class="cli-run-command cli-run-item" data-run-command="home">← Back<br>(Type <u>home</u> to return to the list of supported commands)</span>';
const defaultPrompt = "[keoni@me]~$";
const thoughtsPrompt = "> ";

function setPromptPrefix(prefix) {
  if (!liner) return;
  liner.setAttribute("data-prompt", prefix);
}

function focusInput() {
  if (!textarea) return;
  try {
    textarea.focus({ preventScroll: true });
  } catch (_err) {
    textarea.focus();
  }
}

function scrollToBottom() {
  if (contentscroll) {
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }
}

function clearTerminalLines() {
  if (!terminal) return;
  const lines = terminal.querySelectorAll(":scope > p");
  lines.forEach((line) => line.remove());
}

setTimeout(function () {
  loopLines(banner, "", 80);
  focusInput();
  scrollToBottom();

  setTimeout(function () {
    const initialCommand = "home";
    setActiveNavCommand(initialCommand);
    autoTypeAndSubmitCommand(initialCommand);
  }, banner.length * 80 + 250);
}, 100);

startAsciiCatBlinkAnimation();

window.addEventListener("keyup", function (e) {
  enterKey(e);
});

document.addEventListener("click", function () {
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
  if (e.keyCode === 13) {
    const input = command.innerHTML.trim().toLowerCase();
    const typedPrompt = isThoughtsMode ? thoughtsPrompt : defaultPrompt;
    if (input !== "charcoal") {
      addLine(typedPrompt + " " + command.innerHTML, "no-animation", 0);
    }

    commands.push(command.innerHTML);
    git = commands.length;
    commander(input);

    command.innerHTML = "";
    textarea.value = "";
    scrollToBottom();
  }

  if (e.keyCode === 38 && git !== 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
    scrollToBottom();
  }

  if (e.keyCode === 40 && git !== commands.length) {
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
  if (clearBeforeCommands.has(cmd)) {
    clearTerminalLines();
  }
  switch (cmd) {
    case "home":
      setActiveNavCommand("home");
      outputLines = home.length;
      showFooterHint = false;
      loopLines(home, "", commandLineDelay, {
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
      });
      break;
    case "charcoal":
      setActiveNavCommand("projects");
      openCharcoalOverlay();
      return;
    case "magnum":
      setActiveNavCommand("projects");
      outputLines = projectMagnum.length;
      loopLines(projectMagnum, "", commandLineDelay, {
        previewClickableItems: true,
        previewDuration: buttonPreviewDuration,
      });
      break;
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
        "Unknown command - Type <u>home</u> to see a list of supported commands",
        "output-blue",
        commandLineDelay * 2,
      );
      break;
  }
  if (showFooterHint) {
    addLine("<br>", "", (outputLines + 1) * commandLineDelay);
    addLine(
      homeHintText,
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

function runCommandFromNavigation(cmd) {
  if (!cmd) return;
  if (isThoughtsMode) {
    isThoughtsMode = false;
    setPromptPrefix(defaultPrompt);
  }
  setActiveNavCommand(cmd);
  autoTypeAndSubmitCommand(cmd);
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
        autoTypeAndSubmitCommand("home");
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
  // Attempt normal close (works if tab was JS-opened)
  window.open("", "_self");
  window.close();

  // Fallback (most browsers): navigate away
  setTimeout(() => {
    window.location.href = "about:blank";
  }, 100);
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
    contentscroll.scrollTop = contentscroll.scrollHeight;
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
  name.forEach(function (item, index) {
    addLine(item, style, index * time, function (lineNode) {
      if (!previewClickableItems) return;
      applyTemporaryButtonPreview(lineNode, previewDuration);
    });
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    name.length * time + 50,
  );
}

function closeCharcoalOverlay() {
  const overlay = document.getElementById("charcoal-overlay");
  if (!overlay) return;
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

  initCharcoalProjectJourney(charcoalProject);
}

function initCharcoalProjectJourney(charcoalProject) {
  if (!charcoalProject) return;

  const urlEl = charcoalProject.querySelector(".chrome-url");
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
    charcoalProject.dataset.targetUrl || "charcoal-md.vercel.app";
  const targetFrameSrc =
    charcoalProject.dataset.targetSrc || "https://charcoal-md.vercel.app/";
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
  const stepTimers = [];

  const queueStep = (fn, delay) => {
    const timer = setTimeout(() => {
      const timerIndex = stepTimers.indexOf(timer);
      if (timerIndex >= 0) {
        stepTimers.splice(timerIndex, 1);
      }
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
    urlEl.classList.remove("is-typing");
    urlEl.textContent = targetUrlText;
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
    if (isSequenceRunning || !urlEl || !frameEl) return;
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
}

function autoTypeAndSubmitCommand(autoCommand) {
  let index = 0;
  textarea.value = "";
  command.innerHTML = "";

  const typeNext = function () {
    if (index < autoCommand.length) {
      index += 1;
      const current = autoCommand.slice(0, index);
      textarea.value = current;
      command.innerHTML = current;
      scrollToBottom();
      setTimeout(typeNext, 110);
      return;
    }

    setTimeout(function () {
      enterKey({ keyCode: 13 });
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

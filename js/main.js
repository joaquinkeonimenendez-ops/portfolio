const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");
const projectsOverlay = document.getElementById("projects-overlay");
const projectsOverlayClose = document.getElementById("projects-overlay-close");
const topModeLabel = document.getElementById("top-mode-label");

let git = 0;
let pw = false;
const commands = [];
let suggestedCommand = null;
let awaitingConfirmation = false;

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

function openProjectsOverlay() {
  if (!projectsOverlay) return;
  clearTerminalLines();
  projectsOverlay.hidden = false;
  projectsOverlay.setAttribute("aria-hidden", "false");
  if (topModeLabel) {
    topModeLabel.textContent = "projects";
  }
}

function closeProjectsOverlay() {
  if (!projectsOverlay) return;
  projectsOverlay.hidden = true;
  projectsOverlay.setAttribute("aria-hidden", "true");
  if (topModeLabel) {
    topModeLabel.textContent = "projects";
  }
}

const commandMap = {
  begin: "begin",
};

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
  scrollToBottom();
}, 100);

window.addEventListener("keyup", function (e) {
  enterKey(e);
  scrollToBottom();
});

window.addEventListener("keydown", function () {
  textarea.focus();
  scrollToBottom();
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeProjectsOverlay();
  }
});

document.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

terminal.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

if (projectsOverlayClose) {
  projectsOverlayClose.addEventListener("click", function () {
    closeProjectsOverlay();
    textarea.focus();
    scrollToBottom();
  });
}

textarea.addEventListener("input", scrollToBottom);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  textarea.focus();
  scrollToBottom();

  if (e.keyCode === 13) {
    const input = command.innerHTML.trim().toLowerCase();
    addLine("[keoni@me]~$ " + command.innerHTML, "no-animation", 0);

    if (awaitingConfirmation && suggestedCommand) {
      if (input === "y") {
        commander(suggestedCommand);
      } else {
        addLine("Cancelled.", "color2", 80);
      }
      awaitingConfirmation = false;
      suggestedCommand = null;
    } else {
      commands.push(command.innerHTML);
      git = commands.length;
      commander(input);
    }

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
  switch (cmd.toLowerCase()) {
    case "begin":
      openProjectsOverlay();
      break;
    default:
      const closest = findClosestCommand(cmd);
      if (closest) {
        suggestedCommand = closest;
        awaitingConfirmation = true;
        addLine(
          `<span class="inherit">Command not found. Did you mean <span class="command">'${closest}'</span>? (y/n)</span>`,
          "error",
          100,
        );
      } else {
        addLine(
          `<span class="inherit">Command not found. Type <span class="command">'begin'</span> to view projects.</span>`,
          "error",
          100,
        );
      }
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

function addLine(text, style, time) {
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
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    name.length * time + 50,
  );
}

function findClosestCommand(input) {
  const threshold = 3;
  let minDist = Infinity;
  let closest = null;
  Object.keys(commandMap).forEach((cmd) => {
    const dist = levenshtein(input, cmd);
    if (dist < minDist && dist <= threshold) {
      minDist = dist;
      closest = cmd;
    }
  });
  return closest;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}



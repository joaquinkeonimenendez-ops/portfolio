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
  "contact",
  "social",
  "help",
]);
const commandLineDelay = 80;
const helpHintText =
  '<span class="cli-run-command cli-run-item" data-run-command="help">(Type <u>help</u> to return to the list of supported commands)</span>';
const helpBackText = "← back";
const defaultPrompt = "[keoni@me]~$";
const thoughtsPrompt = ">";

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
    autoTypeAndSubmitCommand("help");
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
    if (isThoughtsMode) {
      isThoughtsMode = false;
      setPromptPrefix(defaultPrompt);
    }
    autoTypeAndSubmitCommand(cmd);
    return;
  }
  focusInput();
});

navCommandLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const cmd = link.getAttribute("data-command");
    if (!cmd) return;
    if (isThoughtsMode) {
      isThoughtsMode = false;
      setPromptPrefix(defaultPrompt);
    }
    autoTypeAndSubmitCommand(cmd);
  });
});

textarea.value = "";
command.innerHTML = "Loading...";
setPromptPrefix(defaultPrompt);

function enterKey(e) {
  if (e.keyCode === 13) {
    const input = command.innerHTML.trim().toLowerCase();
    const typedPrompt = isThoughtsMode ? thoughtsPrompt : defaultPrompt;
    addLine(typedPrompt + " " + command.innerHTML, "no-animation", 0);

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
    case "help":
      outputLines = help.length;
      showFooterHint = false;
      loopLines(help, "", commandLineDelay);
      break;
    case "about":
    case "aboutme":
      outputLines = aboutme.length;
      loopLines(aboutme, "", commandLineDelay);
      break;
    case "projects":
      outputLines = projects.length;
      loopLines(projects, "", commandLineDelay);
      break;
    case "contact":
    case "social":
      outputLines = social.length;
      loopLines(social, "", commandLineDelay);
      break;
    default:
      outputLines = 2;
      showFooterHint = false;
      addLine("<br>", "", commandLineDelay);
      addLine(
        "Unknown command - Type <u>help</u> to see a list of supported commands",
        "output-blue",
        commandLineDelay * 2,
      );
      break;
  }
  if (showFooterHint) {
    addLine("<br>", "", (outputLines + 1) * commandLineDelay);
    addLine(helpBackText, "tertiary", (outputLines + 2) * commandLineDelay);
    addLine(helpHintText, "tertiary", (outputLines + 3) * commandLineDelay);
    addLine("<br>", "", (outputLines + 4) * commandLineDelay);
  } else {
    addLine("<br>", "", (outputLines + 1) * commandLineDelay);
  }
  scrollToBottom();
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

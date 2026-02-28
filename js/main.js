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
let hasAutoHelpRun = false;

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

terminal.addEventListener("click", function () {
  focusInput();
});

navCommandLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const cmd = link.getAttribute("data-command");
    if (!cmd) return;
    autoTypeAndSubmitCommand(cmd);
  });
});

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode === 13) {
    const input = command.innerHTML.trim().toLowerCase();
    addLine("[keoni@me]~$ " + command.innerHTML, "no-animation", 0);

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
  switch (cmd) {
    case "help":
      loopLines(help, "", 80);
      break;
    case "about":
    case "aboutme":
      loopLines(aboutme, "", 80);
      break;
    case "projects":
      loopLines(projects, "", 80);
      break;
    case "contact":
    case "social":
      loopLines(social, "", 80);
      break;
    default:
      addLine(
        "Unknown command - Type help to see a list of supported commands",
        "output-blue",
        80,
      );
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
  if (autoCommand === "help" && hasAutoHelpRun) return;
  if (autoCommand === "help") {
    hasAutoHelpRun = true;
  }

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

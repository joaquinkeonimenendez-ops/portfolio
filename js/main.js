const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");
const topModeLabel = document.getElementById("top-mode-label");

let git = 0;
let pw = false;
const commands = [];

function scrollToBottom() {
  if (contentscroll) {
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }
}

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
    if (topModeLabel) {
      topModeLabel.textContent = "about me";
    }
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

textarea.addEventListener("input", scrollToBottom);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  textarea.focus();
  scrollToBottom();

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
  addLine("HI", "color2", 80);
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


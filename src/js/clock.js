let hours = 0;
let minutes = 0;
let seconds = 0;
let start = document.getElementById("start");
let stop = document.getElementById("stop");
let startstop = true;
let startinterval = null;
let brakeinterval = null;
const audiosound = document.getElementById("ring");
let statuses = document.getElementById("status");
function reset() {
  startstop = true;
  if (startstop) {
    clearInterval(startinterval);
    start.style.visibility = "visible";
    stop.style.visibility = "hidden";
  }
  const removeintervalsec = setInterval(() => {
    if (seconds > 0) {
      seconds -= 1;
    }
    if (seconds === 0) {
      clearInterval(removeintervalsec);
    }
    clock();
  }, 30);
  const removeintervalmin = setInterval(() => {
    if (minutes > 0) {
      minutes -= 1;
    }
    if (minutes === 0) {
      clearInterval(removeintervalmin);
    }
    clock();
  }, 30);
  const removeintervalhr = setInterval(() => {
    if (hours > 0) {
      hours -= 1;
    }
    if (hours === 0) {
      clearInterval(removeintervalhr);
    }
    clock();
  }, 100);
}
let arrow = true;
function displaysection() {
  arrow = !arrow;
  if (arrow) {
    document.getElementById("section-bottom").style.display = "block";
  } else {
    document.getElementById("section-bottom").style.display = "none";
  }
}
setInterval(() => {
  let statusstate = startstop ? "ពេលត្រូវរៀនសូត្រ" : "ពេលត្រូវសម្រាក";
  statuses.innerHTML = "<h3>" + statusstate + "</h3>";
}, 100);
clock();
function add() {
  audiosound.play();
  start.style.visibility = "hidden";
  stop.style.visibility = "visible";
  if (startstop) {
    audiosound.play();
    startinterval = setInterval(() => {
      seconds += 1;
      clock();
    }, 1000);
  } else {
    brakeinterval = setInterval(() => {
      seconds -= 1;
      if (seconds < 1) {
        minutes -= 1;
        seconds += 60;
      }
      if (minutes < 0) {
        audiosound.play();
        minutes = 0;
        seconds = 0;
        stop.style.visibility = "hidden";
        start.style.visibility = "visible";
        startstop = true;
        clearInterval(brakeinterval);
      }
      clock();
    }, 1000);
  }
}
function remove() {
  stop.style.visibility = "hidden";
  start.style.visibility = "visible";
  if (startstop) {
    clearInterval(startinterval);
  } else {
    clearInterval(brakeinterval);
  }
}
function cal() {
  audiosound.play();
  startstop = false;
  let fulltime = hours * 60 + minutes;
  let braketime =
    fulltime < 25
      ? 5
      : (fulltime > 25) & (fulltime < 50)
      ? 8
      : (fulltime > 50) & (fulltime < 90)
      ? 10
      : 15;
  clearInterval(startinterval);
  start.style.visibility = "visible";
  stop.style.visibility = "hidden";
  const removeintervalsec = setInterval(() => {
    if (seconds > 0) {
      seconds -= 1;
    }
    if (seconds === 0) {
      clearInterval(removeintervalsec);
    }
    clock();
  }, 30);
  const removeintervalhr = setInterval(() => {
    if (hours > 0) {
      hours -= 1;
    }
    if (hours === 0) {
      clearInterval(removeintervalhr);
    }
    clock();
  }, 100);
  if (minutes > braketime) {
    const removeintervalmin = setInterval(() => {
      minutes -= 1;
      if (minutes === braketime) {
        clearInterval(removeintervalmin);
      }
      clock();
    }, 30);
  }
  if (minutes < braketime) {
    const removeintervalmin = setInterval(() => {
      minutes += 1;
      if (minutes === braketime) {
        clearInterval(removeintervalmin);
      }
      clock();
    }, 30);
  }
  if (!startstop) {
    clearInterval(brakeinterval);
  }
}
function clock() {
  let secDots = document.getElementById("secDots");
  let minDots = document.getElementById("minDots");
  let hrDots = document.getElementById("hrDots");
  let second = seconds < 2 ? "Second" : "Seconds";
  let minute = minutes < 2 ? "minute" : "minutes";
  let hour = hours < 2 ? "hour" : "hours";
  let secondsDots = "";
  let minutesDots = "";
  let hoursDots = "";
  function zero(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }
  for (let i = 1; i < 61; i++) {
    let rotation = i * 6;
    if (i === seconds) {
      secondsDots +=
        '<div class="dot active" style="transform: rotate(' +
        rotation +
        'deg) translateX(6px)"></div>';
    } else {
      secondsDots +=
        '<div class="dot" style="transform: rotate(' +
        rotation +
        'deg)"></div>';
    }
  }
  for (let i = 1; i < 61; i++) {
    let rotation = i * 6;
    if (i === minutes) {
      minutesDots +=
        '<div class="dot active" style="transform: rotate(' +
        rotation +
        'deg) translateX(6px)"></div>';
    } else {
      minutesDots +=
        '<div class="dot" style="transform: rotate(' +
        rotation +
        'deg)"></div>';
    }
  }
  for (let i = 1; i < 13; i++) {
    let rotation = i * 30;
    if (i === hours) {
      hoursDots +=
        '<div class="dot active" style="transform: rotate(' +
        rotation +
        'deg)"></div>';
    } else {
      hoursDots +=
        '<div class="dot" style="transform: rotate(' +
        rotation +
        'deg)"></div>';
    }
  }
  secDots.innerHTML =
    secondsDots + "<h2>" + zero(seconds) + `<br><span>${second}</span></h2>`;
  minDots.innerHTML =
    minutesDots + "<h2>" + zero(minutes) + `<br><span>${minute}</span></h2>`;
  hrDots.innerHTML =
    hoursDots + "<h2>" + zero(hours) + `<br><span>${hour}</span></h2>`;
  if (seconds > 59) {
    seconds -= 60;
    minutes += 1;
  }
  if (minutes > 59) {
    minutes -= 60;
    hours += 1;
  }
}

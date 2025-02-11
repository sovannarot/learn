let start = true;
const menuli = document.getElementsByClassName("menuli");
const pyramid = document.getElementById("pyramid");
function menu() {
  start = !start;
  if (start) {
    pyramid.style.transform = "scale(1)";
    menuli[0].style.transform = "scale(0)";
    menuli[1].style.transform = "scale(0)";
    menuli[2].style.transform = "scale(0)";
  } else {
    pyramid.style.transform = "scale(0)";
    menuli[0].style.transform = "scale(1)";
    menuli[1].style.transform = "scale(1)";
    menuli[2].style.transform = "scale(1)";
  }
}

let deferredPrompt;
const installButton = document.getElementById("installbutton");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.removeAttribute("hidden");
});
installButton.addEventListener("click", async () => {
  deferredPrompt.prompt();
  deferredPrompt = null;
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    console.log("User accepted the install prompt.");
  } else if (outcome === "dismissed") {
    console.log("User dismissed the install prompt");
  }
});

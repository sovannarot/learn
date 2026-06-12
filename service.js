if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const swPath = getServiceWorkerPath();
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log("service worker registered", registration);

      if (registration.waiting) {
        requestServiceWorkerActivation(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            requestServiceWorkerActivation(installingWorker);
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });

      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000,
      );
    } catch (err) {
      console.log("service worker not registered", err);
    }
  });
}

function getServiceWorkerPath() {
  const currentUrl = location.href;
  if (location.pathname.includes("/src/html/")) {
    return new URL("../../sw.js", currentUrl).href;
  }
  return new URL("./sw.js", currentUrl).href;
}

function requestServiceWorkerActivation(worker) {
  if (!worker) return;
  worker.postMessage({ type: "SKIP_WAITING" });
}

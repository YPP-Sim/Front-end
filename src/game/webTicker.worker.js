let ticking = false;
let taskId = null;

self.addEventListener(
  "message",
  function (e) {
    const [command, speed] = e.data;
    switch (command) {
      case "start":
        if (!ticking) {
          ticking = true;
          taskId = setInterval(() => {
            self.postMessage("tick");
          }, speed);
        }
        break;
      case "stop":
        clearInterval(taskId);
        ticking = false;
        break;
    }
  },
  false
);

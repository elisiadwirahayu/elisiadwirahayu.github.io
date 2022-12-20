let canvas = document.getElementById("canvas");
canvas.height = 400;
canvas.width = 400;
let ctx = canvas.getContext("2d");
ctx.lineWidth = 8;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let prevX = null;
let prevY = null;

let draw = false;

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);
clrs.forEach((clr) => {
  clr.addEventListener("click", () => {
    ctx.strokeStyle = clr.dataset.clr;
  });
});

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  ctx = canvas.getContext("2d");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

let saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
  let data = canvas.toDataURL("image/jpeg");
  var requestOptions = {
    method: "POST",
    body: JSON.stringify({ imgbase64: data }),
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch("http://127.0.0.1:8000/predict-image", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      let res = JSON.parse(result);
      let confidence = res.data.confidence;
      let label = res.data.label;
      let labelEl = document.querySelector("#result");
      let confidenceEl = document.querySelector("#confidence");
      labelEl.innerHTML = label;
      confidenceEl.innerHTML = confidence;
    })
    .catch((error) => console.log("error", error));
  console.log(data);
  data = "";
});

window.addEventListener("mousedown", (e) => (draw = true));
window.addEventListener("mouseup", (e) => (draw = false));

window.addEventListener("mousemove", function (e) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (prevX == null || prevY == null || !draw) {
    prevX = e.clientX;
    prevY = e.clientY;
    return;
  }

  let mouseX = e.clientX;
  let mouseY = e.clientY;
  ctx.beginPath();
  ctx.moveTo(prevX - vw / 2 + 200, prevY - vh / 2 + 200);
  ctx.lineTo(mouseX - vw / 2 + 200, mouseY - vh / 2 + 200);
  ctx.stroke();

  prevX = e.clientX;
  prevY = e.clientY;
});

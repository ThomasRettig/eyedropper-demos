if (!("EyeDropper" in window)) {
  alert(
    "Your browser does not support the EyeDropper API yet. This demo will not work as intended"
  );
}

const selectBtn = document.querySelector(".select");
const swapBtn = document.querySelector(".swap");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let originalColor = null;
let newColor = null;

addEventListener("click", (e) => {
  const image = e.target.closest("img");
  if (!image) {
    return;
  }

  loadImage(image);
});

selectBtn.addEventListener("click", pickColorToSwap);
swapBtn.addEventListener("click", swapSelectedColor);

function loadImage(image) {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

async function pickColorToSwap() {
  originalColor = await startEyeDropper();
}

async function swapSelectedColor() {
  if (!originalColor) {
    return;
  }

  newColor = await startEyeDropper();

  swapColorsInCanvas();
}

function swapColorsInCanvas() {
  if (!originalColor || !newColor) {
    return;
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    if (
      r === originalColor.r &&
      g === originalColor.g &&
      b === originalColor.b
    ) {
      imageData.data[i] = newColor.r;
      imageData.data[i + 1] = newColor.g;
      imageData.data[i + 2] = newColor.b;
    }
  }

  context.putImageData(imageData, 0, 0);
}

function convertToRGB(hex) {
  return {
    r: parseInt(hex.substr(1, 2), 16),
    g: parseInt(hex.substr(3, 2), 16),
    b: parseInt(hex.substr(5, 2), 16),
  };
}

async function startEyeDropper() {
  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open();
    return convertToRGB(result.sRGBHex);
  } catch (e) {
    return null;
  }
}

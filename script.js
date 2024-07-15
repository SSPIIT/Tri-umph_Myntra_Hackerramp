const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".option.tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-img");
const ctx = canvas.getContext("2d");

// Global variables with default values
let prevMouseX, prevMouseY, snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

// Set canvas background initially
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Drawing functions
const drawRect = (e) => {
  if (!fillColor.checked) {
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  } else {
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
}

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  if (!fillColor.checked) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  if (!fillColor.checked) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
}

const drawBrush = (e) => {
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

const drawEraser = (e) => {
  ctx.strokeStyle = "#fff";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const pixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * pixelRatio;
canvas.height = canvas.offsetHeight * pixelRatio;
ctx.scale(pixelRatio, pixelRatio);

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  switch (selectedTool) {
    case "brush":
      drawBrush(e);
      break;
    case "eraser":
      drawEraser(e);
      break;
    case "rectangle":
      drawRect(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
    default:
      break;
  }
}

// Event listeners for shapes options toggle
const shapesTitle = document.querySelector(".shapes-title");
const shapesOptions = document.querySelector(".shapes-options");

shapesTitle.addEventListener("click", () => {
  shapesOptions.classList.toggle("active");
});

// Event listeners for tools options toggle
const toolsTitle = document.querySelector(".tools-title");
const toolsOptions = document.querySelector(".tools-options");

toolsTitle.addEventListener("click", () => {
  toolsOptions.classList.toggle("active");
});

// Event listeners
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".option.tool.active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("input", () => brushWidth = sizeSlider.value);

colorPicker.addEventListener("input", () => {
  selectedColor = colorPicker.value;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
});

fillColor.addEventListener("click", () => {
  if (fillColor.checked) {
    fillColor.parentElement.style.backgroundColor = selectedColor;
  } else {
    fillColor.parentElement.style.backgroundColor = "#fff";
  }
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// Get the icon and color picker elements
const icon = document.getElementById('color-icon');
// const colorPicker = document.getElementById('color-picker');

// Add click event listener to the icon
icon.addEventListener('click', function(event) {
  // Toggle the display of the color picker
  if (colorPicker.style.display === 'none') {
    colorPicker.style.display = 'block';
  } else {
    colorPicker.style.display = 'none';
  }
  
  // Prevent propagation to document click handler
  event.stopPropagation();
});

// Add click event listener to the document
document.addEventListener('click', function(event) {
  // Check if the clicked element is outside the color picker
  if (!colorPicker.contains(event.target) && event.target !== icon) {
    // Hide the color picker
    colorPicker.style.display = 'none';
  }
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

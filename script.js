let array = [];

function logStep(msg) {
  const logList = document.getElementById("logList");
  const item = document.createElement("li");
  item.textContent = msg;
  logList.appendChild(item);
  logList.scrollTop = logList.scrollHeight;
}

function chooseMode(mode) {
  document.getElementById("initial-choice").classList.add("hidden");
  document.getElementById("logList").innerHTML = '';

  if (mode === 'random') {
    const count = Math.floor(Math.random() * 6) + 3; // 3 to 8 values
    array = Array.from({ length: count }, () => Math.floor(Math.random() * 90 + 10));
    drawArray(array);
    logStep("🎲 Random array generated: [" + array.join(", ") + "]");
    quickSortHandler();
  } else {
    document.getElementById("custom-form").classList.remove("hidden");
  }
}

function generateInputFields() {
  const count = parseInt(document.getElementById("numElements").value);
  const container = document.getElementById("elementInputs");
  container.innerHTML = "";

  if (isNaN(count) || count < 2 || count > 8) {
    alert("Please enter a number between 2 and 8.");
    return;
  }

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = `#${i + 1}`;
    input.classList.add("elementInput");
    container.appendChild(input);
  }

  document.getElementById("action-buttons").classList.remove("hidden");
}

function createArray() {
  const inputs = document.querySelectorAll(".elementInput");
  array = [];

  for (let input of inputs) {
    const val = parseInt(input.value);
    if (isNaN(val)) {
      alert("Fill all values!");
      return;
    }
    array.push(val);
  }

  drawArray(array);
  document.getElementById("logList").innerHTML = '';
  logStep("✅ Custom array created: [" + array.join(', ') + "]");
}

function drawArray(arr) {
  const container = document.getElementById("array");
  container.innerHTML = "";

  const maxVal = Math.max(...arr);

  for (let val of arr) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${(val / maxVal) * 100}%`;
    bar.style.width = `${100 / arr.length - 2}%`;
    bar.textContent = val;
    container.appendChild(bar);
  }
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function quickSortHandler() {
  logStep("▶️ Starting Quick Sort...");
  await quickSort(array, 0, array.length - 1);
  logStep("🎉 Sorting Completed!");
}

async function quickSort(arr, low, high) {
  if (low < high) {
    const pi = await partition(arr, low, high);
    logStep(`📌 Pivot placed at index ${pi}`);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  }
}

async function partition(arr, low, high) {
  const bars = document.getElementsByClassName("bar");
  const pivot = arr[high];
  let i = low - 1;

  bars[high].style.backgroundColor = "#ff4081";
  logStep(`🟠 Partitioning with pivot ${pivot}`);

  for (let j = low; j <= high - 1; j++) {
    bars[j].style.backgroundColor = "#ffee58";
    logStep(`🔍 Comparing ${arr[j]} with ${pivot}`);
    await sleep(300);

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      swapBars(i, j);
      logStep(`🔄 Swapped ${arr[i]} and ${arr[j]}`);
      await sleep(300);
    }
    bars[j].style.backgroundColor = "#4fc3f7";
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  swapBars(i + 1, high);
  logStep(`✅ Swapped pivot ${pivot} to position ${i + 1}`);
  await sleep(300);
  bars[high].style.backgroundColor = "#4fc3f7";

  return i + 1;
}

function swapBars(i, j) {
  const bars = document.getElementsByClassName("bar");

  const tempHeight = bars[i].style.height;
  const tempText = bars[i].innerText;

  bars[i].style.height = bars[j].style.height;
  bars[i].innerText = bars[j].innerText;

  bars[j].style.height = tempHeight;
  bars[j].innerText = tempText;
}

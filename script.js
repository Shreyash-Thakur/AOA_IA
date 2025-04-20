let array = [];
let stopRequested = false;
let sortedIndices = [];

function logStep(msg) {
  const log = document.getElementById("logList");
  const li = document.createElement("li");
  li.textContent = msg;
  log.appendChild(li);
  log.scrollTop = log.scrollHeight;
}

function showStatusMessage(msg) {
  const status = document.getElementById("statusMessage");
  status.textContent = msg;
  status.classList.remove("hidden");
}

function generateRandomArray() {
  stopRequested = false;
  sortedIndices = [];
  array = Array.from({ length: 14 }, () => Math.floor(Math.random() * 90 + 10));
  drawArray(array);
  logStep("Random array generated: [" + array.join(", ") + "]");
  showStatusMessage("Random array of 14 elements ready!");

  document.getElementById("custom-input-controls").classList.add("hidden");
  document.getElementById("customInputFields").classList.add("hidden");
  document.getElementById("custom-action-buttons").classList.add("hidden");

  document.getElementById("main-controls").classList.remove("hidden");
  document.getElementById("sorting-buttons").classList.remove("hidden");
}

function chooseCustom() {
  stopRequested = false;
  sortedIndices = [];
  document.getElementById("main-controls").classList.add("hidden");
  document.getElementById("custom-input-controls").classList.remove("hidden");
  document.getElementById("customInputFields").classList.add("hidden");
  document.getElementById("custom-action-buttons").classList.add("hidden");
  document.getElementById("sorting-buttons").classList.add("hidden");
}

function showCustomFields() {
  const count = parseInt(document.getElementById("numElements").value);
  const container = document.getElementById("customInputFields");
  container.innerHTML = "";

  if (isNaN(count) || count < 1) {
    alert("⚠️ Please enter a valid number of elements.");
    return;
  }

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = `#${i + 1}`;
    input.min = 0;
    container.appendChild(input);
  }

  container.classList.remove("hidden");
  document.getElementById("custom-action-buttons").classList.remove("hidden");
}

function createArray() {
  const inputs = document.querySelectorAll("#customInputFields input");
  array = [];
  sortedIndices = [];

  for (const input of inputs) {
    const val = parseInt(input.value);
    if (isNaN(val) || val < 0) {
      alert("⚠️ Only non-negative numbers are allowed.");
      return;
    }
    array.push(val);
  }

  if (array.length === 0) {
    alert("⚠️ Please enter at least one number.");
    return;
  }

  drawArray(array);
  logStep("✅ Custom array created: [" + array.join(", ") + "]");
  showStatusMessage("✅ Custom array generated!");
  document.getElementById("sorting-buttons").classList.remove("hidden");
}

function drawArray(arr, pivotIndex = -1, compareIndex = -1, sorted = []) {
  const container = document.getElementById("arrayContainer");
  container.innerHTML = "";
  const maxVal = Math.max(...arr);

  for (let i = 0; i < arr.length; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = (arr[i] / maxVal) * 100 + "%";
    bar.textContent = arr[i];

    if (i === pivotIndex) bar.classList.add("pivot");
    else if (i === compareIndex) bar.classList.add("comparing");
    
    // ✅ Apply sorted style ONLY after full sort
    if (sorted.length === arr.length) {
      bar.classList.add("sorted");
    }

    container.appendChild(bar);
  }
}


function stopSorting() {
  stopRequested = true;
  showStatusMessage("Sorting stopped.");
  logStep("Sorting was manually stopped.");
}

async function startQuickSort() {
  stopRequested = false;
  sortedIndices = [];
  logStep("▶️ Starting Quick Sort...");
  await quickSort(array, 0, array.length - 1);
  if (!stopRequested) {
    drawArray(array, -1, -1, sortedIndices);
    logStep("🎉 Array is fully sorted!");
    showStatusMessage("✅ Array is now fully sorted!");
  }
}

async function quickSort(arr, low, high) {
  if (stopRequested) return;
  if (low < high) {
    const pi = await partition(arr, low, high);
    logStep(`📍 Pivot placed at index ${pi}`);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  } else if (low === high) {
    sortedIndices.push(low); // mark single element as sorted
    drawArray(arr, -1, -1, sortedIndices);
    await sleep(100);
  }
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  showStatusMessage(`Current pivot: ${pivot}`);
  logStep(`Partitioning with pivot ${pivot}`);

  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (stopRequested) return high;

    logStep(`🔍 Comparing ${arr[j]} with ${pivot}`);
    drawArray(arr, high, j, sortedIndices);
    await sleep(400);

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      logStep(`🔄 Swapped ${arr[i]} and ${arr[j]}`);
      drawArray(arr, high, j, sortedIndices);
      await sleep(400);
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  logStep(`Swapped pivot ${pivot} to position ${i + 1}`);
  sortedIndices.push(i + 1);
  drawArray(arr, -1, -1, sortedIndices);
  await sleep(400);

  return i + 1;
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

window.onload = generateRandomArray;

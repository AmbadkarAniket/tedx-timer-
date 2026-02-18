// ── Config ──
const INITIAL_MINUTES = 18;
const INITIAL_SECONDS = 0;
const WARNING_SECONDS = 5 * 60;  // 5 min — turns orange
const DANGER_SECONDS = 1 * 60;  // 1 min — turns red + pulses

// ── DOM ──
const timerDisplay = document.getElementById('timerDisplay');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerArea = document.getElementById('timerArea');
const controls = document.getElementById('controls');
const resumeBtn = document.getElementById('resumeBtn');
const reloadBtn = document.getElementById('reloadBtn');
const tapHint = document.getElementById('tapHint');
const colorBtn = document.getElementById('colorBtn');
const colorOptions = document.getElementById('colorOptions');
const colorWrapper = document.getElementById('colorPickerWrapper');

// ── State ──
let totalSeconds = INITIAL_MINUTES * 60 + INITIAL_SECONDS;
let running = false;
let intervalId = null;

// ── Helpers ──
function pad(n) {
  return String(n).padStart(2, '0');
}

function render() {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);

  // Warning / danger colors
  timerDisplay.classList.toggle('warning', totalSeconds <= WARNING_SECONDS && totalSeconds > DANGER_SECONDS);
  timerDisplay.classList.toggle('danger', totalSeconds <= DANGER_SECONDS && totalSeconds > 0);
}

function tick() {
  if (totalSeconds <= 0) {
    stop();
    return;
  }
  totalSeconds--;
  render();
}

function start() {
  if (running) return;
  running = true;
  timerDisplay.classList.remove('paused');
  controls.classList.remove('visible');
  colorWrapper.classList.remove('visible');
  colorOptions.classList.remove('open');
  intervalId = setInterval(tick, 1000);
}

function stop() {
  running = false;
  clearInterval(intervalId);
  intervalId = null;
  timerDisplay.classList.add('paused');
  controls.classList.add('visible');
  colorWrapper.classList.add('visible');
}

function reload() {
  stop();
  totalSeconds = INITIAL_MINUTES * 60 + INITIAL_SECONDS;
  timerDisplay.classList.remove('warning', 'danger', 'paused');
  controls.classList.remove('visible');
  render();
  // Auto-start after reload
  start();
}

// ── Events ──

// Click timer to pause
timerArea.addEventListener('click', () => {
  if (running) {
    stop();
  }
});

// Resume button
resumeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  start();
});

// Reload button
reloadBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  reload();
});

// ── Color Picker ──
colorBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  colorOptions.classList.toggle('open');
});

document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    e.stopPropagation();
    const bg = swatch.dataset.bg;
    const text = swatch.dataset.text;
    document.documentElement.style.setProperty('--bg', bg);
    document.documentElement.style.setProperty('--text', text);
    colorOptions.classList.remove('open');
  });
});

// Close color picker when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!document.getElementById('colorPickerWrapper').contains(e.target)) {
    colorOptions.classList.remove('open');
  }
});

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    running ? stop() : start();
  }
  if (e.code === 'KeyR') {
    reload();
  }
});

// ── Init ──
render();
start(); // Auto-start the timer

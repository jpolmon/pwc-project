const rounds = document.getElementById('roundsBtn');
const countdown = document.getElementById('countdownBtn');
const casual = document.getElementById('casualBtn');
const start = document.getElementById('startBtn');
const descriptionBox = document.getElementById('description');

function roundsInfo() {
  descriptionBox.innerText = "See how fast you can correctly answer 10 questions.";
  rounds.classList.remove('is-light', 'is-outlined');
  if (!countdown.classList.contains('is-light','is-outlined')) {
    countdown.classList.add('is-light', 'is-outlined');
  }
  if (!casual.classList.contains('is-light', 'is-outlined')) {
    casual.classList.add('is-light', 'is-outlined');
  }
  start.disabled = false;
}

function countdownInfo() {
  descriptionBox.innerText = "See how many questions you can correctly answer in one minute.";
  countdown.classList.remove('is-light', 'is-outlined');
  if (!rounds.classList.contains('is-light','is-outlined')) {
    rounds.classList.add('is-light', 'is-outlined');
  }
  if (!casual.classList.contains('is-light', 'is-outlined')) {
    casual.classList.add('is-light', 'is-outlined');
  }
  start.disabled = false;
}

function casualInfo() {
  descriptionBox.innerText = "Keep answering questions forever and see your average time per round.";
  casual.classList.remove('is-light', 'is-outlined');
  if (!rounds.classList.contains('is-light','is-outlined')) {
    rounds.classList.add('is-light', 'is-outlined');
  }
  if (!countdown.classList.contains('is-light', 'is-outlined')) {
    countdown.classList.add('is-light', 'is-outlined');
  }
  start.disabled = false;
}

function startGame() {
  start.style.display = 'none'
}
  
rounds.addEventListener('click', roundsInfo);
countdown.addEventListener('click', countdownInfo);
casual.addEventListener('click', casualInfo);
start.addEventListener('click', startGame)
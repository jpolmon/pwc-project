// Getting all required html elements
const scoreboard = document.getElementById('scoreboardBtn');
const rounds = document.getElementById('roundsBtn');
const countdown = document.getElementById('countdownBtn');
const casual = document.getElementById('casualBtn');
const start = document.getElementById('startBtn');
const scoreboardModal = document.getElementById('scoreboard');
const scoreboardBackground = document.getElementById('scoreboardBackground');
const scoreboardClose = document.getElementById('scoreboardClose');
const descriptionBox = document.getElementById('description');

if (!descriptionBox.innerText === "") {
  descriptionBox.style.display = "block";
} else {
  descriptionBox.style.display = "none";
}

// Opens the scoreboard modal
function renderScoreboard() {
  scoreboardModal.classList.add('is-active');
}

// Closes the modal for the scoreboard
function closeScoreboard() {
  scoreboardModal.classList.remove('is-active');
}

function roundsInfo() {
  // Adds the proper description
  descriptionBox.innerText = "See how fast you can correctly answer 10 questions.";
  // Formats the buttons so the selected button is visually different from the others
  rounds.classList.remove('is-light', 'is-outlined');
  if (!countdown.classList.contains('is-light','is-outlined')) {
    countdown.classList.add('is-light', 'is-outlined');
  }
  if (!casual.classList.contains('is-light', 'is-outlined')) {
    casual.classList.add('is-light', 'is-outlined');
  }
  // Enables the start button to be pressed
  start.disabled = false;
  // Making the description box visible if it isn't already
  if (descriptionBox.style.display === "none") {
    descriptionBox.style.display = "block";
  }
}

function countdownInfo() {
  // Adds the proper description
  descriptionBox.innerText = "See how many questions you can correctly answer in one minute.";
  // Formats the buttons so the selected button is visually different from the others
  countdown.classList.remove('is-light', 'is-outlined');
  if (!rounds.classList.contains('is-light','is-outlined')) {
    rounds.classList.add('is-light', 'is-outlined');
  }
  if (!casual.classList.contains('is-light', 'is-outlined')) {
    casual.classList.add('is-light', 'is-outlined');
  }
  // Enables the start button to be pressed
  start.disabled = false;
  // Making the description box visible if it isn't already
  if (descriptionBox.style.display === "none") {
    descriptionBox.style.display = "block";
  }
}

// Called when the casual mode is selected
function casualInfo() {
  // Adds the proper description
  descriptionBox.innerText = "Keep answering questions forever and see your average time per round.";
  // Formats the buttons so the selected button is visually different from the others
  casual.classList.remove('is-light', 'is-outlined');
  if (!rounds.classList.contains('is-light','is-outlined')) {
    rounds.classList.add('is-light', 'is-outlined');
  }
  if (!countdown.classList.contains('is-light', 'is-outlined')) {
    countdown.classList.add('is-light', 'is-outlined');
  }
  // Enables the start button to be pressed
  start.disabled = false;
  // Making the description box visible if it isn't already
  if (descriptionBox.style.display === "none") {
    descriptionBox.style.display = "block";
  }
}

// Function that will run when the start button is clicked, right now it just removes it from the screen.
function startGame() {
  start.style.display = 'none'
}

// Event listeners for all buttons
scoreboard.addEventListener('click', renderScoreboard);
scoreboardBackground.addEventListener('click', closeScoreboard);
scoreboardClose.addEventListener('click', closeScoreboard);
rounds.addEventListener('click', roundsInfo);
countdown.addEventListener('click', countdownInfo);
casual.addEventListener('click', casualInfo);
start.addEventListener('click', startGame)
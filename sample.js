const rounds = document.getElementById('roundsBtn');
const countdown = document.getElementById('countdownBtn');
const casual = document.getElementById('casualBtn');
const descriptionBox = document.getElementById('description');

function roundsInfo() {
  descriptionBox.innerText = "Keep answering questions forever and see your average time per round.";
  rounds.classList.remove('is-light', 'is-outlined');
  countdown.classList.remove('is-outlined');
  casual.classList.remove('is-outlined');
}

function countdownInfo() {
  descriptionBox.innerText = "See how fast you can correctly answer 10 questions.";
  rounds.classList.remove('is-outlined', 'is-light');
  countdown.classList.toggle('is-outlined');
  casual.classList.remove('is-outlined');
}

function casualInfo() {
  descriptionBox.innerText = "See how many questions you can correctly answer in one minute.";
  rounds.classList.remove('is-outlined');
  countdown.classList.remove('is-outlined');
  casual.classList.add('is-outlined');
}
  
rounds.addEventListener('click', roundsInfo);
countdown.addEventListener('click', countdownInfo);
casual.addEventListener('click', casualInfo);
import questions from "./data.js";

let currentQuestion = 0;
let time = 30;
let score = 0;
let gameOver = false;
let timerInterval;

const root = document.getElementById("root");
const toast = document.getElementById("toast");

function startGame() {
  if (!gameOver) {
    renderQuestion();
    startTimer();
  }
}

function renderQuestion() {
  const question = questions[currentQuestion];

  root.innerHTML = `
    <div class="question-container">
      <img src="${
        question.image_fname
      }" alt="quiz" class="question-image" loading="lazy" />
      <div class="comic-text-box">
        <h2>இந்த புகைப்படம் பெயர் என்ன?</h2>
        <div class="complexity-label">கடின நிலை: ${getComplexityInTamil(
          question.complexity
        )}</div>
        <div class="option-container">
          ${[
            question.option1,
            question.option2,
            question.option3,
            question.option4,
          ]
            .map(
              (option, index) =>
                `<button class="option" onclick="handleAnswerClick('option${
                  index + 1
                }')">${option}</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="clock">${time}s</div>
    </div>
  `;
}

function startTimer() {
  clearInterval(timerInterval); // Clear any previous timer
  timerInterval = setInterval(() => {
    if (time > 0 && !gameOver) {
      time--;
      document.querySelector(".clock").innerText = `${time}s`;
    } else {
      clearInterval(timerInterval);
      moveToNextQuestion();
    }
  }, 1000);
}

window.handleAnswerClick = function (option) {
  const question = questions[currentQuestion];
  const points = getScoreByComplexity(
    question.complexity,
    option === question.correct_option
  );
  score += points;

  showToast(
    option === question.correct_option
      ? `சரியான பதில்! ${points} மதிப்பெண்`
      : `தவறான பதில்! ${points} மதிப்பெண்`
  );
  moveToNextQuestion();
};

function getScoreByComplexity(complexity, correct) {
  if (complexity === "Easy") return correct ? 1 : 0;
  if (complexity === "Mid") return correct ? 2 : -1;
  if (complexity === "Hard") return correct ? 3 : -2;
  return 0;
}

function moveToNextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    time = 30; // Reset timer for the next question
    renderQuestion();
    startTimer(); // Restart timer for the new question
  } else {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  clearInterval(timerInterval);
  root.innerHTML = `
    <div class="comic-text-box">
      <h2>விளையாட்டு முடிந்தது!</h2>
      <p>உங்கள் இறுதி மதிப்பெண்: ${score}</p>
    </div>
  `;
}

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function getComplexityInTamil(complexity) {
  switch (complexity) {
    case "Easy":
      return "எளிமை";
    case "Mid":
      return "மத்திய";
    case "Hard":
      return "கடினம்";
    default:
      return "";
  }
}

// Initialize the game
startGame();

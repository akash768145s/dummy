
import { questions } from "./data.js";

const Timer = ({ time }) => {
  return <div className="clock">{time}s</div>;
};

const Question = ({ data, onAnswerClick }) => {
  return (
    <div className="question-container">
      <img
        src={data.image_fname}
        alt="quiz"
        className="question-image"
        loading="lazy"
      />
      <div className="comic-text-box">
        <h2>இந்த புகைப்படம் பெயர் என்ன?</h2>
        <div className="complexity-label">
          கடின நிலை: {getComplexityInTamil(data.complexity)}
        </div>
        <div className="option-container">
          {[data.option1, data.option2, data.option3, data.option4].map(
            (option, index) => (
              <button
                key={index}
                className="option"
                onClick={() =>
                  onAnswerClick(`option${index + 1}`, data.complexity)
                }
              >
                {option}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const getComplexityInTamil = (complexity) => {
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
};

const App = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [time, setTime] = React.useState(30);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  React.useEffect(() => {
    if (time > 0 && !gameOver) {
      const interval = setInterval(() => setTime(time - 1), 1000);
      return () => clearInterval(interval);
    } else {
      moveToNextQuestion();
    }
  }, [time, gameOver]);

  const handleAnswerClick = (option, complexity) => {
    let points = 0;
    if (option === questions[currentQuestion].correct_option) {
      points = getScoreByComplexity(complexity, true);
      setScore(score + points);
      showToastMessage(`சரியான பதில்! ${points} மதிப்பெண்`);
    } else {
      points = getScoreByComplexity(complexity, false);
      setScore(score + points);
      showToastMessage(`தவறான பதில்! ${points} மதிப்பெண்`);
    }

    moveToNextQuestion();
  };

  const getScoreByComplexity = (complexity, correct) => {
    if (complexity === "Easy") return correct ? 1 : 0;
    if (complexity === "Mid") return correct ? 2 : -1;
    if (complexity === "Hard") return correct ? 3 : -2;
    return 0;
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTime(30);
    } else {
      setGameOver(true);
    }
  };

  const endGame = () => {
    // Replace with your API endpoint
    fetch("https://your-api-endpoint/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, timestamp: new Date() }),
    });
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    const toast = document.querySelector(".toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  };

  return (
    <div className="app">
      {!gameOver && <Timer time={time} />}
      {questions.length > 0 && !gameOver && (
        <Question
          data={questions[currentQuestion]}
          onAnswerClick={handleAnswerClick}
        />
      )}
      {gameOver && (
        <div className="comic-text-box">
          <h2>விளையாட்டு முடிந்தது!</h2>
          <p>உங்கள் இறுதி மதிப்பெண்: {score}</p>
          {endGame()}
        </div>
      )}
      <div className="toast">{toastMessage}</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

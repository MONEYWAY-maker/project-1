const questionEl = document.querySelector(".question");
const answersBox = document.querySelector(".answers-mc");
const nextBtn = document.querySelector(".next-button");
const categoryButtons = document.querySelectorAll(".category-buttons button");

let currentCategory = null;
let correctAnswer = "";

// Shuffle helper
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Load question from API
async function loadQuestion() {
  answersBox.innerHTML = "";
  questionEl.innerHTML = "Loading...";

  const url = currentCategory
    ? `https://opentdb.com/api.php?amount=1&category=${currentCategory}`
    : `https://opentdb.com/api.php?amount=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const q = data.results[0];

    questionEl.innerHTML = q.question;
    correctAnswer = q.correct_answer;

    const allAnswers = shuffle([q.correct_answer, ...q.incorrect_answers]);

    allAnswers.forEach(answer => {
      const btn = document.createElement("button");
      btn.classList.add("answer-option");
      btn.innerHTML = answer;

      btn.addEventListener("click", () => {
        if (answer === correctAnswer) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
        }

        // Disable all buttons after selection
        document.querySelectorAll(".answer-option").forEach(b => {
          b.style.pointerEvents = "none";
        });
      });

      answersBox.appendChild(btn);
    });
  } catch (err) {
    questionEl.innerHTML = "Error loading question. Scream again.";
  }
}

// Category click
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.cat;
    loadQuestion();
  });
});

// Next question
nextBtn.addEventListener("click", loadQuestion);

// Initial load
loadQuestion();

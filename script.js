<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trivia Screamdream</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #111;
      color: #eee;
      text-align: center;
      padding: 40px;
    }
    .question {
      font-size: 1.5em;
      margin-bottom: 20px;
    }
    .answers-mc {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    .answer-option {
      background: #222;
      color: #eee;
      border: 1px solid #444;
      padding: 10px;
      cursor: pointer;
      transition: 0.3s;
    }
    .answer-option:hover {
      background: #333;
    }
    .correct {
      background: #2ecc71;
      color: #000;
    }
    .wrong {
      background: #e74c3c;
      color: #000;
    }
    .category-buttons {
      margin-bottom: 20px;
    }
    .category-buttons button {
      margin: 5px;
      padding: 8px 12px;
      background: #555;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    .next-button {
      background: #3498db;
      color: #fff;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>🎃 Screamdream Trivia</h1>
  <div class="category-buttons">
    <button data-cat="9">General Knowledge</button>
    <button data-cat="11">Movies</button>
    <button data-cat="17">Science</button>
  </div>

  <div class="question">Loading...</div>
  <div class="answers-mc"></div>
  <button class="next-button">Next Question</button>

  <script>
    const questionEl = document.querySelector(".question");
    const answersBox = document.querySelector(".answers-mc");
    const nextBtn = document.querySelector(".next-button");
    const categoryButtons = document.querySelectorAll(".category-buttons button");

    let currentCategory = null;
    let correctAnswer = "";

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

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

    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        currentCategory = btn.dataset.cat;
        loadQuestion();
      });
    });

    nextBtn.addEventListener("click", loadQuestion);
    loadQuestion();
  </script>
</body>
</html>

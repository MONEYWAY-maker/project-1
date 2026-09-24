<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lumos Trivia Console</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body>
  <header class="hero">
    <h1 class="brand">LUMOS TRIVIA</h1>
    <p class="tagline">Mission: Sharpen Cognition</p>
  </header>

  <main>
    <!-- MILESTONE 1: Static categories section -->
    <section class="categories">
      <h2>Select Category</h2>
      <div class="category-buttons">
        <!-- Populated dynamically from API (Milestone 5) -->
      </div>
    </section>

    <!-- MILESTONE 2: Question + Answer -->
    <section class="quiz">
      <h2>Question</h2>

      <div class="question-box">
        <p class="question">Loading...</p>
      </div>

      <p class="answer hidden"></p>

      <div class="quiz-buttons">
        <!-- MILESTONE 3: Show/hide answer -->
        <button class="show-answer-button">Show Answer</button>

        <!-- MILESTONE 2 & 4: Next question -->
        <button class="next-button">Next Question</button>
      </div>

      <!-- Optional multiple-choice (Milestone 4+) -->
      <div class="answers-mc"></div>
    </section>
  </main>

  <footer>
    <p>Lumos Labs × NASA × Tesla</p>
    <small>Trivia Interface v1.0</small>
  </footer>

  <script>
    const questionEl = document.querySelector(".question");
    const answerEl = document.querySelector(".answer");
    const answersBox = document.querySelector(".answers-mc");
    const showAnswerBtn = document.querySelector(".show-answer-button");
    const nextBtn = document.querySelector(".next-button");
    const categoryButtonsBox = document.querySelector(".category-buttons");

    let currentCategory = null;
    let correctAnswer = "";

    // MILESTONE 3: Show/hide answer
    showAnswerBtn.addEventListener("click", () => {
      if (answerEl.classList.contains("hidden")) {
        answerEl.classList.remove("hidden");
        showAnswerBtn.textContent = "Hide Answer";
      } else {
        answerEl.classList.add("hidden");
        showAnswerBtn.textContent = "Show Answer";
      }
    });

    // Shuffle helper
    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    // MILESTONE 4 & 6: Load question (random or by category)
    async function loadQuestion() {
      answersBox.innerHTML = "";
      answerEl.classList.add("hidden");
      showAnswerBtn.textContent = "Show Answer";
      questionEl.textContent = "Loading...";

      const url = currentCategory
        ? `https://opentdb.com/api.php?amount=1&category=${currentCategory}`
        : `https://opentdb.com/api.php?amount=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const q = data.results[0];

        questionEl.innerHTML = q.question;
        correctAnswer = q.correct_answer;
        answerEl.innerHTML = q.correct_answer;

        // Optional multiple-choice answers
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
        questionEl.textContent = "Error loading question.";
        answerEl.textContent = "";
      }
    }

    // MILESTONE 5: Load categories from API
    async function loadCategories() {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        const data = await res.json();
        const categories = data.trivia_categories;

        // "All Categories" button
        const allBtn = document.createElement("button");
        allBtn.textContent = "All Categories";
        allBtn.addEventListener("click", () => {
          currentCategory = null;
          loadQuestion();
        });
        categoryButtonsBox.appendChild(allBtn);

        categories.forEach(cat => {
          const btn = document.createElement("button");
          btn.textContent = cat.name;
          btn.dataset.cat = cat.id;

          btn.addEventListener("click", () => {
            currentCategory = btn.dataset.cat;
            loadQuestion();
          });

          categoryButtonsBox.appendChild(btn);
        });
      } catch (err) {
        categoryButtonsBox.innerHTML = "<p>Failed to load categories.</p>";
      }
    }

    // MILESTONE 2 & 4: Next question button
    nextBtn.addEventListener("click", loadQuestion);

    // INITIAL LOAD (Milestones 1–6)
    loadCategories();
    loadQuestion();
  </script>
</body>
</html>

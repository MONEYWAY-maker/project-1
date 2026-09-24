<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Screamdreamco Trivia — Test your knowledge and sharpen your thinking." />
  <title>Screamdreamco Trivia</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body>

  <header class="hero">
    <div class="hero-content">
      <p class="eyebrow">SCREAMDREAMCO</p>
      <h1>Trivia</h1>
      <p class="tagline">Challenge your knowledge. Learn something new.</p>
    </div>
  </header>

  <main>

    <!-- CATEGORIES -->
    <section class="categories">
      <div class="section-header">
        <h2>Select a Category</h2>
        <p>Choose a topic or explore everything.</p>
      </div>

      <div class="category-buttons"></div>
    </section>

    <!-- QUIZ -->
    <section class="quiz">

      <div class="section-header">
        <span class="section-label">QUESTION</span>
        <h2>Test Your Knowledge</h2>
      </div>

      <div class="question-box">
        <p class="question">Loading question...</p>
      </div>

      <div class="answers-mc"></div>

      <div class="answer-container">
        <p class="answer hidden"></p>
      </div>

      <div class="quiz-buttons">
        <button class="show-answer-button secondary-button">
          Show Answer
        </button>

        <button class="next-button primary-button">
          Next Question
        </button>
      </div>

    </section>

  </main>

  <footer>
    <p>SCREAMDREAMCO</p>
    <small>Trivia Interface · v1.0</small>
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

    showAnswerBtn.addEventListener("click", () => {
      if (answerEl.classList.contains("hidden")) {
        answerEl.classList.remove("hidden");
        showAnswerBtn.textContent = "Hide Answer";
      } else {
        answerEl.classList.add("hidden");
        showAnswerBtn.textContent = "Show Answer";
      }
    });

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    async function loadQuestion() {
      answersBox.innerHTML = "";
      answerEl.classList.add("hidden");
      showAnswerBtn.textContent = "Show Answer";
      questionEl.textContent = "Loading question...";

      const url = currentCategory
        ? `https://opentdb.com/api.php?amount=1&category=${currentCategory}`
        : `https://opentdb.com/api.php?amount=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          throw new Error("No question available");
        }

        const q = data.results[0];

        questionEl.innerHTML = q.question;
        correctAnswer = q.correct_answer;
        answerEl.innerHTML = q.correct_answer;

        const allAnswers = shuffle([
          q.correct_answer,
          ...q.incorrect_answers
        ]);

        allAnswers.forEach(answer => {
          const btn = document.createElement("button");

          btn.classList.add("answer-option");
          btn.innerHTML = answer;

          btn.addEventListener("click", () => {

            document.querySelectorAll(".answer-option").forEach(b => {
              b.style.pointerEvents = "none";
            });

            if (answer === correctAnswer) {
              btn.classList.add("correct");
            } else {
              btn.classList.add("wrong");

              document.querySelectorAll(".answer-option").forEach(b => {
                if (b.innerHTML === correctAnswer) {
                  b.classList.add("correct");
                }
              });
            }
          });

          answersBox.appendChild(btn);
        });

      } catch (err) {
        questionEl.textContent =
          "We couldn't load a question. Please try again.";

        answerEl.textContent = "";
      }
    }

    async function loadCategories() {
      try {
        const res = await fetch(
          "https://opentdb.com/api_category.php"
        );

        const data = await res.json();
        const categories = data.trivia_categories;

        const allBtn = document.createElement("button");

        allBtn.textContent = "All Categories";
        allBtn.classList.add("category-active");

        allBtn.addEventListener("click", () => {
          currentCategory = null;

          document
            .querySelectorAll(".category-buttons button")
            .forEach(btn => btn.classList.remove("category-active"));

          allBtn.classList.add("category-active");

          loadQuestion();
        });

        categoryButtonsBox.appendChild(allBtn);

        categories.forEach(cat => {
          const btn = document.createElement("button");

          btn.textContent = cat.name;
          btn.dataset.cat = cat.id;

          btn.addEventListener("click", () => {
            currentCategory = btn.dataset.cat;

            document
              .querySelectorAll(".category-buttons button")
              .forEach(button => {
                button.classList.remove("category-active");
              });

            btn.classList.add("category-active");

            loadQuestion();
          });

          categoryButtonsBox.appendChild(btn);
        });

      } catch (err) {
        categoryButtonsBox.innerHTML =
          "<p class='error-message'>Unable to load categories.</p>";
      }
    }

    nextBtn.addEventListener("click", loadQuestion);

    loadCategories();
    loadQuestion();
  </script>

</body>
</html>
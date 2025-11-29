// Example quiz data
const quiz = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "C"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "B"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Shakespeare", "Mark Twain", "Jane Austen"],
    answer: "B"
  }
];

let currentIndex = 0;
const questionEl = document.getElementById("question");
const optionsEls = document.querySelectorAll(".option");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");

function loadQuestion() {
  const current = quiz[currentIndex];
  questionEl.textContent = `${currentIndex + 1}. ${current.question}`;
  optionsEls.forEach((optEl, i) => {
    optEl.textContent = `${String.fromCharCode(65+i)}) ${current.options[i]}`;
    optEl.classList.remove("selected");
  });
  feedback.textContent = "";
}

// Option click
optionsEls.forEach(optEl => {
  optEl.addEventListener("click", () => {
    optionsEls.forEach(o => o.classList.remove("selected"));
    optEl.classList.add("selected");
  });
});

// Submit
submitBtn.addEventListener("click", () => {
  const selected = document.querySelector(".option.selected");
  if (!selected) { feedback.textContent = "Please select an option."; return; }

  const selectedAnswer = selected.textContent.charAt(0);
  const correctAnswer = quiz[currentIndex].answer;

  if (selectedAnswer === correctAnswer) {
    feedback.style.color = "#00ff6a";
    feedback.textContent = "Correct!";
  } else {
    feedback.style.color = "#ff6b6b";
    feedback.textContent = `Wrong! Correct answer: ${correctAnswer}) ${quiz[currentIndex].options[correctAnswer.charCodeAt(0)-65]}`;
  }

  currentIndex++;
  if(currentIndex < quiz.length){
    setTimeout(loadQuestion, 1500);
  } else {
    setTimeout(() => {
      feedback.textContent = "Quiz Completed!";
      submitBtn.disabled = true;
    }, 1500);
  }
});

// Initial load
loadQuestion();


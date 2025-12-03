/* ===============================
   1. NAVIGATION / SPA LOGIC
=============================== */
const app = {
  views: {
    home: document.getElementById('view-home'),
    login: document.getElementById('view-login'),
    categories: document.getElementById('view-categories'),
    semesters: document.getElementById('view-semesters'),
    courses: document.getElementById('view-courses'),
    grades: document.getElementById('view-grades'),
    hsSubjects: document.getElementById('view-hs-subjects'),
    quiz: document.getElementById('view-quiz'),
    calculator: document.getElementById('view-calculator')
  },
  
  nav: function(viewName) {
    // Hide all views
    for (const key in this.views) {
      if (this.views[key]) {
        this.views[key].classList.add('hidden-view');
        this.views[key].classList.remove('active-view');
      }
    }
    
    // Handle ID mapping
    let targetId = viewName;
    if(viewName === 'hs-subjects') targetId = 'hsSubjects';

    const target = this.views[targetId] || this.views['home'];
    
    // Show requested view
    target.classList.remove('hidden-view');
    target.classList.add('active-view');
    
    // Scroll to top
    window.scrollTo(0,0);

    // Initialize specific views
    if (viewName === 'quiz') quizGame.start();
    if (viewName === 'calculator') gpaCalc.init();
  }
};

/* ===============================
   2. LOGIN / SIGNUP LOGIC
=============================== */
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Only run if elements exist (prevents errors)
if(loginBtn && signupBtn && loginForm && signupForm) {
  loginBtn.addEventListener('click', () => {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
  });

  signupBtn.addEventListener('click', () => {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
  });

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    alert("Logged in successfully!");
    app.nav('categories');
  });
}

/* ===============================
   3. GPA CALCULATOR LOGIC
=============================== */
const gpaCalc = {
  courses: [],
  
  // DATA: Fixed the "P/F" error here
  semData: {
    1: [
      { name: "Logic & Critical Thinking", credit: 3 },
      { name: "General Psychology", credit: 3 },
      { name: "Mathematics for Natural Sci", credit: 4 },
      { name: "Communicative English I", credit: 3 },
      { name: "Geography of Ethiopia", credit: 3 },
      { name: "General Physics", credit: 3 },
      { name: "Physical Fitness", credit: 0 } 
    ],
    2: [
      { name: "Emerging Technology", credit: 3 },
      { name: "Social Anthropology", credit: 2 },
      { name: "History of Ethiopia", credit: 3 },
      { name: "Communicative English II", credit: 3 },
      { name: "Moral & Civics", credit: 2 },
      { name: "Economics", credit: 3 },
      { name: "Global Trends", credit: 2 }
    ]
  },

  init: function() {
    this.loadSem(1);
  },

  loadSem: function(semId) {
    const chipContainer = document.getElementById('courseChips');
    if(!chipContainer) return; // Guard clause

    const btns = document.querySelectorAll('.sem-btn');
    
    // Toggle active button style
    btns.forEach((btn, index) => {
      if (index + 1 === semId) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Render Chips
    chipContainer.innerHTML = '';
    const courses = this.semData[semId];
    
    courses.forEach(course => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.textContent = `${course.name} (${course.credit})`;
      
      chip.onclick = () => {
        document.getElementById('courseName').value = course.name;
        document.getElementById('courseCredit').value = course.credit;
        
        // Visual Highlight
        document.querySelectorAll('.chip').forEach(c => c.style.borderColor = 'rgba(255,255,255,0.1)');
        chip.style.borderColor = '#00ffff';
      };
      chipContainer.appendChild(chip);
    });
  },

  addCourse: function() {
    const nameInput = document.getElementById('courseName');
    const creditInput = document.getElementById('courseCredit');
    const gradeInput = document.getElementById('courseGrade');
    const errorMsg = document.getElementById('calcError');

    const name = nameInput.value.trim();
    const credit = parseFloat(creditInput.value);
    const gradePoint = parseFloat(gradeInput.value);

    // Validation
    if (!name || isNaN(credit) || isNaN(gradePoint)) {
      errorMsg.textContent = "Please fill name, credit, and select a grade.";
      return;
    }

    this.courses.push({ name, credit, gradePoint });
    
    // Reset inputs
    nameInput.value = '';
    creditInput.value = '';
    gradeInput.selectedIndex = 0;
    errorMsg.textContent = '';
    
    // Clear highlights
    document.querySelectorAll('.chip').forEach(c => c.style.borderColor = 'rgba(255,255,255,0.1)');

    this.render();
  },

  deleteCourse: function(index) {
    this.courses.splice(index, 1);
    this.render();
  },

  clearAll: function() {
    this.courses = [];
    this.render();
  },

  render: function() {
    const tbody = document.getElementById('courseTableBody');
    const gpaDisplay = document.getElementById('gpaValue');
    if(!tbody || !gpaDisplay) return;

    tbody.innerHTML = '';
    
    let totalPoints = 0;
    let totalCredits = 0;

    this.courses.forEach((course, index) => {
      totalPoints += (course.gradePoint * course.credit);
      totalCredits += course.credit;

      tbody.innerHTML += `
        <tr>
          <td>${course.name}</td>
          <td>${course.credit}</td>
          <td>${this.getLetterGrade(course.gradePoint)}</td>
          <td><button class="delete-btn" onclick="gpaCalc.deleteCourse(${index})">Remove</button></td>
        </tr>
      `;
    });

    const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits);
    gpaDisplay.textContent = gpa.toFixed(2);
  },

  getLetterGrade: function(point) {
    if (point >= 4.0) return 'A/A+';
    if (point >= 3.75) return 'A-';
    if (point >= 3.5) return 'B+';
    if (point >= 3.0) return 'B';
    if (point >= 2.75) return 'B-';
    if (point >= 2.5) return 'C+';
    if (point >= 2.0) return 'C';
    if (point >= 1.75) return 'C-';
    if (point >= 1.0) return 'D';
    return 'F';
  }
};

/* ===============================
   4. QUIZ LOGIC
=============================== */
const quizGame = {
  data: [
    { question: "What is the capital of Ethiopia?", options: ["Addis Ababa", "Gondar", "Hawassa", "Dire Dawa"], correctIndex: 0 },
    { question: "Which logic gate returns true only if both inputs are true?", options: ["OR", "NOT", "AND", "XOR"], correctIndex: 2 },
    { question: "What is the derivative of x^2?", options: ["x", "2x", "x^2", "0"], correctIndex: 1 },
    { question: "The study of human behavior is called...", options: ["Biology", "Physics", "Psychology", "Geology"], correctIndex: 2 }
  ],
  currentIndex: 0,
  
  elements: {
    question: document.getElementById("question"),
    options: document.querySelectorAll(".option"),
    submitBtn: document.getElementById("submitAnswerBtn"),
    feedback: document.getElementById("feedback")
  },

  start: function() {
    this.currentIndex = 0;
    if(this.elements.submitBtn) this.elements.submitBtn.disabled = false;
    if(this.elements.feedback) this.elements.feedback.textContent = "";
    this.loadQuestion();
    
    // Reset Options Listeners
    this.elements.options.forEach(opt => {
      const newOpt = opt.cloneNode(true);
      opt.parentNode.replaceChild(newOpt, opt);
    });
    this.elements.options = document.querySelectorAll(".option");
    
    this.elements.options.forEach((opt) => {
      opt.addEventListener("click", () => {
        this.elements.options.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
      });
    });

    // Reset Submit Listener
    if(this.elements.submitBtn) {
      const newSubmit = this.elements.submitBtn.cloneNode(true);
      this.elements.submitBtn.parentNode.replaceChild(newSubmit, this.elements.submitBtn);
      this.elements.submitBtn = newSubmit;
      this.elements.submitBtn.addEventListener("click", () => this.checkAnswer());
    }
  },

  loadQuestion: function() {
    const current = this.data[this.currentIndex];
    if(this.elements.question) this.elements.question.textContent = `${this.currentIndex + 1}. ${current.question}`;
    this.elements.options.forEach((opt, i) => {
      opt.textContent = `${String.fromCharCode(65+i)}) ${current.options[i]}`;
      opt.classList.remove("selected");
    });
    if(this.elements.feedback) this.elements.feedback.textContent = "";
  },

  checkAnswer: function() {
    const selected = document.querySelector(".option.selected");
    if (!selected) return; 

    let selectedIndex = -1;
    this.elements.options.forEach((opt, i) => { if(opt === selected) selectedIndex = i; });

    if (selectedIndex === this.data[this.currentIndex].correctIndex) {
      this.elements.feedback.style.color = "#00ff6a";
      this.elements.feedback.textContent = "Correct!";
    } else {
      this.elements.feedback.style.color = "#ff6b6b";
      this.elements.feedback.textContent = "Wrong!";
    }

    this.currentIndex++;
    if(this.currentIndex < this.data.length){
      setTimeout(() => this.loadQuestion(), 1000);
    } else {
      setTimeout(() => {
        alert("Quiz Finished!");
        app.nav('categories');
      }, 1500);
    }
  }
};

// Initialize Calculator logic on load
document.addEventListener('DOMContentLoaded', () => {
    gpaCalc.init();
});

const themeSwitch = document.getElementById("themeSwitch");
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

async function explainCode() {
  const code = document.getElementById("codeInput").value;
  const language = document.getElementById("language").value;
  const output = document.getElementById("output");
  output.innerHTML = "<span class='loader'></span> Thinking... 🤖";

  try {
    const response = await fetch("http://localhost:5000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });

    const data = await response.json();
    if (data.explanation) {
      typeEffect(data.explanation, output);
    } else {
      output.textContent = "No explanation received.";
    }
  } catch (error) {
    output.textContent = "⚠️ Error: Could not connect to the server.";
  }
}

function typeEffect(text, element, speed = 20) {
  element.innerHTML = "";
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
      element.scrollTop = element.scrollHeight;
    }
  }
  typeChar();
}

function downloadPDF() {
  const explanationText = document.getElementById("output").innerText;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(explanationText, 10, 10);
  doc.save("AI_Explanation.pdf");
}

const quizData = {
  python: [
    {
      question: "What is the output of print(2**3)?",
      options: ["6", "8", "9", "5"],
      answer: "8"
    },
    {
      question: "Which keyword is used to define a function?",
      options: ["func", "def", "function", "define"],
      answer: "def"
    }
  ],
  javascript: [
    {
      question: "Which method converts JSON to object?",
      options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "toJSON()"],
      answer: "JSON.parse()"
    },
    {
      question: "Which symbol is used for comments in JS?",
      options: ["#", "//", "<!--", "/* */"],
      answer: "//"
    }
  ],
  java: [
    {
      question: "Which keyword is used to create an object in Java?",
      options: ["class", "interface", "new", "public"],
      answer: "new"
    },
    {
      question: "What is JVM?",
      options: ["Java Virtual Machine", "Java Variable Method", "Joint Virtual Module", "Java Version Manager"],
      answer: "Java Virtual Machine"
    }
  ]
};

function loadQuiz() {
  const lang = document.getElementById("language").value;
  const quiz = quizData[lang] || [];
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  quiz.forEach((q, idx) => {
    const qEl = document.createElement("div");
    qEl.innerHTML = `<p>${q.question}</p>` + q.options.map(opt =>
      `<label><input type="radio" name="q${idx}" value="${opt}"/> ${opt}</label><br>`
    ).join("");
    container.appendChild(qEl);
  });
}

function checkQuiz() {
  const lang = document.getElementById("language").value;
  const quiz = quizData[lang] || [];
  let score = 0;

  quiz.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    if (selected && selected.value === q.answer) score++;
  });

  document.getElementById("quizResult").textContent = `Score: ${score} / ${quiz.length}`;
}

document.getElementById("language").addEventListener("change", loadQuiz);
window.onload = loadQuiz;

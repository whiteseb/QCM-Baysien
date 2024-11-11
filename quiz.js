// Fonction pour charger le CSV et l'afficher sur la page
async function loadQuizData() {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQE5hXX56g9pN-vusClQrFtV-_iPVtSDak1po5mfigJ0iAzMaNn3aPBG57_UH0LiCnUZJDcT55HgyjL/pub?output=csv";
  const response = await fetch(csvUrl);
  
  if (!response.ok) {
    console.error("Erreur de chargement du fichier CSV");
    return;
  }

  const text = await response.text();
  const questions = parseCSV(text);

  displayQuestions(questions);
}

// Fonction pour parser le CSV et convertir les données en un tableau d'objets
function parseCSV(csvText) {
  const rows = csvText.split("\n").map(row => row.split(","));
  const questions = [];
  
  // On suppose que la première ligne contient les en-têtes
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 6) continue; // S'il manque des données, on ignore la ligne

    const questionText = row[0];
    const correctAnswer = row[1]; // Bonne réponse
    const wrongAnswers = row.slice(2, 6); // Réponses incorrectes (4 réponses possibles)
    
    questions.push({
      question: questionText,
      correctAnswer: correctAnswer,
      answers: shuffle([correctAnswer, ...wrongAnswers]),
    });
  }

  return questions;
}

// Fonction pour mélanger un tableau (réponses aléatoires)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
  }
  return array;
}

// Fonction pour afficher les questions et les réponses sur la page
function displayQuestions(questions) {
  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = ""; // Réinitialiser le contenu

  questions.forEach((q, index) => {
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    
    const questionText = document.createElement("h3");
    questionText.textContent = q.question;
    
    const answersList = document.createElement("ul");

    q.answers.forEach((answer, i) => {
      const answerItem = document.createElement("li");
      answerItem.textContent = answer;
      answerItem.addEventListener("click", () => {
        selectAnswer(index, answer);
      });
      answersList.appendChild(answerItem);
    });

    questionElement.appendChild(questionText);
    questionElement.appendChild(answersList);
    questionContainer.appendChild(questionElement);

    // Ajouter l'indication de la bonne réponse (pour test seulement)
    // On peut cacher ceci dans un vrai projet
    questionElement.dataset.correctAnswer = q.correctAnswer;
  });
}

// Fonction pour sélectionner une réponse et la stocker
function selectAnswer(questionIndex, selectedAnswer) {
  const questions = document.querySelectorAll(".question");
  const questionElement = questions[questionIndex];
  
  questionElement.dataset.selectedAnswer = selectedAnswer;
  checkScore();
}

// Fonction pour vérifier le score de l'utilisateur
function checkScore() {
  const questions = document.querySelectorAll(".question");
  let score = 0;
  
  questions.forEach(questionElement => {
    const selectedAnswer = questionElement.dataset.selectedAnswer;
    const correctAnswer = questionElement.dataset.correctAnswer;

    if (selectedAnswer === correctAnswer) {
      score++;
    }
  });

  document.getElementById("result").textContent = `Ton score est : ${score}`;
}

// Attacher l'événement au bouton de soumission
document.getElementById("submit-button").addEventListener("click", checkScore);

// Charger les données au chargement de la page
window.onload = loadQuizData;

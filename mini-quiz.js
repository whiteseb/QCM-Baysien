// Variables globales pour garder la trace de l'état du quiz
let currentQuestionIndex = 0;
let totalScoreBarème1 = 0;
let totalScoreBarème2 = 0;
let questionTimeouts = []; // Tableau pour stocker le temps passé sur chaque question

// Questions du mini-quiz
const questions = [
    {
        question: "Quelle est la couleur du ciel ?",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        correctAnswerBarème1: "Bleu",
        correctAnswerBarème2: [0, 100, 0, 0]  // Par exemple, "Bleu" = 100% et les autres = 0%
    },
    {
        question: "Quel est l'animal roi de la savane ?",
        options: ["Lion", "Éléphant", "Tigre", "Zèbre"],
        correctAnswerBarème1: "Lion",
        correctAnswerBarème2: [100, 0, 0, 0]  // "Lion" = 100% et les autres = 0%
    },
    {
        question: "Combien de continents y a-t-il ?",
        options: ["5", "6", "7", "8"],
        correctAnswerBarème1: "7",
        correctAnswerBarème2: [0, 0, 100, 0]  // "7" = 100% et les autres = 0%
    }
];

// Fonction pour afficher la question et les options de réponse
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Afficher la question
    const questionElement = document.getElementById("question");
    questionElement.textContent = currentQuestion.question;

    // Afficher les options de réponse sous forme de cases à cocher ou de radios
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";  // Réinitialiser les options à chaque question

    currentQuestion.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.textContent = option;

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = option;

        label.prepend(input);
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(document.createElement("br"));  // Pour espacer chaque option
    });

    // Afficher le bouton "Question suivante" seulement après une réponse
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "none";  // Le bouton est caché par défaut
}

// Fonction pour vérifier si une réponse a été sélectionnée
function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }
    return true;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    if (!checkAnswer()) {
        return;  // Ne pas passer à la question suivante si aucune réponse n'est donnée
    }

    // Calculer les scores
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = document.querySelector('input[name="answer"]:checked').value;

    if (selectedAnswer === currentQuestion.correctAnswerBarème1) {
        totalScoreBarème1++;
    }

    const selectedAnswerIndex = currentQuestion.options.indexOf(selectedAnswer);
    if (currentQuestion.correctAnswerBarème2[selectedAnswerIndex] === 100) {
        totalScoreBarème2++;
    }

    // Passer à la question suivante
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();  // Afficher la question suivante
    } else {
        // Si c'est la dernière question, afficher un message de fin
        const result = document.getElementById("result");
        result.textContent = `Votre score Barème 1 : ${totalScoreBarème1} / ${questions.length}\n` +
                             `Votre score Barème 2 : ${totalScoreBarème2} / ${questions.length}`;
    }
}

// Initialiser le quiz
window.onload = function() {
    displayQuestion();  // Afficher la première question
    
    const nextButton = document.getElementById("next-button");
    nextButton.addEventListener("click", nextQuestion);  // Ajouter l'événement de clic sur le bouton
};

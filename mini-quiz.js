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

    // Affichage du QCM classique (barème 1)
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

    // Afficher la section pour les pourcentages (barème bayésien)
    const percentagesContainer = document.getElementById("percentages-container");
    percentagesContainer.innerHTML = "<label>Entrez les pourcentages pour chaque option (total = 100) :</label><br>";

    currentQuestion.options.forEach((option, index) => {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.name = "percentages";
        input.placeholder = `Pourcentage pour ${option}`;
        input.setAttribute("data-index", index);

        percentagesContainer.appendChild(input);
        percentagesContainer.appendChild(document.createElement("br"));
    });

    // Cacher le bouton "Question suivante" tant qu'aucune réponse n'est sélectionnée
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "none";  // Le bouton est caché par défaut

    // Ajouter un événement pour afficher le bouton une fois une réponse choisie
    const inputs = optionsContainer.querySelectorAll('input[name="answer"]');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            nextButton.style.display = "block";  // Afficher le bouton "Suivant"
        });
    });

    // Montrer le container pour les pourcentages
    percentagesContainer.style.display = "block";
}

// Fonction pour vérifier si une réponse a été sélectionnée
function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }
    
    // Vérifier que les pourcentages sont correctement remplis
    const percentageInputs = document.querySelectorAll('input[name="percentages"]');
    let totalPercentage = 0;
    
    percentageInputs.forEach(input => {
        const percentageValue = parseFloat(input.value);
        if (!isNaN(percentageValue)) {
            totalPercentage += percentageValue;
        }
    });
    
    if (totalPercentage !== 100) {
        alert("Les pourcentages doivent être égaux à 100.");
        return false;
    }

    return true;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    if (!checkAnswer()) {
        return;  // Ne pas passer à la question suivante si aucune réponse n'est donnée
    }

    // Calculer les scores pour le barème 1 (QCM classique)
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = document.querySelector('input[name="answer"]:checked').value;

    if (selectedAnswer === currentQuestion.correctAnswerBarème1) {
        totalScoreBarème1++;
    }

    // Calculer les scores pour le barème bayésien (pourcentages)
    const percentageInputs = document.querySelectorAll('input[name="percentages"]');
    percentageInputs.forEach(input => {
        const percentageValue = parseFloat(input.value);
        const optionIndex = input.getAttribute("data-index");
        if (percentageValue === currentQuestion.correctAnswerBarème2[optionIndex]) {
            totalScoreBarème2++;
        }
    });

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


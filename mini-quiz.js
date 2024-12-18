// Variables globales pour garder la trace de l'état du quiz
let currentQuestionIndex = 0;
let currentBarèmeType = 0;  // 0 pour barème classique, 1 pour barème bayésien
let totalScoreBarème1 = 0;
let totalScoreBarème2 = 0;

// Questions du mini-quiz
const questions = [
    {
        question: "Quelle est la couleur du ciel ?",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        correctAnswerBarème1: "Bleu",
        correctAnswerBarème2: [1, 0, 0, 0]  // "Bleu" = 100% et les autres = 0%
    },
    {
        question: "Quel est l'animal roi de la savane ?",
        options: ["Lion", "Éléphant", "Tigre", "Zèbre"],
        correctAnswerBarème1: "Lion",
        correctAnswerBarème2: [1, 0, 0, 0]  // "Lion" = 100% et les autres = 0%
    },
    {
        question: "Combien de continents y a-t-il ?",
        options: ["5", "6", "7", "8"],
        correctAnswerBarème1: "7",
        correctAnswerBarème2: [0, 0, 1, 0]  // "7" = 100% et les autres = 0%
    }
];

// Mélange des questions pour randomisation
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Fonction pour masquer tous les blocs
function hideAllBlocks() {
    const blocks = document.querySelectorAll('div[id^="question"]');
    blocks.forEach(block => {
        block.style.display = "none";
    });
}

// Fonction pour afficher la question et le barème classique
function displayQuestionBarèmeClassique(question, questionIndex) {
    hideAllBlocks();

    const optionsContainer = document.getElementById(`options-container${questionIndex}`);
    optionsContainer.innerHTML = "";  // Réinitialiser les options

    // Affichage de l'énoncé de la question
    const questionElement = document.getElementById("question");
    questionElement.textContent = question.question;

    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.textContent = option;

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `answer${questionIndex}`;
        input.value = option;

        label.prepend(input);
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(document.createElement("br"));
    });

    document.getElementById(`question${questionIndex}-baremeclassique`).style.display = "block";
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour afficher le barème bayésien
function displayQuestionBarèmeBayésien(question, questionIndex) {
    hideAllBlocks();

    const percentagesContainer = document.getElementById(`percentages-container${questionIndex}`);
    percentagesContainer.innerHTML = "<label>Entrez les pourcentages pour chaque option (total = 100) :</label><br>";

    question.options.forEach((option, index) => {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.name = `percentages-${questionIndex}`;
        input.placeholder = `Pourcentage pour ${option}`;
        input.setAttribute("data-index", index);
        input.value = 0;  // Valeur par défaut à 0

        percentagesContainer.appendChild(input);

        const space = document.createElement("span");
        space.style.display = "inline-block";
        space.style.width = "10px";
        percentagesContainer.appendChild(space);

        const label = document.createElement("label");
        label.textContent = option;
        percentagesContainer.appendChild(label);
        percentagesContainer.appendChild(document.createElement("br"));
    });

    // Réinitialisation des champs de pourcentage
    const inputs = percentagesContainer.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = "0";  // Valeur par défaut à 0
    });

    document.getElementById(`question${questionIndex}-baremebaysien`).style.display = "block";
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour vérifier la réponse donnée par l'utilisateur pour le barème classique
function checkBarèmeClassique(question, questionIndex) {
    const selectedAnswer = document.querySelector(`input[name="answer${questionIndex}"]:checked`);
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }

    if (selectedAnswer.value === question.correctAnswerBarème1) {
        totalScoreBarème1++;
    }
    return true;
}

// Fonction pour vérifier la réponse donnée par l'utilisateur pour le barème bayésien
function checkBarèmeBayésien(question, questionIndex) {
    const percentageInputs = document.querySelectorAll(`input[name="percentages-${questionIndex}"]`);
    let totalPercentage = 0;
    let squaredErrorSum = 0;

    // Validation de chaque entrée et calcul de la somme des pourcentages
    percentageInputs.forEach(input => {
        const percentageValue = parseFloat(input.value);
        if (!isNaN(percentageValue) && percentageValue >= 0 && percentageValue <= 100) {
            totalPercentage += percentageValue;
        } else {
            alert("Les pourcentages doivent être entre 0 et 100.");
            return false;
        }
    });

    // Vérification que la somme des pourcentages est exactement 100
    if (totalPercentage !== 100) {
        alert("Les pourcentages doivent être égaux à 100.");
        return false;
    }

    // Calcul du score basé sur la somme des carrés des erreurs
    percentageInputs.forEach(input => {
        const percentageValue = parseFloat(input.value);
        const optionIndex = input.getAttribute("data-index");

        // Calcul de l'erreur pour chaque option
        const error = percentageValue / 100 - question.correctAnswerBarème2[optionIndex]; // Corriger l'erreur : diviser par 100
        squaredErrorSum += error * error;  // Carré de l'erreur
    });

    // Calcul du score : 1 - somme des carrés des erreurs
    const score = 1 - squaredErrorSum;

    // Ajout du score bayésien à la variable globale
    totalScoreBarème2 += score;
    return true;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentBarèmeType === 0) {  // Si c'est le barème classique
        if (!checkBarèmeClassique(currentQuestion, currentQuestionIndex + 1)) return;
        currentBarèmeType = 1;  // Passer au barème bayésien
        displayQuestionBarèmeBayésien(currentQuestion, currentQuestionIndex + 1);  // Afficher le barème bayésien
    } else {  // Si c'est le barème bayésien
        if (!checkBarèmeBayésien(currentQuestion, currentQuestionIndex + 1)) return;
        currentQuestionIndex++;  // Passer à la question suivante

        if (currentQuestionIndex < questions.length) {
            currentBarèmeType = 0;  // Revenir au barème classique pour la prochaine question
            displayQuestionBarèmeClassique(questions[currentQuestionIndex], currentQuestionIndex + 1);
        } else {
            // Affichage du résultat
            document.getElementById("result").textContent = `Quiz terminé ! Score barème classique : ${totalScoreBarème1} / ${questions.length}, Score barème bayésien : ${totalScoreBarème2.toFixed(2)}`;
            document.getElementById("next-button").style.display = "none";
        }
    }
}

// Initialisation du quiz
function startQuiz() {
    shuffleQuestions();  // Mélanger les questions avant le début
    displayQuestionBarèmeClassique(questions[currentQuestionIndex], currentQuestionIndex + 1);
}

// Attacher l'événement au bouton "question suivante"
document.getElementById("next-button").addEventListener("click", nextQuestion);

// Démarrer le quiz à l'ouverture de la page
startQuiz();

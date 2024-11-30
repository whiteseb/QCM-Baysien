// Questions du mini-quiz
const questions = [
    {
        question: "Quelle est la couleur du ciel ?",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        correctAnswerBarème1: "Bleu",
        correctAnswerBarème2: [0, 100, 0, 0]  // "Bleu" = 100% et les autres = 0%
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

// Initialiser les tableaux de suivi après la déclaration de questions
let answeredClassique = Array(questions.length).fill(false);
let answeredBayesien = Array(questions.length).fill(false);

// Mélanger les questions
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Mélanger l'ordre des barèmes pour chaque question
function shuffleBarèmes() {
    return Math.random() < 0.5 ? [0, 1] : [1, 0]; // Retourne un tableau avec l'ordre des barèmes aléatoire
}

// Fonction pour afficher l'énoncé de la question
function displayQuestionText(question) {
    const questionElement = document.getElementById("question");
    questionElement.textContent = question.question;
}

// Fonction pour afficher le barème classique
function displayBarèmeClassique(question) {
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";  // Réinitialiser les options

    // Affichage de l'énoncé de la question
    displayQuestionText(question);

    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.textContent = option;

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = option;

        label.prepend(input);
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(document.createElement("br"));
    });

    // Montrer le conteneur pour le barème classique
    document.getElementById("barème-classique-container").style.display = "block";
    document.getElementById("barème-bayésien-container").style.display = "none";
}

// Fonction pour afficher le barème bayésien
function displayBarèmeBayésien(question) {
    const percentagesContainer = document.getElementById("percentages-container");
    percentagesContainer.innerHTML = "<label>Entrez les pourcentages pour chaque option (total = 100) :</label><br>";

    // Affichage de l'énoncé de la question
    displayQuestionText(question);

    question.options.forEach((option, index) => {
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

    // Réécriture des intitulés après les pourcentages
    question.options.forEach((option, index) => {
        const optionLabel = document.createElement("label");
        optionLabel.textContent = option;
        percentagesContainer.appendChild(optionLabel);
        percentagesContainer.appendChild(document.createElement("br"));
    });

    // Montrer le conteneur pour le barème bayésien
    document.getElementById("barème-classique-container").style.display = "none";
    document.getElementById("barème-bayésien-container").style.display = "block";
}

// Fonction pour vérifier la réponse donnée par l'utilisateur pour le barème classique
function checkBarèmeClassique(question) {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }

    // Vérifier si la réponse est correcte
    if (selectedAnswer.value === question.correctAnswerBarème1) {
        totalScoreBarème1++;
    }

    return true;  // On permet de passer au barème suivant même si la réponse est incorrecte
}

// Fonction pour vérifier la réponse donnée par l'utilisateur pour le barème bayésien
function checkBarèmeBayésien(question) {
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

    percentageInputs.forEach(input => {
        const percentageValue = parseFloat(input.value);
        const optionIndex = input.getAttribute("data-index");
        if (percentageValue === question.correctAnswerBarème2[optionIndex]) {
            totalScoreBarème2++;
        }
    });

    return true;
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    if (!answeredClassique[currentQuestionIndex] && !answeredBayesien[currentQuestionIndex]) {
        // Si aucun barème n'a été répondu, on commence avec un barème aléatoire
        const orderBarèmes = shuffleBarèmes();

        if (orderBarèmes[0] === 0) {  // Si le barème classique doit venir en premier
            displayBarèmeClassique(currentQuestion);  // Afficher le barème classique
        } else {  // Si le barème bayésien doit venir en premier
            displayBarèmeBayésien(currentQuestion);  // Afficher le barème bayésien
        }
    } else if (!answeredClassique[currentQuestionIndex]) {
        // Si seul le barème bayésien a été répondu
        displayBarèmeClassique(currentQuestion);
    } else if (!answeredBayesien[currentQuestionIndex]) {
        // Si seul le barème classique a été répondu
        displayBarèmeBayésien(currentQuestion);
    } else {
        // Les deux barèmes ont été répondus, passer à la question suivante
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            answeredClassique[currentQuestionIndex] = false;
            answeredBayesien[currentQuestionIndex] = false;
            const orderBarèmes = shuffleBarèmes();

            if (orderBarèmes[0] === 0) {
                displayBarèmeClassique(questions[currentQuestionIndex]);
            } else {
                displayBarèmeBayésien(questions[currentQuestionIndex]);
            }
        } else {
            // Fin du quiz
            const result = document.getElementById("result");
            result.textContent = `Votre score Barème 1 : ${totalScoreBarème1} / ${questions.length}\n` +
                                 `Votre score Barème 2 : ${totalScoreBarème2} / ${questions.length}`;
        }
    }

    // Montrer le bouton "Question suivante"
    document.getElementById("next-button").style.display = "none";  // Cacher le bouton après chaque passage
    setTimeout(() => {
        document.getElementById("next-button").style.display = "block";  // Afficher le bouton "question suivante"
    }, 500); // Assurer que le bouton est caché juste après le changement
}

// Initialiser le quiz
window.onload = function() {
    shuffleQuestions();  // Mélanger les questions
    displayBarèmeClassique(questions[currentQuestionIndex]);  // Afficher le premier barème
};

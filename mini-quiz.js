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

// Mélanger les questions
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Fonction pour afficher l'énoncé de la question
function displayQuestionText(question) {
    const questionElement = document.getElementById("question");
    questionElement.textContent = question.question;
}

// Fonction pour afficher le barème classique
function displayBarèmeClassique(question) {
    const optionsContainer = document.getElementById(`options-container${currentQuestionIndex + 1}`);
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
    document.getElementById(`question${currentQuestionIndex + 1}-baremeclassique`).style.display = "block";
    document.getElementById(`question${currentQuestionIndex + 1}-baremebaysien`).style.display = "none";

    // Montrer le bouton pour passer à l'étape suivante
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour afficher le barème bayésien
function displayBarèmeBayésien(question) {
    const percentagesContainer = document.getElementById(`percentages-container${currentQuestionIndex + 1}`);
    percentagesContainer.innerHTML = "<label>Entrez les pourcentages pour chaque option (total = 100) :</label><br>";

    // Affichage de l'énoncé de la question
    displayQuestionText(question);

    question.options.forEach((option, index) => {
        // Créer un champ de saisie pour chaque pourcentage
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.name = "percentages";
        input.placeholder = `Pourcentage pour ${option}`;
        input.setAttribute("data-index", index);

        // Ajouter l'input au conteneur
        percentagesContainer.appendChild(input);

        // Ajouter un petit espace (10px) après le champ de saisie
        const space = document.createElement("span");
        space.style.display = "inline-block";
        space.style.width = "10px";  // Petite largeur pour l'espace
        percentagesContainer.appendChild(space);

        // Ajouter l'intitulé de l'option juste après l'espace, sur la même ligne
        const label = document.createElement("label");
        label.textContent = option;  // Intitulé de l'option
        percentagesContainer.appendChild(label);

        // Ajouter un retour à la ligne après chaque option
        percentagesContainer.appendChild(document.createElement("br"));
    });

    // Montrer le conteneur pour le barème bayésien
    document.getElementById(`question${currentQuestionIndex + 1}-baremeclassique`).style.display = "none";
    document.getElementById(`question${currentQuestionIndex + 1}-baremebaysien`).style.display = "block";

    // Montrer le bouton pour passer à l'étape suivante
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour vérifier la réponse donnée par l'utilisateur pour le barème classique
function checkBarèmeClassique(question) {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }

    // Vérifier si la réponse est correcte (cela ne bloque plus la progression)
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

    if (currentBarèmeType === 0) {  // Si c'est le barème classique
        if (!checkBarèmeClassique(currentQuestion)) return;  // Vérifier la réponse classique
        currentBarèmeType = 1;  // Passer au barème bayésien
        displayBarèmeBayésien(currentQuestion);  // Afficher le barème bayésien
    } else {  // Si c'est le barème bayésien
        if (!checkBarèmeBayésien(currentQuestion)) return;  // Vérifier la réponse bayésienne
        currentQuestionIndex++;  // Passer à la question suivante

        if (currentQuestionIndex < questions.length) {
            currentBarèmeType = 0;  // Revenir au barème classique pour la prochaine question
            displayBarèmeClassique(questions[currentQuestionIndex]);  // Afficher la question suivante
        } else {
            // Fin du quiz
            const resultElement = document.getElementById("result");
            resultElement.textContent = `Vous avez obtenu ${totalScoreBarème1} sur ${questions.length} au barème classique et ${totalScoreBarème2} sur ${questions.length} au barème bayésien.`;
            document.getElementById("next-button").style.display = "none";  // Cacher le bouton à la fin
        }
    }
}

// Démarrer le quiz
shuffleQuestions();  // Mélanger les questions avant de commencer
displayBarèmeClassique(questions[currentQuestionIndex]);  // Afficher la première question avec le barème classique
document.getElementById("next-button").addEventListener("click", nextQuestion);  // Attacher l'événement au bouton

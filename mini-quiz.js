// Variables globales pour garder la trace de l'état du quiz
let currentBlockIndex = 0;  // Indice du bloc actuel dans l'ordre mélangé
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

// Mélanger les blocs
function shuffleBlocks() {
    const blocks = [];
    questions.forEach((question, index) => {
        // Ajouter chaque bloc de question avec chaque barème
        blocks.push({questionIndex: index, barèmeType: 0});  // Barème classique
        blocks.push({questionIndex: index, barèmeType: 1});  // Barème bayésien
    });
    blocks.sort(() => Math.random() - 0.5);  // Mélanger les blocs de manière aléatoire
    return blocks;
}

// Fonction pour afficher l'énoncé de la question
function displayQuestionText(question) {
    const questionElement = document.getElementById("question");
    questionElement.textContent = question.question;
}

// Fonction pour afficher le barème classique
function displayBarèmeClassique(question, index) {
    const optionsContainer = document.getElementById(`options-container${index + 1}`);
    optionsContainer.innerHTML = "";  // Réinitialiser les options
    displayQuestionText(question);

    question.options.forEach((option, i) => {
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

    // Masquer les autres blocs et afficher le barème classique
    hideAllBlocks();
    document.getElementById(`question${index + 1}-baremeclassique`).style.display = "block";
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour afficher le barème bayésien
function displayBarèmeBayésien(question, index) {
    const percentagesContainer = document.getElementById(`percentages-container${index + 1}`);
    percentagesContainer.innerHTML = "<label>Entrez les pourcentages pour chaque option (total = 100) :</label><br>";
    displayQuestionText(question);

    question.options.forEach((option, i) => {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 100;
        input.name = "percentages";
        input.placeholder = `Pourcentage pour ${option}`;
        input.setAttribute("data-index", i);
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

    hideAllBlocks();
    document.getElementById(`question${index + 1}-baremebaysien`).style.display = "block";
    document.getElementById("next-button").style.display = "block";
}

// Fonction pour masquer tous les blocs
function hideAllBlocks() {
    document.querySelectorAll('.question-block').forEach(block => {
        block.style.display = "none";
    });
}

// Fonction pour vérifier la réponse pour le barème classique
function checkBarèmeClassique(question) {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("Veuillez répondre à la question avant de passer à la suivante.");
        return false;
    }

    if (selectedAnswer.value === question.correctAnswerBarème1) {
        totalScoreBarème1++;
    }
    return true;
}

// Fonction pour vérifier la réponse pour le barème bayésien
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
    const currentBlock = blocks[currentBlockIndex];
    const question = questions[currentBlock.questionIndex];

    hideAllBlocks();

    if (currentBlock.barèmeType === 0) {
        if (!checkBarèmeClassique(question)) return;
        currentBlock.barèmeType = 1;
        displayBarèmeBayésien(question, currentBlock.questionIndex);
    } else {
        if (!checkBarèmeBayésien(question)) return;
        currentBlockIndex++;

        if (currentBlockIndex < blocks.length) {
            const nextBlock = blocks[currentBlockIndex];
            const nextQuestion = questions[nextBlock.questionIndex];

            if (nextBlock.barèmeType === 0) {
                displayBarèmeClassique(nextQuestion, nextBlock.questionIndex);
            } else {
                displayBarèmeBayésien(nextQuestion, nextBlock.questionIndex);
            }
        } else {
            const resultElement = document.getElementById("result");
            resultElement.textContent = `Vous avez obtenu ${totalScoreBarème1} sur ${questions.length} au barème classique et ${totalScoreBarème2} sur ${questions.length} au barème bayésien.`;
            document.getElementById("next-button").style.display = "none";
        }
    }
}

// Initialisation du quiz
const blocks = shuffleBlocks();  // Mélanger les blocs de manière aléatoire
displayBarèmeClassique(questions[blocks[currentBlockIndex].questionIndex], blocks[currentBlockIndex].questionIndex);

document.getElementById("next-button").addEventListener("click", nextQuestion);

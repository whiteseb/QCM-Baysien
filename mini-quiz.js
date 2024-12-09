// Variables globales pour garder la trace de l'état du quiz
let currentBlockIndex = 0;  // Index du bloc actuel (commence à 0)
const totalBlocks = 6; // 3 questions * 2 barèmes (classique et bayésien pour chaque question)
let totalScoreBarème1 = 0; // Score pour le barème classique
let totalScoreBarème2 = 0; // Score pour le barème bayésien

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

// Fonction pour masquer tous les blocs
function hideAllBlocks() {
    // Sélectionner tous les blocs dont l'id commence par "question" et les masquer
    const allBlocks = document.querySelectorAll('[id^="question"]');
    allBlocks.forEach(block => {
        block.style.display = "none";
    });
}

// Fonction pour afficher le bloc correspondant
function showBlock(index) {
    hideAllBlocks();  // Masquer tous les blocs précédemment affichés
    
    // Trouver les blocs correspondant à la question et son barème
    const currentBlock = document.getElementById(`question${index + 1}-baremeclassique`);
    const currentBayesianBlock = document.getElementById(`question${index + 1}-baremebaysien`);

    // Afficher le bloc classique si disponible
    if (currentBlock) {
        currentBlock.style.display = "block";
    }
    
    // Afficher le bloc bayésien si disponible
    if (currentBayesianBlock) {
        currentBayesianBlock.style.display = "block";
    }
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

    return true;  // Permet de passer au barème suivant même si la réponse est incorrecte
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

// Fonction pour passer au bloc suivant
function nextBlock() {
    const currentQuestion = questions[Math.floor(currentBlockIndex / 2)];

    if (currentBlockIndex % 2 === 0) {  // Si c'est le barème classique
        if (!checkBarèmeClassique(currentQuestion)) return;  // Vérifier la réponse classique
    } else {  // Si c'est le barème bayésien
        if (!checkBarèmeBayésien(currentQuestion)) return;  // Vérifier la réponse bayésienne
    }

    // Incrémenter l'index du bloc
    currentBlockIndex++;

    // Si nous avons atteint le nombre total de blocs, afficher un message de fin
    if (currentBlockIndex >= totalBlocks) {
        document.getElementById("next-button").style.display = "none"; // Masquer le bouton
        document.getElementById("result").textContent = `Quiz terminé! Votre score Barème 1 : ${totalScoreBarème1} / ${questions.length}\n` +
            `Votre score Barème 2 : ${totalScoreBarème2} / ${questions.length}`; // Afficher les scores
    } else {
        // Afficher le bloc suivant (question + barème)
        showBlock(currentBlockIndex);
    }
}

// Initialisation du quiz
window.onload = function() {
    // Afficher le premier bloc de la première question
    showBlock(currentBlockIndex);  

    // Récupérer le bouton "Question suivante" et lui associer l'événement de clic
    const nextButton = document.getElementById("next-button");
    nextButton.addEventListener("click", nextBlock);  // Ajouter l'événement de clic pour passer au bloc suivant
};


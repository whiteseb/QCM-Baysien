// Tableau des questions du mini-questionnaire
const questions = [
    {
        type: 'QCU',
        question: "Quel est le capital de la France ?",
        options: ["Paris", "Lyon", "Marseille", "Toulouse"],
        correctAnswer: "Paris"
    },
    {
        type: 'Baysien',
        question: "Répartissez votre confiance sur ces réponses (en %)",
        options: ["Paris", "Lyon", "Marseille", "Toulouse"],
        correctAnswer: "Paris"
    },
    {
        type: 'QCU',
        question: "Quel est le plus grand océan du monde ?",
        options: ["Atlantique", "Indien", "Pacifique", "Arctique"],
        correctAnswer: "Pacifique"
    },
    {
        type: 'Baysien',
        question: "Répartissez votre confiance sur ces réponses (en %)",
        options: ["Atlantique", "Indien", "Pacifique", "Arctique"],
        correctAnswer: "Pacifique"
    },
    {
        type: 'QCU',
        question: "Quelle est la capitale de l'Italie ?",
        options: ["Rome", "Milan", "Venise", "Naples"],
        correctAnswer: "Rome"
    },
    {
        type: 'Baysien',
        question: "Répartissez votre confiance sur ces réponses (en %)",
        options: ["Rome", "Milan", "Venise", "Naples"],
        correctAnswer: "Rome"
    },
    {
        type: 'QCU',
        question: "Quel est l'élément chimique dont le symbole est O ?",
        options: ["Oxygène", "Or", "Ozone", "Osmium"],
        correctAnswer: "Oxygène"
    },
    {
        type: 'Baysien',
        question: "Répartissez votre confiance sur ces réponses (en %)",
        options: ["Oxygène", "Or", "Ozone", "Osmium"],
        correctAnswer: "Oxygène"
    }
];

// Variable pour suivre l'indice de la question actuelle
let currentQuestionIndex = 0;

// Fonction pour afficher la question actuelle
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
    questionContainer.appendChild(questionTitle);

    if (question.type === 'QCU') {
        displayQCU(question);
    } else if (question.type === 'Baysien') {
        displayBaysien(question);
    }

    // Mettre à jour l'indicateur de progression
    const progressIndicator = document.getElementById('progress');
    progressIndicator.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;

    // Si on est sur la dernière question, masquer le bouton "Question suivante"
    const nextButton = document.getElementById('next-button');
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.style.display = 'none'; // Cacher le bouton après la dernière question
    } else {
        nextButton.style.display = 'inline'; // Afficher le bouton si ce n'est pas la dernière question
    }
}

// Fonction pour afficher une question QCU
function displayQCU(question) {
    question.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.innerHTML = `<input type="radio" name="question-${currentQuestionIndex}" value="${option}">${option}`;
        document.getElementById('question-container').appendChild(optionLabel);
    });
}

// Fonction pour afficher une question avec le barème Baysien
function displayBaysien(question) {
    question.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.innerHTML = `
            ${option} :
            <input type="number" name="question-${currentQuestionIndex}-percentage" min="0" max="100" step="1" placeholder="0" required>
            %<br>
        `;
        document.getElementById('question-container').appendChild(optionLabel);
    });
}

// Fonction pour vérifier les réponses avant de passer à la question suivante
function validateAnswer() {
    const question = questions[currentQuestionIndex];

    if (question.type === 'QCU') {
        // Vérifier si une réponse a été sélectionnée
        const selectedOption = document.querySelector(`input[name="question-${currentQuestionIndex}"]:checked`);
        if (!selectedOption) {
            alert('Veuillez répondre à la question avant de passer à la suivante.');
            return false;  // Empêche de passer à la question suivante
        }
    } else if (question.type === 'Baysien') {
        // Vérifier si la somme des pourcentages est égale à 100%
        const percentageInputs = document.querySelectorAll(`input[name="question-${currentQuestionIndex}-percentage"]`);
        let totalPercentage = 0;
        percentageInputs.forEach(input => {
            totalPercentage += parseFloat(input.value) || 0;  // Ajoute les valeurs des entrées de pourcentage
        });

        if (totalPercentage !== 100) {
            alert('La somme des pourcentages doit être égale à 100%.');
            return false;  // Empêche de passer à la question suivante
        }
    }

    return true;  // Si toutes les validations sont réussies, on peut passer à la question suivante
}

// Fonction pour passer à la question suivante
function nextQuestion() {
    if (validateAnswer()) {
        currentQuestionIndex++;  // Incrémenter l'indice de la question

        if (currentQuestionIndex < questions.length) {
            displayQuestion();  // Afficher la prochaine question
        } else {
            // Si c'est la dernière question, afficher un message de fin
            alert("Vous avez terminé le questionnaire !");
        }
    }
}

// Fonction pour initialiser le questionnaire
function startQuiz() {
    currentQuestionIndex = 0;  // Réinitialiser l'indice de la question
    displayQuestion();  // Afficher la première question
}

// Exécution de la fonction de démarrage lorsque la page est chargée
window.onload = startQuiz;


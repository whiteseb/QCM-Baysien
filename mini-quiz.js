// Exemple de questions avec les deux barèmes (réponse unique et pourcentage)
const questions = [
    {
        question: "Quel est le plus grand mammifère terrestre ?",
        answers: ["Éléphant", "Girafe", "Rhinocéros", "Baleine", "Lion"],
        correctAnswer: "Éléphant",  // Bonne réponse pour le premier barème (réponse unique)
        // Les valeurs pour le barème des pourcentages sont un exemple
        percentageAnswers: {
            "Éléphant": 0.9,
            "Girafe": 0.05,
            "Rhinocéros": 0.03,
            "Baleine": 0.02,
            "Lion": 0.0
        }
    },
    {
        question: "Quel est l'organe responsable de la respiration ?",
        answers: ["Cœur", "Poumons", "Reins", "Estomac", "Foie"],
        correctAnswer: "Poumons",  // Bonne réponse pour le premier barème (réponse unique)
        percentageAnswers: {
            "Cœur": 0.0,
            "Poumons": 0.95,
            "Reins": 0.02,
            "Estomac": 0.02,
            "Foie": 0.01
        }
    },
    {
        question: "Quel est l'élément chimique avec le symbole 'O' ?",
        answers: ["Oxygène", "Ozone", "Osmium", "Oxyde", "Or"],
        correctAnswer: "Oxygène",  // Bonne réponse pour le premier barème (réponse unique)
        percentageAnswers: {
            "Oxygène": 0.9,
            "Ozone": 0.05,
            "Osmium": 0.03,
            "Oxyde": 0.01,
            "Or": 0.01
        }
    }
];

// Variables pour suivre la progression
let currentQuestionIndex = 0;
let userAnswers = [];  // Pour stocker les réponses des utilisateurs

// Fonction pour afficher la question suivante
function showNextQuestion() {
    // Si on a atteint la fin du mini-questionnaire, afficher le bouton pour commencer le vrai questionnaire
    if (currentQuestionIndex >= questions.length * 2) {
        document.getElementById("start-real-quiz-btn").style.display = "inline-block";
        return;
    }

    // Choisir une question et déterminer quel barème utiliser
    const questionIndex = Math.floor(currentQuestionIndex / 2); // Calcul de l'indice de la question
    const barème = currentQuestionIndex % 2 === 0 ? "unique" : "pourcentage";  // Alternance des barèmes

    const question = questions[questionIndex];

    // Affichage de la question et des réponses
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `
        <h3>${question.question}</h3>
    `;

    // Création des réponses en fonction du barème
    let answersHtml = "";
    if (barème === "unique") {
        // Barème réponse unique
        question.answers.forEach(answer => {
            answersHtml += `
                <label><input type="radio" name="answer" value="${answer}">${answer}</label><br>
            `;
        });
    } else {
        // Barème pourcentage
        question.answers.forEach(answer => {
            answersHtml += `
                <label><input type="number" name="answer" min="0" max="100" value="0" data-answer="${answer}">${answer}</label><br>
            `;
        });
    }

    questionContainer.innerHTML += answersHtml;

    // Afficher un bouton pour passer à la question suivante
    const nextButton = document.createElement("button");
    nextButton.textContent = "Question suivante";
    nextButton.addEventListener("click", () => {
        collectAnswer(barème, questionIndex);
        currentQuestionIndex++;
        showNextQuestion();
    });
    questionContainer.appendChild(nextButton);
}

// Fonction pour collecter la réponse de l'utilisateur
function collectAnswer(barème, questionIndex) {
    const question = questions[questionIndex];

    if (barème === "unique") {
        // Collecter la réponse pour le barème "unique"
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            userAnswers.push({ question: question.question, answer: selectedAnswer.value, barème });
        }
    } else {
        // Collecter les réponses pour le barème "pourcentage"
        const inputs = document.querySelectorAll('input[name="answer"]');
        let totalPercentage = 0;
        inputs.forEach(input => {
            const answer = input.dataset.answer;
            const percentage = parseInt(input.value);
            totalPercentage += percentage;
            userAnswers.push({ question: question.question, answer: answer, percentage: percentage, barème });
        });
        if (totalPercentage !== 100) {
            alert("La somme des pourcentages doit être égale à 100.");
            return;
        }
    }
}

// Fonction pour commencer le mini-questionnaire
function startMiniQuiz() {
    showNextQuestion();
}

// Lorsque la page est chargée, démarrer le mini-questionnaire
document.addEventListener("DOMContentLoaded", startMiniQuiz);

// Lorsque l'utilisateur est prêt à démarrer le vrai questionnaire
document.getElementById("start-real-quiz-btn").addEventListener("click", () => {
    window.location.href = "questionnaire.html";  // Remplace par la page du vrai questionnaire
});

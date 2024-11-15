// Fonction pour charger et parser le fichier CSV depuis Google Sheets
function loadCSV() {
    const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQE5hXX56g9pN-vusClQrFtV-_iPVtSDak1po5mfigJ0iAzMaNn3aPBG57_UH0LiCnUZJDcT55HgyjL/pub?output=csv'; // URL du CSV Google Sheets

    fetch(csvURL)  // Pas besoin de proxy CORS ici
        .then(response => response.text()) // Récupère le contenu en texte brut
        .then(data => {
            parseCSV(data); // On passe les données récupérées à la fonction de parsing
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier CSV:', error);
        });
}

// Fonction pour parser le CSV et afficher les questions
function parseCSV(data) {
    const questions = Papa.parse(data, {
        header: true,   // Assure-toi que la première ligne contient les noms des colonnes
        skipEmptyLines: true
    });

    // Afficher les données du CSV dans la console pour vérifier qu'elles sont bien récupérées
    console.log('Données du CSV:', questions.data); // Ajoute cette ligne pour vérifier le contenu du CSV

    displayQuestions(questions.data);
}

// Fonction pour afficher les questions et les réponses sur la page
function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Vide le contenu précédent

    questions.forEach((question, index) => {
        // Vérifie si la question et ses réponses sont valides
        console.log(`Question ${index + 1}:`, question);

        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        
        // Créer l'élément de question
        const questionText = document.createElement('h3');
        questionText.textContent = `${index + 1}. ${question.Question}`;
        questionElement.appendChild(questionText);

        // Mélanger les options
        const options = [
            question.Reponse1,
            question.Reponse2,
            question.Reponse3,
            question.Reponse4,
            question.Reponse5
        ];

        // Filtrer les options vides ou undefined
        const filteredOptions = options.filter(option => option && option !== "undefined");

        // Mélanger les options filtrées
        shuffle(filteredOptions);

        filteredOptions.forEach((option, idx) => {
            const optionElement = document.createElement('label');
            optionElement.innerHTML = `<input type="radio" name="question-${index}" value="${option}">${option}`;
            questionElement.appendChild(optionElement);
        });

        quizContainer.appendChild(questionElement);
    });

    // Ajouter le bouton de soumission
    const submitButton = document.getElementById('submit-btn');
    submitButton.addEventListener('click', () => submitQuiz(questions));
}

// Fonction pour mélanger les options de réponse
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fonction pour soumettre le quiz et calculer le score
function submitQuiz(questions) {
    let score = 0;
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selectedOption) {
            const selectedAnswer = selectedOption.value;
            if (selectedAnswer === question.BonneReponse) {
                score += 1; // Le score est incrémenté si la réponse est correcte
            }
        }
    });

    alert(`Ton score est : ${score}`);
}

// Charger le CSV au démarrage
window.onload = loadCSV;



document.addEventListener('DOMContentLoaded', function () {
    // Remplace ceci par le lien correct qui se termine par ?output=csv
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQE5hXX56g9pN-vusClQrFtV-_iPVtSDak1po5mfigJ0iAzMaNn3aPBG57_UH0LiCnUZJDcT55HgyjL/pub?output=csv';
    
    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du CSV');
            }
            return response.text();
        })
        .then(data => {
            console.log('CSV chargé avec succès');
            const questions = parseCSV(data);
            displayQuestions(questions);
        })
        .catch(error => console.error('Erreur lors du chargement du CSV:', error));

    function parseCSV(data) {
        const lines = data.split('\n');
        const questions = [];
        for (let i = 1; i < lines.length; i++) {  // Ignorer la première ligne (les en-têtes)
            const cols = lines[i].split(',');
            if (cols.length >= 6) {
                const question = {
                    question: cols[0].trim(),
                    options: [cols[1].trim(), cols[2].trim(), cols[3].trim(), cols[4].trim()],
                    correct_answer: cols[5].trim(),
                };
                console.log(question);  // Afficher chaque question pour vérifier
                questions.push(question);
            }
        }
        return questions;
    }

    function displayQuestions(questions) {
        console.log('Questions récupérées :', questions);
        const shuffledQuestions = shuffleArray(questions);
        const questionContainer = document.getElementById('quiz-container');
        if (!questionContainer) {
            console.error('Le container de questions est introuvable.');
            return;
        }

        shuffledQuestions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <h3>${q.question}</h3>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <label>
                            <input type="radio" name="q${index}" value="${option}" /> ${option}
                        </label><br>
                    `).join('')}
                </div>
            `;
            questionContainer.appendChild(questionElement);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Échange
        }
        return array;
    }

    window.submitQuiz = function () {
        let score = 0;
        const allQuestions = document.querySelectorAll('.question');
        allQuestions.forEach((q, index) => {
            const selectedOption = q.querySelector('input:checked');
            if (selectedOption) {
                const answer = selectedOption.value;
                if (answer === shuffledQuestions[index].correct_answer) {
                    score += 1;  // Barème simple
                }
            }
        });
        document.getElementById('score').textContent = `Ton score est: ${score}`;
    };
});

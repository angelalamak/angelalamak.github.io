var quizData = {};
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
fetch('plgi_mc.json') // Path to your JSON file
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON data
    })
    .then(data => {
        // quizData = data;
        quizData = {"questions": shuffleArray([...data.questions])}
        showQuestion();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

const elements = {
    questionNumber: document.querySelector('.question-number'),
    questionText: document.querySelector('.question-text'),
    optionsList: document.querySelector('.options-list'),
    explanation: document.querySelector('.explanation'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    results: document.querySelector('.results'),
    questionContainer: document.querySelector('.question-container')
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function showQuestion() {
    const question = quizData.questions[currentQuestion];
    elements.questionNumber.textContent = `問題 ${currentQuestion + 1}/${quizData.questions.length}`;
    elements.questionText.textContent = question.question;
    elements.optionsList.innerHTML = '';

    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option-item';
        li.textContent = option;
        li.onclick = () => selectAnswer(index);
        if (userAnswers[currentQuestion] !== undefined) {
            if (index === question.answer) {
                li.classList.add('correct');
            } else if (index === userAnswers[currentQuestion] && !isAnswerCorrect(currentQuestion)) {
                li.classList.add('incorrect');
            }
        }
        elements.optionsList.appendChild(li);
    });

    elements.prevBtn.disabled = currentQuestion === 0;
    elements.nextBtn.disabled = userAnswers[currentQuestion] === undefined;

    if (userAnswers[currentQuestion] !== undefined) {
        showExplanation();
    }
}

function selectAnswer(selectedIndex) {
    if (userAnswers[currentQuestion] !== undefined) return;

    userAnswers[currentQuestion] = selectedIndex;
    const isCorrect = isAnswerCorrect(currentQuestion);
    if (isCorrect) score++;

    document.querySelectorAll('.option-item').forEach(li => {
        li.style.cursor = 'default';
        const index = Array.from(li.parentNode.children).indexOf(li);
        if (index === quizData.questions[currentQuestion].answer) {
            li.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            li.classList.add('incorrect');
        }
    });

    elements.nextBtn.disabled = false;
    showExplanation();
}

function showExplanation() {
    const explanation = quizData.questions[currentQuestion].explanation;
    if (explanation) {
        elements.explanation.textContent = explanation;
        elements.explanation.style.display = 'block';
    }
}

function isAnswerCorrect(questionIndex) {
    return userAnswers[questionIndex] === quizData.questions[questionIndex].answer;
}

function nextQuestion() {
    if (currentQuestion < quizData.questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showResults() {
    elements.questionContainer.style.display = 'none';
    elements.results.style.display = 'block';
    elements.results.innerHTML = `
        <h2>測驗完成！</h2>
        <p>你的得分是 ${score}/${quizData.questions.length}</p>
        <button onclick="location.reload()">重新測驗</button>
    `;
}
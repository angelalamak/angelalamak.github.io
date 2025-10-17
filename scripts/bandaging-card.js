let questions = [];
const flipCard = document.querySelector('.flip-card');
const flipCardInner = document.querySelector('.flip-card-inner');

async function fetchQuestions() {
    try {
        await fetch('question/card/bandaging.json')
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
            })
            .catch(error => { throw error; });
    }
    catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function randomQuestion(max) {
    let questionNumber = Math.floor(Math.random() * max) + 1;
    document.querySelector('#questionNumber').value = questionNumber;
    loadQuestion(questionNumber);
    flipCardInner.classList.remove('flip');
}

function loadQuestion(questionNumber) {
    questionNumber -= 1; // Adjust for zero-based index

    document.querySelector('#question').innerHTML = questionNumber + 1 + '. ' + questions[questionNumber].question;
    document.querySelector('#description-1').innerHTML = questions[questionNumber].description[0];
    document.querySelector('#description-2').innerHTML = questions[questionNumber].description[1];
    document.querySelector('#description-answer-1').innerHTML = questions[questionNumber].answer[0];
    document.querySelector('#description-answer-2').innerHTML = questions[questionNumber].answer[1];
    document.querySelector('#answer').innerHTML = questions[questionNumber].answer[2];
    flipCardInner.classList.remove('flip');

}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchQuestions();
    loadQuestion(1);
});

flipCard.addEventListener('click', () => {
    flipCardInner.classList.toggle('flip');
});
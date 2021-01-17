const $template = document.getElementById('question-template');

class Questions extends HTMLElement {

    question = '';
    category = '';
    difficulty = '';
    arrAnswer = new Array();
    correctAnswer = '';
    scores = 0;
    indexQues = 0;
    arrData = new Array();

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.append($template.content.cloneNode(true));

        this.$questionContainer = this.shadowRoot.getElementById('question-container');
        this.$container = this.shadowRoot.getElementById('container');
        this.$question = this.shadowRoot.getElementById('question');
        this.$category = this.shadowRoot.getElementById('category');
        this.$difficulty = this.shadowRoot.getElementById('difficulty');
        this.$answerButtonElement = this.shadowRoot.getElementById('answer-buttons');
        this.$start = this.shadowRoot.getElementById('start-btn');
        this.$next = this.shadowRoot.getElementById('next-btn');
        this.$restart = this.shadowRoot.getElementById('restart-btn');
        this.$score = this.shadowRoot.getElementById('score');

        this.loadData();

        this.$start.onclick = () => {
            this.startQuiz();
        }

        this.$next.onclick = () => {
            this.nextQuiz();
        }

        this.$restart.onclick = () => {
            location.reload();
        }
    }

    static get observedAttributes() {
        return ['question','category','difficulty','answer1','answer2','answer3','correct-answer'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
             case 'question':
                this.question = newValue;
                 break;
            case 'category':
                this.category = newValue;
                break;
            case 'difficulty':
                this.difficulty = newValue;
                break;

            case 'answer1':
                this.arrAnswer.push(newValue);
                break;

            case 'answer2':
                this.arrAnswer.push(newValue);
                break;

            case 'answer3':
                this.arrAnswer.push(newValue);
                break;

            case 'correct-answer':
                this.arrAnswer.push(newValue);
                this.correctAnswer = newValue;
                break;
            }

    }

    async loadData(){
        const response = await fetch(`https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple`);
        const data = await response.json();
        const arrData = data.results;
        this.pullData(arrData);
    }

    pullData(arr){
      this.arrData = arr;
      this.$start.disabled = false;
    }

    startQuiz() {
        this.$start.classList.add("hide");
        this.$container.classList.remove("hide");
        this.$next.classList.remove("hide");
        this.$score.classList.remove("hide");
        this.nextQuiz();
    }


    nextQuiz() {
        this.undisabledButton();
        this.clearStatusButton();
        if(this.indexQues < this.arrData.length){
            this.showQuestion(this.arrData[this.indexQues]);
            this.indexQues += 1;
        }else {
            this.$next.classList.add("hide");
            this.$container.classList.add("hide");
            this.restartQuiz();
        }
    }

    restartQuiz() {
        this.$restart.classList.remove("hide");
    }

    showQuestion(arr){
        this.question = arr.question;
        this.category = arr.category;
        this.difficulty = arr.difficulty;
        this.arrAnswer[0] = arr.correct_answer;
        this.arrAnswer[1] = arr.incorrect_answers[0];
        this.arrAnswer[2] = arr.incorrect_answers[1]
        this.arrAnswer[3] = arr.incorrect_answers[2]
        this.correctAnswer = arr.correct_answer;
        this.render();
    }

    shuffleAnswer(array){
        var currentIndex = array.length, randomIndex, tempValue;
        if(currentIndex !== 0){
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            tempValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = tempValue;
        }

        return array;
    }


    selectAnswer(e) {

        var correctAnswer = e.target.getAttribute("correct");
        var correct = e.target.innerText;
        if(correctAnswer == correct){
            e.target.classList.add("correct");
            alert("Bạn được 10 điểm !!");
        }else {
            alert("Bạn không được điểm nào rồi !!");
        }
    }

    clearStatusButton() {
        Array.from(this.$answerButtonElement.children).forEach(button => {
            button.classList.remove('correct');
        })
    }

    
    render(){
    this.$question.innerHTML = `Question: ${this.question}`;
    this.$category.innerHTML = `Category: ${this.category}`;
    this.$difficulty.innerHTML = `Difficulty: ${this.difficulty}`;
    this.arrAnswer = this.shuffleAnswer(this.arrAnswer);
      var index = this.arrAnswer.length - 1;
    Array.from(this.$answerButtonElement.children).forEach(button => {
        this.setButtonAnswer(button, index);
        index -= 1;

    })
  }

  setButtonAnswer(element, index) {
    element.innerText = this.arrAnswer[index];
    if(this.arrAnswer[index] == this.correctAnswer){
        element.setAttribute("correct",this.correctAnswer);
    }
    element.addEventListener('click', this.selectAnswer);
    element.onclick = (e) => {
        this.upPoint(e);
    };                                                                                                                                                                                                                                               
  }

    upPoint(e) {
        if (Array.from(e.target.classList).indexOf("correct") != -1) {
            this.scores += 10;
            this.$score.innerText = `YOUR SCORE: ${this.scores}`;
        }
        this.disabledButton();
    }
    
    disabledButton() {
        Array.from(this.$answerButtonElement.children).forEach(button => {
            button.disabled = true;
        })
    }

    undisabledButton() {   
            Array.from(this.$answerButtonElement.children).forEach(button => {
                button.disabled = false;
            })
    }

}

window.customElements.define('question-container', Questions);
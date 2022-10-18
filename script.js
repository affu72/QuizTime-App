"use strict";

const topic = document.querySelectorAll(".topic-option");
const submitBtn = document.querySelector(".subBtn");
const quizDes = document.querySelector(".section-hero");
const btns = document.querySelector(".btns");
const quesSection = document.querySelector(".questions");

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".previous-btn");

let url, topi, num, level;
let d;
const questArr = [];

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const [t, n, l] = [...topic];
  topi = t;
  num = n;
  level = l;

  url = `https://the-trivia-api.com/api/questions?categories=${topi.value}&limit=${num.value}&difficulty=${level.value}`;

  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();

  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);

    btns.classList.remove("hidden");
    quizDes.classList.add("hidden");
    prevBtn.classList.add("hidden");
    document.querySelector(".questions").classList.remove("hidden");
    document.querySelector(".header").classList.add("hidden");
    createQuestion(data);
  });
});

//create question

const allOptions = [];
const correct = [];
let score = 0;

const createQuestion = function (data) {
  let options;

  data.forEach((ele, questCount) => {
    if (ele.type === "Multiple Choice") {
      const incorrect = ele.incorrectAnswers;
      const crct = ele.correctAnswer;
      const option = incorrect.splice(0, Math.floor(Math.random() * 3) + 1);
      option.push(crct);
      options = option.concat(incorrect);

      allOptions.push(options);
      correct.push(crct);

      const html = `<div class="question-active-${questCount} hidden question-container">
    <div class=" question-title question-${questCount}">${questCount + 1}. ${
        data[questCount]["question"]
      }</div>
  <form class="question-active">
      <div class="option">
        <input type="radio" name="option-${questCount}" value="1" id = "${
        questCount + 1
      }a">
        <label  class="question-options" for="${questCount + 1}a">${
        options[0]
      }</label>
      </div>

      <div class="option">
        <input type="radio" name="option-${questCount}" value="2" id="${
        questCount + 1
      }b">
        <label class="question-options" for="${questCount + 1}b">${
        options[1]
      }</label>
      </div>

      <div class="option">
        <input type="radio" name="option-${questCount}" value="3" id = "${
        questCount + 1
      }c">
        <label class="question-options" for="${questCount + 1}c">${
        options[2]
      }</label>
      </div>

      <div class="option">
        <input type="radio" name="option-${questCount}" value="4" id ="${
        questCount + 1
      }d">
        <label class="question-options" for="${questCount + 1}d">${
        options[3]
      }</label>
      </div>
    </form>
    <div class="visited">${questCount + 1}/${data.length}</div>
    <div>`;
      questArr.push(html);
    }
  });

  const displaResult = function (ans) {
    console.log(ans);
    let score = 0;
    let wrong = 0;
    let skip = 0;

    ans.forEach((ele) => {
      if (ele === 1) skip++;
      if (ele === 2) score++;
      if (ele === 3) wrong++;
    });

    const res = `<div class="result-description">
      <div class="total-questions">Total Questions</div>
      <div class="total">${ans.length}</div>
      <div class="total-attempted">Attempted</div>
      <div class="attempted">${ans.length - skip}</div>
      <div class="total-skipped">Skipped</div>
      <div class="skipped">${skip}</div>
      <div class="total-wrong">Wrong</div>
      <div class="wrong">${wrong}</div>
      <div class="total">Correct</div>
      <div class="correct">${score}</div>
      <div class="total">Marks</div>
      <div class="marks">${score}/${ans.length}</div>
    </div>`;

    document.querySelector(".score").insertAdjacentHTML("beforeend", res);
  };

  const final = new Array(questArr.length);
  final.fill(1);

  let count = 0;
  const answer = [];

  const displayPrevious = function () {
    count--;

    if (count <= 1) {
      prevBtn.classList.add("hidden");
    }

    if (count > 0) {
      document
        .querySelector(`.question-active-${count}`)
        .classList.add("hidden");
    }

    document
      .querySelector(`.question-active-${count - 1}`)
      .classList.remove("hidden");

    if (count >= questArr.length - 1) {
      document.querySelector(".next-btn").classList.remove("hidden");
      document.querySelector(".submit-result").classList.add("hidden");
    }
  };

  const displayNext = function () {
    if (count < questArr.length)
      quesSection.insertAdjacentHTML("afterbegin", questArr[count]);

    const optionInput = document.getElementsByName(`option-${count - 1}`);

    optionInput.forEach((ele) => {
      if (ele.checked) {
        const optionSelected = allOptions[count - 1][+ele.value - 1];

        const re = optionSelected === correct[count - 1];
        re ? (final[count - 1] = 2) : (final[count - 1] = 3);
      }
    });
    if (count != 0) {
      document
        .querySelector(`.question-active-${count - 1}`)
        .classList.add("hidden");
    }

    if (count < questArr.length) {
      document
        .querySelector(`.question-active-${count}`)
        .classList.remove("hidden");
    }

    if (count === 1) {
      prevBtn.classList.remove("hidden");
    }

    count++;

    if (count === questArr.length) {
      document.querySelector(".next-btn").classList.add("hidden");
      document.querySelector(".submit-result").classList.remove("hidden");
    }
  };

  displayNext();
  nextBtn.addEventListener("click", displayNext);
  prevBtn.addEventListener("click", displayPrevious);

  document
    .querySelector(".submit-result")
    .addEventListener("click", function () {
      displayNext();
      document.querySelector(".submit-result").classList.add("hidden");
      prevBtn.classList.add("hidden");
      document.querySelector(".score").classList.remove("hidden");
      document.querySelector(".questions").classList.add("hidden");
      displaResult(final);
    });
};

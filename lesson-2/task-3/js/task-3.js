class hamburger {
  constructor(size) {
    this.size = size;
    this.topings = [];
    this.dressings = [];
  }
  // функция добавления начинки
  addToping(toping) {
    this.topings.push(toping);
  }

  // функция добавления приправ
  addDressing() {
    check = false;
    let dressing;
    let a = this;
    let answer = document.querySelectorAll(".answer");
    answer[0].addEventListener("click", answerSpice);
    answer[1].addEventListener("click", answerMayonnaise);
    function answerSpice() {
      dressing = 1;
      a.dressings.push(dressing);
      h1[0].insertAdjacentHTML("beforeend", ` с приправой `);
      a.calcPriceCalories();
    }
    function answerMayonnaise() {
      dressing = 2;
      a.dressings.push(dressing);
      h1[0].insertAdjacentHTML("beforeend", ` с майонезом `);
      a.calcPriceCalories();
    }
  }
  // Функция подсчета цены и калорийности (майонез 5 ккал?!!)
  calcPriceCalories() {
    let price = 0;
    let calories = 0;
    switch (this.size) {
      case "big":
        price += 100;
        calories += 40;
        break;
      case "small":
        price += 50;
        calories += 20;
        break;
    }
    for (let top of this.topings) {
      price += topings[top - 1].cost;
      calories += topings[top - 1].cal;
    }
    for (let dress of this.dressings) {
      price += dressings[dress - 1].cost;
      calories += dressings[dress - 1].cal;
    }
    alert(
      `Ваш заказ стоит ${price} золотых \nКалорийность - ${calories} ккал, но это 100% неточно`
    );
  }
}
const topings = [
  { name: "cheese", cost: 10, cal: 20 },
  { name: "salad", cost: 20, cal: 5 },
  { name: "potato", cost: 15, cal: 10 },
];
const dressings = [
  { name: "spice", cost: 15, cal: 0 },
  { name: "mayonnaise", cost: 20, cal: 5 },
];
let check = false;
let size;
let order;
let orderHtml = document.querySelector(".order");
let h1 = document.getElementsByTagName("h1");
orderHtml.insertAdjacentHTML(
  "beforeend",
  `<div class="question"><h2>выбирете размер гамбургера</h2></div>`
);
orderHtml.insertAdjacentHTML("beforeend", `<div class="small">Маленький</div>`);
orderHtml.insertAdjacentHTML("beforeend", `<div class="big">Большой</div>`);
document.querySelector(".order").addEventListener("click", getSize);
function getSize(e) {
  if (e.target.classList.contains("small")) {
    size = "small";
    h1[0].insertAdjacentHTML("beforeend", ` Маленький `);
    rerending();
  }
  if (e.target.classList.contains("big")) {
    size = "big";
    h1[0].insertAdjacentHTML("beforeend", ` Большой `);
    rerending();
  }
  function rerending() {
    order = new hamburger(size);
    document.querySelector(".small").remove();
    document.querySelector(".big").remove();
    document.querySelector(".order").removeEventListener("click", getSize);
    document.querySelector(".question").innerHTML = "<h2>Какую начинку</h2>";
    orderHtml.insertAdjacentHTML(
      "beforeend",
      `<div class="toping" data-name="1">Сыр</div>`
    );
    orderHtml.insertAdjacentHTML(
      "beforeend",
      `<div class="toping" data-name="2">Салат</div>`
    );
    orderHtml.insertAdjacentHTML(
      "beforeend",
      `<div class="toping" data-name="3">Картоха</div>`
    );
    document.querySelector(".order").addEventListener("click", getToping);
  }
}
function getToping(e) {
  if (e.target.classList.contains("toping")) {
    toping = e.target.dataset["name"];
    document.querySelector(".order").removeEventListener("click", getToping);
    switch (toping) {
      case "1":
        h1[0].insertAdjacentHTML("beforeend", ` с сыром `);
        break;
      case "2":
        h1[0].insertAdjacentHTML("beforeend", ` с салатом `);
        break;
      case "3":
        h1[0].insertAdjacentHTML("beforeend", ` с картохой `);
        break;
    }
    document.querySelector(".question").innerHTML = "<h2>Еще начинки?</h2>";
    order.addToping(toping);
    rendingYesNo();
  }
  function rendingYesNo() {
    orderHtml.insertAdjacentHTML(
      "beforeend",
      `<div class="answer" data-answer="Yes">Да</div>`
    );
    orderHtml.insertAdjacentHTML(
      "beforeend",
      `<div class="answer" data-answer="No">Нет</div>`
    );
    document.querySelector(".order").addEventListener("click", getAnswer);
  }
  function getAnswer(e) {
    if (e.target.classList.contains("answer")) {
      answer = e.target.dataset["answer"];
      if (answer == "Yes") {
        document.querySelectorAll(".answer")[0].remove();
        document.querySelectorAll(".answer")[0].remove();
        document
          .querySelector(".order")
          .removeEventListener("click", getAnswer);
        document.querySelector(".order").addEventListener("click", getToping);
      }
      if (answer == "No") {
        rerending();
      }
      function rerending() {
        document.querySelectorAll(".answer")[0].remove();
        document.querySelectorAll(".answer")[0].remove();
        document.querySelectorAll(".toping")[0].remove();
        document.querySelectorAll(".toping")[0].remove();
        document.querySelectorAll(".toping")[0].remove();
        document.querySelector(".question").innerHTML =
          "<h2>Чем-нибудь заправить?</h2>";
        orderHtml.insertAdjacentHTML(
          "beforeend",
          `<div class="answer" data-answer="Yes">Да</div>`
        );
        orderHtml.insertAdjacentHTML(
          "beforeend",
          `<div class="answer" data-answer="No">Нет</div>`
        );
        document.querySelector(".order").addEventListener("click", getDressing);
      }
    }
  }
}
function getDressing(e) {
  if (e.target.classList.contains("answer")) {
    answer = e.target.dataset["answer"];
    return;
  }
}
/*

  
  
  function getAnswer(e) {
     {
      
      
        /*
        
        answer = document.querySelectorAll(".answer");
        answer[0].addEventListener("click", answerYes);
        answer[1].addEventListener("click", answerNo);
        function answerYes() {
          answer[0].innerHTML = "Приправа";
          answer[1].innerHTML = "Майонез";
          order.addDressing();
        }
        function answerNo() {
          order.calcPriceCalories();
        }
      }
      return answer;
    }
  }
  
  let answer = document.querySelectorAll(".answer");
  answer[0].addEventListener("click", answerYes);
  answer[1].addEventListener("click", answerNo);
  function answerYes() {
    answer[0].remove();
    answer[1].remove();
    order.addToping();
  }
  function answerNo() {
    answer[0].remove();
    answer[1].remove();
    document.querySelectorAll(".toping")[0].remove();
    document.querySelectorAll(".toping")[0].remove();
    document.querySelectorAll(".toping")[0].remove();
    question.innerHTML = "<h2>Чем-нибудь заправить?</h2>";
    orderHtml.insertAdjacentHTML("beforeend", `<div class="answer">Да</div>`);
    orderHtml.insertAdjacentHTML("beforeend", `<div class="answer">Нет</div>`);
    answer = document.querySelectorAll(".answer");
    answer[0].addEventListener("click", answerYes);
    answer[1].addEventListener("click", answerNo);
    function answerYes() {
      answer[0].innerHTML = "Приправа";
      answer[1].innerHTML = "Майонез";
      order.addDressing();
    }
    function answerNo() {
      order.calcPriceCalories();
    }
  }
}*/

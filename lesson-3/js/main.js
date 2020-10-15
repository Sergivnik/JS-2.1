class item {
  constructor(id, title, price, img = "noPhoto.jpg") {
    this.id = id;
    this.title = title;
    this.price = price;
    this.img = img;
  }
  renderItem() {
    return `
  <div class="product-item">
    <h3>${this.title}</h3>
    <p>${this.price} дублонов</p>
    <img src="img/${this.img}" width="150" height="150">
    <button class="buy-btn" data-id="${this.id}">В корзину</button>
  </div>`;
  }
  addToBasket() {
    let haveItem = false;
    for (let good of cartList.itemsCart) {
      if (good.item.id == this.id) {
        haveItem = true;
        good.number++;
        break;
      }
    }
    if (haveItem == false) {
      cartList.itemsCart.push(new itemCart(this, 1));
    }
  }
}
class itemsList {
  constructor() {
    this.items = [
      new item("01", "Shirt", 150, "shirt.jpg"),
      new item("02", "Socks", 50, "Socks.jpg"),
      new item("03", "Jacket", 350),
      new item("04", "Shoes", 250),
    ];
  }
  async getData() {
    let url =
      "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json";
    let response = await fetch(url);
    let commits = await response.text(); // читаем ответ в формате JSON
    this.items = JSON.parse(commits);
    list.renderList();
  }

  renderList() {
    let listHtml = "";
    for (let item of this.items) {
      listHtml += item.renderItem();
    }
    document.querySelector(".products").innerHTML = listHtml;
  }
}
class itemCart {
  constructor(item, number) {
    this.item = item;
    this.number = number;
  }
  renderItemCart() {
    return `
    <div class="cart-item">
      <h3>${this.item.title}</h3>
      <p>Цена ${this.item.price} дублонов</p>
      <p>Количество ${this.number}</p>
      <img src="img/${this.item.img}" width="100" height="100">
      <button class="add-btn" data-id="${this.item.id}">Добавить</button>
      <button class="del-btn" data-id="${this.item.id}">Удалить</button>
    </div>
    `;
  }
  addInBasket() {
    this.number++;
    cartList.renderList();
  }
  delFromBasket() {
    if (this.number > 1) {
      this.number--;
      cartList.renderList();
    } else {
      let index = 0;
      let id = this.item.id;
      for (let item of cartList.itemsCart) {
        if (id == item.item.id) {
          cartList.itemsCart.splice(index, 1);
          cartList.renderList();
          break;
        }
        index++;
      }
    }
  }
}
class itemsCartList {
  constructor() {
    this.itemsCart = [];
  }
  renderList() {
    let listHtml = `<h2 class="cart-h2">Корзина</h2>`;
    let sum = 0;
    for (let item of this.itemsCart) {
      listHtml += item.renderItemCart();
      sum += item.item.price * item.number;
    }
    listHtml += `<p class="psum">Итого на сумму ${sum} дублонов</p>`;
    document.querySelector(".cart").innerHTML = listHtml;
  }
}
const list = new itemsList();
list.getData();

const cartList = new itemsCartList();
document.querySelector(".products").addEventListener("click", bayItem);
function bayItem(e) {
  if (e.target.classList.contains("buy-btn")) {
    let id = e.target.dataset["id"];
    for (let good of list.items) {
      if (id == good.id) {
        good.addToBasket();
        break;
      }
    }
    console.log(cartList);
  }
}
document.querySelector(".btn-cart").addEventListener("click", () => {
  let cart = document.querySelector(".cart");
  if (cart.classList.contains("invisible")) {
    cart.classList.remove("invisible");
    cart.classList.add("visible");
    document.querySelector(".products").removeEventListener("click", bayItem);
    cartList.renderList();
  } else {
    cart.classList.remove("visible");
    cart.classList.add("invisible");
    document.querySelector(".products").addEventListener("click", bayItem);
  }
});
document.querySelector(".cart").addEventListener("click", changeOrder);
function changeOrder(e) {
  if (e.target.classList.contains("add-btn")) {
    let id = e.target.dataset["id"];
    for (let good of cartList.itemsCart) {
      if (id == good.item.id) {
        good.addInBasket();
        break;
      }
    }
  }
  if (e.target.classList.contains("del-btn")) {
    let id = e.target.dataset["id"];
    for (let good of cartList.itemsCart) {
      if (id == good.item.id) {
        good.delFromBasket();
        break;
      }
    }
  }
}

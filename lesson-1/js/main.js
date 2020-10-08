// Скрипт не запускался т.к. был указан вверху html кода и без атрибута defer
// Красоту навел, но не судите художника строго, я так вижу мир)))
const items = [
  { title: "Shirt", price: 150, img: "shirt" },
  { title: "Socks", price: 50, img: "Socks" },
  { title: "Jacket", price: 350 },
  { title: "Shoes", price: 250 },
];
// return и скобки не нужны т.к. только одно действие, по умолчанию добавил изображение нет фото
const renderItem = (title, price, img = "noPhoto") =>
  `<div class="product-item">
    <h3>${title}</h3>
    <p>${price} дублонов</p>
    <img src="img/${img}.jpg" width="150" height="150">
    <button class="buy-btn">Купить</button>
  </div>`;
const renderItemList = (list) => {
  const itemsList = list.map((item) =>
    renderItem(item.title, item.price, item.img)
  );
  //запятые появлялись потому что их добавляли как разделители элементов массива
  document.querySelector(".products").innerHTML = itemsList.join("");
};
renderItemList(items);

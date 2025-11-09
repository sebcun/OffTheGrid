import { items } from "./config.js";

export function populateShop() {
  const categories = {};
  const categoryNames = new Set();

  Object.keys(items).forEach((key) => {
    const item = items[key];
    categoryNames.add(item.category);
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push({ ...item, id: key });
  });

  const categoriesContainer = document.getElementById("bottom-bar-categories");
  const insidesContainer = document.getElementById("bottom-bar-insides");
  categoriesContainer.innerHTML = "";
  insidesContainer.innerHTML = "";

  Array.from(categoryNames).forEach((category, index) => {
    const tabButton = document.createElement("div");
    tabButton.className = `bottom-bar-category${
      index === 0 ? " selected" : ""
    }`;
    tabButton.textContent = category;
    categoriesContainer.appendChild(tabButton);

    const itemsDiv = document.createElement("div");
    itemsDiv.className = `bottom-bar-category-items${
      index === 0 ? "" : " hidden"
    }`;
    itemsDiv.id = `category-${category.toLowerCase()}`;
    insidesContainer.appendChild(itemsDiv);

    if (categories[category]) {
      itemsDiv.innerHTML = categories[category]
        .map((item) => {
          const parts = [];
          if (item.price.wood) parts.push(`${item.price.wood}wood`);
          if (item.price.stone) parts.push(`${item.price.stone}stone`);
          if (item.price.food) parts.push(`${item.price.food}food`);
          const priceStr = parts.join("|");
          return `
          <div class="item" data-price="${priceStr}" data-id="${item.id}">
            <img src="${item.image}" />
            <span class="title">${item.name}</span>
            <span class="hover">${item.description}</span>
            <div class="price">
              ${
                item.price.wood
                  ? `<img src="img/wood.png" /> <span>${item.price.wood}</span>`
                  : ""
              }
              ${
                item.price.stone
                  ? `<img src="img/stone.png" /> <span>${item.price.stone}</span>`
                  : ""
              }
              ${
                item.price.food
                  ? `<img src="img/dirt.png" /> <span>${item.price.food}</span>`
                  : ""
              }
            </div>
          </div>
        `;
        })
        .join("");
    }

    tabButton.addEventListener("click", () => {
      document
        .querySelectorAll(".bottom-bar-category")
        .forEach((b) => b.classList.remove("selected"));
      tabButton.classList.add("selected");

      document
        .querySelectorAll(".bottom-bar-category-items")
        .forEach((div) => div.classList.add("hidden"));
      itemsDiv.classList.remove("hidden");
    });
  });
}

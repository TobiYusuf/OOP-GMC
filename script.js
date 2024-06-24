class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class ShoppingCartItem {
  constructor(product, quantity, liked = false) {
    this.product = product;
    this.quantity = quantity;
    this.liked = liked;
  }

  getTotalPrice() {
    return this.product.price * this.quantity;
  }

  toggleLike() {
    this.liked = !this.liked;
  }
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = new ShoppingCartItem(product, quantity);
      this.items.push(newItem);
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  updateQuantity(productId, action) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (action === "increase") {
        item.quantity += 1;
      } else if (action === "decrease" && item.quantity > 1) {
        item.quantity -= 1;
      }
    }
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  displayCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    this.items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add(
        "flex",
        "items-center",
        "justify-between",
        "p-4",
        "border-b"
      );

      itemDiv.innerHTML = `
                <div class="flex items-center space-x-4">
                    <button class="heart-btn ${
                      item.liked ? "liked" : ""
                    }" data-id="${item.product.id}">
                        <img src="./img/${
                          item.liked ? "heart-fill" : "heart"
                        }.png" class="love-icon"/>
                    </button>
                    <h2 class="text-xl">${item.product.name}</h2>
                </div>

                <div class="flex items-center space-x-4">
                    <button class="quantity-btn" data-id="${
                      item.product.id
                    }" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${
                      item.product.id
                    }" data-action="increase">+</button>
                    <span>$${item.getTotalPrice().toFixed(2)}</span>
                    <button class="delete-btn" data-id="${
                      item.product.id
                    }">🗑️</button>
                </div>
            `;

      cartContainer.appendChild(itemDiv);
    });

    document.getElementById("total-price").innerText =
      this.getTotalPrice().toFixed(2);
  }

  toggleLike(productId) {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      item.toggleLike();
    }
  }
}

// Initialize shopping cart
const cart = new ShoppingCart();

// Example items
const product1 = new Product(1, "Item 1", 19.99);
const product2 = new Product(2, "Item 2", 9.99);
const product3 = new Product(3, "Item 3", 14.99);

// Add example items to cart
cart.addItem(product1, 1);
cart.addItem(product2, 2);
cart.addItem(product3, 1);

// Render cart
cart.displayCart();

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("quantity-btn")) {
    const id = parseInt(event.target.dataset.id);
    const action = event.target.dataset.action;
    cart.updateQuantity(id, action);
    cart.displayCart();
  }

  if (event.target.classList.contains("delete-btn")) {
    const id = parseInt(event.target.dataset.id);
    cart.removeItem(id);
    cart.displayCart();
    toggleLikes();
  }

  if (event.target.classList.contains("heart-btn")) {
    const id = parseInt(event.target.dataset.id);
    cart.toggleLike(id);
    cart.displayCart();
    toggleLikes();
  }
});

function toggleLikes() {
  const heartBtns = document.querySelectorAll(".heart-btn");
  heartBtns.forEach((heart) => {
    heart.addEventListener("click", () => {
      let check = `<img src="./img/heart.png" class="love-icon">`;
      if (heart.innerHTML === check) {
        console.log("Checked");
        heart.innerHTML = `<img src="./img/heart-fill.png" class="love-icon"/>`;
      } else {
        heart.innerHTML = `<img src="./img/heart.png" class="love-icon"/>`;
      }
      console.log(heart.innerHTML);
    });
  });
}

document.addEventListener("DOMContentLoaded", toggleLikes);

document.getElementById("add-item-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("item-name").value;
  const price = parseFloat(document.getElementById("item-price").value);
  const quantity = parseInt(document.getElementById("item-quantity").value);

  const newItem = new Product(
    cart.items.length ? cart.items[cart.items.length - 1].product.id + 1 : 1,
    name,
    price
  );

  cart.addItem(newItem, quantity);

  cart.displayCart();
  toggleLikes();

  // Clear form
  document.getElementById("item-name").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-quantity").value = "";
});

cart.displayCart();

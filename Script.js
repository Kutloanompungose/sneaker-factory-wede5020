"use strict";

/* =====================================
   SNEAKER FACTORY - PART 3 JAVASCRIPT
   ===================================== */

// Product information is read from the HTML.
const productCards = document.querySelectorAll(".product-card");

// Website state
let selectedCategory = "all";
let cart = loadFromStorage("sneakerCart", []);
let wishlist = loadFromStorage("sneakerWishlist", []);
let currentUser = null;


/* =====================================
   LOCAL STORAGE HELPER FUNCTIONS
   ===================================== */

function loadFromStorage(key, fallback) {
    try {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : fallback;
    } catch (error) {
        console.error("Could not read saved website data:", error);
        return fallback;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Could not save website data:", error);
    }
}


/* =====================================
   PRODUCT SEARCH AND CATEGORY FILTERS
   ===================================== */

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const noProducts = document.getElementById("noProducts");
const productResults = document.getElementById("productResults");

function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleProducts = 0;

    productCards.forEach((card) => {
        const productName = card.dataset.name.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        const shouldDisplay = matchesSearch && matchesCategory;

        card.hidden = !shouldDisplay;

        if (shouldDisplay) {
            visibleProducts++;
        }
    });

    noProducts.hidden = visibleProducts !== 0;

    productResults.textContent =
        `${visibleProducts} sneaker${visibleProducts === 1 ? "" : "s"} found.`;
}

// Search updates results while the user types.
searchInput.addEventListener("input", filterProducts);

// Category buttons update the selected category.
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        // Search and category filters work together.
        filterProducts();
    });
});


/* =====================================
   PRODUCT COLOUR SELECTION
   ===================================== */

document.querySelectorAll(".color-swatches").forEach((swatchGroup) => {
    swatchGroup.addEventListener("click", (event) => {
        const clickedSwatch = event.target.closest(".color-swatch");

        if (!clickedSwatch) return;

        swatchGroup.querySelectorAll(".color-swatch").forEach((swatch) => {
            swatch.classList.remove("selected");
        });

        clickedSwatch.classList.add("selected");
    });
});

function getSelectedColour(productCard) {
    const selectedSwatch = productCard.querySelector(".color-swatch.selected");

    if (!selectedSwatch) return "Black";

    if (selectedSwatch.classList.contains("white")) return "White";
    if (selectedSwatch.classList.contains("red")) return "Red";

    return "Black";
}


/* =====================================
   SHOPPING CART
   ===================================== */

const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function addToCart(productCard) {
    const name = productCard.dataset.name;
    const priceText = productCard.querySelector(".price").textContent;
    const price = Number(priceText.replace(/[^\d]/g, ""));
    const size = productCard.querySelector(".size-select").value;
    const colour = getSelectedColour(productCard);

    if (!size) {
        alert("Please select a UK shoe size before adding this sneaker to your cart.");
        productCard.querySelector(".size-select").focus();
        return;
    }

    const existingItem = cart.find((item) =>
        item.name === name &&
        item.size === size &&
        item.colour === colour
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name,
            price,
            size,
            colour,
            quantity: 1
        });
    }

    saveToStorage("sneakerCart", cart);
    renderCart();

    alert(`${name} has been added to your cart.`);
}

function renderCart() {
    cartItemsContainer.replaceChildren();

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your shopping cart is empty.";
        cartItemsContainer.appendChild(emptyMessage);
    }

    cart.forEach((item) => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const information = document.createElement("p");
        information.textContent =
            `UK ${item.size} | ${item.colour} | Quantity: ${item.quantity}`;

        const price = document.createElement("p");
        price.textContent = formatCurrency(item.price * item.quantity);

        details.append(name, information, price);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            removeCartItem(item.id);
        });

        itemElement.append(details, removeButton);
        cartItemsContainer.appendChild(itemElement);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatCurrency(total);
}

function removeCartItem(itemId) {
    cart = cart.filter((item) => item.id !== itemId);

    saveToStorage("sneakerCart", cart);
    renderCart();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).format(amount);
}

document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".product-card");
        addToCart(productCard);
    });
});

document.getElementById("cartButton").addEventListener("click", () => {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
});

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Add a sneaker before checking out.");
        return;
    }

    alert(
        "This is a student project demonstration. " +
        "No order or payment has been processed."
    );
});


/* =====================================
   WISHLIST
   ===================================== */

const wishlistPanel = document.getElementById("wishlistPanel");
const wishlistItemsContainer = document.getElementById("wishlistItems");
const wishlistCount = document.getElementById("wishlistCount");

function toggleWishlist(productCard, button) {
    const name = productCard.dataset.name;
    const priceText = productCard.querySelector(".price").textContent;
    const price = Number(priceText.replace(/[^\d]/g, ""));

    const existingIndex = wishlist.findIndex((item) => item.name === name);

    if (existingIndex >= 0) {
        wishlist.splice(existingIndex, 1);
        button.classList.remove("active");
        button.textContent = "♡";
    } else {
        wishlist.push({ name, price });
        button.classList.add("active");
        button.textContent = "♥";
    }

    saveToStorage("sneakerWishlist", wishlist);
    renderWishlist();
}

function renderWishlist() {
    wishlistItemsContainer.replaceChildren();

    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your wishlist is empty.";
        wishlistItemsContainer.appendChild(message);
    }

    wishlist.forEach((item) => {
        const row = document.createElement("div");
        row.className = "wishlist-item";

        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatCurrency(item.price);

        details.append(name, price);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            wishlist = wishlist.filter((product) => product.name !== item.name);
            saveToStorage("sneakerWishlist", wishlist);
            renderWishlist();
            updateWishlistButtons();
        });

        row.append(details, removeButton);
        wishlistItemsContainer.appendChild(row);
    });
}

function updateWishlistButtons() {
    productCards.forEach((card) => {
        const button = card.querySelector(".wishlist-btn");
        const isSaved = wishlist.some((item) => item.name === card.dataset.name);

        button.classList.toggle("active", isSaved);
        button.textContent = isSaved ? "♥" : "♡";
    });
}

document.querySelectorAll(".wishlist-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".product-card");
        toggleWishlist(productCard, button);
    });
});

document.getElementById("wishlistButton").addEventListener("click", () => {
    wishlistPanel.classList.add("open");
    wishlistPanel.setAttribute("aria-hidden", "false");
});

document.getElementById("closeWishlist").addEventListener("click", () => {
    wishlistPanel.classList.remove("open");
    wishlistPanel.setAttribute("aria-hidden", "true");
});


/* =====================================
   DARK MODE
   ===================================== */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
}

const savedTheme = localStorage.getItem("sneakerTheme");
applyTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);
    localStorage.setItem("sneakerTheme", isDark ? "dark" : "light");
});


/* =====================================
   CONTACT FORM VALIDATION
   ===================================== */

const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

function showFieldError(fieldId, errorId, message) {
    document.getElementById(errorId).textContent = message;
    document.getElementById(fieldId).setAttribute("aria-invalid", message ? "true" : "false");
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value.trim();

    let isValid = true;

    // Clear old error messages.
    showFieldError("contactName", "nameError", "");
    showFieldError("contactEmail", "emailError", "");
    showFieldError("contactSubject", "subjectError", "");
    showFieldError("contactMessage", "messageError", "");

    if (name.length < 2) {
        showFieldError("contactName", "nameError", "Please enter a name with at least 2 characters.");
        isValid = false;
    }

    if (!isValidEmail(email)) {
        showFieldError("contactEmail", "emailError", "Please enter a valid email address.");
        isValid = false;
    }

    if (!subject) {
        showFieldError("contactSubject", "subjectError", "Please select a subject.");
        isValid = false;
    }

    if (message.length < 10) {
        showFieldError("contactMessage", "messageError", "Your message must contain at least 10 characters.");
        isValid = false;
    }

    if (!isValid) {
        contactFeedback.textContent = "Please correct the highlighted fields.";
        contactFeedback.className = "form-feedback error";
        return;
    }

    contactFeedback.textContent =
        "Thank you! Your message passed validation. This demonstration form does not send messages to a server.";
    contactFeedback.className = "form-feedback success";

    contactForm.reset();
});


/* =====================================
   ACCOUNT MODAL AND DEMONSTRATION LOGIN
   ===================================== */

const accountModal = document.getElementById("accountModal");
const profileModal = document.getElementById("profileModal");
const accountButton = document.getElementById("accountButton");

function openModal(modal) {
    modal.classList.add("open");
}

function closeModal(modal) {
    modal.classList.remove("open");
}

accountButton.addEventListener("click", () => {
    if (currentUser) {
        document.getElementById("profileName").textContent =
            `Name: ${currentUser.name}`;

        document.getElementById("profileEmail").textContent =
            `Email: ${currentUser.email}`;

        openModal(profileModal);
    } else {
        openModal(accountModal);
    }
});

document.getElementById("closeAccount").addEventListener("click", () => {
    closeModal(accountModal);
});

document.getElementById("closeProfile").addEventListener("click", () => {
    closeModal(profileModal);
});

accountModal.addEventListener("click", (event) => {
    if (event.target === accountModal) closeModal(accountModal);
});

profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) closeModal(profileModal);
});

// Switch between the sign-in and registration forms.
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden-form");
    registerForm.classList.add("hidden-form");
});

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden-form");
    loginForm.classList.add("hidden-form");
});

// Demonstration registration.
// No password is stored in localStorage.
let demonstrationAccount = null;

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const error = document.getElementById("registerError");

    error.textContent = "";

    if (name.length < 2) {
        error.textContent = "Please enter your full name.";
        return;
    }

    if (!isValidEmail(email)) {
        error.textContent = "Please enter a valid email address.";
        return;
    }

    if (password.length < 8) {
        error.textContent = "Your password must contain at least 8 characters.";
        return;
    }

    // Keep only the demonstration user's name and email.
    // The password is deliberately not saved.
    demonstrationAccount = { name, email };

    currentUser = { name, email };

    alert("Demonstration account created successfully.");

    registerForm.reset();
    closeModal(accountModal);
    accountButton.textContent = "My Account";
});

// Demonstration sign-in.
// This is not real authentication.
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const error = document.getElementById("loginError");

    error.textContent = "";

    if (!isValidEmail(email)) {
        error.textContent = "Please enter a valid email address.";
        return;
    }

    if (!password) {
        error.textContent = "Please enter your password.";
        return;
    }

    if (!demonstrationAccount || demonstrationAccount.email !== email) {
        error.textContent =
            "No demonstration account found for this email. Please register first.";
        return;
    }

    currentUser = demonstrationAccount;

    loginForm.reset();
    closeModal(accountModal);
    accountButton.textContent = "My Account";

    alert(`Welcome back, ${currentUser.name}!`);
});

document.getElementById("logoutButton").addEventListener("click", () => {
    currentUser = null;

    closeModal(profileModal);
    accountButton.textContent = "Account";

    alert("You have signed out.");
});


/* =====================================
   BACK TO TOP BUTTON
   ===================================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 350);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* =====================================
   FOOTER YEAR
   ===================================== */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


/* =====================================
   INITIALISE WEBSITE
   ===================================== */

function initialiseWebsite() {
    renderCart();
    renderWishlist();
    updateWishlistButtons();
    filterProducts();
}

initialiseWebsite();

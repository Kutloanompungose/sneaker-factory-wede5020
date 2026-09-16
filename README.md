# Sneaker Factory

A responsive sneaker e-commerce website built for the WEDE5020 Web Development module Portfolio of Evidence (PoE).

## Project Overview

Sneaker Factory is a single-page website for a fictional sneaker retailer. It includes a product catalogue with search and filtering, a shopping cart, a wishlist, a front-end sign-in/register system, and dark mode support.

## Technologies Used

- **HTML5** — semantic page structure
- **CSS3** — external stylesheet (`style.css`), CSS Grid and Flexbox for layout, CSS custom properties (variables) for theming, media queries for responsive design
- **JavaScript (vanilla)** — DOM manipulation, event handling, `localStorage` for client-side persistence
- **Google Fonts** — Bebas Neue (headings/branding) and Poppins (body text)

## File Structure

```
sneaker-factory/
├── index.html        # Main page: markup + JavaScript
├── style.css          # External stylesheet
├── court-pro.jpg       # Local product image
└── README.md          # This file
```

All three files must sit in the same folder — `index.html` links to `style.css` with a relative path, and references `court-pro.jpg` the same way.

## How to Run

1. Download/clone all files into a single folder.
2. Open `index.html` directly in a browser, **or** open the folder in VS Code and use the Live Server extension for auto-refresh while editing.
3. An internet connection is needed on first load to fetch Google Fonts and the remaining Unsplash-hosted product images.

## Technical Documentation

### CSS Architecture

- **Reset:** a universal `*` selector zeroes margin/padding and applies `box-sizing: border-box` for predictable sizing.
- **Theming:** colours are defined as CSS custom properties on `:root` (`--bg-main`, `--bg-surface`, `--text-main`, `--text-muted`, `--text-soft`, `--border-color`). A `body.dark-mode` block overrides these variables, so every themed element repaints automatically when dark mode is toggled — no per-element dark-mode rules needed.
- **Layout:** CSS Grid is used for the product grid, footer grid, and two-column sections (About, New Releases, Contact). Flexbox is used for the navbar, filter buttons, and shop controls.
- **Responsiveness:** two breakpoints (`max-width: 1000px` and `max-width: 700px`) collapse the multi-column grid layouts to single columns and adjust the navbar/hero sizing for tablet and mobile.

### JavaScript Features

| Feature | How it works |
|---|---|
| **Product filter** | `filterProducts(category, button)` shows/hides `.product-card` elements by comparing the clicked category to each card's `data-category` attribute. |
| **Product search** | `searchProducts()` reads the search input and hides any product whose `data-name` doesn't match. |
| **Shopping cart** | `addToCart()` pushes an item (name, price, size, colour) into an in-memory `cart` array and re-renders the cart panel via `updateCart()`. |
| **Size & colour selection** | Each product card has a UK size dropdown (4–11) and three colour swatches (Black/White/Red). `addToCartFromCard()` reads the selected values from the closest `.product-card` before calling `addToCart()`. |
| **Wishlist** | `toggleWishlist()` adds/removes an item from an in-memory `wishlist` array and toggles the heart button's active state. `updateWishlistUI()` re-renders the wishlist panel. |
| **Sign in / Register** | Front-end only authentication demo. Registered accounts are stored as an array in `localStorage` (`sneakerFactoryUsers`). Signing in checks email/password against that array. The currently logged-in user is stored separately (`sneakerFactoryUser`) so the session persists across page reloads. **This is not a real backend** — it demonstrates the UX flow only, and is not secure for production use. |
| **Profile editing** | Once signed in, `openProfileModal()` lets the user update their stored name/email, which updates both the active session and their saved account record. |
| **Add-to-cart login gate** | `addToCart()` checks for a logged-in user before adding an item; if none is found, it opens the sign-in modal and queues the attempted item (`pendingCartItem`), completing the add automatically once login succeeds. |
| **Dark mode** | `toggleDarkMode()` toggles a `dark-mode` class on `<body>` and saves the preference to `localStorage` so it persists on return visits. |
| **Back to top** | A scroll listener shows/hides a floating button once the user scrolls past 400px; clicking it smooth-scrolls to the top. |

### Known Limitations

- Cart and wishlist contents reset on page refresh (only login/theme state persist, via `localStorage`).
- The sign-in/register system is a client-side simulation for demonstration purposes and does not implement real security (e.g. password hashing).

## Changelog

### Part 2 — CSS Styling and Responsive Design

- **Addressed Part 1 feedback:** added this technical documentation section (previously missing) covering architecture, file structure, and feature explanations.
- Extracted the embedded `<style>` block into an external stylesheet (`style.css`), linked via `<link rel="stylesheet">`.
- Fixed a broken product image (dead external link) by replacing it with a locally hosted photo (`court-pro.jpg`).
- Converted core colours to CSS custom properties and added a dark/light mode toggle, persisted via `localStorage`.
- Fixed several dark-mode contrast issues (testimonial author names, filter button borders/text, form inputs) that were unreadable against the dark background.
- Added a wishlist feature: per-product save button, slide-in wishlist panel, remove-item control.
- Added a "back to top" button that appears after scrolling.
- Added a front-end sign-in/register system gating the "Add to Cart" action, plus an editable user profile.
- Added Google Fonts (Bebas Neue for headings, Poppins for body text) for stronger brand identity.
- Added UK size (4–11) and colour (Black/White/Red) selection per product, reflected in the cart display.

### Part 1 — HTML Foundation

- Initial site structure: navigation, hero section, shop/product grid, about section, new releases, testimonials, contact form, footer.
- Basic shopping cart and product filter/search functionality.

## References

- Google Fonts. Available at: https://fonts.google.com (Bebas Neue, Poppins) [Accessed 2026].
- Unsplash. Available at: https://unsplash.com (stock product/lifestyle photography) [Accessed 2026].
- Puma. Product photography sourced for local product image (Court Pro). Available at: https://www.puma.com [Accessed 2026].

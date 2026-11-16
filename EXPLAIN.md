# ShopKart — Interview Guide

This file is for you, Pratiksha — so you can explain this project easily in an interview. Everything is in easy English.

## What is this project?

ShopKart is a small e-commerce store. Users can see products, search and filter by category, add items to the cart, and place an order with a checkout form.

**Tech:** Angular 22, TypeScript (strict mode), RxJS, Reactive Forms, Fake Store API (a free public API — `fakestoreapi.com`), localStorage. No backend, no UI library — all hand-written SCSS.

## Folder structure

```
src/app/
├── core/            → models + services (the "brain" of the app)
│   ├── models/      → Product, CartItem (only type definitions)
│   └── services/    → ProductService, CartService
├── features/        → each page in its own folder
│   ├── shop/        → product list + product detail
│   ├── cart/        → cart page
│   └── checkout/    → checkout form + success screen
├── shared/          → header, footer, product-card, spinner, 404 page
├── app.routes.ts    → all routes + lazy loading
└── app.config.ts    → HttpClient setup
```

## What does each service do?

### ProductService (`core/services/product.service.ts`)
- **Work:** It gets products from the Fake Store API with `HttpClient.get()`.
- **Special point:** It uses `shareReplay` — the API is called only one time, then the result stays in cache. Every component does not call the API again.
- **Search:** The search box uses `valueChanges` with `debounceTime(300)` — the search does not run on every letter. It waits 300ms and then filters one time. The category filter works with it using `combineLatest`.

### CartService (`core/services/cart.service.ts`)
- **Work:** It manages all cart data — add, remove, change quantity, total price, item count.
- **How it works:**
  - One `BehaviorSubject<CartItem[]>` is there — this is the single source of truth for the cart.
  - Header badge (`itemCount$`), cart page, checkout summary — all of them get data from this with the `async` pipe. When data changes in one place, it updates everywhere.
  - On every change, the cart is saved in **localStorage**, and it loads again on page refresh. So the cart does not become empty after refresh.
  - `total$` and `itemCount$` are derived streams made with the `map` operator. No separate state is kept for them.

## Routes and lazy loading

- `/` → product list (shop)
- `/product/:id` → product detail
- `/cart` → cart page
- `/checkout` → checkout form
- wrong URL → 404 page

**Lazy loading:** shop, cart, checkout load in separate chunks (`loadChildren`). Only the code for the home page downloads first (initial bundle ~79 kB). This is good for performance — this point sounds good in an interview.

## Checkout form

It is a Reactive Form with validation:
- Name, email, address, city — required
- ZIP — 5–6 digits
- Card number — 16 digits, expiry MM/YY, CVV 3–4 digits
- On submit, an order id is made (`ORD-...`), a success screen shows, and the cart becomes empty.
- Payment is **mocked** — there is no real payment gateway. This is written clearly in the README.

## Interview questions (with short answers)

**Q: How did you manage state? Why not NgRx?**
A: "This is a small app, so NgRx was not needed. I kept the cart state in a BehaviorSubject in CartService — single source of truth, and all components subscribe with the async pipe. NgRx is for big apps where state is complex."

**Q: Why BehaviorSubject, not Subject?**
A: "A BehaviorSubject has a current value — a new subscriber gets the latest cart at once. A plain Subject gives only future values, not old data."

**Q: Why does the API data not fetch again and again?**
A: "I cached the response with shareReplay — after the first call, every subscriber gets the same cached data."

**Q: Why debounceTime in search?**
A: "Running the filter on every keystroke is a waste. We wait 300ms and then filter, so the UI does not freeze while the user types."

**Q: How does the cart stay after refresh?**
A: "On every change we save it in localStorage, and on app start we load it back with loadFromStorage. If the data is corrupt, we check it and ignore it."

**Q: What is the benefit of lazy loading?**
A: "The first bundle stays small, so the page loads fast. The cart or checkout code downloads only when the user goes to that page."

## How to run

```bash
npm install
npm start        # http://localhost:4200
npm run build    # production build check
```

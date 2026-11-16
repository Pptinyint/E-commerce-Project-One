# ShopKart — Angular E-Commerce Storefront

A complete, responsive e-commerce storefront built with **Angular 22** (standalone
components, lazy-loaded feature routes) and **TypeScript (strict mode)**.
Product data comes from the public [Fake Store API](https://fakestoreapi.com).

## Features

- **Product list** — products loaded from the Fake Store API via `HttpClient` + RxJS,
  with a loading spinner and an error state if the API is unreachable.
- **Live search + category filter** — search box debounced with RxJS `debounceTime(300)`.
- **Product detail page** (`/product/:id`) — full details, rating, quantity selector,
  add to cart.
- **Cart** — `CartService` built on a `BehaviorSubject`; add / remove / update
  quantity, totals computed with RxJS, cart badge in the header via the `async` pipe.
  The cart **persists in `localStorage`**, so a refresh does not empty it.
- **Checkout** — reactive form with validation (name, email, address, ZIP, mock card
  details). On submit it shows an order-success screen with a generated order id and
  clears the cart. Payment is mocked — no real charge is ever made.
- **Header + footer**, and a proper **404 page** for unknown routes.
- **Lazy loading** — shop, cart and checkout are separate feature routes loaded on
  demand (`loadChildren`), so the initial bundle stays small.

## Tech stack

- Angular 22 (standalone components, Angular Router, Reactive Forms)
- TypeScript (strict mode), RxJS 7
- HttpClient + Fake Store API
- SCSS (hand-written, no UI library), fully responsive

## How to run

```bash
npm install
ng serve
```

Then open http://localhost:4200. The app reloads automatically when you change a file.

## Production build

```bash
ng build
```

The output goes to `dist/e-commerce-project-one/browser`.

## Folder structure

```
src/app/
├── app.ts / app.html / app.routes.ts / app.config.ts   # app shell + lazy routes
├── core/
│   ├── models/        # Product, CartItem interfaces
│   └── services/      # ProductService (HttpClient), CartService (BehaviorSubject + localStorage)
├── features/
│   ├── shop/          # product list (search + filter) and product detail
│   ├── cart/          # cart page
│   └── checkout/      # checkout form + order success
└── shared/
    └── components/    # header, footer, product-card, spinner, not-found
```

## Notes

- Product data, images and prices come from https://fakestoreapi.com — a free
  public demo API. No account or API key is needed.
- Checkout is a **mock**: it validates the form and generates an order id, but it
  never charges a card or sends data anywhere.

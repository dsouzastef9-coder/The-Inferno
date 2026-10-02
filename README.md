# The Inferno Merchandise

A complete responsive front-end storefront for **The Inferno Merchandise**.

## Included

- Responsive home page
- Product catalog with 8 sample products
- Category filtering
- Product sorting
- Search
- Shopping cart
- Quantity controls
- LocalStorage cart persistence
- Demo checkout form
- Newsletter signup UI
- Mobile navigation
- Dark / fire-inspired visual system
- No build tools required

## Run locally

### Option 1 — easiest
Double-click `index.html`.

### Option 2 — local server
If you have Python installed:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## Important before going live

This package is a front-end storefront. The checkout intentionally does **not** charge money.

For a production store, connect:

1. A backend/API for orders
2. A database such as MongoDB or PostgreSQL
3. Razorpay or Stripe for payments
4. Product image hosting/storage
5. Authentication for an admin dashboard
6. Real shipping/tax calculations
7. Order email/SMS notifications
8. HTTPS and production hosting

## Where to edit products

Open `script.js` and edit the `products` array near the top.

Each product has:

- `id`
- `name`
- `category`
- `price`
- `badge`
- `visual`
- `bg`

You can later replace the generated visual placeholders with real product image URLs.

## Suggested next production step

Convert this front end into a React/Node.js application and connect Razorpay + MongoDB. That will turn the demo store into a real e-commerce system.

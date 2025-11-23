# Products API

Base URL: `/api/products`

## Authentication

- Upload requires `Authorization: Bearer <JWT>` with `role` of `admin` or `executive`.

## Upload Product

- `POST /api/products`
- Content-Type: `multipart/form-data`
- Fields:
  - `name` (string, required)
  - `description` (string)
  - `price` (number, required)
  - `categories` (string or array of strings)
  - `stock` (number)
  - `sku` (string)
  - `images` (file[], up to 6, jpeg/png/webp, ≤5MB each)
- Response: `201 Created`
```json
{
  "_id": "...",
  "name": "Product",
  "description": "...",
  "price": 9.99,
  "categories": ["Electronics"],
  "images": [{ "url": "/uploads/123_image.png", "alt": "Product" }],
  "stock": 0,
  "sku": "SKU123",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## List Products

- `GET /api/products?page=1&limit=20&q=search&sort=-createdAt`
- Response: `200 OK`
```json
{
  "items": [ { "_id": "...", "name": "...", "price": 9.99, "images": [ { "url": "/uploads/..." } ] } ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

## Get Product

- `GET /api/products/:id`
- Response: `200 OK` with product or `404`.

## Filter by Category

- `GET /api/products/category/:category?page=1&limit=20`
- Response: list payload as above.

## CORS

- Allowed origin: `CLIENT_URL` env or `http://localhost:5173`.

## Errors

- Standard JSON: `{ "message": "error text" }` with appropriate status codes.


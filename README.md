# Inventory Management System API

A robust REST API for managing warehouse inventory with stock tracking capabilities.

## Features

- ✅ Full CRUD operations for products
- ✅ Stock management with validation
- ✅ Low stock threshold alerts
- ✅ Comprehensive error handling
- ✅ Unit tests with edge cases
- ✅ MVVC (Model-View-ViewModel-Controller) architecture

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Jest (Testing)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`)
4. Start MongoDB
5. Run the application:
```bash
npm run dev
```

## Testing

Run tests with coverage:
```bash
npm test
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Stock Management
- `PATCH /products/:id/add-stock` - Add stock
- `PATCH /products/:id/remove-stock` - Remove stock
- `GET /products/low-stock` - Get low stock products

## License

MIT
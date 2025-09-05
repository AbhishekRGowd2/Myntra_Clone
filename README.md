🛒 Myntra Clone Backend

This is the backend service for the Myntra Clone project, built with Node.js, Express, and MongoDB (Mongoose).
It provides APIs for product management, cart operations, and includes Swagger-based API documentation.

🚀 Features

Product APIs

Fetch all products with filters, search, sorting, and pagination

Get product details by ID

Seed products from DummyJSON
 into MongoDB

Cart APIs

Get a user’s cart (auto-creates if not exists)

Add products to the cart

Update item quantity (including remove on quantity 0)

Remove items from the cart

Swagger Documentation
Available at:

Local: http://localhost:5000/api/docs

Deployed: https://myntra-clone-ulcv.onrender.com/api/docs



CORS enabled

📂 Project Structure
├── config/
│   └── db.js              # Database connection
├── controller/
│   ├── cartController.js  # Cart operations
│   └── productController.js # Product operations
├── models/
│   ├── cart.js            # Cart schema
│   └── product.js         # Product schema
├── routes/
│   ├── cartRoutes.js      # Cart routes
│   └── productRoutes.js   # Product routes
├── seed/
│   └── seedProducts.js    # Product seeding from DummyJSON
├── tests/
│   ├── cartController.test.js
│   └── productController.test.js
├── server.js              # Express app entry point
└── package.json

⚙️ Setup Instructions

Clone the repo

git clone https://github.com/AbhishekRGowd2/Myntra_Clone.git
cd myntra-clone-backend


Install dependencies

npm install


Set up environment variables in .env

PORT=5000
MONGO_URI=mongodb+srv://abhiram201196:7HPj0SXENliYkDG4@almabetter.6zo2l.mongodb.net/myntra?retryWrites=true&w=majority&appName=AlmaBetter


Start the server

npm start


Run tests

npm test

🌐 API Endpoints
Products

GET /api/products → Fetch all products (filters: q, category, brand, minPrice, maxPrice, sort, page, limit)

GET /api/products/:id → Fetch product details by ID

Cart

GET /api/cart/:userId → Get cart for a user

POST /api/cart/:userId/add → Add item to cart

PUT /api/cart/:userId/update → Update quantity of an item

DELETE /api/cart/:userId/remove/:productId → Remove item from cart

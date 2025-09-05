Myntra Clone

A modern e-commerce web application built with React, Redux, Firebase Authentication, and TailwindCSS, replicating core functionalities of Myntra. This project demonstrates a full-featured shopping experience including product browsing, search, cart management, and secure phone-based login/signup.

NOTE : Please use '+915555555555' as phone number and '555555' as OTP for login and signup

Features :

🛒 Shopping :

Browse products fetched from an API.

Detailed product pages with:

Images, brand, description, price, stock, dimensions, and reviews.

Add to cart with quantity management.

Dynamic pricing and discount display.

🔍 Search :

Live search suggestions with clickable results.

Clear search functionality with a user-friendly UI.

🛍 Cart Management :

Add, increment, decrement, and remove items.

Display total price dynamically.

Redirect to login if user is not authenticated.

Proceed to checkout placeholder.

👤 Authentication :

Firebase Phone OTP Authentication for login and signup.

Secure Recaptcha integration.

Dynamic user dropdown with logout option.

🧩 Components :

Navbar: Responsive header with logo, cart, and user actions.

Hero: Landing page hero section with call-to-action.

Footer: Simple responsive footer.

⚡ State Management :

Redux Toolkit slices for:

authSlice: Login, signup, logout.

cartSlice: Cart items with quantity management.

productSlice: Fetch and manage product data from API.

🧪 Testing :

Jest & React Testing Library for unit tests:

Cart functionality (Cart.test.js)

Product listing and details (Products.test.js, ProductDetails.test.js)

Authentication flows (Login.test.js, Signup.test.js)

Tech Stack

Frontend: React, React Router, TailwindCSS

State Management: Redux Toolkit

Authentication: Firebase Phone OTP

Icons: Lucide React

Testing: Jest, React Testing Library

API: Dummy JSON Products API (https://dummyjson.com/products)

Installation :

Clone the repo
git clone https://github.com//myntra-clone.git cd myntra-clone

Install dependencies
npm install

Start development server
npm run dev

Usage :

Browse products on the homepage or via /products.

Click a product to view details, add it to cart, and manage quantity.

Sign up or login using your phone number.

Access the cart to view total and proceed to checkout.




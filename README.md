Myntra Clone

A modern e-commerce web application built with React, Redux, Firebase Authentication, and TailwindCSS, replicating core functionalities of Myntra. This project demonstrates a full-featured shopping experience including product browsing, search, cart management, and secure phone-based login/signup.

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

# Clone the repo
git clone https://github.com/<your-username>/myntra-clone.git
cd myntra-clone

# Install dependencies
npm install

# Start development server
npm run dev

Usage : 

Browse products on the homepage or via /products.

Click a product to view details, add it to cart, and manage quantity.

Sign up or login using your phone number.

Access the cart to view total and proceed to checkout.

Screenshots : 
Home Page : 
<img width="1912" height="965" alt="image" src="https://github.com/user-attachments/assets/0578e351-80df-4311-89ae-b3fa81348081" />
Browse Products : 
<img width="1908" height="895" alt="image" src="https://github.com/user-attachments/assets/73bf655e-611d-40c1-b956-46af8722da09" />
Search Functionality : 
<img width="1908" height="887" alt="image" src="https://github.com/user-attachments/assets/3264f575-bd84-41f5-998c-f0d2f65d66e7" />
Product Details : 
<img width="1907" height="890" alt="image" src="https://github.com/user-attachments/assets/a521a661-3183-47f6-a212-2073e11b6ac3" />
Login and Otp : 
<img width="692" height="737" alt="image" src="https://github.com/user-attachments/assets/6d0a2b79-96de-4bbd-9fc1-40f62abbf9ff" />
Cart : 
<img width="1057" height="400" alt="image" src="https://github.com/user-attachments/assets/e4635f48-7f76-422b-9de7-5c8b02fe35e0" />
Extras : 
<img width="760" height="151" alt="image" src="https://github.com/user-attachments/assets/189f0b80-a86a-4125-bcd4-970e5e8b4f85" />








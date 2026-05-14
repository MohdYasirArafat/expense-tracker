# Expense Tracker Backend

A REST API for tracking personal expenses with JWT authentication.

## 🔗 Live Frontend
https://expense-tracker-frontend-zaxy.onrender.com/

## 🛠️ Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT (Access + Refresh Tokens)
- HttpOnly Cookies

## ⚙️ Setup Locally
1. Clone the repo
   git clone https://github.com/MohdYasirArafat/expense-tracker.git
2. Install dependencies
   npm install
3. Create .env file
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
4. Run server
   npm start

## 📌 API Routes

### Auth
- POST /api/user/register
- POST /api/user/login  
- POST /api/user/logout
- POST /api/user/refresh

### Expenses
- GET    /api/expense/list
- POST   /api/expense/add
- PUT    /api/expense/edit/:id
- DELETE /api/expense/delete/:id
- GET    /api/expense/summary
- GET    /api/expense/category

## 🔐 Auth Flow
- Login karne par Access Token (15 min) + Refresh Token (7 days) HttpOnly cookie mein set hota hai
- Access token expire hone par automatically refresh hota hai
- Logout par dono cookies clear ho jaati hain
# Inventory Loan Management API

A simple RESTful API built with Node.js, Express, and SQLite for managing customers, items, and loans in a pawn/inventory loan system.

> 🔗 GitHub Repository: [santhocandy/inventory-loan-api](https://github.com/santhocandy/inventory-loan-api)

---

## 🔧 Features

- JWT-based user authentication
- CRUD for customers, items, and loans
- Soft delete (archive) for items and loans
- Dynamic interest rate and loan duration
- SQLite database (in-memory or persistent)
- Custom logging utility

---

## 📦 Technologies Used

- Node.js
- Express.js
- SQLite3
- bcrypt
- jsonwebtoken

---

## ▶️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/santhocandy/inventory-loan-api.git
cd inventory-loan-api
npm install


JWT_SECRET=your_jwt_secret_key
PORT=3000

Server starts at: http://localhost:3000

⸻
🚀 Run the Server
npm start
🔐 Authentication
Method
Endpoint
Description
POST
/login
Admin login


👤 Customers API

Method
Endpoint
Description
POST
/api/customers
Add customer
GET
/api/customers/:id
Get customer by ID
PUT
/api/customers/:id
Update customer

📦 Items API

Method
Endpoint
Description
POST
/api/items
Add item
GET
/api/items
Get all items
GET
/api/items/:id
Get item by ID
PUT
/api/items/:id
Update item
DELETE
/api/items/:id
Archive item

💸 Loans API
Method
Endpoint
Description
POST
/api/loans
Create loan
GET
/api/loans
List all loans
GET
/api/loans/:id
Get loan by ID
PUT
/api/loans/:id
Update loan status or due
DELETE
/api/loans/:id
Cancel 

📁 Project Structure
inventory-loan-api/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
├── .env
├── .gitignore
├── server.js
└── README.md


💡 Notes
	•	✅ Admin login required for protected routes.
	•	✅ Passwords are hashed with bcrypt.
	•	✅ JWT token needed in headers for APIs.
	•	✅ Loan interest and duration are customizable.


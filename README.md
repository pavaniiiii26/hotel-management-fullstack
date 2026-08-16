# 🍽️ Zesty — Modern Hotel & Restaurant Management System

An editorial, full-stack hotel and restaurant management web application built with **Node.js, Express, MongoDB, and React (Vite)**. Featuring role-based access control (RBAC), real-time kitchen order dispatching, menu management, and team directory views.

https://hotel-management-fullstack-tau.vercel.app/ 

---

## ✨ Features

- 📖 **Digital Customer Menu**: Browse artisanal dishes, view taste profiles and ingredients, and place table orders directly to the kitchen queue.
- 👨‍🍳 **Live Kitchen Queue**: Real-time order tracking for kitchen staff with stage transitions (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
- 🔐 **JWT Authentication & Role-Based Access (RBAC)**: Secure authentication distinguishing between **Staff** and **Manager** roles.
- ➕ **Manager Menu Management**: Centered, responsive interface for managers to add new dishes with image uploads, pricing, taste profiles, and ingredients.
- 👥 **Team Directory**: Filter staff members by role (Chefs, Waiters, Managers) with dynamic pagination.
- 👤 **Protected Profile Management**: Fetch and update personal credentials securely (`/profile/me`) with role escalation safeguards.
- 🛡️ **Production Security**: Security headers via `Helmet`, global and auth rate limiters (`express-rate-limit`), CORS protection, and password hashing using `bcrypt`.

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Passport.js (`passport-local`)
- **Security & Utilities**: `bcrypt`, `helmet`, `cors`, `express-rate-limit`, `multer`

### **Frontend**
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios with request/response interceptors
- **Styling**: Modern Vanilla CSS with Editorial typography and warm taupe/gold design system

---

## 📁 Project Structure

```text
bootcampnodejs/
├── server.js               # Express application entry point & middleware setup
├── db.js                   # MongoDB connection logic
├── jwt.js                  # JWT verification & isManager middleware
├── auth.js                 # Passport local authentication strategy
├── models/                 # Mongoose schemas
│   ├── person.js           # Staff / Manager User model
│   ├── menu.js             # Menu item model
│   └── order.js            # Kitchen order model
├── routes/                 # Express API routes
│   ├── personRoutes.js     # Auth (signup/login) & staff routes
│   ├── profileRoutes.js    # Self-profile management (/profile/me)
│   ├── menuRoutes.js       # Menu CRUD operations (RBAC protected)
│   └── orderRoutes.js      # Kitchen order queue operations
└── frontend/               # React 19 Single Page Application
    ├── src/
    │   ├── api/            # Axios instance & JWT header interceptors
    │   ├── components/     # Editorial Navbar, Protected Route wrappers
    │   ├── context/        # Auth Context & global user state
    │   └── pages/          # Application views (Welcome, Menu, Staff, Kitchen, Login, Signup, Add Menu, Dashboard)
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pavaniiiii26/hotel-management-fullstack.git
   cd hotel-management-fullstack
   ```

2. **Setup Backend Environment**:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mydatabase
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3000
   ```

3. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

4. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 🏃 Running the Application

Open **two terminal windows**:

### Terminal 1: Backend API
```bash
npm start
```
> Server runs on `http://localhost:3000`

### Terminal 2: Frontend App
```bash
cd frontend
npm run dev
```
> App runs on `http://localhost:5173`

---

## 📡 API Endpoints Summary

### **Authentication & Staff (`/person`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/person/signup` | Public | Register new staff or manager |
| `POST` | `/person/login` | Public | Authenticate user & receive JWT |
| `GET` | `/person/:work` | Public | Get staff list by work type (`chef`, `waiter`, `manager`) |

### **Profile Management (`/profile`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile/me` | Authenticated | Get logged-in user profile |
| `PUT` | `/profile/me` | Authenticated | Update logged-in user details (excluding role) |

### **Menu (`/menu`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/menu` | Public / Staff | Get all menu items with pagination |
| `POST` | `/menu` | Manager Only | Add new menu item with photo upload |
| `DELETE` | `/menu/:id` | Manager Only | Delete menu item by ID |

### **Kitchen Orders (`/order`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/order` | Public / Staff | Fetch kitchen order queue |
| `POST` | `/order` | Public / Staff | Submit new order from table |
| `PUT` | `/order/:id/status` | Staff | Update order status |

---

## 👤 Author

Developed by **Pavani Patel**  
📞 Contact: **+91 9588655454**  
✉️ Email: `reservations@zestyrestaurant.com`
 Every decision in this project was made with a real-world use case in mind.

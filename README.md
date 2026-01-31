
# Authentication System

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Demo-brightgreen)](https://authservice-g187.onrender.com)

A full-stack authentication application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring secure email verification and password recovery. 

## ![Preview](./frontend/public/preview.png)


## ✨ Features

- **Secure Signup:** User registration with 6-digit email verification codes generated on the server.
- **Email Services:** Integration with Mailtrap for verification, welcome, and password reset emails.
- **Authentication:** Secure Login and persistent sessions using JWT stored in HTTP-only cookies.
- **Password Recovery:** Full "Forgot Password" and "Reset Password" flow with expiring tokens
- **Global State Management:** Efficient authentication state handling with Zustand.
- **Modern UI:** Interactive components built with Tailwind CSS, Lucide icons, and Framer Motion.




## 🚀 Technologies Used

- **MongoDB:** NoSQL database for storing user accounts and verification tokens.
- **Express:** Backend framework for building the RESTful API.
- **React:** Frontend library for building the user interface.
- **Node.js:** JavaScript runtime environment.
- **Zustand:** Lightweight state management for handling user auth status.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Mailtrap:** Email delivery platform for transactional emails.
- **Vite:** Fast build tool for the React frontend.
  
##  🏁 Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB connection URI (Local or Atlas).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sujal-Dudhe/authentication-system
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd authentication-system
    ```
3.  **Install backend dependencies:**
    ```bash
    npm install
    ```
4.  **Install frontend dependencies:**
    ```bash
    npm install --prefix frontend
    ```
5.  **Create a `.env` file** in the root directory and add your configuration:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

    MAILTRAP_TOKEN=your_mailtrap_token
    MAILTRAP_ENDPOINT=your_mailtrap_endpoint
    MAILTRAP_SENDER_EMAIL=your_sender_email
    MAILTRAP_SENDER_NAME="Auth System"

    CLIENT_URL=http://localhost:5173
    ```

---

### **Run this app locally**

```bash
    npm run build
```

### **Start the app**

```bash
    npm run start
```

---

## 🔧 API Endpoints

The following API endpoints are available:

| Method | Endpoint                          | Description                                   |
| ------ | -------------------------------- | --------------------------------------------- |
| `POST` | `/api/auth/signup`               | Register a new user and send verification mail |
| `POST` | `/api/auth/verify-email`         | Verify user account using 6-digit code         |
| `POST` | `/api/auth/login`                | Login an existing user and set JWT cookie      |
| `POST` | `/api/auth/logout`               | Logout the user and clear auth cookie          |
| `POST` | `/api/auth/forgot-password`      | Send password reset link to email              |
| `POST` | `/api/auth/reset-password/:token`| Reset password using reset token               |
| `GET`  | `/api/auth/check-auth`           | Validate current session and get user data     |

## Project Structure
```
authentication-system/
├── backend/                    # Backend (Node.js/Express)
│   ├── controllers/            # Auth logic (signup, login, reset)
│   ├── db/                     # MongoDB connection
│   ├── mailtrap/               # Email configurations & templates
│   ├── middleware/             # Token verification middleware
│   ├── models/                 # User data models
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Token generation utilities
│   └── index.js                # Server entry point
│
├── frontend/                   # Frontend (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # UI components (Inputs, Strength Meter)
│   │   ├── pages/              # Page views (Dashboard, Login, Signup)
│   │   ├── store/              # Zustand Auth Store
│   │   ├── App.jsx             # Main application logic
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Root dependencies & scripts
└── README.md                   # Project documentation
```

# Budget Management Tracker

The Budget Management Tracker Application is a system that allows users to manage their finances efficiently. It enables authenticated users to record, categorize, and visualize their expenses and income. The backend is built with Node.js, Express.js, and MongoDB, while the frontend is developed in React.js for a seamless user experience.

## Project Overview

The **Budget Management Tracker** enables users to:

- Register and log in securely with JWT authentication.
- Add, edit, and delete transactions (income and expenses).
- Categorize spending and set budgets.
- View analytics and statistics via interactive charts.
- Manage personal profile and financial overview.
- Receive instant feedback through responsive notifications.

### Core Feautures

User Authentication: Registration and login with JWT.
Password hashing using bcrypt.
Expense Management (CRUD): Add, update, delete, and view expenses.
Categorize transactions (e.g., Food, Rent, Transport).
Dashboard: Developed in React.js with Tailwind CSS.
Displays transaction list, totals, and summary charts.
Communicates with the backend using Axios for API calls.
Data Visualization: Simple charts to visualize spending trends using Chart.js.
Email Notifications: Send warning for budget over shoot.

## Folder Structure

Budget-Management-Tracker/
├── backend/ # Node.js + Express + MongoDB backend
│ ├── controllers/ # Handles route logic
│ ├── middleware/ # Authentication and error handling middleware
│ ├── models/ # MongoDB Mongoose schemas
│ ├── routes/ # Express route definitions
│ ├── services/ # Business logic and reusable service functions
│ ├── utils/ # Helper utilities (formatting, validators, etc.)
│ ├── server.js # Main entry point
│ └── .env # Environment variables
│
├── frontend/ # React + Vite frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Individual page views
│ │ ├── services/ # Axios API service layer
│ │ ├── utils/ # Frontend helpers (e.g., token helpers)
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── .env
│
└── README.md

yaml
Copy code

---

## Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | React, Vite, TailwindCSS, Axios, Recharts, React Router |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **Charts** | Recharts for visualizing spending/income |

---

## Backend Setup (`/backend`)

### Create .env file

PORT=8080

### Run backend server

npm run dev
✅ Server running on localhost:8080
✅ MongoDB connected

### Frontend Setup

## Install Dependencies

cd frontend
npm install

## Start frontend

npm run dev

## Running on

localhost:5173

## Common commands

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Run backend (with nodemon)             |
| `npm run start` | Run production backend                 |
| `npm run build` | Build frontend for deployment          |
| `npm run seed`  | (Optional) Seed demo data into MongoDB |

## Future Enhancement

Expense receipt OCR scanning
 Mobile version (React Native)
 AI-powered budget recommendations
 Multi-user group budgeting

## Contributors

Felix Olayinka Osuntola
Echanny Emmanuel Idagu

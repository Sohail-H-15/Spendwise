# 💸 SpendWise — Expense Tracker & Budget Planner

A modern, futuristic MERN stack expense tracker with a premium fintech dashboard UI.

> 🎓 **College Micro Project** — Built with React.js, Node.js, Express.js, MongoDB

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 💰 Add Income | Record salary, freelance, business income |
| 💸 Add Expenses | Track food, transport, shopping, bills |
| 📊 Analytics | Pie chart + Bar chart for spending insights |
| 🧾 History | Filter & view all past transactions |
| 🗑️ Delete | Remove any transaction instantly |
| 📱 Responsive | Works on mobile and desktop |
| 🌙 Dark UI | Futuristic glassmorphism dashboard |

---

## 🛠️ Tech Stack

**Frontend**
- React.js 18
- Tailwind CSS 3
- Framer Motion (animations)
- Recharts (charts)
- Axios (HTTP calls)
- React Icons

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS, dotenv

---

## 📁 Project Structure

```
spendwise/
│
├── server/                    # ← Backend (Express + MongoDB)
│   ├── models/
│   │   └── Transaction.js     # Mongoose schema
│   ├── routes/
│   │   └── transactions.js    # GET, POST, DELETE routes
│   ├── index.js               # Entry point, MongoDB connection
│   ├── .env                   # Environment variables
│   └── package.json
│
└── client/                    # ← Frontend (React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Top navigation bar
    │   │   ├── HeroSection.jsx    # Animated balance display
    │   │   ├── SummaryCards.jsx   # Balance, Income, Expense cards
    │   │   ├── TransactionForm.jsx # Add transaction form
    │   │   ├── TransactionList.jsx # Transaction history + delete
    │   │   └── Analytics.jsx      # Pie + Bar charts
    │   ├── utils/
    │   │   └── api.js             # Axios API calls
    │   ├── App.js                 # Root component
    │   ├── index.js               # React entry point
    │   └── index.css              # Global styles + Tailwind
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Edition)
- npm (comes with Node.js)

---

### Step 1 — Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
# OR run manually:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# OR
mongod
```

---

### Step 2 — Setup Backend

```bash
# 1. Go to the server folder
cd spendwise/server

# 2. Install dependencies
npm install

# 3. Start the server (development mode with auto-reload)
npm run dev

# OR for regular start:
npm start
```

✅ You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Setup Frontend

Open a **new terminal window** and run:

```bash
# 1. Go to the client folder
cd spendwise/client

# 2. Install dependencies
npm install

# 3. Start the React app
npm start
```

✅ The app will open at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a new transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction by ID |

### Example POST body:
```json
{
  "title": "Monthly Salary",
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15"
}
```

---

## 🗄️ MongoDB Schema

```js
{
  title:    String,      // "Grocery Shopping"
  amount:   Number,      // 1250
  type:     String,      // "income" | "expense"
  category: String,      // "Food & Dining"
  date:     Date,        // 2024-01-15
  createdAt: Date,       // auto
  updatedAt: Date        // auto
}
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Background | `#0F172A` (dark navy) |
| Card Surface | `rgba(30,41,59,0.7)` |
| Accent Cyan | `#06B6D4` |
| Income Green | `#22C55E` |
| Expense Red | `#EF4444` |
| Text | `#F8FAFC` |
| Display Font | Outfit (Google Fonts) |
| Body Font | DM Sans (Google Fonts) |
| Mono Font | JetBrains Mono |

---

## 🐛 Troubleshooting

**"Cannot connect to backend"**
→ Make sure the server is running on port 5000 first, then start the client.

**MongoDB connection error**
→ Make sure MongoDB is running. Try `mongod` in a separate terminal.

**Port 3000 already in use**
→ React will ask if you want to use another port — press `Y`.

**"Module not found" errors**
→ Run `npm install` inside both `/server` and `/client` folders.

---

## 👨‍💻 Project Info

- **Project Type:** MERN Stack Micro Project
- **Purpose:** College submission demonstrating full-stack development
- **Complexity:** Beginner-friendly backend, premium frontend UI
- **No auth required** — single user, local MongoDB

---

*Made with ❤️ using React + Express + MongoDB*

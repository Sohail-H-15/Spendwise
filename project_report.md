# 💸 SpendWise — Project Documentation & Report

## 1. Project Overview
**SpendWise** is a modern, futuristic expense tracker and budget planner. It is a full-stack web application designed to help users log their daily income and expenses, visualize their spending habits, and maintain a clear overview of their financial health. 

The application features a premium "fintech" dashboard UI utilizing glassmorphism design principles, dark mode aesthetics, and smooth micro-animations.

---

## 2. Technology Stack (MERN)
The project is built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

### Frontend (Client)
* **Framework:** React.js (v18)
* **Styling:** Tailwind CSS (v3) for utility-first responsive design.
* **Animations:** Framer Motion for smooth page transitions and component rendering.
* **Data Visualization:** Recharts for rendering interactive Pie and Bar charts.
* **HTTP Client:** Axios for making asynchronous API requests to the backend.
* **Icons:** React Icons.

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js for building the RESTful API.
* **Database:** MongoDB (hosted on MongoDB Atlas Cloud).
* **ODM (Object Data Modeling):** Mongoose for defining the database schema and interacting with MongoDB.
* **Middleware:** `cors` (Cross-Origin Resource Sharing) and `dotenv` (environment variable management).

---

## 3. Core Features & Functionality
1. **Financial Dashboard:** Displays a high-level summary of Total Balance, Total Income, and Total Expenses.
2. **Transaction Management:**
   * **Add Income:** Users can log money received (e.g., Salary, Freelance, Business).
   * **Add Expenses:** Users can log money spent across different categories (e.g., Food, Transport, Bills).
3. **Analytics & Visualization:** 
   * A dynamic Pie Chart showing the breakdown of expenses by category.
   * A Bar Chart visualizing income vs. expenses.
4. **Transaction History:** A scrollable list of all past transactions, color-coded by type (green for income, red for expenses).
5. **Delete Functionality:** Users can remove accidental or outdated transactions, instantly updating the charts and balances.

---

## 4. System Architecture & Working Mechanism

The application follows a standard **Client-Server Architecture**:

### A. The Database Layer (MongoDB)
Data is stored in a single collection called `transactions`. The schema is defined as:
* `title` (String): e.g., "Grocery Shopping"
* `amount` (Number): e.g., 1500
* `type` (String): "income" or "expense"
* `category` (String): e.g., "Food & Dining"
* `date` (Date): The date of the transaction
* `createdAt` / `updatedAt` (Timestamps automatically managed by Mongoose)

### B. The Backend API (Express.js)
The backend acts as a bridge between the database and the frontend. It exposes the following REST API endpoints:
* `GET /api/transactions` — Fetches all transactions from the database and sends them to the frontend.
* `POST /api/transactions` — Receives new transaction data from the frontend and saves it to the database.
* `DELETE /api/transactions/:id` — Finds a transaction by its unique ID and removes it from the database.

### C. The Frontend Interface (React.js)
When the user opens the app (`App.js`):
1. **Initial Load:** A `useEffect` hook triggers the `fetchTransactions()` function.
2. **API Call:** Axios sends an HTTP GET request to the backend.
3. **State Update:** The backend returns the JSON array of transactions. React stores this in a `useState` variable.
4. **Rendering:** The data is passed down as "props" to the child components (`HeroSection`, `SummaryCards`, `Analytics`, `TransactionList`), which render the UI dynamically.
5. **User Interaction:** When a user adds a new transaction, an HTTP POST request is sent. Upon success, the frontend re-fetches the data, and React automatically updates the screen without reloading the page.

---

## 5. Deployment Infrastructure

The application is deployed to the internet using a decoupled architecture:

* **Database Hosting:** MongoDB Atlas (Cloud Database)
  * Stores all user data securely in the cloud.
* **Backend Hosting:** Render (Web Service)
  * Runs the Node.js/Express server continuously. 
  * Connects to MongoDB Atlas using a secure `MONGO_URI` environment variable.
* **Frontend Hosting:** Render (Static Site)
  * Hosts the compiled React build (`index.html`, CSS, JS).
  * Communicates with the live backend using the `REACT_APP_API_URL` environment variable.
  * Uses a Rewrite Rule (`/*` to `/index.html`) to ensure React handles page routing properly.

---

## 6. Future Scope & Improvements
While currently a complete micro-project, future enhancements could include:
* **User Authentication:** Adding Login/Signup using JWT (JSON Web Tokens) to support multiple users.
* **Date Filtering:** Allowing users to view transactions by month or year.
* **Export to PDF/CSV:** Enabling users to download their financial reports.

# EduLink – Smart Learning, Group Formation & Student Marketplace Platform

EduLink is a comprehensive web platform focused on modern education, featuring:
- **Secure authentication** (registration, login, role-based access)
- **Smart group formation** (skill profiles, group management, join approval)
- **Interactive dashboards** for students and administrators

This repository contains both the **frontend** (Vite + React) and **backend** (Node.js + Express) of the EduLink project.

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which comes with npm)
- [MongoDB](https://www.mongodb.com/) (Make sure to configure your `.env` file in the backend to point to your database cluster)

### ⚙️ Installation

To install all dependencies for both the frontend and backend, run the following script from the root of the project:

```bash
npm run install-all
```
*(Alternatively, you can manually `cd` into both `frontend/` and `backend/` and run `npm install` inside each folder).*

### 🏃‍♂️ Running the Project

You can start both the frontend development server and the backend API server concurrently with a single command!

From the **root directory**, simply run:

```bash
npm run dev
```

This will:
- Start the server from the `backend/` folder on `http://localhost:5000` (or the port defined in your `.env`).
- Start the React application from the `frontend/` folder, usually available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
/EduLink--Online-Student-life-materials-Management-System
 ├── backend/        # Node.js Express server, MongoDB models, controllers, and routes
 ├── frontend/       # Vite + React UI, pages, styles, and assets
 ├── package.json    # Root configuration for concurrently running the project
 └── README.md       # Project documentation
```

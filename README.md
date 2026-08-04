#  Todo Task Management Application

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=for-the-badge&logo=tailwindcss)
![Better Auth](https://img.shields.io/badge/Auth-Better%20Auth-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

#  Project Overview

A modern **Full Stack Todo Task Management Application** built with a scalable architecture using **Next.js**, **FastAPI**, **Neon PostgreSQL**, and **Better Auth**.

The project demonstrates production-ready development practices including:

- Responsive modern UI
- RESTful API architecture
- JWT Authentication
- User-specific data isolation
- Secure database design
- Layered backend architecture
- Automated testing
- Clean code organization
- Type-safe development

The application allows authenticated users to securely manage their personal tasks while ensuring complete isolation between different user accounts.

---

#  Features

##  Frontend

- Responsive UI
- Modern App Router architecture
- Task Dashboard
- Create Task
- Update Task
- Delete Task
- Toggle Task Completion
- Loading States
- Empty States
- Error Handling
- Reusable Components
- API Integration
- Type-safe development using TypeScript

---

## ⚙️ Backend

- FastAPI REST API
- SQLModel ORM
- Repository Pattern
- Service Layer
- JWT Authentication
- Request Validation
- Structured Error Responses
- CRUD Operations
- Alembic Database Migrations
- User Authorization
- Clean Architecture

---

## 🔐 Authentication

- Better Auth
- Email & Password Sign Up
- Secure Sign In
- JWT Session Management
- Protected Routes
- Middleware Authentication
- Session Persistence
- Secure Logout

---

## 🗄 Database

- Neon PostgreSQL
- SQLModel
- Alembic
- Indexed Tables
- Relational Design
- Secure User Isolation

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Better Auth Client

---

## Backend

- FastAPI
- SQLModel
- Python 3.12+
- Uvicorn
- PyJWT
- Alembic

---

## Database

- Neon PostgreSQL

---

## Authentication

- Better Auth
- JWT
- HTTP Authorization Bearer Tokens

---

## Testing

### Frontend

- Vitest
- React Testing Library
- Playwright

### Backend

- Pytest
- HTTPX

---

#  System Architecture

```text
                ┌───────────────────────────┐
                │        Next.js App        │
                │      Frontend (UI)        │
                └────────────┬──────────────┘
                             │
                HTTPS REST API Requests
                             │
                             ▼
                ┌───────────────────────────┐
                │      FastAPI Backend      │
                │ Repository + Services     │
                └────────────┬──────────────┘
                             │
                    SQLModel ORM
                             │
                             ▼
                ┌───────────────────────────┐
                │     Neon PostgreSQL       │
                └───────────────────────────┘

               ▲
               │
        Better Auth
               │
     JWT Authentication
```

---

#  Project Structure

```text
Todo-App/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── middleware.ts
│   ├── types/
│   └── tests/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── db/
│   │   ├── schemas/
│   │   └── core/
│   │
│   ├── alembic/
│   └── tests/
│
└── README.md
```

---

#  Core Functionalities

## Task Management

- Create Task
- View Tasks
- Update Task
- Delete Task
- Toggle Completion

---

## Account Management

- User Registration
- Login
- Logout
- Session Persistence
- Protected Routes

---

## Security

- JWT Authentication
- Route Protection
- User Data Isolation
- Secure API Requests
- Authorization Middleware
- Input Validation

---

#  Application Workflow

```text
User

↓

Sign Up / Login

↓

Better Auth

↓

JWT Generated

↓

Frontend Stores Session

↓

API Request

↓

FastAPI

↓

JWT Verification

↓

Repository Layer

↓

PostgreSQL

↓

Response
```
---

#  Installation

##  Clone the Repository

```bash
git clone https://github.com/your-username/todo-task-management.git

cd todo-task-management
```

---

#  Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

#  Backend Setup

```bash
cd backend

uv sync

uv run uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

#  Database Setup

Create a Neon PostgreSQL database.

Run the backend migrations:

```bash
alembic upgrade head
```

For Better Auth schema:

```bash
npx @better-auth/cli generate

npx @better-auth/cli migrate
```

---

#  Environment Variables

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

BETTER_AUTH_SECRET=your_secret

BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=your_neon_database_url
```

---

## Backend (.env)

```env
DATABASE_URL=your_neon_database_url

BETTER_AUTH_SECRET=your_secret
```

---

#  Running the Application

## Start Frontend

```bash
cd frontend

npm run dev
```

---

## Start Backend

```bash
cd backend

uv run uvicorn app.main:app --reload
```

---

# REST API Overview

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/{user_id}/tasks` | Create Task |
| GET | `/api/{user_id}/tasks` | List Tasks |
| GET | `/api/{user_id}/tasks/{id}` | Get Single Task |
| PUT | `/api/{user_id}/tasks/{id}` | Update Task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle Completion |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete Task |

---

#  Authentication Flow

```text
User

↓

Sign Up

↓

Better Auth

↓

User Created

↓

JWT Generated

↓

Session Created

↓

Frontend Stores Session

↓

Authorization: Bearer <token>

↓

FastAPI

↓

JWT Verification

↓

Request Authorized

↓

Database Access

↓

Frontend UI Updated

```

---

#  Database Design

## Tasks Table

| Field | Type |
|--------|------|
| id | UUID |
| user_id | UUID |
| title | String |
| description | Text |
| completed | Boolean |
| created_at | DateTime |
| updated_at | DateTime |

---

## Better Auth Tables

- users
- sessions
- accounts
- verification

---

#  Testing

## Frontend

```bash
npm run test
```

Run Playwright:

```bash
npm run test:e2e
```

---

## Backend

```bash
pytest
```

---

#  Features Tested

### Frontend

- Form Validation
- Component Tests
- UI Rendering
- Authentication Pages
- Playwright End-to-End Tests

---

### Backend

- Contract Tests
- Integration Tests
- CRUD API Tests
- JWT Authentication Tests
- Validation Tests
- User Isolation Tests

---

# Responsive Design

The application is fully responsive and optimized for:

- 📱 Mobile
- 📲 Tablet
- 💻 Laptop
- 🖥 Desktop

---

# Deployment

Frontend can be deployed on:

- Vercel

Backend can be deployed on:

- Railway
- Render
- VPS

Database:

- Neon PostgreSQL

---

# Future Improvements

- Task Categories
- Task Priorities
- Due Dates
- File Attachments
- Search Tasks
- Task Filters
- Pagination
- Dark / Light Theme
- Email Notifications
- Social Login
- User Profile
- Team Collaboration
- Activity Logs
- Dashboard Analytics

---

# Author

**Alishba Asif**

Frontend Developer | Full Stack Developer

GitHub: https://github.com/Alishbasif
> 

LinkedIn: https://www.linkedin.com/in/alishba-asif-222b77363/
> 

---

# License

This project is licensed under the **MIT License**.

---

# Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

Happy Coding! 😊


---

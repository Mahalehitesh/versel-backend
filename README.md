# School Classroom Management Web Application

A full-stack, production-quality School Classroom Management Application built with **Spring Boot 3 / Java 21**, **PostgreSQL**, **Flyway**, **Spring Security (JWT)**, and **Angular 18 Standalone Components with Signals**.

---

## 🔑 Default Login Credentials

The application automatically seeds initial data on first launch:

| Role | Username | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `admin123` | Full CRUD over Terms, Classrooms, Teachers, Students, & Assignments |
| **TEACHER** | `t_smith` | `password123` | Assigned to **Algebra II** (Current), **Introductory Geometry** (Past), **Advanced Calculus** (Future) |
| **TEACHER** | `t_davis` | `password123` | Assigned to **AP Biology** (Current), **Physical Science** (Past), **Advanced Calculus** (Future) |
| **TEACHER** | `t_wilson` | `password123` | Assigned to **World History** (Current) |

---

## 🛠️ Architecture & Features

1. **Role-Based Authorization & Scoped Data Security:**
   - Teachers are strictly prohibited from viewing classrooms or students they are not assigned to. Enforced via `@PreAuthorize("@teacherSecurityService.isAssignedToClassroom(#id, authentication)")` backend method security.
2. **Dynamic Term Status:**
   - Academic terms compute status (`PAST`, `CURRENT`, `FUTURE`) dynamically relative to today's date.
3. **Teacher Dashboard:**
   - Displays classrooms grouped into **Current Term**, **Previous Terms**, and **Future Terms**.
   - *Future Terms* section automatically hides if no future classrooms are assigned.
4. **Classroom & Student Details:**
   - Searchable, sortable, and paginated student lists per classroom.
   - Comprehensive student profile page showing guardian contacts, DOB, address, and enrolled classrooms list.
5. **Security & Rate Limiting:**
   - Stateless JWT access (24h) + refresh tokens (7 days).
   - Rate limiting on `/api/auth/login` to prevent brute force attacks.
   - Externalized credentials and CORS configuration.

---

## 🚀 Quick Start with Docker Compose

To start the database, Spring Boot backend, and Angular frontend concurrently:

```bash
docker-compose up --build -d
```

Access the application in your browser:
- **Frontend App:** [http://localhost:4200](http://localhost:4200)
- **Backend Swagger API Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Database:** `localhost:5432` (`classroom_db`)

---

## 💻 Manual / Local Development Setup

### 1. Database Setup
Start a local PostgreSQL instance:
```sql
CREATE DATABASE classroom_db;
```

### 2. Backend Setup (Spring Boot)
Ensure Java 21+ and Maven are installed.
```bash
cd backend
mvn clean spring-boot:run
```
The Flyway migration script (`V1__init.sql`) will execute automatically, followed by `DataSeeder.java` populating initial seed records.

### 3. Frontend Setup (Angular)
Ensure Node.js 20+ and npm are installed.
```bash
cd frontend
npm install
npm start
```
Navigate to `http://localhost:4200`.

---

## 🧪 Running Unit & Integration Tests

### Backend Tests (JUnit 5 & Mockito)
```bash
cd backend
mvn test
```
Runs unit tests for:
- `TermServiceTest`: Dynamic term status calculation (`PAST`, `CURRENT`, `FUTURE`).
- `SecurityAccessTest`: Scoped teacher access control validation.

---

## 📁 Repository Folder Structure

```
classroom/
├── Prompt                               # Initial prompt specification
├── docker-compose.yml                   # Docker Compose container orchestration
├── .env.example                         # Environment configuration template
├── README.md                            # Setup and architecture document
├── backend/                             # Spring Boot Maven Project
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/school/classroom/
│       │   │   ├── ClassroomApplication.java
│       │   │   ├── config/              # Security, CORS, RateLimiting, OpenApi
│       │   │   ├── controller/          # REST Endpoints (Auth, Terms, Teachers, Students, Classrooms, TeacherDashboard)
│       │   │   ├── dto/                 # Java Records for requests & responses
│       │   │   ├── entity/              # JPA Entities (User, Teacher, Student, Term, Classroom)
│       │   │   ├── exception/           # Global REST Exception Handler
│       │   │   ├── repository/          # Spring Data JPA Repositories
│       │   │   ├── security/           # JWT Provider, Filters, Custom UserDetails, Security Service
│       │   │   └── service/            # Core Business Logic & DataSeeder
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/
│       │           └── V1__init.sql     # Flyway SQL Migration
│       └── test/                        # JUnit 5 & Mockito Unit Tests
└── frontend/                            # Angular 18 Standalone App
    ├── package.json
    ├── angular.json
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── index.html
        ├── styles.css                    # Glassmorphism dark-mode design system
        └── app/
            ├── app.config.ts
            ├── app.routes.ts             # Functional guards & lazy routes
            ├── components/              # Navbar & Toast components
            ├── guards/                  # Role & Auth functional guards
            ├── interceptors/          # JWT HTTP interceptor & auto-refresh
            ├── models/                  # TypeScript interfaces
            ├── pages/                   # Login, Teacher Dashboard, Classroom Students, Student Detail, Admin Pages
            └── services/                # AuthService, ApiService, ToastService
```

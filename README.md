# PathFinder — Student Opportunity & Career Pathway Platform

> **Subtitle:** *Explore Your Education, Exams, Skills & Career Opportunities*

---

## 1. Project Overview

**PathFinder** is a modern, responsive, full-stack opportunity discovery and career pathway web application. It guides students after Class 10 and across all subsequent academic and vocational milestones — including Intermediate (11th–12th), Diploma / Polytechnic, ITI, Undergraduate, Engineering, Postgraduate, and competitive exam tracks.

The platform provides a centralized repository of verified entrance examinations, merit scholarships, courses, internships, and interactive career roadmaps with rule-based recommendations and urgent application deadline tracking.

---

## 2. Problem Statement

> *"After Class 10 or at any stage of education, students often do not know what options are available, which path they can choose, which entrance examinations they can write, what eligibility criteria they need, what scholarships they can apply for, and what career opportunities are available."*

Most existing platforms focus strictly on Intermediate or engineering admissions, leaving vocational, diploma, school-level olympiad, and degree students without guidance. PathFinder solves this by:
- Centralizing diverse educational streams in one place.
- Eliminating guesswork through structured eligibility criteria.
- Connecting every opportunity directly to verified official government or university portals.

---

## 3. Key Features

- **Personalized Student Onboarding:** 3-step setup collecting current level, class, stream, marks, state, interests, skills, and target career sectors.
- **Rule-Based Recommendation Engine:** Analyzes education level, stream, declared interests, and deadlines to compute match scores and explainable "Based on your profile" badges.
- **Dedicated Opportunity Explorer:** Filterable and searchable catalog of internships, fellowships, government initiatives, and skill certifications.
- **Comprehensive Examination Module:** School-Level (Olympiads), Engineering (JEE), Medical (NEET), Law (CLAT), Management (CAT), Government/Competitive (UPSC, SSC, Banking), and Defence (NDA).
- **Scholarship & Financial Aid Hub:** Search by category, state, and income criteria, featuring benefit amounts, deadlines, and required document checklists.
- **Interactive Career Pathway Engine:** Visual, step-by-step roadmaps:
  `Education → Entrance Exam → Course → In-Demand Skills → Internship → Dream Career`.
- **Course Discovery Explorer:** Covers 16+ domains with durations, skill outcomes, eligibility, and corresponding entrance examinations.
- **Application Deadline Tracking:** Real-time countdowns highlighting closing deadlines in green (Upcoming), amber (Closing Soon), and pulsating red (Closing in ≤ 7 days).
- **Personalized Bookmarks / Saved Opportunities:** Easily save, organize, and track deadlines.
- **Role-Based Admin Console:** Complete CRUD suite for Opportunities, Exams, Scholarships, Courses, Careers, and user directory management with statistics.

---

## 4. Technology Stack

### Frontend
- **Framework:** React.js (v19 with Vite 8)
- **Styling:** Tailwind CSS (v4 with `@tailwindcss/vite`)
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios (with request & response JWT interceptors)
- **Icons:** Lucide React
- **Typography:** Inter & Plus Jakarta Sans via Google Fonts

### Backend
- **Runtime:** Node.js (v22)
- **Framework:** Express.js (v4 REST APIs)
- **Database:** MongoDB Atlas via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** Express Validator & Mongoose Schema constraints

---

## 5. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React.js Frontend                    │
│      Vite + Tailwind CSS + Responsive UI / UX          │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST (Axios + JWT)
┌───────────────────────────▼────────────────────────────┐
│                  Express.js Backend                    │
│   ├── authMiddleware & adminMiddleware                 │
│   ├── Controllers (Auth, Opps, Exams, Sch, Careers)    │
│   ├── Rule-Based Recommendation Engine                 │
│   └── Centralized Error & Async Handlers               │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼────────────────────────────┐
│                   MongoDB Atlas                        │
│   Users • Opportunities • Exams • Scholarships         │
│   Courses • Careers • Bookmarks                        │
└────────────────────────────────────────────────────────┘
```

---

## 6. Folder Structure

```
pathfinder/
├── client/                              # React Frontend
│   ├── public/                          # Static assets & favicons
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                 # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── common/                  # Badge, DeadlineBadge, Modal, Pagination, Skeletons
│   │   │   ├── cards/                   # OpportunityCard, ExamCard, ScholarshipCard, CourseCard, CareerCard
│   │   │   └── layout/                  # Navbar, Footer, AdminLayout, PublicLayout
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Session state & bookmark manager
│   │   ├── pages/                       # Landing, About, Login, Register, Onboarding, Dashboard, Profile, Saved
│   │   │   └── admin/                   # AdminDashboard, AdminOpportunities, AdminExams, etc.
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx       # Student & Admin Route Guards
│   │   ├── App.jsx                      # Main Router configuration
│   │   ├── index.css                    # Tailwind CSS base configuration
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                      # Vercel deployment rewrite rules
│   └── package.json
│
├── server/                              # Express.js Backend
│   ├── config/
│   │   └── db.js                        # Mongoose MongoDB connection
│   ├── controllers/                     # authController, examController, etc.
│   ├── middleware/                      # authMiddleware, errorHandler
│   ├── models/                          # User, Opportunity, Examination, Scholarship, Course, Career, Bookmark
│   ├── routes/                          # authRoutes, opportunityRoutes, etc.
│   ├── services/
│   │   └── recommendationEngine.js      # Rule-based matching engine
│   ├── seed/
│   │   ├── seedData.js                  # Realistic demo data
│   │   └── seed.js                      # Database population script
│   ├── utils/                           # apiResponse.js, asyncHandler.js
│   ├── .env                             # Environment secrets (ignored in Git)
│   ├── .env.example
│   ├── server.js                        # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 7. Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas cluster URI (or local MongoDB)

### Step 1: Clone the repository
```bash
git clone <repository_url>
cd "sample project"
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 8. Environment Variables

### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.uu5ezng.mongodb.net/pathfinder?retryWrites=true&w=majority
JWT_SECRET=pathfinder_super_secret_jwt_key_2026_student_platform
NODE_ENV=development
```

### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 9. MongoDB Atlas Setup

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free cluster (Shared M0).
3. Under **Database Access**, create a database user with Read/Write privileges.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) or your server's static IP.
5. In your Cluster Overview, click **Connect** → **Drivers** (Node.js) and copy the connection string.
6. Replace `<password>` with your database user password and append `/pathfinder` as the database name.

---

## 10. Database Setup & Seeding

Run the seed script from the `server/` directory to automatically populate the database:
```bash
cd server
npm run seed
```
This inserts realistic records across opportunities, exams, scholarships, courses, and career paths, and creates the default Admin and Student demo accounts.

---

## 11. Seed Demo Data & Credentials

### Default Accounts
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@pathfinder.com` | `Admin@123` |
| **Student** | `student@pathfinder.com` | `Student@123` |

*(Quick-fill demo buttons are also present on the Sign In page for seamless evaluator testing).*

---

## 12. Running the Backend Server

```bash
cd server
npm run dev
# or: node server.js
```
The server will start on `http://localhost:5000`. Test health status at `http://localhost:5000/api/health`.

---

## 13. Running the Frontend Client

```bash
cd client
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open your browser to explore the platform.

---

## 14. API Documentation

### Authentication & Profile
- `POST /api/auth/register` — Create a new student account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — [Protected] Get current user profile
- `PUT /api/auth/profile` — [Protected] Update academic details & onboarding preferences

### Opportunities
- `GET /api/opportunities` — List opportunities (supports `?search=`, `?category=`, `?educationLevel=`, `?state=`, `?page=`, `?limit=`)
- `GET /api/opportunities/:id` — Single opportunity details
- `POST /api/opportunities` — [Admin] Create new opportunity
- `PUT /api/opportunities/:id` — [Admin] Update opportunity
- `DELETE /api/opportunities/:id` — [Admin] Delete opportunity

### Examinations
- `GET /api/exams` — List exams (supports `?category=`, `?search=`, `?sortBy=`)
- `GET /api/exams/:id` — Single exam with syllabus and schedule
- `POST /api/exams` — [Admin] Add examination
- `PUT /api/exams/:id` — [Admin] Update examination
- `DELETE /api/exams/:id` — [Admin] Remove examination

### Scholarships
- `GET /api/scholarships` — List scholarships (supports `?state=`, `?educationLevel=`, etc.)
- `GET /api/scholarships/:id` — Single scholarship details
- `POST /api/scholarships` — [Admin] Add scholarship
- `PUT /api/scholarships/:id` — [Admin] Update scholarship
- `DELETE /api/scholarships/:id` — [Admin] Delete scholarship

### Courses & Career Pathways
- `GET /api/courses` — List courses with duration and skills
- `GET /api/courses/:id` — Single course details
- `GET /api/careers` — List career pathways
- `GET /api/careers/:id` — Single career roadmap with progression trajectory

### Bookmarks & Recommendations
- `GET /api/bookmarks` — [Protected] Get saved bookmarks
- `POST /api/bookmarks` — [Protected] Add a bookmark
- `DELETE /api/bookmarks/:id` — [Protected] Remove bookmark
- `GET /api/recommendations` — [Protected] Returns rule-based scored matches

### Admin Stats & Users
- `GET /api/admin/stats` — [Admin] Overview counts and upcoming deadlines
- `GET /api/admin/users` — [Admin] List users
- `PUT /api/admin/users/:id/role` — [Admin] Change user role (`student` / `admin`)

---

## 15. Authentication Flow

1. User registers (`POST /api/auth/register`).
2. Backend generates a 30-day JWT signed with `JWT_SECRET`.
3. Frontend stores the token in `localStorage` and automatically attaches it via Axios interceptors as `Authorization: Bearer <token>`.
4. Role-based route guards (`ProtectedRoute` and `AdminRoute`) protect student and administrator routes.
5. In case of token expiry (401), the frontend cleans up storage and redirects to `/login?expired=true`.

---

## 16. Admin Setup & Privileges

Any user with `role: 'admin'` gains immediate access to the `/admin` dashboard.
- Default Admin account: `admin@pathfinder.com` / `Admin@123`.
- Any existing student can also be promoted to an administrator through the User Directory tab inside the admin portal.

---

## 17. Screenshots & User Flow

```
[Landing Page (Hero & Stage Selectors)]
          │
          ▼
   [Registration] ──► [3-Step Onboarding Questionnaire]
                             │
                             ▼
                 [Personalized Dashboard]
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
 [Opportunities]      [Entrance Exams]   [Career Roadmaps]
```

---

## 18. Future Enhancements

The platform's clean modular architecture makes it ready for future extensions:
- AI-Powered Career Assistant / Chatbot
- Resume & CV Builder tailored to selected opportunities
- College Comparison & Finder tool
- Automated Email & SMS Deadline reminders
- Multi-language support (Telugu, Hindi, and Regional languages)
- Mobile Application with React Native

---

## 19. Deployment Instructions

### Frontend (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the `client/` folder.
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
4. The included `vercel.json` ensures client-side routing works smoothly.

### Backend (Render / Railway)
1. Create a Web Service on Render / Railway pointing to the `server/` directory.
2. Build command: `npm install`.
3. Start command: `node server.js`.
4. Set environment variables:
   - `PORT=5000`
   - `MONGODB_URI=<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET=<Your JWT Secret>`
   - `NODE_ENV=production`

---

## License

This project is built for educational and demonstration purposes.
All rights reserved © 2026 PathFinder.

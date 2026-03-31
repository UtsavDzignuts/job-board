# Job Board Platform (Nx Monorepo)

A production-ready Job Board Platform built with FastAPI, Next.js 14, and Nx.

## Tech Stack
- **Backend:** Python 3.12, FastAPI, SQLModel, PostgreSQL, JWT, Alembic
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Lucide Icons
- **Monorepo:** Nx

---

## Project Structure
```
repo/
├── apps/
│   ├── job-board-web   # Next.js frontend
│   └── job-board-api   # FastAPI backend
├── packages/
│   ├── ui              # Reusable React components
│   └── config          # Shared configurations (Tailwind, etc.)
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.12
- PostgreSQL database

### 1. Clone the repository
```bash
git clone <repo-url>
cd job-board
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Setup Backend
```bash
cd apps/job-board-api
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Database Configuration
Update the `DATABASE_URL` in `apps/job-board-api/app/core/config.py` with your PostgreSQL credentials.

### 5. Run Migrations
```bash
npx nx run job-board-api:migrate
```

### 6. Run the Project

You can run both apps simultaneously using Nx:
```bash
npx nx run-many -t dev serve
```

Or individually:

#### 🟢 Backend (API)
The backend is built with FastAPI. To start the API server:
```bash
npx nx serve job-board-api
```
The API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

#### 🔵 Frontend (Web)
The frontend is built with Next.js. To start the development server:
```bash
npx nx dev job-board-web
```
The application will be available at [http://localhost:3000](http://localhost:3000).
---

## Features
- **JWT Authentication:** Secure login/register for seekers and recruiters.
- **Job Search & Filters:** Search by keyword, location, type, etc.
- **Company Management:** Companies can maintain profiles.
- **Recruiter Dashboard:** Post and manage job openings.
- **Responsive Design:** Premium UI with Tailwind CSS.

---

## API Documentation
Once the backend is running, visit:
`http://localhost:8000/docs` for Swagger UI.

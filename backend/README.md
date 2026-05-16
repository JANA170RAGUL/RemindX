# AI Reminder Productivity Dashboard - Backend

This is the production-ready FastAPI backend foundation for a futuristic AI reminder and productivity SaaS platform.

## Features
- **FastAPI** with async architecture
- **PostgreSQL** integration using **SQLAlchemy 2.0**
- **Alembic** migrations
- **JWT Authentication** (Passlib + Jose)
- **Modular Architecture** inspired by enterprise standards
- **Docker** and **Railway** ready

## Setup Instructions

### 1. Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` matches your local PostgreSQL setup.

### 4. Database Setup & Alembic
```bash
# Initialize alembic if not done (optional, already generated)
alembic init alembic

# Create an initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Server
```bash
uvicorn app.main:app --reload
```
Swagger UI will be available at: http://localhost:8000/docs
ReDoc will be available at: http://localhost:8000/redoc

## Railway Deployment
1. Connect your GitHub repository to Railway.
2. Add a **PostgreSQL** plugin in your Railway project.
3. Update environment variables in Railway to match `.env`.
4. Railway will automatically detect the `Dockerfile` and build the image.

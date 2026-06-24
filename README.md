# Healthify — AI-Powered Fitness & Nutrition Planner

A full-stack fitness web application that generates personalized exercise, yoga, and nutrition plans using Google's Gemini AI.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 + React + Tailwind CSS + PWA |
| **Backend** | Python FastAPI |
| **Database** | MongoDB Atlas |
| **AI Engine** | Google Gemini 1.5 Flash |
| **Auth** | JWT (PyJWT) |
| **Rate Limiting** | SlowAPI |
| **Deployment** | Vercel (Frontend) + Render (Backend) |

## 📁 Project Structure (Monorepo)

```
healthify/
├── .env                     # Root secrets (gitignored)
├── .env.example             # Environment template
├── .gitignore
├── README.md
├── backend/                 # FastAPI Python service
│   ├── app/
│   │   ├── core/            # Config, security, logging
│   │   ├── db/              # MongoDB connection & collections
│   │   ├── api/             # API routes (auth, plans, users)
│   │   ├── services/        # Gemini AI service, plan generator
│   │   ├── models/          # Pydantic schemas
│   │   └── main.py          # FastAPI entry point
│   ├── requirements.txt
│   └── render.yaml          # Render deployment config
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API client, utilities
│   │   └── styles/          # Tailwind globals
│   ├── public/              # PWA icons, manifest
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
└── .github/
    └── workflows/
        └── ci.yml           # Auto-deploy on push
```

## 🛠️ Local Setup

### 1. Clone & Configure

```bash
git clone https://github.com/ItsmeYuvi/healthify.git
cd healthify

# Copy environment template and fill in your keys
cp .env.example .env
# Edit .env with your real Gemini API key and MongoDB URI
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

Interactive docs (Swagger UI): `http://localhost:8000/docs`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. MongoDB Collections

The backend auto-creates the following collections on first run:

| Collection | Purpose |
|------------|---------|
| `users` | Authentication profiles (hashed passwords) |
| `fitness_profiles` | User physical metrics & goals |
| `fitness_plans` | AI-generated plans (exercise, yoga, nutrition) |
| `workouts` | Individual workout logs/sessions |
| `meals` | Nutrition / meal plan entries |
| `progress_logs` | Weekly weight/measurement tracking |

## 🔐 Security Checklist

- [x] `.env` is gitignored — never commit secrets
- [x] Passwords are hashed with `bcrypt` before storage
- [x] JWT tokens expire after 60 minutes (configurable)
- [x] Rate limiting protects Gemini API endpoints (30 req/min)
- [x] CORS is configured for frontend origin only
- [x] MongoDB credentials are never logged or returned in responses

## 🚀 Deployment

### Frontend → Vercel

1. Connect `https://github.com/ItsmeYuvi/healthify` to Vercel
2. Set root directory to `frontend`
3. Add environment variables from `.env` (only `NEXT_PUBLIC_*` vars)
4. Deploy on every push to `main`

### Backend → Render

1. Connect `https://github.com/ItsmeYuvi/healthify` to Render
2. Set root directory to `backend`
3. Add environment variables from `.env` (all backend vars)
4. Deploy on every push to `main`

> **Note:** Update `NEXT_PUBLIC_API_URL` in Vercel to point to your Render backend URL after first deploy.

## 📜 License

MIT — Built for personal fitness goals.

# AI Resume Analyzer (ResumeAI)

Production-ready SaaS for ATS resume analysis, job matching, AI rewriting, and cover letter generation — powered by **Google Gemini**.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Node.js, Express, MongoDB, JWT, bcrypt, Multer |
| AI | Google Gemini API |
| Storage | Local (dev) / Cloudinary (production) |
| Deploy | Vercel (client) + Render (server) |

## Features

- User authentication (register, login, JWT)
- PDF resume upload, list, delete
- ATS analysis (score, skills, strengths, weaknesses, suggestions)
- Job description matching
- AI bullet point rewriter
- Cover letter generator
- Dashboard with stats, charts, and history

## Project Structure

```
├── client/          # React frontend
├── server/          # Express API
├── ARCHITECTURE.md  # System design
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- (Production) Cloudinary account

## Local Setup

### 1. Clone and install

```bash
cd server
npm install
cp .env.example .env

cd ../client
npm install
cp .env.example .env
```

### 2. Configure server `.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/resume-analyzer
JWT_SECRET=your-long-random-secret-min-32-chars
GEMINI_API_KEY=your-gemini-api-key
CLIENT_URL=http://localhost:5173
STORAGE_MODE=local
```

### 3. Configure client `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Run

```bash
# Terminal 1 — API
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173  
- API health: http://localhost:5000/health  

## API Endpoints

Base: `/api/v1`

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| GET | `/auth/me` | Yes |
| POST | `/resumes/upload` | Yes |
| GET | `/resumes` | Yes |
| DELETE | `/resumes/:id` | Yes |
| POST | `/analysis/ats/:resumeId` | Yes |
| GET | `/analysis` | Yes |
| POST | `/job-match` | Yes |
| POST | `/rewriter` | Yes |
| POST | `/cover-letter` | Yes |
| GET | `/dashboard/stats` | Yes |

## Deployment

### Backend — Render

1. Create a **Web Service** connected to your repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. Add environment variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | production |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `GEMINI_API_KEY` | Your API key |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `STORAGE_MODE` | cloudinary |
| `CLOUDINARY_*` | Cloudinary credentials |

6. Use Render's health check path: `/health`

### Frontend — Vercel

1. Import repo, set **Root Directory** to `client`.
2. Framework: **Vite**
3. Environment variable:

```
VITE_API_URL=https://your-api.onrender.com/api/v1
```

4. Deploy.

### MongoDB Atlas

1. Create a free cluster.
2. Database Access → create user.
3. Network Access → allow `0.0.0.0/0` (or Render IPs).
4. Connect → copy connection string into `MONGODB_URI`.

### Google Gemini

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Create an API key.
3. Set `GEMINI_API_KEY` on Render.

## Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT on protected routes
- PDF-only uploads, 5MB limit
- Rate limiting on auth and AI endpoints
- Never commit `.env` files

## License

MIT

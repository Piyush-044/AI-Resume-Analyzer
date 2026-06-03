# ResumeAI — Setup Guide (Hindi + English)

## ✅ Jo ho chuka hai

- Node.js LTS install (winget)
- `server/.env` aur `client/.env` ban gaye
- `npm install` server + client dono mein

---

## 🔑 Step 1: Gemini API Key (zaroori — AI ke liye)

1. Kholo: https://aistudio.google.com/apikey  
2. **Create API Key** click karo  
3. `server/.env` kholo aur yeh line update karo:

```env
GEMINI_API_KEY=AIza...apni-actual-key
```

Bina iske ATS / Job Match / Rewriter kaam nahi karenge.

---

## 🗄️ Step 2: MongoDB (ek option chuno)

### Option A — Local Docker (recommended for dev)

1. **Docker Desktop** open karo (taskbar se start hona chahiye)  
2. Terminal mein project folder se:

```powershell
cd "e:\AI Resume Analyzer"
docker compose up -d
```

Connection already set hai:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/resume-analyzer
```

### Option B — MongoDB Atlas (cloud, free tier)

1. https://cloud.mongodb.com → Sign up → **Free cluster** banao  
2. **Database Access** → user + password  
3. **Network Access** → Add IP → `0.0.0.0/0` (Allow from anywhere)  
4. **Connect** → Drivers → copy connection string  
5. `server/.env` mein paste karo:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/resume-analyzer?retryWrites=true&w=majority
```

(`<password>` ko apna password se replace karo)

---

## ▶️ Step 3: App chalao

**Terminal 1 — API:**

```powershell
cd "e:\AI Resume Analyzer\server"
npm run dev
```

**Terminal 2 — Frontend:**

```powershell
cd "e:\AI Resume Analyzer\client"
npm run dev
```

| URL | Kya hai |
|-----|---------|
| http://localhost:5173 | App (Register → Upload → Analyze) |
| http://localhost:5000/health | API health check |

---

## 🧪 Quick test

1. http://localhost:5173 → **Get Started** → Register  
2. **Upload Resume** → PDF upload  
3. **ATS Analysis** → resume select → Analyze  

---

## ❌ Common errors

| Error | Fix |
|-------|-----|
| `MongoDB connection failed` | Docker Desktop start karo + `docker compose up -d` YA Atlas URI check karo |
| `Gemini API key not configured` | `server/.env` mein sahi `GEMINI_API_KEY` |
| `npm not recognized` | Terminal band karke naya kholo (Node install ke baad) |
| Docker pipe error | Docker Desktop fully start hone do, phir `docker compose up -d` |

---

## 🚀 Deploy (baad mein)

Full steps: root `README.md` — Vercel (client) + Render (server).

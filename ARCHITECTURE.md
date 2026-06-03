# AI Resume Analyzer — Architecture & Folder Structure

> **Status:** Draft for approval — no application code generated yet.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Vercel)                                 │
│  React + Tailwind + React Router + Axios + Context API                      │
│  Pages: Home, Auth, Dashboard, Upload, ATS, Job Match, Rewriter, Cover, Profile│
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTPS (REST JSON + multipart)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API SERVER (Render)                                │
│  Node.js + Express + JWT + bcrypt + Multer + rate-limit + helmet + cors      │
└───────┬─────────────────┬──────────────────────┬────────────────────────────┘
        │                 │                      │
        ▼                 ▼                      ▼
┌───────────────┐  ┌──────────────┐      ┌──────────────────┐
│ MongoDB Atlas │  │ Cloudinary   │      │ Google Gemini API │
│ (Users,       │  │ (PDF storage)│      │ (AI analysis)     │
│  Resumes,     │  │ optional:    │      │                   │
│  Analyses,    │  │ local disk   │      │                   │
│  JobMatches)  │  │ in dev       │      │                   │
└───────────────┘  └──────────────┘      └──────────────────┘
```

### Design principles

| Principle | Implementation |
|-----------|----------------|
| Separation of concerns | Routes → Controllers → Services → Models |
| Stateless API | JWT in `Authorization: Bearer` header |
| Fail closed | Auth middleware rejects invalid/missing tokens |
| AI isolation | All Gemini calls in `services/gemini.service.js` |
| Config via env | No secrets in repo; `.env.example` only |

---

## 2. Complete Folder Structure

```
ai-resume-analyzer/
│
├── README.md                          # Setup, env vars, deployment (post-approval)
├── ARCHITECTURE.md                    # This document
├── .gitignore
│
├── server/                            # Backend (Render)
│   ├── package.json
│   ├── .env.example
│   │
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   ├── cloudinary.js              # Cloudinary SDK (prod uploads)
│   │   └── env.js                     # Validated env loader
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Resume.model.js
│   │   ├── Analysis.model.js
│   │   └── JobMatch.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── resume.controller.js
│   │   ├── analysis.controller.js
│   │   ├── jobMatch.controller.js
│   │   ├── rewriter.controller.js
│   │   ├── coverLetter.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── routes/
│   │   ├── index.js                   # Mount all routes under /api
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   ├── analysis.routes.js
│   │   ├── jobMatch.routes.js
│   │   ├── rewriter.routes.js
│   │   ├── coverLetter.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verify
│   │   ├── upload.middleware.js       # Multer PDF config
│   │   ├── validate.middleware.js     # express-validator wrapper
│   │   ├── error.middleware.js        # Central error handler
│   │   └── rateLimit.middleware.js    # express-rate-limit presets
│   │
│   ├── services/
│   │   ├── gemini.service.js          # All Gemini prompts & parsing
│   │   ├── pdf.service.js             # pdf-parse text extraction
│   │   ├── resume.service.js          # CRUD + storage abstraction
│   │   ├── analysis.service.js        # ATS pipeline orchestration
│   │   ├── jobMatch.service.js
│   │   ├── rewriter.service.js
│   │   ├── coverLetter.service.js
│   │   └── dashboard.service.js       # Aggregations for stats
│   │
│   ├── utils/
│   │   ├── ApiError.js                # Custom error class
│   │   ├── ApiResponse.js             # Standard success wrapper
│   │   ├── asyncHandler.js            # Wrap async route handlers
│   │   ├── jwt.js                     # sign / verify helpers
│   │   └── promptTemplates.js         # Gemini system/user prompts
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── resume.validator.js
│   │   ├── analysis.validator.js
│   │   └── jobMatch.validator.js
│   │
│   ├── uploads/                       # Local PDF storage (dev only, gitignored)
│   │
│   ├── app.js                         # Express app (middleware, routes)
│   └── server.js                      # HTTP listen + DB connect
│
└── client/                            # Frontend (Vercel)
    ├── package.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js                 # Vite (recommended for React + Vercel)
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    ├── public/
    │   └── favicon.svg
    │
    └── src/
        ├── main.jsx
        ├── App.jsx                    # Router + providers
        ├── index.css                  # Tailwind directives
        │
        ├── context/
        │   └── AuthContext.jsx          # User, token, login/logout/register
        │
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useToast.js
        │   └── useFetch.js              # Optional: loading/error wrapper
        │
        ├── services/
        │   ├── api.js                   # Axios instance + interceptors
        │   ├── auth.service.js
        │   ├── resume.service.js
        │   ├── analysis.service.js
        │   ├── jobMatch.service.js
        │   ├── rewriter.service.js
        │   ├── coverLetter.service.js
        │   └── dashboard.service.js
        │
        ├── layouts/
        │   ├── MainLayout.jsx           # Public pages (Home)
        │   ├── AuthLayout.jsx           # Login / Register centered card
        │   └── DashboardLayout.jsx      # Sidebar + header + outlet
        │
        ├── components/
        │   ├── ui/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Textarea.jsx
        │   │   ├── Card.jsx
        │   │   ├── Badge.jsx
        │   │   ├── Spinner.jsx
        │   │   ├── Modal.jsx
        │   │   └── EmptyState.jsx
        │   ├── layout/
        │   │   ├── Sidebar.jsx
        │   │   ├── Header.jsx
        │   │   └── ProtectedRoute.jsx
        │   ├── dashboard/
        │   │   ├── StatCard.jsx
        │   │   ├── RecentAnalysesTable.jsx
        │   │   ├── JobMatchHistoryTable.jsx
        │   │   └── ScoreChart.jsx       # recharts
        │   ├── resume/
        │   │   ├── ResumeUpload.jsx
        │   │   └── ResumeList.jsx
        │   └── analysis/
        │       ├── AtsScoreGauge.jsx
        │       ├── SkillsList.jsx
        │       └── SuggestionsList.jsx
        │
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── UploadResume.jsx
            ├── AtsAnalysis.jsx
            ├── JobMatching.jsx
            ├── ResumeRewriter.jsx
            ├── CoverLetterGenerator.jsx
            └── Profile.jsx
```

---

## 3. Database Schema (MongoDB / Mongoose)

### User

```javascript
{
  name: String,          // required, trim
  email: String,         // required, unique, lowercase
  password: String,      // bcrypt hash, select: false
  createdAt: Date        // timestamps
}
```

**Indexes:** `email` (unique)

---

### Resume

```javascript
{
  userId: ObjectId,      // ref User, required, indexed
  fileName: String,      // original name
  fileUrl: String,       // Cloudinary URL or local path
  filePublicId: String,  // Cloudinary only (for delete)
  storageType: String,   // 'cloudinary' | 'local'
  fileSize: Number,      // bytes
  mimeType: String,      // application/pdf
  uploadedAt: Date
}
```

**Indexes:** `{ userId: 1, uploadedAt: -1 }`

---

### Analysis

```javascript
{
  userId: ObjectId,
  resumeId: ObjectId,    // ref Resume
  atsScore: Number,      // 0-100
  missingSkills: [String],
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  rawTextLength: Number, // optional metadata
  createdAt: Date
}
```

**Indexes:** `{ userId: 1, createdAt: -1 }`, `{ resumeId: 1 }`

---

### JobMatch

```javascript
{
  userId: ObjectId,
  resumeId: ObjectId,
  jobDescription: String,  // truncated storage policy (e.g. max 10k chars)
  matchScore: Number,    // 0-100
  missingSkills: [String],
  recommendedSkills: [String],
  createdAt: Date
}
```

**Indexes:** `{ userId: 1, createdAt: -1 }`

---

## 4. REST API Design

Base URL: `/api/v1`

### Auth (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create user, return JWT + user |
| POST | `/auth/login` | Validate credentials, return JWT |
| GET | `/auth/me` | Current user (protected) |

Logout is **client-side** (remove token); optional token blacklist omitted for v1.

---

### Resumes (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resumes/upload` | multipart PDF → store → metadata |
| GET | `/resumes` | List user's resumes |
| GET | `/resumes/:id` | Single resume metadata |
| DELETE | `/resumes/:id` | Delete file + DB record |

---

### ATS Analysis (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analysis/ats/:resumeId` | Extract PDF → Gemini → save Analysis |
| GET | `/analysis` | List analyses (paginated) |
| GET | `/analysis/:id` | Single analysis detail |
| GET | `/analysis/resume/:resumeId/latest` | Latest ATS for resume |

---

### Job Matching (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/job-match` | Body: `{ resumeId, jobDescription }` |
| GET | `/job-match` | History list |
| GET | `/job-match/:id` | Single match detail |

---

### AI Tools (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rewriter` | Body: `{ resumeId, bullets: string[] }` or extract from PDF |
| POST | `/cover-letter` | Body: `{ resumeId, jobRole, jobDescription? }` |

---

### Dashboard (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Counts, latest ATS, recent items |

---

### Standard response shapes

**Success**

```json
{
  "success": true,
  "message": "optional",
  "data": { }
}
```

**Error**

```json
{
  "success": false,
  "message": "Human readable error",
  "errors": []
}
```

**HTTP codes:** 200, 201, 400, 401, 403, 404, 429, 500

---

## 5. Request Flow Diagrams

### ATS Analysis pipeline

```
Client POST /analysis/ats/:resumeId
    → auth.middleware
    → analysis.controller
    → analysis.service
        → resume.service (fetch + authorize ownership)
        → pdf.service (download/read PDF → plain text)
        → gemini.service (structured JSON prompt)
        → Analysis.model.create()
    → ApiResponse
```

### Job match pipeline

```
Client POST /job-match { resumeId, jobDescription }
    → pdf.service (resume text)
    → gemini.service (compare resume + JD → scores/skills)
    → JobMatch.model.create()
```

### File upload pipeline

```
Client POST /resumes/upload (multipart)
    → upload.middleware (PDF only, size limit e.g. 5MB)
    → IF production: cloudinary.uploader
      ELSE: save to server/uploads/
    → Resume.model.create()
```

---

## 6. Gemini Integration Architecture

**Package:** `@google/generative-ai`

**Model:** `gemini-1.5-flash` (cost/latency) or `gemini-1.5-pro` (quality) — configurable via env.

**Pattern:** Single `gemini.service.js` with dedicated methods:

| Method | Input | Output (parsed JSON) |
|--------|-------|----------------------|
| `analyzeATS(resumeText)` | Plain text | score, missingSkills, strengths, weaknesses, suggestions |
| `matchJob(resumeText, jobDescription)` | Two texts | matchScore, missingSkills, recommendedSkills |
| `rewriteBullets(bullets[])` | Array of strings | improved bullets[] |
| `generateCoverLetter(resumeText, jobRole, jobDescription?)` | Texts | coverLetter string |

**Prompt strategy:**

- System instruction: "Return valid JSON only, no markdown."
- JSON schema described in `promptTemplates.js`
- `utils` parse with try/catch; retry once on malformed JSON
- Max input length: truncate resume text (~12k chars) with warning in logs

**Env:** `GEMINI_API_KEY`

---

## 7. Security Architecture

| Layer | Measure |
|-------|---------|
| Passwords | bcrypt (salt rounds: 12) |
| Auth | JWT (access token, 7d expiry; secret in env) |
| HTTP | helmet, cors (Vercel origin only in prod) |
| Input | express-validator on all POST bodies |
| Upload | PDF MIME + magic bytes check; 5MB max; sanitize filename |
| Rate limit | Global: 100/15min; Auth: 10/15min; AI routes: 20/hour |
| Ownership | Every resume/analysis/match query filters by `userId` |
| Secrets | Never commit `.env`; Render/Vercel env dashboards |

---

## 8. Frontend Architecture

### Routing (`App.jsx`)

| Path | Layout | Auth |
|------|--------|------|
| `/` | MainLayout | Public |
| `/login` | AuthLayout | Public (redirect if logged in) |
| `/register` | AuthLayout | Public |
| `/dashboard` | DashboardLayout | Protected |
| `/upload` | DashboardLayout | Protected |
| `/analysis` | DashboardLayout | Protected |
| `/job-match` | DashboardLayout | Protected |
| `/rewriter` | DashboardLayout | Protected |
| `/cover-letter` | DashboardLayout | Protected |
| `/profile` | DashboardLayout | Protected |

### State management

- **AuthContext:** user, token (localStorage), login/register/logout, axios default header
- **Page-local state:** forms, selected resume, analysis results
- **No Redux** for v1 (scope appropriate)

### API layer

- `api.js`: `baseURL` from `VITE_API_URL`, request interceptor (Bearer), response interceptor (401 → logout)

### UI stack

- Tailwind + custom components
- **react-hot-toast** for notifications
- **recharts** for dashboard score trend
- Loading: Spinner + skeleton on tables
- Error: inline alerts + toast

---

## 9. Environment Variables

### Server (`server/.env`)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173

# Storage
STORAGE_MODE=local
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=5

# Cloudinary (production)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 10. Deployment Architecture

```
                    ┌─────────────┐
                    │   Vercel    │
                    │   client/   │
                    │ VITE_API_URL│──┐
                    └─────────────┘  │
                                     ▼
                    ┌─────────────────────────┐
                    │   Render Web Service    │
                    │   server/ (Node)        │
                    │   Health: GET /health   │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        MongoDB Atlas      Cloudinary         Gemini API
```

**Render:** Root directory `server`, build `npm install`, start `node server.js`  
**Vercel:** Root directory `client`, framework Vite, output `dist`  
**CORS:** `CLIENT_URL` = Vercel production URL

---

## 11. Key Dependencies (planned)

### Server

- express, mongoose, bcryptjs, jsonwebtoken
- multer, cloudinary
- pdf-parse
- @google/generative-ai
- express-validator, express-rate-limit, helmet, cors, dotenv
- morgan (dev logging)

### Client

- react, react-dom, react-router-dom
- axios
- tailwindcss, postcss, autoprefixer
- react-hot-toast
- recharts
- lucide-react (icons)

---

## 12. Implementation Order (post-approval)

1. Server scaffold: config, models, utils, middleware
2. Auth module (register, login, JWT)
3. Resume upload + list + delete
4. PDF extraction + Gemini ATS analysis
5. Job matching + dashboard aggregations
6. Rewriter + cover letter endpoints
7. Client: auth + layout + protected routes
8. Client: pages one by one (Dashboard → Upload → ATS → …)
9. README + deployment guide
10. Smoke test checklist

---

## 13. Open Decisions (confirm before coding)

| # | Decision | Recommendation |
|---|----------|----------------|
| 1 | React build tool | **Vite** (faster, Vercel-native) vs CRA — recommend Vite |
| 2 | PDF storage prod | **Cloudinary** (specified in requirements) |
| 3 | Gemini model | **gemini-1.5-flash** default, env override |
| 4 | Pagination | Limit 20 on list endpoints |
| 5 | Monorepo root | Single repo with `server/` + `client/` |

---

## 14. Approval Checklist

Please confirm or request changes on:

- [ ] Folder structure (`server/` + `client/` layout)
- [ ] Database schemas and indexes
- [ ] API endpoints and versioning (`/api/v1`)
- [ ] Cloudinary for production PDFs, local for dev
- [ ] Vite for frontend (vs Create React App)
- [ ] Gemini model choice and JSON-only responses
- [ ] Client-side logout (no server blacklist)
- [ ] Any additional features for v1

**Once approved, implementation will begin with the backend, then frontend page by page.**

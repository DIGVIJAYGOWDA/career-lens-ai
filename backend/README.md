# CareerLens AI Backend API

FastAPI backend for CareerLens AI — an AI-powered Resume and Job Matching platform featuring explainable match scoring, skill gap identification, and AI interview simulation.

---

## Features
- **Authentication**: JWT-based user authentication and password hashing (`bcrypt`).
- **Resume Text Extraction**: PDF and DOCX parsing using open-source libraries (`pypdf`, `python-docx`).
- **Explainable Matching Engine**: Multi-dimensional scoring formula comparing required skills (40%), preferred skills (20%), work experience (15%), education (10%), and semantic text similarity (15%).
- **Skill Normalization**: Canonicalization mapping skill variants (`React.js` → `React`, `Postgres` → `PostgreSQL`).
- **Local Semantic Embeddings**: TF-IDF & Cosine Similarity vector matching using `scikit-learn` without external paid vector databases.
- **Gemini AI Integration**: Abstracted `AIProvider` using Google Gemini API Free Tier with fallback heuristics.
- **AI Recommendations & Roadmaps**: Customized priority skills, phased learning roadmaps, and portfolio project suggestions.
- **AI Interview Coach Simulator**: Job-tailored question generation, STAR-method answer input, and scoring evaluations.

---

## Technology Stack
- **Framework**: Python / FastAPI
- **Database**: PostgreSQL (via Supabase Free Tier) / SQLite (local fallback out-of-the-box)
- **ORM**: SQLAlchemy + Alembic
- **Security**: PyJWT (`python-jose`) + `passlib`
- **Document Parsing**: `pypdf`, `python-docx`
- **ML / Vector Similarity**: `scikit-learn`, `numpy`
- **AI Provider**: Google Gemini API (`google-genai`)

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (or SQLite local) | `sqlite:///./careerlens.db` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-key-...` |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime in minutes | `1440` (24 Hours) |
| `GEMINI_API_KEY` | Free Google Gemini API Key | `""` (Fallback heuristics used if empty) |
| `FRONTEND_URL` | Allowed CORS frontend origin | `http://localhost:3000` |

---

## Obtaining a FREE Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a free API key (No credit card or billing required).
3. Set the key in your `.env` file:
   ```env
   GEMINI_API_KEY=your_free_gemini_api_key_here
   ```

---

## Setup & Running Locally

1. **Create Python virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. Access the API documentation at:
   - Swagger UI: `http://localhost:8000/api/v1/docs`
   - ReDoc: `http://localhost:8000/api/v1/redoc`

# myOS

An interactive quiz that helps users find the ideal Linux distribution using a weighted matching algorithm.

We started off as a team: Melih Güldogdu, Cristina Postoronca, Maisam Mohammadi and Adis Murtezani.
I decided to keep working on the project on my own to keep learning.

## Key Features

- **Data pipeline:** scrapes data from DistroWatch and enriches it locally with UI and release-cycle attributes.
- **Matching logic:** a weighted algorithm evaluates 12 categories. Match scores are normalized and capped at 100%.
- **Database:** SQLite locally or PostgreSQL in production. PostgreSQL uses `DATABASE_URL`.
- **Community:** forum with posts and comments, user profiles, favorite OS.

## Project Structure

```
myos/
├── run_project.py          one-command setup and start
├── backend/                Flask API (port 3100)
│   ├── app.py              routes
│   ├── models.py           SQLAlchemy models
│   ├── services/           recommender, security links, DB loading
│   ├── scripts/            scraper, data enrichment, DB seeding
│   └── data/os.json        scraped distro data (input for seeding)
└── frontend/               React + Vite (port 8080)
    ├── functions/api/      Cloudflare Pages proxy
    └── src/
        ├── pages/          one folder per feature (home, auth, account, forum, glossary, quiz)
        ├── components/     shared UI (navbar, footer, ...)
        ├── context/        auth context
        ├── utils/          logo lookup, PDF export
        ├── styles/
        └── assets/images/
```

## Prerequisites

- Python 3.10+
- Node.js & npm

## Installation and Execution

**1. Virtual environment**

Windows:

```
python -m venv venv
.\venv\Scripts\activate
```

Linux / macOS:

```
python3 -m venv venv
source venv/bin/activate
```

**2. Environment file**

Copy `backend/.env.example` to `backend/.env`. Generate a secret with:

```
python -c "import secrets; print(secrets.token_hex(32))"
```

Set the generated value as `SECRET_KEY`. Add `YOUTUBE_API_KEY` only if you want to use YouTube Data API lookups. Leave `DATABASE_URL` empty for the local SQLite database, or set `DATABASE_PATH` to choose its location.

The backend loads the project-root `.env.local` first (used by the Neon CLI), then the backend `.env`. Existing process environment variables take precedence.

**3. Launch**

The script installs Python and Node dependencies, initializes the database and starts both servers.

```
python run_project.py
```

(`python3` on Linux / macOS.) The frontend runs on http://localhost:8080.

Frontend only: `cd frontend && npm run dev`.

The Vite development server proxies `/api` to the local Flask server. No frontend API URL override is needed for local development.

## Production deployment

### Database

Set `DATABASE_URL` on Render to the PostgreSQL connection string from Neon. The production requirements include both `psycopg2-binary` and `psycopg[binary]` so SQLAlchemy URLs using either PostgreSQL driver work; SQLAlchemy also checks pooled connections before reusing them.

Render Free does not provide a shell. To initialize a new Neon database, run the seed script from your local machine:

1. Copy `backend/data/os.json` to your local checkout if it is not already present.
2. Ensure the project-root `.env.local` contains the Neon `DATABASE_URL` (run `neon env pull` if needed). Keep this file private; it is ignored by Git.
3. From the `backend` directory, run `python -m scripts.setup_db`.

The script creates the schema and seeds distributions only if the table is empty. It is not a migration tool. It uses the same `DATABASE_URL` as the running application.
For future schema migrations, use Neon's `DATABASE_URL_UNPOOLED` (direct connection); keep the pooled `DATABASE_URL` for normal application traffic.

### Render backend

- Install dependencies with `pip install -r requirements-production.txt` from `backend`.
- Configure `APP_ENV=production`, `DATABASE_URL`, a generated `SECRET_KEY`, and `SESSION_COOKIE_SECURE=true`.
- Keep `SESSION_COOKIE_SAMESITE=Lax` and leave `SESSION_COOKIE_DOMAIN` unset when using the Pages proxy.
- Start the service with `gunicorn --bind 0.0.0.0:$PORT app:app`.

### Cloudflare Pages frontend and API proxy

- Set the Pages project root to `frontend`, build command to `npm run build`, and output directory to `dist`.
- Set the build environment variable `VITE_API_URL=/api`.
- Set the Pages Function environment variable `API_ORIGIN` to the Render service origin, such as `https://myos-api.onrender.com` (origin only, no path).
- The Function in `frontend/functions/api/[[path]].js` forwards `/api/...` requests to Render. The browser therefore talks only to the Pages origin, allowing the session cookie to remain same-origin. Do not set `SESSION_COOKIE_DOMAIN` to the Render domain.

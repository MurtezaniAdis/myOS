# myOS

An interactive quiz that helps users find the ideal Linux distribution using a weighted matching algorithm.

We started off as a team: Melih Güldogdu, Cristina Postoronca, Maisam Mohammadi and Adis Murtezani.
I decided to keep working on the project on my own to keep learning.

## Key Features

- **Data pipeline:** scrapes data from DistroWatch and enriches it locally with UI and release-cycle attributes.
- **Matching logic:** a weighted algorithm evaluates 12 categories. Match scores are normalized and capped at 100%.
- **Database:** SQLite. To reset it, delete `backend/instance/` and restart the application.
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

Copy `backend/.env.example` to `backend/.env` and fill in both values: a YouTube Data API key and a random string for `SECRET_KEY`.

**3. Launch**

The script installs Python and Node dependencies, initializes the database and starts both servers.

```
python run_project.py
```

(`python3` on Linux / macOS.) The frontend runs on http://localhost:8080.

Frontend only: `cd frontend && npm run dev`.

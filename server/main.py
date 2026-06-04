import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import IS_POSTGRES, PH, get_db, init_db

if IS_POSTGRES:
    import psycopg2.extras  # type: ignore

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-app.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


def db_insert(cur, conn, sql: str, params: tuple) -> int:
    """Execute INSERT and return the new row id for both SQLite and PostgreSQL."""
    if IS_POSTGRES:
        cur.execute(sql + " RETURNING id", params)
        row_id = cur.fetchone()[0]
    else:
        cur.execute(sql, params)
        row_id = cur.lastrowid
    conn.commit()
    return row_id


def db_fetchall(conn, sql: str, params: tuple = ()) -> list:
    """Execute SELECT and return list of dicts for both backends."""
    if IS_POSTGRES:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)  # type: ignore
    else:
        cur = conn.cursor()
    cur.execute(sql, params)
    return [dict(r) for r in cur.fetchall()]


# ── Models ───────────────────────────────────────────────

class ContactIn(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: Optional[str] = None


class JobIn(BaseModel):
    title: str
    department: str
    location: str
    type: str
    description: str


class SubscriptionIn(BaseModel):
    email: str


# ── Routes ───────────────────────────────────────────────

@app.post("/api/contacts")
def create_contact(body: ContactIn):
    conn = get_db()
    try:
        cur = conn.cursor()
        row_id = db_insert(cur, conn,
            f"INSERT INTO contacts (first_name, last_name, email, phone, company, service, message) VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH})",
            (body.first_name, body.last_name, body.email, body.phone, body.company, body.service, body.message),
        )
        return {"success": True, "id": row_id}
    finally:
        conn.close()


@app.get("/api/jobs")
def get_jobs():
    conn = get_db()
    try:
        return db_fetchall(conn, f"SELECT * FROM jobs WHERE is_active = 1 ORDER BY created_at ASC")
    finally:
        conn.close()


@app.post("/api/jobs")
def create_job(body: JobIn):
    conn = get_db()
    try:
        cur = conn.cursor()
        row_id = db_insert(cur, conn,
            f"INSERT INTO jobs (title, department, location, type, description) VALUES ({PH},{PH},{PH},{PH},{PH})",
            (body.title, body.department, body.location, body.type, body.description),
        )
        return {"success": True, "id": row_id}
    finally:
        conn.close()


@app.post("/api/applications")
async def create_application(
    job_id: Optional[str] = Form(None),
    job_title: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    consent: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
):
    resume_filename = None
    resume_path = None

    if resume and resume.filename:
        ext = Path(resume.filename).suffix.lower()
        if ext not in (".pdf", ".doc", ".docx"):
            raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are allowed")

        content = await resume.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 10 MB")

        resume_filename = f"{uuid.uuid4().hex}{ext}"
        resume_path = str(UPLOADS_DIR / resume_filename)
        with open(resume_path, "wb") as f:
            f.write(content)

    conn = get_db()
    try:
        cur = conn.cursor()
        row_id = db_insert(cur, conn,
            f"INSERT INTO job_applications (job_id, job_title, first_name, last_name, email, phone, consent, resume_filename, resume_path) VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH})",
            (
                int(job_id) if job_id else None,
                job_title, first_name, last_name, email, phone,
                1 if consent in ("true", "True", "1") else 0,
                resume_filename, resume_path,
            ),
        )
        return {"success": True, "id": row_id}
    finally:
        conn.close()


@app.post("/api/subscriptions")
def create_subscription(body: SubscriptionIn):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"INSERT INTO newsletter_subscriptions (email) VALUES ({PH})", (body.email,))
        conn.commit()
        return {"success": True}
    except Exception as e:
        if "UNIQUE" in str(e).upper():
            return {"success": False, "message": "Already subscribed"}
        raise
    finally:
        conn.close()

import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import boto3
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import IS_POSTGRES, PH, get_db, init_db

if IS_POSTGRES:
    import psycopg2.extras  # type: ignore

S3_BUCKET = os.environ.get("S3_BUCKET", "wisesource-resumes")
s3 = boto3.client("s3")

UPLOADS_DIR = Path(__file__).parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://wise-source-website.vercel.app", "https://main.d28qsol90tm0c9.amplifyapp.com"],
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


class BlogIn(BaseModel):
    category: str
    title: str
    caption: Optional[str] = None
    excerpt: str
    image: str
    date: str
    read_time: str
    content_intro: Optional[str] = None
    content_points: Optional[str] = None
    content_conclusion_heading: Optional[str] = None
    content_conclusion_text: Optional[str] = None
    is_published: int = 1


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


@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, key: str = ""):
    if key != "wisesource-admin-2026":
        raise HTTPException(status_code=403, detail="Forbidden")
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"DELETE FROM jobs WHERE id = {PH}", (job_id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Job not found")
        return {"success": True}
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

        now = datetime.now(timezone.utc)
        timestamp = now.strftime("%Y%m%d%H%M%S")
        folder_job_id = job_id if job_id else "general"
        resume_filename = f"{first_name}_{last_name}_{timestamp}{ext}"
        s3_key = f"WiseSource_Application/{now.year}/{now.month:02d}/{now.day:02d}/{folder_job_id}/{resume_filename}"
        s3.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=content)
        resume_path = f"s3://{S3_BUCKET}/{s3_key}"

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


@app.get("/api/admin/data")
def admin_data(key: str = ""):
    if key != "wisesource-admin-2026":
        raise HTTPException(status_code=403, detail="Forbidden")
    conn = get_db()
    try:
        return {
            "contacts": db_fetchall(conn, "SELECT * FROM contacts ORDER BY created_at DESC"),
            "job_applications": db_fetchall(conn, "SELECT * FROM job_applications ORDER BY created_at DESC"),
            "newsletter_subscriptions": db_fetchall(conn, "SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC"),
            "jobs": db_fetchall(conn, "SELECT * FROM jobs ORDER BY created_at ASC"),
            "blogs": db_fetchall(conn, "SELECT * FROM blogs ORDER BY id ASC"),
        }
    finally:
        conn.close()


@app.get("/api/blogs")
def get_blogs():
    conn = get_db()
    try:
        return db_fetchall(conn, "SELECT * FROM blogs WHERE is_published = 1 ORDER BY id ASC")
    finally:
        conn.close()


@app.post("/api/blogs")
def create_blog(body: BlogIn):
    conn = get_db()
    try:
        cur = conn.cursor()
        row_id = db_insert(cur, conn,
            f"INSERT INTO blogs (category, title, caption, excerpt, image, date, read_time, content_intro, content_points, content_conclusion_heading, content_conclusion_text, is_published) VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH})",
            (body.category, body.title, body.caption, body.excerpt, body.image, body.date, body.read_time, body.content_intro, body.content_points, body.content_conclusion_heading, body.content_conclusion_text, body.is_published),
        )
        return {"success": True, "id": row_id}
    finally:
        conn.close()


@app.delete("/api/blogs/{blog_id}")
def delete_blog(blog_id: int, key: str = ""):
    if key != "wisesource-admin-2026":
        raise HTTPException(status_code=403, detail="Forbidden")
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"DELETE FROM blogs WHERE id = {PH}", (blog_id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Blog not found")
        return {"success": True}
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

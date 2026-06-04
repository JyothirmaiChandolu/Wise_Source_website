import os
import sqlite3
from pathlib import Path

DATABASE_URL = os.environ.get("DATABASE_URL", "")
IS_POSTGRES = bool(DATABASE_URL)
PH = "%s" if IS_POSTGRES else "?"  # placeholder for queries

if IS_POSTGRES:
    import psycopg2
    import psycopg2.extras

DB_PATH = Path(__file__).parent / "wisesource.db"


def get_db():
    if IS_POSTGRES:
        url = DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return psycopg2.connect(url)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    if IS_POSTGRES:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                service TEXT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                department TEXT NOT NULL,
                location TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS job_applications (
                id SERIAL PRIMARY KEY,
                job_id INTEGER,
                job_title TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                consent INTEGER NOT NULL DEFAULT 0,
                resume_filename TEXT,
                resume_path TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("SELECT COUNT(*) FROM jobs")
        count = cur.fetchone()[0]
    else:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                company TEXT,
                service TEXT,
                message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                department TEXT NOT NULL,
                location TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS job_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id INTEGER,
                job_title TEXT NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                consent INTEGER NOT NULL DEFAULT 0,
                resume_filename TEXT,
                resume_path TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur = conn.cursor()
        count = cur.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]

    if count == 0:
        seed = [
            ("Senior Cloud Architect", "Engineering", "Remote", "Full-time", "Design and lead enterprise-scale cloud infrastructure across AWS, Azure, and GCP for Fortune 500 clients."),
            ("Full Stack Engineer", "Engineering", "San Francisco, CA", "Full-time", "Build high-performance web applications end-to-end using React, Node.js, and modern cloud-native patterns."),
            ("Data Engineer", "Data Engineering", "New York, NY", "Full-time", "Architect and maintain scalable data pipelines and lakehouses that power real-time analytics at scale."),
            ("Data Scientist", "Analytics", "Remote", "Full-time", "Turn complex datasets into actionable insights and predictive models that drive measurable business outcomes."),
            ("DevOps Engineer", "Engineering", "Austin, TX", "Full-time", "Automate CI/CD pipelines, infrastructure provisioning, and observability across multi-cloud environments."),
            ("Product Manager", "Product", "Remote", "Full-time", "Own the roadmap for our SaaS products, working closely with engineering and clients to ship impactful features."),
        ]
        cur.executemany(f"INSERT INTO jobs (title, department, location, type, description) VALUES ({PH},{PH},{PH},{PH},{PH})", seed)

    conn.commit()
    conn.close()

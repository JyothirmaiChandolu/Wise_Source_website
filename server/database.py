import json
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
        cur.execute("""
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                caption TEXT,
                excerpt TEXT NOT NULL,
                image TEXT NOT NULL,
                date TEXT NOT NULL,
                read_time TEXT NOT NULL,
                content_intro TEXT,
                content_points TEXT,
                content_conclusion_heading TEXT,
                content_conclusion_text TEXT,
                is_published INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            DO $$ BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM information_schema.table_constraints
                WHERE constraint_name = 'fk_job' AND table_name = 'job_applications'
              ) THEN
                ALTER TABLE job_applications
                  ADD CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;
              END IF;
            END $$;
        """)
        cur.execute("SELECT COUNT(*) FROM jobs")
        job_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM blogs")
        blog_count = cur.fetchone()[0]
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
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                caption TEXT,
                excerpt TEXT NOT NULL,
                image TEXT NOT NULL,
                date TEXT NOT NULL,
                read_time TEXT NOT NULL,
                content_intro TEXT,
                content_points TEXT,
                content_conclusion_heading TEXT,
                content_conclusion_text TEXT,
                is_published INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur = conn.cursor()
        job_count = cur.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
        blog_count = cur.execute("SELECT COUNT(*) FROM blogs").fetchone()[0]

    if job_count == 0:
        seed_jobs = [
            ("Senior Cloud Architect", "Engineering", "Remote", "Full-time", "Design and lead enterprise-scale cloud infrastructure across AWS, Azure, and GCP for Fortune 500 clients."),
            ("Full Stack Engineer", "Engineering", "San Francisco, CA", "Full-time", "Build high-performance web applications end-to-end using React, Node.js, and modern cloud-native patterns."),
            ("Data Engineer", "Data Engineering", "New York, NY", "Full-time", "Architect and maintain scalable data pipelines and lakehouses that power real-time analytics at scale."),
            ("Data Scientist", "Analytics", "Remote", "Full-time", "Turn complex datasets into actionable insights and predictive models that drive measurable business outcomes."),
            ("DevOps Engineer", "Engineering", "Austin, TX", "Full-time", "Automate CI/CD pipelines, infrastructure provisioning, and observability across multi-cloud environments."),
            ("Product Manager", "Product", "Remote", "Full-time", "Own the roadmap for our SaaS products, working closely with engineering and clients to ship impactful features."),
        ]
        cur.executemany(f"INSERT INTO jobs (title, department, location, type, description) VALUES ({PH},{PH},{PH},{PH},{PH})", seed_jobs)

    if blog_count == 0:
        seed_blogs = [
            (
                "Data Privacy & Compliance",
                "Navigating the Privacy Matrix: Surviving the CCPA Compliance Waves",
                "Beyond the Opt-Out Button: What True Data Privacy Looks Like Now.",
                "Data compliance isn't just about sticking a long, unreadable legal text block in your footer anymore. The latest CCPA updates change the rules on how companies collect, track, and handle user information.",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop",
                "June 2026", "4 min read",
                "Data compliance isn't just about sticking a long, unreadable legal text block in your footer anymore. The latest updates to the California Consumer Privacy Act (CCPA) change the rules on how companies collect, track, and handle user information. If you're running digital systems today, compliance needs to be built directly into your technical architecture.",
                json.dumps([
                    {"title": "Fixing the Interface Bias", "text": "You can no longer use deceptive \"dark patterns\" that trick users into consenting to tracking. The design to opt out must be just as prominent and take the exact same number of clicks as opting in."},
                    {"title": "The Long Archive Audit", "text": "Consumers now have the right to request years of historical data. If your software can't instantly crawl your legacy cloud systems, offline databases, and cold storage to pull an individual's data footprint, you are exposed."},
                    {"title": "Pulling Back the Curtain on AI", "text": "If you use software algorithms to automatically score users or make decisions without human review, CCPA now requires you to offer a clear explanation of that logic—and give users an absolute right to opt out of automated profiling."},
                ]),
                "The Bottom Line",
                "Compliance isn't a legal problem; it's a systems infrastructure problem. Winning enterprises are those that build clear data visibility directly into their pipelines from day one.",
            ),
            (
                "Enterprise Analytics",
                "Cracking the Enterprise Dashboard: The Mechanics of CEO Performance Analysis",
                "Cutting Through Corporate Noise with Hard Execution Data.",
                "Evaluating executive performance has historically been an exercise in subjective board evaluations and delayed quarterly reviews. Automated CEO Performance Analysis changes that dynamic entirely.",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
                "May 2026", "5 min read",
                "This project answers a deceptively simple question: for every publicly traded company in the S&P 500 and Russell 2000 indices, who was CEO — and when? The answer matters for governance research, activist investing, board-diversity analysis, executive-compensation studies, and event-driven trading strategies alike. Yet no single authoritative database provides a clean, verified CEO history going back to 2000 for all ~2,500 companies across both indices.\n\nThe CEO Transition Impact Analysis project solves this by building an automated pipeline that collects company lists, ticker symbols, and CIK mappings for companies in the S&P 500 and Russell 2000 from official sources, along with company metadata from Yahoo Finance using yfinance. It uses a custom AI Agent built on OpenAI GPT-4o with a ReAct loop to fetch SEC EDGAR 8-K filings and automatically extract CEO transition information — including CEO names, start dates, and end dates — while also collecting company and index stock market data. The result is a structured dataset — one row per CEO tenure per company — that spans 25 years and covers every leadership transition a public company is required to disclose.\n\nCommercial databases like Bloomberg, FactSet, and Refinitiv do carry executive history, but they are expensive, have inconsistent historical depth for small-cap companies, and are difficult to audit. For a researcher working across the full Russell 2000, gaps and errors are common below the large-cap tier.\n\nFree sources each cover only part of the picture:",
                json.dumps([
                    {"title": "SEC EDGAR", "text": "Has authoritative CEO-change filings, but only from August 2004 onward, and only if you know which specific filing type and item to look for."},
                    {"title": "Wikipedia", "text": "Has narrative CEO history for many companies, but it is unstructured, inconsistently maintained, and requires interpretation."},
                    {"title": "Web Search", "text": "Can fill individual gaps, but is not systematic at scale."},
                ]),
                "The Outcome",
                "By feeding these operational variables into high-speed data analytics dashboards, company boards can stop arguing over vague impressions. Instead, clean data parsing delivers an objective, live view of structural efficiency, making it incredibly simple to optimize enterprise targets.",
            ),
            (
                "AI & Biotechnology",
                "Embark on a Journey into Biology's Tomorrow: Unveiling the Marvels of AlphaFold!",
                "Code Meets Chemistry: How Deep Learning Solved a 50-Year Biological Riddle.",
                "For decades, predicting how a protein chain folds into its 3D shape required years of grueling lab work. Google DeepMind's AlphaFold proved that deep neural networks could predict molecular structures with staggering accuracy in minutes.",
                "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop",
                "April 2026", "5 min read",
                "For decades, predicting exactly how a protein chain folds into its three-dimensional shape required years of grueling, expensive laboratory work using X-ray crystallography. Google DeepMind's AlphaFold blew those timelines apart, proving that deep neural networks could predict molecular structures with staggering accuracy in just a matter of minutes.",
                json.dumps([
                    {"title": "Mapping More Than Just Proteins", "text": "The latest iterations move past simple amino-acid strings. We are now seeing architectures predict interactions across DNA, RNA, and complex chemical ligands, giving pharmaceutical labs a massive head start in drug design."},
                    {"title": "Spotting Toxic Mutations", "text": "Specialized offshoot models can now analyze tiny genetic variations to predict with high confidence whether specific mutations are benign or likely to cause cellular damage."},
                    {"title": "Radical Research Acceleration", "text": "By replacing slow laboratory trial-and-error with high-fidelity predictive modeling, software engineering has effectively compressed decades of biological research into a couple of keystrokes."},
                ]),
                "The Future is Computational",
                "We are moving rapidly toward a world where the next life-saving medicine won't just be discovered in a petri dish—it will be compiled, simulated, and optimized directly inside a software repository.",
            ),
            (
                "Cloud Architecture",
                "The Future of Cloud-Native Architecture",
                "Microservices, Service Meshes, and the Next Era of Distributed Systems.",
                "How microservices, service meshes, and eBPF are reshaping how enterprises build and operate large-scale distributed systems in the cloud.",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
                "March 2026", "6 min read",
                "The cloud-native revolution is no longer a future promise — it is the operating standard for every serious enterprise technology team. Microservices, service meshes, and emerging kernel-level tools like eBPF are fundamentally changing how large-scale distributed systems are built, monitored, and scaled.",
                json.dumps([
                    {"title": "Microservices and Service Mesh", "text": "Breaking monolithic applications into independently deployable services is only half the battle. Service meshes like Istio and Linkerd handle the hard part — traffic routing, mutual TLS encryption, retries, and observability — without a single line of application code change."},
                    {"title": "eBPF for Deep Observability", "text": "Extended Berkeley Packet Filter (eBPF) allows engineers to attach lightweight programs directly to the Linux kernel. This means you can collect granular network, security, and performance telemetry across your entire fleet without any instrumentation overhead on the application side."},
                    {"title": "Platform Engineering as a Discipline", "text": "Leading organizations are now building internal developer platforms (IDPs) that abstract away infrastructure complexity. Instead of every team reinventing CI/CD pipelines and Kubernetes manifests, a central platform team delivers a paved road — accelerating product delivery across the board."},
                ]),
                "The Cloud-Native Mandate",
                "Cloud-native is not a checkbox — it is a continuous architectural discipline. Enterprises that invest in service mesh, eBPF observability, and platform engineering today will have an insurmountable operational advantage within the next three years.",
            ),
            (
                "Data Engineering",
                "Building Data Pipelines at Scale: Lessons from the Field",
                "What Nobody Tells You About Petabyte-Scale Data Until It's Too Late.",
                "Real-world patterns and hard-won lessons from building petabyte-scale data pipelines for Fortune 500 companies — covering Kafka, Spark, and the lakehouse pattern.",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
                "February 2026", "7 min read",
                "After building data infrastructure for some of the largest enterprises in North America, a clear pattern emerges: most data pipeline failures are not technology failures — they are architecture failures made early that compound silently over time.",
                json.dumps([
                    {"title": "Kafka Is Not a Database", "text": "Teams routinely treat Apache Kafka as a persistent data store. It is not. Kafka is a high-throughput event streaming backbone. Design your pipelines with a clear separation between your streaming layer (Kafka), your transformation layer (Spark or Flink), and your storage layer (Delta Lake or Iceberg)."},
                    {"title": "The Lakehouse Pattern Wins at Scale", "text": "The traditional data warehouse versus data lake debate is over. The lakehouse pattern — combining the raw storage flexibility of a data lake with the ACID transaction guarantees of a warehouse — is the architecture that scales."},
                    {"title": "Schema Evolution Is a First-Class Problem", "text": "At petabyte scale, upstream data producers change their schemas constantly. Building schema registries, enforcing backward compatibility contracts, and automating schema drift detection into your pipeline health checks is not optional."},
                ]),
                "The Foundational Truth",
                "Great data pipelines are invisible — they just work. Getting there requires treating data infrastructure with the same engineering rigor you apply to your production application stack.",
            ),
            (
                "AI & ML",
                "AI Integration in Enterprise Systems: A Practical Guide",
                "Moving Beyond the AI Pilot Graveyard Into Real Production Value.",
                "A step-by-step framework for evaluating, piloting, and scaling AI/ML capabilities in enterprise environments — without disrupting existing workflows.",
                "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop",
                "January 2026", "6 min read",
                "Approximately 80% of enterprise AI pilots never make it to production. The technology is rarely the problem — the integration strategy is. Most organizations approach AI as a standalone initiative bolted onto existing systems rather than as a capability woven into the core architecture.",
                json.dumps([
                    {"title": "Start With a Narrow, High-Value Problem", "text": "Resist the temptation to boil the ocean. The AI integrations that succeed are ruthlessly scoped. Identify a single workflow with measurable business impact and build deep rather than wide."},
                    {"title": "Build the Data Infrastructure First", "text": "AI models are only as good as the data pipelines feeding them. Before a single model is trained, the data collection, labeling, versioning, and monitoring infrastructure must be production-grade."},
                    {"title": "MLOps Is Not Optional", "text": "Deploying a model is easy. Keeping it accurate three months later is hard. Model drift, data distribution shifts, and dependency rot will silently degrade performance unless you have automated retraining pipelines and monitoring built from day one."},
                ]),
                "The Real Competitive Advantage",
                "The enterprises winning with AI are not the ones with the most sophisticated models — they are the ones with the most reliable AI infrastructure.",
            ),
            (
                "DevOps",
                "DevSecOps: Shifting Security Left Without Slowing Down",
                "How to Ship Fast and Stay Secure — Without Choosing One Over the Other.",
                "How modern engineering teams are embedding security into every step of the CI/CD pipeline — and why it actually makes you ship faster, not slower.",
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
                "December 2025", "5 min read",
                "For years, security and development velocity were treated as fundamentally opposing forces. DevSecOps dismantles that false choice entirely. When security is embedded as automated gates inside the CI/CD pipeline rather than bolted on as a manual review at the end, it stops being a bottleneck and starts being a deployment accelerator.",
                json.dumps([
                    {"title": "Automated Security Scanning in the Pipeline", "text": "Static application security testing (SAST), dependency vulnerability scanning, and container image scanning should run on every single commit. Tools like Snyk, Trivy, and Semgrep integrate directly into GitHub Actions and GitLab CI with zero developer friction."},
                    {"title": "Infrastructure as Code Security", "text": "Every cloud misconfiguration that has ever caused a major breach was, at its core, a code review failure. Scanning Terraform and CloudFormation templates with tools like Checkov or tfsec before they reach production catches open S3 buckets, overprivileged IAM roles, and unencrypted databases before they exist."},
                    {"title": "Secrets Management as a Hard Gate", "text": "Hardcoded credentials in source code remain one of the most common enterprise breach vectors. Integrating secret scanning as a blocking CI check eliminates the entire class of credential exposure vulnerabilities at the source."},
                ]),
                "The Result",
                "Teams that implement DevSecOps correctly do not just improve their security posture — they ship more confidently. When every commit is automatically verified against security baselines, the cognitive load of 'is this safe to deploy?' disappears.",
            ),
        ]
        cur.executemany(
            f"INSERT INTO blogs (category, title, caption, excerpt, image, date, read_time, content_intro, content_points, content_conclusion_heading, content_conclusion_text) VALUES ({PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH},{PH})",
            seed_blogs
        )

    conn.commit()
    conn.close()

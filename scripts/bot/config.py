"""
Configuration for the Job Scraper.
Keywords, geo-filtering rules, and settings.
"""

import os

# ─── Geo-filtering ──────────────────────────────────────────
# Jobs in these countries pass regardless of remote/onsite
ALLOWED_ONSITE_COUNTRIES = {"egypt", "مصر", "saudi arabia", "saudi", "ksa", "السعودية"}

# Patterns that indicate a location is in Egypt
EGYPT_PATTERNS = {
    "egypt", "مصر", "cairo", "القاهرة", "alexandria", "الإسكندرية",
    "giza", "الجيزة", "minya", "المنيا", "mansoura", "المنصورة",
    "tanta", "طنطا", "aswan", "أسوان", "luxor", "الأقصر",
    "port said", "بورسعيد", "suez", "السويس", "ismailia", "الإسماعيلية",
    "fayoum", "الفيوم", "zagazig", "الزقازيق", "damanhur", "دمنهور",
    "beni suef", "بني سويف", "sohag", "سوهاج", "asyut", "أسيوط",
    "qena", "قنا", "hurghada", "الغردقة", "sharm el sheikh",
    "new cairo", "6th of october", "6 october", "smart village",
    "new capital", "العاصمة الإدارية", "nasr city", "مدينة نصر",
    "maadi", "المعادي", "heliopolis", "مصر الجديدة", "dokki", "الدقي",
    "mohandessin", "المهندسين",
}

# Patterns that indicate a location is in Saudi Arabia
SAUDI_PATTERNS = {
    "saudi arabia", "saudi", "ksa", "السعودية", "المملكة العربية السعودية",
    "riyadh", "الرياض", "jeddah", "جدة", "mecca", "مكة",
    "medina", "المدينة", "dammam", "الدمام", "khobar", "الخبر",
    "dhahran", "الظهران", "tabuk", "تبوك", "abha", "أبها",
    "taif", "الطائف", "jubail", "الجبيل", "yanbu", "ينبع",
    "neom", "نيوم", "qassim", "القصيم", "hail", "حائل",
    "jazan", "جازان", "najran", "نجران", "al kharj", "الخرج",
}

# Patterns that indicate a job is remote
REMOTE_PATTERNS = {
    "remote", "anywhere", "worldwide", "work from home", "wfh",
    "distributed", "global", "fully remote", "100% remote",
    "remote-friendly", "location independent", "عن بعد",
}

# ─── Job Keywords ────────────────────────────────────────────
# Job MUST contain at least one of these (case-insensitive, checked in title + tags)
INCLUDE_KEYWORDS = [
    # Software Engineering
    "software engineer", "software developer", "software development",
    "swe", "sde",
    # Backend
    "backend", "back-end", "back end",
    "server-side", "server side",
    "api developer", "api engineer",
    # Frontend
    "frontend", "front-end", "front end",
    "ui developer", "ui engineer",
    # Full-Stack
    "full-stack", "full stack", "fullstack",
    # DevOps / SRE / Cloud / Infra
    "devops", "dev ops", "dev-ops",
    "sre", "site reliability",
    "cloud engineer", "cloud developer", "cloud architect",
    "infrastructure engineer", "platform engineer",
    "kubernetes", "docker", "terraform",
    "aws engineer", "azure engineer", "gcp engineer",
    # QA / Testing
    "qa engineer", "qa developer", "quality assurance",
    "test engineer", "sdet", "software tester",
    "automation engineer", "test automation",
    "qa analyst", "qa lead", "qa manager",
    # Mobile — expanded
    "mobile developer", "mobile engineer", "mobile application",
    "ios developer", "ios engineer",
    "android developer", "android engineer",
    "flutter developer", "flutter engineer", "flutter",
    "react native developer", "react native engineer", "react native",
    "swift developer", "kotlin developer",
    "mobile app developer", "app developer",
    # Web Development
    "web developer", "web engineer", "webmaster",
    # AI / ML / Data Science
    "machine learning", "ml engineer", "ml developer",
    "ai engineer", "ai developer", "artificial intelligence",
    "deep learning", "nlp engineer", "computer vision",
    "data scientist", "data science",
    "data analyst", "data analytics",
    "data engineer", "etl developer", "data pipeline",
    "big data", "hadoop", "spark engineer",
    # Cybersecurity
    "security engineer", "appsec", "application security",
    "cybersecurity", "cyber security", "infosec",
    "penetration tester", "pen tester", "security analyst",
    "soc analyst", "security architect",
    # Database
    "database administrator", "dba",
    "database developer", "database engineer",
    "sql developer", "postgresql", "mongodb",
    # Blockchain / Web3
    "blockchain developer", "blockchain engineer",
    "smart contract", "solidity developer",
    "web3 developer", "web3 engineer",
    "crypto developer",
    # Game Development
    "game developer", "game engineer", "game programmer",
    "unity developer", "unreal developer",
    "game designer",  # programming-focused game design
    # Embedded / IoT
    "embedded developer", "embedded engineer", "embedded software",
    "iot developer", "iot engineer",
    "firmware developer", "firmware engineer",
    # Systems / Low-level
    "systems engineer", "systems developer",
    "systems programmer", "kernel developer",
    "linux engineer", "os developer",
    # ERP / CRM
    "salesforce developer", "sap developer", "sap engineer",
    "erp developer", "crm developer",
    "dynamics developer", "odoo developer",
    # Networking
    "network engineer", "network administrator",
    "network architect",
    # Programming Languages (as job titles)
    "python developer", "python engineer",
    "java developer", "java engineer",
    "javascript developer", "js developer",
    "typescript developer", "ts developer",
    "golang developer", "go developer", "go engineer",
    "rust developer", "rust engineer",
    "ruby developer", "ruby engineer", "rails developer",
    "php developer", "php engineer",
    "c# developer", ".net developer", "dotnet developer",
    "c++ developer", "cpp developer",
    "scala developer", "elixir developer",
    "perl developer", "r developer",
    # Frameworks (as job titles)
    "node.js developer", "nodejs developer", "node developer",
    "react developer", "react engineer", "next.js developer",
    "angular developer", "vue developer", "vue.js developer",
    "django developer", "flask developer", "fastapi",
    "spring developer", "spring boot",
    "laravel developer", "symfony developer",
    "express.js developer",
    # CMS / WordPress
    "wordpress developer", "shopify developer",
    "drupal developer", "magento developer",
    # Technical Leadership
    "tech lead", "technical lead", "engineering manager",
    "cto", "vp engineering", "head of engineering",
    "principal engineer", "staff engineer", "architect",
    # Teaching / Tutoring
    "coding instructor", "programming instructor",
    "coding tutor", "programming tutor",
    "coding teacher", "programming teacher",
    "bootcamp instructor", "technical instructor",
    "computer science instructor", "cs instructor",
    "technical trainer", "coding mentor",
    # ERP / CRM / Accounting
    "erp developer", "erp consultant", "erp engineer",
    "odoo developer", "odoo engineer", "odoo consultant", "odoo",
    "sap developer", "sap consultant", "sap engineer",
    "sap abap", "sap fiori", "sap hana", "sap basis",
    "salesforce developer", "salesforce engineer", "salesforce admin",
    "dynamics developer", "dynamics 365", "dynamics consultant",
    "oracle developer", "oracle ebs", "oracle apps", "oracle dba",
    "netsuite developer", "netsuite consultant",
    "quickbooks developer",
    "crm developer", "crm engineer",
    "accounting software", "financial software",
    # Internships / Entry Level
    "intern", "internship", "trainee",
    "graduate program", "training program",
    "co-op", "apprentice", "apprenticeship",
    "working student", "student developer",
    # Marketing / Growth / Social Media
    "digital marketing", "digital marketer",
    "social media marketing", "social media manager", "social media specialist",
    "growth marketing", "growth hacker", "growth manager",
    "seo specialist", "seo manager", "seo analyst",
    "sem specialist", "sem manager",
    "ppc specialist", "ppc manager", "paid media",
    "content marketing", "content strategist", "content manager",
    "email marketing", "email specialist",
    "marketing automation", "marketing analyst",
    "performance marketing", "demand generation",
    "brand marketing", "brand manager",
    "community manager", "community specialist",
    "copywriter", "content writer", "content creator",
    "marketing manager", "marketing coordinator",
    "marketing specialist", "marketing director",
    "social media coordinator", "influencer marketing",
    "affiliate marketing", "marketing intern",
    # Data Engineering (expanded)
    "data engineer", "etl developer", "data pipeline",
    "data architect", "data platform",
    "big data engineer", "hadoop engineer", "spark engineer",
    "airflow", "dbt developer", "data warehouse",
    "snowflake developer", "redshift", "databricks",
    "data ops", "dataops", "analytics engineer",
    # Application Support / IT Support
    "application support", "app support",
    "application analyst", "application engineer",
    "technical support engineer", "it support engineer",
    "production support", "l2 support", "l3 support",
    "helpdesk engineer", "service desk",
    "incident management", "system support",
    "application administrator", "app admin",
    "technical analyst", "support analyst",
    # UI/UX Design & Graphic Design
    "ui/ux designer", "ui ux designer", "ux designer", "ux engineer",
    "ui designer", "ui developer", "ux developer",
    "ux researcher", "ux research", "user experience",
    "user interface", "interaction designer",
    "product designer", "visual designer",
    "graphic designer", "graphic design",
    "brand designer", "brand identity",
    "web designer", "creative designer",
    "figma", "sketch designer", "adobe xd",
    "design system", "motion designer",
    # Business Analysis & Product
    "business analyst", "business analysis",
    "product owner", "product manager",
    "project manager", "program manager", "scrum master",
    "agile coach", "delivery manager",
    "requirements analyst", "functional analyst",
    "process analyst", "systems analyst",
    "business intelligence", "bi analyst",
    "product analyst", "product strategist",
    "technical product manager", "tpm",
    # Data Analysis (additional)
    "data analyst", "data analysis",
    "power bi", "tableau", "looker",
    "bi developer", "bi engineer",
    "reporting analyst", "insight analyst",
    "excel analyst", "sql analyst",
    # General (broad catch — filtered by EXCLUDE)
    "programmer", "developer", "engineer", "designer", "analyst",
]

# Job is EXCLUDED if it contains any of these (case-insensitive)
EXCLUDE_KEYWORDS = [
    # Non-tech roles
    "interior design", "fashion design", "industrial design",
    "recruiter", "talent acquisition", "hr manager", "human resources",
    "customer support", "customer service", "customer success",
    "financial analyst", "accountant", "bookkeeper",
    "office manager", "administrative",
    "supply chain", "logistics",
    # Pure sales (not marketing)
    "sales representative", "sales executive", "account executive",
    "real estate agent", "insurance agent",
    # Hardware / Non-software engineering
    "mechanical engineer", "electrical engineer", "civil engineer",
    "chemical engineer", "structural engineer",
    "hardware engineer", "pcb",
    # Medical / Other
    "medical coder", "billing coder", "clinical",
    "nurse", "physician", "pharmacist",
    "dental", "veterinary",
]

# ─── Emoji Map ───────────────────────────────────────────────
# Maps keywords in job title/tags to emoji
EMOJI_MAP = {
    "backend": "⚙️",
    "back-end": "⚙️",
    "frontend": "🎨",
    "front-end": "🎨",
    "full-stack": "🔄",
    "fullstack": "🔄",
    "devops": "🚀",
    "sre": "🚀",
    "cloud": "☁️",
    "aws": "☁️",
    "azure": "☁️",
    "qa": "🧪",
    "test": "🧪",
    "quality": "🧪",
    "mobile": "📱",
    "ios": "🍎",
    "android": "🤖",
    "flutter": "🦋",
    "react native": "📱",
    "python": "🐍",
    "java": "☕",
    "javascript": "🟨",
    "typescript": "🔷",
    "react": "⚛️",
    "node": "🟩",
    "golang": "🐹",
    "rust": "🦀",
    "ruby": "💎",
    "php": "🐘",
    ".net": "🟣",
    "c#": "🟣",
    "c++": "🔵",
    "swift": "🍎",
    "kotlin": "🟠",
    "data engineer": "📊",
    "data scien": "📊",
    "machine learning": "🤖",
    "ml ": "🤖",
    "ai ": "🤖",
    "artificial intel": "🤖",
    "deep learning": "🧠",
    "blockchain": "⛓️",
    "web3": "⛓️",
    "solidity": "⛓️",
    "game dev": "🎮",
    "unity": "🎮",
    "unreal": "🎮",
    "security": "🔒",
    "cyber": "🔒",
    "penetration": "🔒",
    "embedded": "🔌",
    "iot": "🔌",
    "firmware": "🔌",
    "database": "🗄️",
    "dba": "🗄️",
    "sql": "🗄️",
    "wordpress": "📝",
    "shopify": "🛒",
    "salesforce": "☁️",
    "sap": "🏢",
    "network": "🌐",
    "instructor": "📚",
    "tutor": "📚",
    "teacher": "📚",
    "mentor": "📚",
    "senior": "👨‍💻",
    "junior": "🌱",
    "lead": "⭐",
    "principal": "⭐",
    "staff": "⭐",
    "intern": "🎓",
    "architect": "🏗️",
    "ux designer": "🎨",
    "ui designer": "🎨",
    "ux research": "🎨",
    "graphic design": "🎨",
    "product design": "🎨",
    "visual design": "🎨",
    "brand design": "🎨",
    "web design": "🎨",
    "figma": "🎨",
    "business analyst": "💼",
    "product owner": "💼",
    "product manager": "💼",
    "project manager": "💼",
    "scrum master": "💼",
    "agile": "💼",
    "power bi": "📊",
    "tableau": "📊",
    "looker": "📊",
    "bi analyst": "📊",
    "reporting": "📊",
    "marketing": "📣",
    "social media": "📣",
    "growth": "📈",
    "seo": "🔍",
    "sem": "🔍",
    "ppc": "💰",
    "content": "✍️",
    "copywriter": "✍️",
    "email marketing": "📧",
    "data pipeline": "📊",
    "etl": "📊",
    "data warehouse": "📊",
    "snowflake": "📊",
    "databricks": "📊",
    "application support": "🛠️",
    "app support": "🛠️",
    "technical support": "🛠️",
    "production support": "🛠️",
    "helpdesk": "🛠️",
    "erp": "🏢",
    "odoo": "🏢",
    "dynamics": "🏢",
    "oracle": "🏢",
    "netsuite": "🏢",
    "accounting": "🏢",
    "remote": "🌍",
    "egypt": "🇪🇬",
    "مصر": "🇪🇬",
    "cairo": "🇪🇬",
    "saudi": "🇸🇦",
    "riyadh": "🇸🇦",
    "jeddah": "🇸🇦",
}

# Default emoji if no match
DEFAULT_EMOJI = "💻"

# ─── Source Display Names ────────────────────────────────────
SOURCE_DISPLAY = {
    "wuzzuf": "WUZZUF",
    "linkedin": "LinkedIn",
}

# ─── Misc ────────────────────────────────────────────────────
MAX_JOBS_PER_RUN = 100   # safety cap per run
REQUEST_TIMEOUT = 15     # seconds

import os
import psycopg2

def get_postgres_url() -> str:
    # First try environment variable
    url = os.environ.get("POSTGRES_URL")
    if url:
        return url
        
    # If not in env, try to read from .env.local
    try:
        env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env.local")
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("POSTGRES_URL="):
                    return line.strip().split("=", 1)[1].strip('"\'')
    except Exception:
        pass
        
    raise ValueError("POSTGRES_URL not found!")

def run_cleanup(should_delete=False):
    url = get_postgres_url()
    conn = psycopg2.connect(url)
    
    # We will identify jobs that are clearly NOT engineering/tech related
    # based on some of the roles we saw earlier like Marketing, SEO, etc.
    junk_keywords = [
        '%marketing%', '%seo%', '%sales%', '%human resources%', 
        '%hr %', '%recruiter%', '%accountant%', '%finance%',
        '%business development%', '%content writer%', '%copywriter%'
    ]
    
    try:
        with conn.cursor() as cur:
            # 1. First, let's just COUNT how many total jobs we have
            cur.execute("SELECT count(*) FROM jobs")
            total_jobs = cur.fetchone()[0]
            print(f"Total jobs currently in database: {total_jobs}")
            
            # 2. Count how many match our 'junk' keywords
            where_clause = " OR ".join(["title ILIKE %s" for _ in junk_keywords])
            query = f"SELECT count(*) FROM jobs WHERE {where_clause}"
            cur.execute(query, junk_keywords)
            junk_count = cur.fetchone()[0]
            
            print(f"Jobs matching non-engineering keywords (Marketing, SEO, Sales, etc.): {junk_count}")
            
            # 3. Actually select a few to show as examples
            if junk_count > 0:
                example_query = f"SELECT title, company FROM jobs WHERE {where_clause} LIMIT 5"
                cur.execute(example_query, junk_keywords)
                print("\nExamples of jobs that would be deleted:")
                for row in cur.fetchall():
                    print(f" - {row[0]} at {row[1]}")
            
            # 4. Delete if requested
            if should_delete and junk_count > 0:
                print("\nDeleting non-engineering jobs...")
                delete_query = f"DELETE FROM jobs WHERE {where_clause}"
                cur.execute(delete_query, junk_keywords)
                conn.commit()
                print(f"Successfully deleted {cur.rowcount} jobs!")
                    
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    import sys
    should_delete = "--delete" in sys.argv
    run_cleanup(should_delete)

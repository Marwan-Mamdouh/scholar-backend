
erDiagram


    users {
        bigint id PK
        varchar email UK
        varchar password
        varchar role "student | graduate | admin"
        timestamp created_at
        timestamp updated_at
    }

    profiles {
        bigint user_id PK, FK
        varchar first_name
        varchar last_name
        varchar gender
        varchar country
        varchar governorate
        varchar university
        varchar faculty
        varchar department
        integer graduation_year
        varchar linkedin_url
        varchar github_url
        varchar scholar_url
        jsonb skills
        jsonb experience
    }



    companies {
        bigint id PK
        varchar name UK
        varchar industry
        varchar size
        varchar website
        varchar linkedin
        varchar glassdoor
        varchar headquarters_country
        timestamp created_at
        timestamp updated_at

    }

    company_branches {
        bigint id PK
        bigint company_id FK
        varchar region
        varchar country
        varchar state
        varchar city
        varchar presence "active | inactive "
    }

    jobs {
        bigint id PK
        bigint company_id FK 
        bigint branch_id FK 
        varchar title
        varchar industry
        jsonb domains
        varchar type "full-time | part-time | internship"
        varchar seniority "junior | mid | senior | lead"
        text description
        text requirements
        varchar salary
        varchar apply_link 
        timestamp posted_at
        timestamp updated_at

    }

    job_applications {
        bigint id PK
        bigint job_id FK 
        bigint applicant_user_id FK 
        varchar cv_path 
        varchar status "pending | reviewed | accepted | rejected"            
        timestamp submitted_at
    }


    graduation_project_applications {
            bigint id PK
            bigint project_id FK
            bigint applicant_user_id FK
            jsonb team_members
            varchar proposal_summary_url
            varchar status "pending | reviewed | accepted | rejected"            
            timestamp submitted_at
        }



    academic_researchers {
        bigint id PK
        varchar first_name
        varchar last_name
        varchar institution_name
        varchar department
        varchar affiliation
        varchar main_topic
        jsonb subtopics
        varchar scholar_id 
        varchar linkedin_url
        timestamp created_at
        timestamp updated_at        
    }

    graduation_projects {
        bigint id PK
        boolean is_sponsored
        bigint sponsor_company_id FK 
        varchar university
        varchar faculty
        varchar industry
        jsonb domains 
        varchar supervisor
        varchar co_supervisor
        varchar project_title
        integer no_of_students
        varchar documentation_link 
        timestamp posted_at
    }

    feedback {
        bigint id PK
        bigint user_id FK "optional link to logged-in user"
        varchar first_name
        varchar last_name        
        varchar email
        varchar category "bug | feature | data | other"
        text message
        timestamp submitted_at
    }


    team_members {
        bigint id PK
        varchar name
        varchar role
        varchar linkedin_url
        varchar team "web | industry | academia"
        timestamp created_at
        timestamp updated_at
    }




    ACADEMIC_PUBLICATIONS {
        bigint id PK
        bigint sub_category_id FK
        varchar acronym
        varchar publication_type
        varchar title UK
        char issn UK
        char eissn UK
        varchar open_access_type
        varchar indexing_service
        varchar specific_focus_scope
        varchar website_link
        text journal_scope
        timestamp created_at
    }

    
    PUBLICATION_DOMAINS {
        bigint id PK
        varchar name UK
    }

    PUBLICATION_SUB_CATEGORIES {
        bigint id PK
        bigint domain_id FK
        varchar name
    }



    PUBLICATION_YEARLY_METRICS {
        bigint id PK
        bigint publication_id FK
        integer metric_year PK "Composite UK with pub_id"
        numeric journal_impact_factor
        numeric five_year_impact_factor
        char quartile
        numeric jci
        numeric eigenfactor
        numeric article_influence_score
        numeric citescore
        timestamp updated_at
    }




    users ||--|| profiles : "has profile"
    users ||--o{ job_applications : "submits"
    users ||--o{ graduation_projects : "submits"
    users ||--o{ feedback : "provides"
    users ||--o{ graduation_project_applications : "applies"
    companies ||--o{ company_branches : "has"
    companies ||--o{ jobs : "offers"
    companies ||--o{ graduation_projects : "sponsors"
    jobs ||--o{ job_applications : "receives"
    graduation_projects ||--o{ graduation_project_applications : "receives"


    PUBLICATION_DOMAINS ||--o{ PUBLICATION_SUB_CATEGORIES : "contains"
    PUBLICATION_SUB_CATEGORIES ||--o{ ACADEMIC_PUBLICATIONS : "classifies"
    ACADEMIC_PUBLICATIONS ||--o{ PUBLICATION_YEARLY_METRICS : "tracks_history_of"


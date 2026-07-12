/* 
   ================================================================
   SCHOLAR NEXUS // COMPLETE SERVER BACKEND
   ================================================================
   Features:
   1. Academic Search & Analysis (Semantic Scholar + Gemini AI) ..... Done and need to be checked
   2. Topic Explorer (AI Keyword Mapping) ..... Done and need to be checked
   3. Hot Topics Radar (Breakthroughs) ..... Done and need to be checked
   4. Jobs Portal (Interactive Map, Filtering, Application System) ..... Done and need to be checked
   5. Academic Search & Analysis (Data Base) ..... Done and need to be checked
   6. Companies info (Data Base)  ..... in progres
   7. Graduation Projects (Form and dashboard )  ..... in progres
   ================================================================
    author: Mohamed Gad Mohaned
    ...
   ================================================================
   notes: اي كومنت بالعربي يبقي ده مهم جدا 
*/

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import axios from 'axios';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(process.cwd());
const JWT_SECRET = process.env.JWT_SECRET || 'nexus-super-secret-key-2024';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
import os from 'node:os';
import xlsx from 'xlsx';
import * as cheerio from 'cheerio';
import logger from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./modules/auth/auth.routes.js";
import feedbackRouter from './modules/feedback/feedback.routes.js';
import researchersRouter from './modules/researchers/researchers.routes.js';
import { extractTopField, extractData } from './utils/extractors.js';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/authentication/auth.js";

// --- APP CONFIGURATION ---
const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Gemini AI
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Middleware
app.use(express.json());
app.use(cors());

app.use(logger); // Custom logging middleware to log all requests with timestamps and details
app.use(cookieParser());


app.use("/api", researchersRouter);

// ================================================================
//  SECTION 2: ACADEMIC SCANNER API (Researcher Analysis)
// ================================================================

/**
 * API: Search Researchers
 * Wraps Semantic Scholar API
 */
app.get('/api/search', async (req, res) => {
    const { query, description, page, limit } = req.query;
    if (!query && !description)
        return res.status(400).json({ error: "Query or Description required" });
    try {
        const response = await axios.get(`https://api.semanticscholar.org/graph/v1/author/search`, {
            params: {
                query,
                limit: limit || 15,
                offset: limit * page - limit || 0,
                fields: 'authorId,name,hIndex,paperCount,citationCount,papers.fieldsOfStudy'
            },
            headers: { 'x-api-key': process.env.S2_API_KEY || '' }
        });

        const processed = (response.data.data || []).map(author => ({
            ...author,
            primaryField: extractTopField(author.papers)
        }));

        res.json({
            success: true,
            total: response.data.total || response.data.data?.length || 0,
            authors: processed || []
        });
    } catch (e) {
        console.error("S2 Search Error:", e.message);
        res.status(500).json({
            success: false,
            error: "Search Service Unavailable"
        });
    }
});

/**
 * API: Deep Analyze Researcher
 * Fetches papers from S2 and formats the profile (Gemini AI Removed).
 */
app.post('/api/analyze', async (req, res) => {
    const { authorId } = req.body;
    if (!authorId) return res.status(400).send("Target ID Required");

    try {
        // Fetch Author Data from S2
        const resData = await axios.get(`https://api.semanticscholar.org/graph/v1/author/${authorId}`, {
            params: {
                fields: 'name,citationCount,hIndex,paperCount,url,papers.title,papers.year,papers.venue,papers.citationCount,papers.fieldsOfStudy,papers.authors,papers.url,papers.openAccessPdf'
            },
            headers: { 'x-api-key': process.env.S2_API_KEY || '' }
        });

        const author = resData.data;
        author.primaryField = extractTopField(author.papers);

        // Calculate Collaborations
        const collabMap = new Map();
        if (author.papers) {
            author.papers.forEach(p => {
                if (p.authors) {
                    p.authors.forEach(a => {
                        // Don't count the researcher themselves
                        if (a.authorId !== authorId && a.name) {
                            if (!collabMap.has(a.authorId)) {
                                collabMap.set(a.authorId, { id: a.authorId, name: a.name, count: 0 });
                            }
                            collabMap.get(a.authorId).count++;
                        }
                    });
                }
            });
        }

        const topCollabs = Array.from(collabMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Return top 10

        // Format Data identically to the local database endpoint
        const localData = {
            name: author.name,
            affiliation: "Semantic Scholar Global",
            main_topic: author.primaryField,
            subtopics: author.primaryField,
            scholar_id: authorId
        };

        res.json({ local: localData, author: author, collaborators: topCollabs });

    } catch (e) {
        console.error("Analysis Error:", e);
        res.status(500).json({ error: "Analysis Failed" });
    }
});

// ================================================================
//  SECTION 3: TOPIC EXPLORER API
// ================================================================

/**
 * API: Explore Idea
 * AI converts idea to keywords -> Parallel Search -> Ranking Algorithm
 */
// ================================================================
//  SECTION 3: TOPIC EXPLORER API
// ================================================================

app.get('/api/explore', async (req, res) => {
    const { paperId, mode, year } = req.query;

    const FIELDS = 'paperId,title,abstract,venue,year,authors,citationCount,openAccessPdf,url,externalIds';

    try {
        let apiUrl = '';
        const defaults = { fields: FIELDS, offset: 0, limit: 10, sort: "asc" };
        const params = { ...defaults, ...req.query }

        if (mode === 'recommend' && paperId) {
            let targetId = paperId;
            if (/^\d+$/.test(String(paperId))) {
                targetId = `CorpusId:${targetId}`;
            }

            console.log(`[S2] Recommend for ID: ${targetId}`);
            apiUrl = `https://api.semanticscholar.org/graph/v1/paper/${targetId}/recommendations`;
        } else {
            apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search`;
            if (year) params.year = `${year}-`;
        }

        const response = await axios.get(apiUrl, {
            params,
            headers: { 'x-api-key': process.env.S2_API_KEY || '' }
        });

        res.json({
            success: true,
            total: response.data.total || response.data.data?.length || 0,
            papers: response.data.data || []
        });

    } catch (e) {
        console.error(`[S2 API Error] Mode: ${mode} | ID: ${paperId} | Msg: ${e.message}`);

        if (e.response?.status === 404) {
            return res.json({ success: true, papers: [], total: 0, message: "No recommendations found for this specific paper." });
        }

        res.status(500).json({ error: "Search service unavailable." });
    }
});


// ================================================================
//  SECTION 4: HOT TOPICS API
// ================================================================

app.get('/api/hottopics', async (req, res) => {
    const { data, error } = await supabase
        .from('hot_topics')
        .select('*')
        .order('priority', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/hottopics/add', isAdmin, async (req, res) => {
    const { title, description, field, type, status, priority, link } = req.body;

    const { data, error } = await supabase
        .from('hot_topics')
        .insert([{ title, description, field, type, status, priority: priority || 0, link }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
});

app.delete('/api/hottopics/:id', isAdmin, async (req, res) => {
    const { error } = await supabase.from('hot_topics').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// ================================================================
//  SECTION 5: AUTHENTICATION & USERS (FINALIZED)
// ================================================================

app.use("/api/auth", authRoutes);

app.get('/api/admin/pending-users', async (req, res) => {
    const { data: rows, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('is_approved', 0);

    if (error) return res.status(500).json({ error: error.message });
    res.json(rows);
});


app.post('/api/admin/approve-user', async (req, res) => {
    const { userId } = req.body;

    const { error } = await supabase
        .from('users')
        .update({ is_approved: 1 })
        .eq('id', userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});


// ================================================================
//  SECTION 6: COMPANIES DIRECTORY API (REVISED)
// ================================================================

// API: Upload Companies
// 1. Upload Companies (Revised with Glassdoor & Link Mining)
app.post('/api/admin/upload-companies', isAdmin, async (req, res) => {
    if (!req.file || !req.file.buffer) return res.status(400).json({error: "No file uploaded"});
    
    const clearDb = req.body.clear_db === 'true';

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const companiesMap = {};

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet);
            const range = xlsx.utils.decode_range(sheet['!ref']);

            // Link Mining (Hidden Hyperlinks)
            const rowLinks = {};
            for (let R = range.s.r; R <= range.e.r; ++R) {
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const cellRef = xlsx.utils.encode_cell({ c: C, r: R });
                    const cell = sheet[cellRef];
                    if (cell && cell.l && cell.l.Target) {
                        const url = cell.l.Target;
                        const rowIndex = R - 1;
                        if (!rowLinks[rowIndex]) rowLinks[rowIndex] = {};

                        if (url.includes('linkedin.com')) rowLinks[rowIndex].linkedin = url;
                        else if (url.includes('glassdoor.com')) rowLinks[rowIndex].glassdoor = url;
                        else if (url.startsWith('http')) rowLinks[rowIndex].website = url;
                    }
                }
            }

            const region = sheetName.trim();

            rows.forEach((row, index) => {
                const name = extractData(row, 'name');
                if (!name) return;
                const nameKey = name.toLowerCase().trim();

                let mined = rowLinks[index] || {};
                let website = mined.website || extractData(row, 'website');
                let linkedin = mined.linkedin || extractData(row, 'linkedin');
                let glassdoor = mined.glassdoor || extractData(row, 'glassdoor');

                // Fallback text scan for glassdoor
                if (!glassdoor) {
                    Object.values(row).forEach(val => {
                        if (String(val).includes('glassdoor.com')) glassdoor = String(val);
                    });
                }

                // Location Logic
                let rawLocation = extractData(row, 'location') || 'Unknown';
                let country = rawLocation;
                let state = null;
                let city = null;

                if (rawLocation.includes('(')) {
                    const parts = rawLocation.split('(');
                    country = parts[0].trim();
                    const sub = parts[1].replace(')', '').trim();
                    if (region.toUpperCase().includes('USA') || region.toUpperCase().includes('AMERICA')) {
                        country = "United States"; state = parts[0].trim(); city = sub;
                    } else { city = sub; }
                } else if (region.toUpperCase().includes('USA')) {
                    country = "United States"; state = rawLocation;
                }

                if (!companiesMap[nameKey]) {
                    companiesMap[nameKey] = {
                        name: name.trim(),
                        category: extractData(row, 'category') || 'General',
                        industry: extractData(row, 'industry'),
                        size: extractData(row, 'size') || 'N/A',
                        website: website,
                        linkedin: linkedin,
                        glassdoor: glassdoor, // Added Glassdoor
                        hq_country: country,
                        branches: []
                    };
                }

                const entry = companiesMap[nameKey];
                if (website && (!entry.website || entry.website.length < 5)) entry.website = website;
                if (linkedin && (!entry.linkedin || entry.linkedin.length < 5)) entry.linkedin = linkedin;
                if (glassdoor && !entry.glassdoor) entry.glassdoor = glassdoor;

                const isDup = entry.branches.some(b => b.country === country && b.state === state);
                if (!isDup) entry.branches.push({ region, country, state, city, presence: extractData(row, 'presence') });
            });
        });

        if (clearDb) {
            await supabase.from('companies').delete().neq('id', 0);
        }

        const companiesToInsert = Object.values(companiesMap).map(c => ({
            name: c.name, category: c.category, industry: c.industry, size: c.size,
            website: c.website, linkedin: c.linkedin, glassdoor: c.glassdoor,
            branches: JSON.stringify(c.branches), hq_country: c.hq_country
        }));

        // Batch Insert to prevent timeouts
        const batchSize = 100;
        for (let i = 0; i < companiesToInsert.length; i += batchSize) {
            const batch = companiesToInsert.slice(i, i + batchSize);
            const { error } = await supabase.from('companies').insert(batch);
            if (error) console.error("Batch insert error:", error);
        }

        res.json({ success: true, message: `Processed ${companiesToInsert.length} companies.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed: " + err.message });
    }
});

// 2. Search Companies (Matches ANY branch + Size + Category)
app.get('/api/companies', async (req, res) => {
    const { q, country, category, size } = req.query;

    let query = supabase.from('companies').select('*');

    // Category Multi-select
    if (category && category !== 'All') {
        const cats = category.split(',');
        query = query.in('category', cats);
    }

    // Size Filter (Added)
    if (size && size !== 'All') {
        query = query.eq('size', size);
    }

    if (q) {
        query = query.or(`name.ilike.%${q}%,industry.ilike.%${q}%`);
    }

    const { data: rows, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    let finalRows = rows;
    if (country && country !== 'All') {
        const list = country.split(',');
        finalRows = rows.filter(r => {
            const bStr = r.branches || '';
            return list.some(c => bStr.includes(c));
        });
    }

    const enhanced = finalRows.map(r => ({
        ...r,
        logo: `https://logo.clearbit.com/${r.name.replace(/[\s,.]+/g, '').toLowerCase()}.com`,
        branches: JSON.parse(r.branches || '[]')
    }));

    res.json(enhanced);
});

// 3. Get Filters (Added Size)
app.get('/api/companies/filters', async (req, res) => {
    const { data: rows, error } = await supabase.from('companies').select('branches, category, size');
    if (error) return res.status(500).json({ error: error.message });

    const countries = new Set();
    const categories = new Set();
    const sizes = new Set();

    rows.forEach(r => {
        if (r.category) categories.add(r.category);
        if (r.size && r.size !== 'N/A') sizes.add(r.size);
        try {
            const b = JSON.parse(r.branches);
            b.forEach(branch => { if (branch.country) countries.add(branch.country); });
        } catch (e) { }
    });

    res.json({
        countries: Array.from(countries).sort(),
        categories: Array.from(categories).sort(),
        sizes: Array.from(sizes).sort()
    });
});


// 4. NEW: Company Analytics (Jobs & Timeline)
app.get('/api/companies/analytics', async (req, res) => {
    const { name } = req.query;
    if (!name) return res.json({ jobs: [], timeline: [] });

    // Fetch Jobs matching company name
    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('id, title, type, country, posted_at, apply_link')
        .ilike('company', `%${name}%`)
        .order('posted_at', { ascending: false })
        .limit(20);

    if (error) return res.status(500).json({ error: error.message });

    // Calculate Timeline in JS (easier than Supabase SQL for date grouping)
    const timelineMap = {};
    jobs.forEach(job => {
        const date = new Date(job.posted_at);
        // Format YYYY-MM
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        timelineMap[key] = (timelineMap[key] || 0) + 1;
    });

    const timeline = Object.entries(timelineMap)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

    res.json({ jobs, timeline });
});

// 2. API: Submit Project
app.post('/api/grad-projects/submit', async (req, res) => {
    const {
        studentName, email, phone, university, faculty, major,
        supervisor, coSupervisor, isSponsored, sponsorCompany,
        companyMentor, gradYear, domains, projectTitle, peersCount, docLink
    } = req.body;

    // Prepare data for Supabase
    const { data, error } = await supabase
        .from('graduation_projects')
        .insert([{
            student_name: studentName,
            email: email,
            phone: phone,
            university: university,
            faculty: faculty,
            major: major,
            supervisor: supervisor,
            co_supervisor: coSupervisor,
            is_sponsored: isSponsored, // Supabase boolean handles true/false directly
            sponsor_company: sponsorCompany,
            company_mentor: companyMentor,
            grad_year: gradYear,
            domains: JSON.stringify(domains), // Store array as string
            project_title: projectTitle,
            peers_count: peersCount,
            doc_link: docLink
        }])
        .select();

    if (error) {
        console.error("Supabase Insert Error:", error.message);
        return res.status(500).json({ error: "Failed to save project: " + error.message });
    }

    res.json({ success: true, message: "Project registered successfully!", id: data[0].id });
});

// 3. API: Get All Projects (For Dashboard)
app.get('/api/grad-projects', async (req, res) => {
    // Select all columns, order by newest first
    const { data, error } = await supabase
        .from('graduation_projects')
        .select('*')
        .order('grad_year', { ascending: false })
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error("Supabase Fetch Error:", error.message);
        return res.status(500).json({ error: "Database error" });
    }

    // Process data to match frontend expectations
    const processedRows = data.map(row => {
        let parsedDomains = [];
        try {
            // Parse JSON string back to Array, handle if it's already an object
            parsedDomains = typeof row.domains === 'string' ? JSON.parse(row.domains) : row.domains;
        } catch (e) {
            parsedDomains = [];
        }

        return {
            ...row,
            domains: parsedDomains || [],
            // Convert Boolean to "Yes/No" for the frontend display
            is_sponsored: row.is_sponsored ? 'Yes' : 'No'
        };
    });

    res.json(processedRows);
});


// 1. Serper API Proxy (Search Logic)
// 1. Serper API Proxy (View ALL Results)
app.post('/api/admin/external-search', async (req, res) => {
    const { query, location, type } = req.body;

    console.log(`\n--- [SERPER DEBUG] START ---`);
    console.log(`1. Incoming Request: Query=${query}, Location=${location}`);

    // البحث داخل لينكدإن
    const searchString = `site:linkedin.com/jobs ${query} ${location}`;
    console.log(`2. Google Query: [${searchString}]`);

    const apiKey = process.env.SERPER_API_KEY || 'd15508687b958ed69e249d7ec03f37de4fd89837';

    if (!apiKey) {
        return res.status(500).json({ error: "Server Configuration Error: Missing Serper API Key" });
    }

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://google.serper.dev/search',
        headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "q": searchString,
            "gl": "eg",
            "num": 20
        })
    };

    try {
        const response = await axios.request(config);
        const organic = response.data.organic || [];

        console.log(`3. Total Results Found: ${organic.length}`);

        if (organic.length === 0) {
            return res.json({ success: true, data: [] });
        }

        const mappedJobs = organic.map(item => {
            let rawTitle = item.title || "Unknown Result";
            let cleanTitle = rawTitle;
            let company = query;

            cleanTitle = cleanTitle.replace(/ \| LinkedIn/gi, '').replace(/ - LinkedIn/gi, '').trim();

            if (rawTitle.includes(' hiring ')) {
                const parts = rawTitle.split(' hiring ');
                company = parts[0].trim();
                let rolePart = parts[1];
                if (rolePart.includes(' in ')) {
                    rolePart = rolePart.split(' in ')[0];
                }
                cleanTitle = rolePart.trim();
            }

            return {
                title: cleanTitle,
                company: company,
                country: location,
                link: item.link,
                snippet: item.snippet || "No description available.",
                source: 'LinkedIn'
            };
        });

        console.log(`4. Successfully mapped ALL ${mappedJobs.length} jobs.`);
        console.log(`--- [SERPER DEBUG] END ---\n`);

        res.json({ success: true, data: mappedJobs });

    } catch (error) {
        console.error("--- [SERPER DEBUG] ERROR ---");
        res.status(500).json({ error: "Search Service Failed" });
    }
});


// API: Direct LinkedIn Scraper
app.post('/api/admin/linkedin-scrape', async (req, res) => {
    const { query, location } = req.body;

    // 1. Use the official guest API endpoint for job search, which is much more stable than the SEO URL
    const targetUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&start=0`;

    console.log(`[LinkedIn Scraper] Target URL: ${targetUrl}`);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                // Update User-Agent to a modern one to prevent blocking
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const jobs = [];

        // 2. In the guest API, the response is a list of <li> elements containing the job cards
        $('.base-search-card, .job-search-card').each((index, element) => {
            const title = $(element).find('.base-search-card__title').text().trim().replace(/\s+/g, ' ');

            // Subtitle usually holds the company name. We remove extra spaces/newlines.
            let company = $(element).find('.base-search-card__subtitle').text().trim().replace(/\s+/g, ' ');
            if (!company) {
                // Fallback in case the structure is slightly different
                company = $(element).find('h4 a').text().trim().replace(/\s+/g, ' ');
            }
            if (!company) company = query; // Final fallback

            const jobLocation = $(element).find('.job-search-card__location').text().trim().replace(/\s+/g, ' ');
            const link = $(element).find('a.base-card__full-link').attr('href');

            const dateElement = $(element).find('time');
            const postedDate = dateElement.attr('datetime') || dateElement.text().trim();

            const imgElement = $(element).find('.artdeco-entity-image');
            const logo = imgElement.attr('data-delayed-url') || imgElement.attr('src');

            if (title && link) {
                jobs.push({
                    title: title,
                    company: company,
                    location: jobLocation,
                    // Strip tracking parameters from the URL
                    link: link.split('?')[0],
                    date: postedDate,
                    logo: logo,
                    source: 'LinkedIn Direct'
                });
            }
        });

        // 3. FILTER: Only keep jobs where the parsed company name closely matches the searched text
        const queryLower = query.trim().toLowerCase();
        const filteredJobs = jobs.filter(j => {
            const compLower = j.company.toLowerCase();
            // Check if either contains the other to be safe (e.g. "Siemens" vs "Siemens AG")
            return compLower.includes(queryLower) || queryLower.includes(compLower);
        });

        console.log(`[LinkedIn Scraper] Found ${jobs.length} jobs. After filtering by exact company: ${filteredJobs.length}`);

        if (jobs.length > 0 && filteredJobs.length === 0) {
            console.log(`[LinkedIn Scraper] Warning: Filter removed all jobs. LinkedIn returned jobs, but none matched the exact company name "${query}".`);
        }

        res.json({ success: true, data: filteredJobs });


    } catch (error) {
        console.error("[LinkedIn Scraper] Error:", error.message);
        if (error.response && error.response.status === 404) {
            return res.json({ success: true, data: [], message: "No jobs page found for this combination." });
        }
        res.status(500).json({ error: "Failed to scrape LinkedIn. They might be blocking the request." });
    }
});

// ================================================================
//  SECTION 7: FEEDBACK API
// ================================================================

app.use("/api/feedback", feedbackRouter)


// --- SECTION 8: PROFILES & DIRECTORY API ---

// 1. Serve the Profiles Page

// 2. API: Get Public Profiles (with Filters)
app.get('/api/directory/profiles', async (req, res) => {
    const { q, role, university, skill } = req.query;

    let query = supabase
        .from('profiles')
        .select(`
            *,
            users!inner (
                name,
                role,
                is_approved
            )
        `)
        .eq('users.is_approved', 1); // Only show approved users

    // Apply Backend Filters
    if (role && role !== 'All') query = query.eq('users.role', role);
    if (university && university !== 'All') query = query.ilike('university', `%${university}%`);
    if (skill) query = query.contains('skills', [skill]);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    let filteredData = data;

    // Client-side text search (Simpler for combined name/bio search)
    if (q) {
        const lowerQ = q.toLowerCase();
        filteredData = filteredData.filter(p =>
            p.full_name?.toLowerCase().includes(lowerQ) ||
            p.users?.role?.toLowerCase().includes(lowerQ) ||
            p.university?.toLowerCase().includes(lowerQ)
        );
    }

    // STRICT BACKEND PRIVACY: ALWAYS mask data in the public directory payload
    filteredData = filteredData.map(p => {
        let firstName = "Member";
        if (p.full_name) {
            let parts = p.full_name.trim().split(/\s+/);
            firstName = parts[0];
            // Handle compound Arabic names
            if ((firstName === 'عبد' || firstName.toLowerCase() === 'abd') && parts.length > 1) {
                firstName = firstName + ' ' + parts[1];
            }
        }

        return {
            ...p,
            full_name: firstName,
            university_email: "Hidden", // Hard-coded removal
            email: "Hidden", // Hard-coded removal
            users: p.users ? {
                ...p.users,
                name: firstName,
                email: "Hidden" // Hard-coded removal
            } : null
        };
    });

    res.json(filteredData);
});

// 3. API: Get Directory Stats
app.get('/api/directory/stats', async (req, res) => {
    // Fetch basic columns for stats to save bandwidth
    const { data, error } = await supabase
        .from('profiles')
        .select('university, skills, users!inner(role)');

    if (error) return res.status(500).json({ error: error.message });

    const total = data.length;

    // Count Roles
    const roles = {};
    data.forEach(p => {
        const r = p.users?.role || 'User';
        roles[r] = (roles[r] || 0) + 1;
    });

    // Count Universities
    const unis = {};
    data.forEach(p => {
        if (p.university) unis[p.university] = (unis[p.university] || 0) + 1;
    });
    const topUni = Object.entries(unis).sort((a, b) => b[1] - a[1])[0];

    // Count Top Skill
    const skillMap = {};
    data.forEach(p => {
        if (Array.isArray(p.skills)) {
            p.skills.forEach(s => skillMap[s] = (skillMap[s] || 0) + 1);
        }
    });
    const topSkill = Object.entries(skillMap).sort((a, b) => b[1] - a[1])[0];

    res.json({
        total,
        breakdown: roles,
        topUniversity: topUni ? `${topUni[0]} (${topUni[1]})` : 'N/A',
        topSkill: topSkill ? `${topSkill[0]} (${topSkill[1]})` : 'N/A'
    });
});

// ================================================================
//  SECTION 8: Import Jobs
// ================================================================

//  Fetch all companies for the dropdown autocomplete
app.get('/api/admin/all-companies', async (req, res) => {
    const { data, error } = await supabase.from('companies').select('name');
    if (error) return res.status(500).json({ error: error.message });
    // Also merge companies from the jobs table just in case
    const { data: jobData } = await supabase.from('jobs').select('company');
    const allNames = new Set([...(data || []).map(c => c.name), ...(jobData || []).map(j => j.company)]);
    res.json(Array.from(allNames).filter(Boolean).sort());
});


// ================================================================ 
// // SECTION 6: COMPANIES DIRECTORY API section.
// ================================================================ 

// ================================================================
//  SECTION: USER PROFILE API
// ================================================================

// Route for serving the profile page

// GET /api/profile -> Returns full user data
app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch basic user credentials
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, name, email, role, is_approved')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        // Fetch detailed profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single(); // It's okay if this is null for new users

        res.json({
            success: true,
            data: { ...user, profile: profile || {} }
        });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch profile data" });
    }
});

app.put('/api/profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            full_name, role, bio, skills, university,
            graduation_year, linkedin_url, github_url,
            graduation_project, experience
        } = req.body;

        // 1. Sync name and role in the `users` table
        const userUpdate = {};
        if (full_name) userUpdate.name = full_name;
        if (role) userUpdate.role = role;

        if (Object.keys(userUpdate).length > 0) {
            await supabase.from('users').update(userUpdate).eq('id', userId);
        }

        // 2. Sanitize arrays for JSONB columns
        const safeSkills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

        const profilePayload = {
            full_name,
            bio,
            skills: safeSkills,
            university,
            graduation_year: graduation_year ? parseInt(graduation_year) : null,
            linkedin_url,
            github_url,
            graduation_project: graduation_project || {}, // Full JSON Object
            experience: experience || []                  // JSON Array
        };

        // 3. BULLETPROOF SAVE: Check if exists first instead of using Upsert
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle(); // Prevents throwing an error if it doesn't exist

        let profile, error;

        if (existingProfile) {
            // Update existing
            const res = await supabase.from('profiles').update(profilePayload).eq('user_id', userId).select().single();
            profile = res.data;
            error = res.error;
        } else {
            // Insert new
            const res = await supabase.from('profiles').insert([{ user_id: userId, ...profilePayload }]).select().single();
            profile = res.data;
            error = res.error;
        }

        if (error) throw error;

        res.json({ success: true, data: profile, message: "Profile updated successfully." });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, error: "Failed to update profile." });
    }
});

app.post('/api/profile/avatar', isAuthenticated,  async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image file provided" });

        const userId = req.user.id;
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        // Upload to Supabase 'avatars' bucket
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const avatarUrl = publicUrlData.publicUrl;

        // Save URL in database
        await supabase.from('profiles').upsert({ user_id: userId, avatar_url: avatarUrl }, { onConflict: 'user_id' });

        res.json({ success: true, avatar_url: avatarUrl, message: "Avatar updated successfully." });
    } catch (error) {
        console.error("Avatar Upload Error:", error);
        res.status(500).json({ success: false, error: "Failed to upload avatar." });
    }
});

// ================================================================

// ================================================================
//  ADMIN: BULK UPLOAD GRADUATION PROJECTS (CORRECTED)
// ================================================================

app.post('/api/admin/upload-grad-projects', async (req, res) => {
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No file uploaded or invalid format" });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawRows = xlsx.utils.sheet_to_json(sheet);

        const projectsToInsert = rawRows.map(row => {
            const clean = (val) => (val && val !== 'NA' && val !== 'Na') ? String(val).trim() : null;

            // Logic: Convert "Yes"/"No" to Boolean
            const isSponsored = (row['Sponsored by Company'] && row['Sponsored by Company'].toLowerCase() === 'yes');

            // Logic: Convert single domain to JSON array
            const domainRaw = clean(row['Project Domain']);
            const domains = domainRaw ? JSON.stringify([domainRaw]) : JSON.stringify([]);

            return {
                university: clean(row['University']),
                grad_year: clean(row['Graduation Year']),
                supervisor: clean(row['Supervisor 1 Name']),
                co_supervisor: clean(row['Supervisor 2 Name']),
                domains: domains,
                project_title: clean(row['Project Title']),

                // REMOVED project_summary to fix the error
                // project_summary: clean(row['Project Summary']), 

                peers_count: parseInt(row['Number of Peers']) || 1,
                is_sponsored: isSponsored,
                sponsor_company: clean(row['Company Name']),
                company_mentor: clean(row['Company Mentor Name']),
                doc_link: clean(row['Thesis Document']),

                // Default values for required fields not in CSV
                student_name: 'Imported Project',
                email: 'imported@system.local', // Dummy email if required
                phone: null,
                faculty: 'Engineering',
                major: 'Electronics',
                submitted_at: new Date()
            };
        });

        if (projectsToInsert.length > 0) {
            const { error } = await supabase
                .from('graduation_projects')
                .insert(projectsToInsert);

            if (error) throw error;
        }

        res.json({
            success: true,
            message: `Successfully uploaded ${projectsToInsert.length} projects.`
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Failed to upload projects: " + err.message });
    }
});

app.use(errorHandler);



// Vercel invokes the exported app as a serverless handler; do not bind a listener there.
if (!process.env.VERCEL) {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
}


export default app;





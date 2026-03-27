/**
 * =========================================================================
 * Scholar Nexus — Advanced SEO Meta Tags & JSON-LD Helper
 * =========================================================================
 * This script dynamically generates highly optimized SEO meta tags, 
 * Open Graph data, and Schema.org structured data for each page.
 * 
 * Usage:
 * <script src="/seo-helper.js"></script>
 * <script>
 *   ScholarNexusSEO.setPage('scanner');
 * </script>
 * =========================================================================
 */

const ScholarNexusSEO = (() => {

  const SITE = {
    name: 'Scholar Nexus',
    url: 'https://www.scholarnexus.com',
    logo: 'https://www.scholarnexus.com/assets/logo.png',
    twitter: '@ScholarNexus',
    defaultImage: 'https://www.scholarnexus.com/assets/og-default.jpg',
  };

  // ─── PAGE-SPECIFIC METADATA (ENGLISH-FIRST + ARABIC KEYWORDS) ───
  const PAGES = {
    home: {
      title: 'Scholar Nexus | Premium Academic Research, Jobs & Projects Hub in MENA',
      description: 'Join Scholar Nexus, the ultimate AI-powered academic platform in Egypt and MENA. Discover top researchers, explore scientific papers, showcase graduation projects, and apply for academic jobs. | المنصة الأكاديمية الأولى',
      keywords: 'academic platform Egypt, research network MENA, graduation projects database, academic jobs Egypt, find researchers, منصة أكاديمية مصر, باحثين علميين',
      url: '/',
      image: '/assets/og-home.jpg',
    },
    scanner: {
      title: 'AI Academic Scanner | Profile & Analyze Researchers Worldwide — Scholar Nexus',
      description: 'Utilize our AI Academic Scanner powered by Google Gemini and Semantic Scholar. Get deep insights into researcher profiles, publication history, and global academic impact. | تحليل الباحثين بالذكاء الاصطناعي',
      keywords: 'AI researcher profiling, Semantic Scholar search, analyze academic papers, Gemini AI research, researcher impact metrics, تحليل باحث أكاديمي',
      url: '/scanner',
      image: '/assets/og-scanner.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'AI Academic Scanner', url: '/scanner' }
      ]
    },
    explorer: {
      title: 'Research Topic Explorer | Discover Scientific Papers & AI Trends — Scholar Nexus',
      description: 'Search millions of scientific papers, journals, and articles. Experience personalized AI recommendations for your academic research and literature reviews. | استكشاف الأبحاث العلمية',
      keywords: 'scientific paper search, research explorer, academic journal finder, AI research recommendations, literature review tool, استكشاف أبحاث علمية',
      url: '/explorer',
      image: '/assets/og-explorer.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'Research Explorer', url: '/explorer' }
      ]
    },
    hottopics: {
      title: 'Trending Academic Research & Hot Scientific Topics | Scholar Nexus',
      description: 'Stay ahead of the academic curve. Discover trending research topics, highly cited papers, and emerging scientific fields curated daily for students and scholars. | أحدث المواضيع البحثية',
      keywords: 'trending research topics, hot scientific fields, highly cited papers, emerging technologies academia, مواضيع بحثية حديثة',
      url: '/hottopics',
      image: '/assets/og-hottopics.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'Hot Topics', url: '/hottopics' }
      ]
    },
    jobs: {
      title: 'Academic & Research Jobs Portal | Careers in Egypt & MENA — Scholar Nexus',
      description: 'Find your next academic career opportunity. Browse exclusive university jobs, research fellowships, teaching assistant roles, and academic internships in the Arab world. | وظائف أكاديمية وبحثية',
      keywords: 'academic jobs Egypt, research fellowships MENA, university careers, teaching assistant jobs, academic internships, وظائف أكاديمية مصر',
      url: '/jobs',
      image: '/assets/og-jobs.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'Academic Jobs', url: '/jobs' }
      ]
    },
    'local-search': {
      title: 'Egyptian & Arab Researchers Database | Comprehensive Academic Directory',
      description: 'Search the largest directory of academic researchers in Egypt and the MENA region. Filter by university, domain, faculty, and academic publications. | قاعدة بيانات الباحثين المصريين والعرب',
      keywords: 'Egyptian researchers database, Arab academic directory, find university professors MENA, regional scholars, دليل الباحثين العرب',
      url: '/local-search',
      image: '/assets/og-local.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'MENA Researchers Database', url: '/local-search' }
      ]
    },
    profiles: {
      title: 'Academic User Profiles | Connect with Scholars & Students — Scholar Nexus',
      description: 'Browse the Scholar Nexus global user directory. Network with academics, university students, and industry professionals across various scientific disciplines. | دليل الأكاديميين',
      keywords: 'academic profiles, student network, university scholars, research collaborators finder, academic networking, ملفات باحثين أكاديميين',
      url: '/profiles',
      image: '/assets/og-profiles.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'User Profiles', url: '/profiles' }
      ]
    },
    'grad-form': {
      title: 'Register Graduation Projects | University Student Showcase — Scholar Nexus',
      description: 'Submit and showcase your university graduation project on Scholar Nexus. Connect with industry sponsors, corporate recruiters, and academic supervisors. | تسجيل مشاريع التخرج',
      keywords: 'graduation projects Egypt, register student project, university thesis showcase, engineering grad projects MENA, مشاريع تخرج مصر',
      url: '/grad-form',
      image: '/assets/og-grad.jpg',
      breadcrumb:[
        { name: 'Home', url: '/' },
        { name: 'Graduation Projects', url: '/grad-form' }
      ]
    },
  };

  // ─── JSON-LD GENERATORS ───

  function createBreadcrumbSchema(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": SITE.url + item.url
      }))
    };
  }

  function createWebPageSchema(page) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": page.title,
      "description": page.description,
      "url": SITE.url + page.url,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": SITE.name,
        "url": SITE.url
      },
      "image": SITE.url + (page.image || SITE.defaultImage)
    };
  }

  // ─── MAIN INJECTION FUNCTION ───
  function setPage(pageKey) {
    const page = PAGES[pageKey];
    if (!page) {
      console.warn(`[Scholar Nexus SEO] Warning: Unknown page key "${pageKey}". Falling back to home.`);
      return setPage('home');
    }

    const fullUrl = SITE.url + page.url;
    const fullImage = SITE.url + (page.image || SITE.defaultImage);

    // 1. Update Title
    document.title = page.title;

    // 2. Helper to Inject/Update Meta Tags
    function setMeta(selector, attr, value) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName] = selector.match(/\[([^\]]+)=/) ?[selector.match(/\[([^\]]+)=/)[1]] : ['name'];
        const attrVal = selector.match(/["']([^"']+)["']/)?.[1] || '';
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    // Basic SEO
    setMeta('meta[name="description"]', 'content', page.description);
    setMeta('meta[name="keywords"]', 'content', page.keywords);
    
    // Check and set canonical link safely
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', page.title);
    setMeta('meta[property="og:description"]', 'content', page.description);
    setMeta('meta[property="og:url"]', 'content', fullUrl);
    setMeta('meta[property="og:image"]', 'content', fullImage);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', page.title);
    setMeta('meta[name="twitter:description"]', 'content', page.description);
    setMeta('meta[name="twitter:image"]', 'content', fullImage);

    // 3. Helper to Inject JSON-LD Schema
    function injectSchema(schema) {
      if (!schema) return;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    }

    // Inject Schemas
    injectSchema(createWebPageSchema(page));
    if (page.breadcrumb) {
      injectSchema(createBreadcrumbSchema(page.breadcrumb));
    }

    console.log(`✅ [Scholar Nexus SEO] Meta tags and structured data for "${pageKey}" successfully injected.`);
  }

  return { setPage, PAGES, SITE };

})();

// ─── AUTO-DETECT PAGE ON LOAD ───
(function autoDetect() {
  const path = window.location.pathname.replace('/', '').split('/')[0] || 'home';
  const validKeys = Object.keys(ScholarNexusSEO.PAGES);
  
  if (validKeys.includes(path)) {
    ScholarNexusSEO.setPage(path);
  } else if (path === '' || path === 'index.html') {
    ScholarNexusSEO.setPage('home');
  }
})();
/* public/js/layout.js */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Check
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Inject Header
    const header = document.getElementById('app-header');
    const path = window.location.pathname;

// Inject CSS for Dropdowns and Mobile Menu
    const style = document.createElement('style');
    style.textContent = `
        /* 1. PREVENT SIDE SCROLLING (The Fix) */
        html, body {
            overflow-x: hidden; /* This stops the page from scrolling sideways */
            width: 100%;
            margin: 0; 
            padding: 0;
        }

        .nav-item { position: relative; height: 100%; display: flex; align-items: center; }
        .dropdown-trigger { cursor: pointer; display: flex; align-items: center; gap: 5px; height: 100%; }
        
        /* Desktop Dropdown */
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: var(--bg-card);
            min-width: 200px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border-radius: 8px;
            border: 1px solid var(--border);
            z-index: 1000;
            flex-direction: column;
            padding: 5px 0;
        }
        .nav-item:hover .dropdown-menu { display: flex; }
        .dropdown-item {
            padding: 10px 15px;
            color: var(--text-main);
            text-decoration: none;
            transition: background 0.2s;
            display: block;
        }
        .dropdown-item:hover { background-color: var(--bg-main); color: var(--accent); }
        .dropdown-item.active { color: var(--accent); font-weight: bold; }

        /* Hamburger Menu (Hidden on Desktop) */
        .hamburger { display: none; font-size: 1.5rem; cursor: pointer; color: var(--text-main); z-index: 1200; }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
            .hamburger { display: block; margin-left: auto; margin-right: 15px; }
            
            /* Sidebar Drawer - Fixed Position is key */
            .nav-links {
                position: fixed; /* Fixed prevents it from taking up space in the document flow */
                top: 0;
                right: -280px; /* Start hidden off-screen */
                width: 260px;
                height: 100vh;
                background-color: var(--bg-card);
                flex-direction: column;
                align-items: flex-start;
                padding: 80px 20px 20px;
                box-shadow: -4px 0 15px rgba(0,0,0,0.5);
                transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1100;
                overflow-y: auto;
            }
            
            /* Class to slide menu in */
            .nav-links.nav-active { right: 0; }

            /* Overlay effect when menu is open (Optional but recommended) */
            .nav-links.nav-active::before {
                content: '';
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
            
                z-index: -1;
                pointer-events: none;
            }

            /* Mobile Nav Items */
            .nav-item { 
                flex-direction: column; 
                align-items: flex-start; 
                height: auto; 
                width: 100%;
                margin-bottom: 15px;
            }

            .nav-link { font-size: 1.1rem; width: 100%; }

            /* Mobile Dropdowns */
            .dropdown-menu {
                position: static;
                box-shadow: none;
                border: none;
                background-color: transparent;
                padding-left: 15px;
                min-width: 100%;
                display: none;
                border-left: 2px solid var(--border);
            }

            .nav-item:hover .dropdown-menu, 
            .nav-item:focus-within .dropdown-menu { 
                display: flex; 
            }
        }
    `;
    document.head.appendChild(style);

    if (header) {
        const user = JSON.parse(localStorage.getItem('nexus_user'));

        // Auth Section
        const authLink = user
            ? `<div style="display:flex; align-items:center; gap:15px;">
                 <a href="/profile" style="color:var(--accent); font-weight:bold; text-decoration:none;"><i class="fas fa-user-circle"></i> ${user.name}</a>
                 <button onclick="logout()" style="background:var(--bg-card); color:var(--text-main); border:1px solid var(--border); padding:5px 10px; border-radius:6px; cursor:pointer;">Logout</button>
               </div>`
            : `<a href="/login" class="nav-link" style="color:var(--accent); font-weight:bold;"><i class="fas fa-sign-in-alt"></i> Login</a>`;

            
        // Define Navigation Groups
        // Check if any sub-link is active to highlight the parent dropdown
        const isAcademicActive = ['/scanner', '/explorer', '/local-search', '/grad-form.html'].includes(path);
        const isAdminActive = ['/jobs', '/companies.html'].includes(path);

header.innerHTML = `
            <div class="main-header">
                <div class="brand" onclick="window.location.href='/'">
                    <i class="fas fa-atom"></i> NEXUS
                </div>

                <!-- Hamburger Button (Visible only on mobile) -->
                <div class="hamburger" id="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </div>
                
                <nav class="nav-links" id="nav-links">
                    <a href="/" class="nav-link ${path === '/' ? 'active' : ''}">Home</a>
                    
                    <!-- RESEARCH DROPDOWN -->
                    <div class="nav-item">
                        <span class="nav-link dropdown-trigger ${['/scanner','/explorer','/local-search'].some(x=>path.includes(x)) ? 'active' : ''}">
                            Research <i class="fas fa-chevron-down" style="font-size: 0.8em;"></i>
                        </span>
                        <div class="dropdown-menu">
                            <a href="/scanner" class="dropdown-item"><i class="fas fa-user-astronaut"></i> Target Scanner</a>
                            <a href="/explorer" class="dropdown-item"><i class="fas fa-search"></i> Paper Explorer</a>
                            <a href="/local-search" class="dropdown-item"><i class="fas fa-map-marker-alt"></i> Local Researchers</a> 
                            <a href="/grad-dashboard" class="dropdown-item"><i class="fas fa-database"></i> Database Stats</a> 
                            <a href="/profiles" class="nav-link ${path === '/profiles' || path === '/profiles.html' ? 'active' : ''}">Community</a>
                            </div>
                    </div>

                    <!-- JOBS DROPDOWN -->
                    <div class="nav-item">
                        <span class="nav-link dropdown-trigger ${['/jobs','/companies.html'].some(x=>path.includes(x)) ? 'active' : ''}">
                            Jobs & Market <i class="fas fa-chevron-down" style="font-size: 0.8em;"></i>
                        </span>
                        <div class="dropdown-menu">
                            <a href="/jobs" class="dropdown-item"><i class="fab fa-linkedin"></i> Job Search & Map</a>
                            <a href="/companies.html" class="dropdown-item"><i class="fas fa-building"></i> Companies List</a>
                            <a href="/tools.html" class="dropdown-item"><i class="fas fa-building"></i> open-source</a>

                        </div>
                    </div>
                        
                    <a href="/team.html" class="nav-link ${path === '/team.html' ? 'active' : ''}">Team</a>
                    <a href="/feedback.html" class="nav-link ${path === '/feedback.html' ? 'active' : ''}">Feedback</a>
                    
                    ${authLink}
                </nav>

                <button onclick="toggleTheme()" style="background:none; border:none; color:var(--text-main); cursor:pointer; font-size:1.2rem; z-index:1101;">
                    <i class="fas fa-adjust"></i>
                </button>
            </div>
        `;



        // Mobile Menu Logic
        const hamburger = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');

        if(hamburger && navLinks) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent immediate closing
                navLinks.classList.toggle('nav-active');
                
                // Toggle icon between bars and times (X)
                const icon = hamburger.querySelector('i');
                if(navLinks.classList.contains('nav-active')){
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if(navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    navLinks.classList.remove('nav-active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
            });
        }


        window.logout = function () {
            localStorage.removeItem('nexus_token');
            localStorage.removeItem('nexus_user');
            window.location.reload();
        }
    }

    // 3. Inject Footer
    const footer = document.getElementById('app-footer');
    if (footer) {
        footer.innerHTML = `
            <div class="main-footer">
                <div class="footer-links">
                    <a href="/about">About</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/contact">Contact</a>
                </div>
                <div style="font-size:0.8rem; opacity:0.6;">&copy; 2026 Scholar Nexus. Our Team.</div>
            </div>
        `;
    }
});

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'THEME_CHANGE', theme: next }, '*');
        }
    });
}

function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

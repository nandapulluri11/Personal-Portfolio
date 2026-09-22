/**
 * ============================================================================
 * PERSONAL PORTFOLIO - NANDA KISHORE (PROJECT 01)
 * Clean, modular Vanilla JavaScript for interactive functionality
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioConfig();
  initNavbar();
  initScrollProgressBar();
  initThemeToggle();
  initProjectFilters();
  initCaseStudies();
  initContactForm();
  initBackToTop();
  initYear();
  initAIChat();
  initResumeHandling();
});

/**
 * 0. Hydrate dynamic portfolio data from PORTFOLIO_CONFIG
 */
function initPortfolioConfig() {
  if (typeof window.PORTFOLIO_CONFIG === 'undefined') return;
  const cfg = window.PORTFOLIO_CONFIG;

  // Social Links
  if (cfg.socialLinks) {
    const heroGithub = document.getElementById('heroGithubLink');
    if (heroGithub && cfg.socialLinks.github) heroGithub.href = cfg.socialLinks.github;

    const heroLinkedin = document.getElementById('heroLinkedinLink');
    if (heroLinkedin && cfg.socialLinks.linkedin) heroLinkedin.href = cfg.socialLinks.linkedin;

    const heroEmail = document.getElementById('heroEmailLink');
    if (heroEmail && cfg.personal && cfg.personal.email) {
      heroEmail.href = `mailto:${cfg.personal.email}`;
    }

    const contactLinkedin = document.getElementById('contactLinkedinLink');
    if (contactLinkedin && cfg.socialLinks.linkedin) {
      contactLinkedin.href = cfg.socialLinks.linkedin;
      contactLinkedin.textContent = cfg.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, '');
    }

    // Professional profiles
    const profGithub = document.getElementById('profileGithubBtn');
    if (profGithub && cfg.socialLinks.github) profGithub.href = cfg.socialLinks.github;
  }

  // Personal info
  if (cfg.personal) {
    const phoneEl = document.getElementById('contactPhoneText');
    if (phoneEl) {
      phoneEl.textContent = cfg.personal.phone ? cfg.personal.phone : 'Available upon request';
    }

    const locEl = document.getElementById('contactLocationText');
    if (locEl && cfg.personal.location) {
      locEl.textContent = cfg.personal.location;
    }
  }

  // Education info
  if (cfg.education) {
    const collegeEl = document.getElementById('eduCollegeName');
    if (collegeEl && cfg.education.institutionName) {
      collegeEl.textContent = cfg.education.institutionName;
    }

    const branchBadge = document.getElementById('heroBranchBadge');
    if (branchBadge && cfg.education.branch) {
      branchBadge.textContent = `• ${cfg.education.branch}`;
    }

    const degreeBranchEl = document.getElementById('eduDegreeBranch');
    if (degreeBranchEl && cfg.education.branch) {
      degreeBranchEl.textContent = cfg.education.branch;
    }

    const schoolEl = document.getElementById('eduSchoolName');
    if (schoolEl && cfg.education.intermediate && cfg.education.intermediate.institutionName) {
      schoolEl.textContent = cfg.education.intermediate.institutionName;
    }
  }
}

/**
 * Check and handle resume availability gracefully
 */
function initResumeHandling() {
  const resumeDownloadButtons = document.querySelectorAll('a[href*="resume.pdf"]');
  const cfg = window.PORTFOLIO_CONFIG;
  const hasLocalPdf = cfg && cfg.resume && cfg.resume.hasPdfFile === true;

  if (!hasLocalPdf) {
    // Check via fetch if the resume actually exists on the server
    fetch('/assets/resume/resume.pdf', { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          setupResumeFallback(resumeDownloadButtons);
        }
      })
      .catch(() => {
        setupResumeFallback(resumeDownloadButtons);
      });
  }
}

function setupResumeFallback(buttons) {
  buttons.forEach(btn => {
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#resumeModal');
    btn.removeAttribute('download');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const resumeModalEl = document.getElementById('resumeModal');
      if (resumeModalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getInstance(resumeModalEl) || new bootstrap.Modal(resumeModalEl);
        modal.show();
      }
    });
  });
}

/**
 * 1. Navbar behavior: Scroll shadow, auto-close mobile drawer, and active state
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const navCollapse = document.getElementById('navbarNav');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Close mobile collapse on navigation click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // Highlight active link based on scroll position
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link-custom[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }
}

/**
 * 2. Scroll Progress Bar
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
  }, { passive: true });
}

/**
 * 3. Theme Toggle (Light / Dark mode) with LocalStorage persistence
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeToggleIcon');

  if (!themeToggleBtn || !themeIcon) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('nk_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.className = 'bi bi-sun-fill';
      themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      localStorage.setItem('nk_portfolio_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.className = 'bi bi-moon-stars-fill';
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      localStorage.setItem('nk_portfolio_theme', 'light');
    }
  }
}

/**
 * 3. Project Filter Tabs
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-grid-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'block';
          card.classList.remove('d-none');
        } else {
          card.style.display = 'none';
          card.classList.add('d-none');
        }
      });
    });
  });
}

/**
 * 5. Case Study Modal Engine & Dynamic Architecture Diagrams
 */
function initCaseStudies() {
  const modalEl = document.getElementById('projectPreviewModal');
  if (!modalEl) return;

  const caseStudyData = {
    drivex: {
      badge: 'Under Development • 75% Complete',
      isUnderDev: true,
      image: '/assets/images/drivex.svg',
      title: 'DriveX — Peer-to-Peer Car Rental Marketplace',
      desc: 'A peer-to-peer car sharing marketplace connecting local vehicle hosts with verified drivers. Features include dynamic vehicle search, location & date selection, instant rate estimation, and multi-tier car booking.',
      arch: [
        { title: 'React 18 + TS', sub: 'Tailwind + shadcn/ui' },
        { title: 'Zustand & Query', sub: 'Client & Server State' },
        { title: 'FastAPI + Pydantic', sub: 'REST Endpoints' },
        { title: 'PostgreSQL + SQLAlchemy', sub: 'ACID Relational Store' }
      ],
      techStack: [
        { layer: 'Frontend', tech: 'React + TypeScript', purpose: 'UI and application logic' },
        { layer: 'Styling', tech: 'Tailwind CSS', purpose: 'Responsive styling' },
        { layer: 'UI Components', tech: 'shadcn/ui', purpose: 'Professional reusable components' },
        { layer: 'State Management', tech: 'Zustand', purpose: 'Global client state' },
        { layer: 'Server State', tech: 'TanStack Query', purpose: 'API data fetching/caching' },
        { layer: 'HTTP Client', tech: 'Axios', purpose: 'Frontend ↔ backend communication' },
        { layer: 'Backend', tech: 'FastAPI', purpose: 'REST API' },
        { layer: 'Validation', tech: 'Pydantic', purpose: 'Request/response validation' },
        { layer: 'ORM', tech: 'SQLAlchemy', purpose: 'Database interaction' },
        { layer: 'Database', tech: 'PostgreSQL', purpose: 'Users, vehicles, bookings, reviews, etc.' },
        { layer: 'Authentication', tech: 'JWT', purpose: 'Secure authentication' },
        { layer: 'Password Security', tech: 'bcrypt', purpose: 'Password hashing' },
        { layer: 'Image Storage', tech: 'Cloudinary', purpose: 'Vehicle images/media' },
        { layer: 'Payments', tech: 'Razorpay', purpose: 'Booking/payment processing' },
        { layer: 'Notifications', tech: 'Firebase Cloud Messaging', purpose: 'Push notifications' },
        { layer: 'Email', tech: 'Resend', purpose: 'Transactional emails' },
        { layer: 'Location', tech: 'Google Places API', purpose: 'Location/search autocomplete' },
        { layer: 'API Testing', tech: 'Swagger/OpenAPI + Postman', purpose: 'API testing/documentation' },
        { layer: 'Version Control', tech: 'Git + GitHub', purpose: 'Source control' },
        { layer: 'Deployment', tech: 'TBD', purpose: 'Production hosting' }
      ],
      problem: 'Traditional commercial rental agencies feature complex paper agreements, rigid depot locations, and non-transparent hidden fees for short-distance or weekend travel.',
      solution: 'Engineered a modern web UI with React, TypeScript, and shadcn/ui backed by high-performance FastAPI Python micro-services. Includes multi-city destination browsing (Hyderabad, Bangalore, Chennai, Mumbai, Delhi), flexible pickup/drop-off date pickers, transparent daily rates, and a 4-step rental workflow (Search, Book, Pick Up, Return).',
      tradeoffs: 'Selected FastAPI and PostgreSQL with SQLAlchemy over Node/MongoDB for strict transactional integrity on reservation bookings, native Pydantic schema validation, and automatic OpenAPI interactive docs.',
      lessons: 'Mastered full-stack TypeScript-to-Python API contracts, global client state with Zustand, TanStack Query server-side cache invalidation, and integrating third-party SDKs (Razorpay, Cloudinary, and Google Places API).',
      github: 'https://github.com/[GitHub-URL]/drivex'
    },
    library: {
      badge: 'Database & CRUD System',
      title: 'Book Library Management System',
      desc: 'Academic database project cataloging library books, member accounts, and borrowing transaction lifecycles using Python and SQLite.',
      arch: [
        { title: 'User / Librarian', sub: 'Terminal / Web Form' },
        { title: 'Python Controller', sub: 'Validation & Flow' },
        { title: 'SQL Query Engine', sub: 'Parameterized Queries' },
        { title: 'SQLite Database', sub: 'Relational Tables' }
      ],
      problem: 'Manual paper-based library registers cause lost records, overdue loan confusion, and lack indexing for book searches.',
      solution: 'Engineered a normalized database schema with foreign key relationships connecting books, members, and checkout transaction tables with automated return date tracking.',
      tradeoffs: 'Chose SQLite for zero-configuration, reliable ACID transactions and portable deployment across lab environments over complex cloud database servers.',
      lessons: 'Mastered SQL indexing, foreign key cascade constraints, defensive exception handling against SQL injection, and database transaction commits.',
      github: 'https://github.com/[GitHub-URL]/library-management-system'
    },
    vision: {
      badge: 'Computer Vision & Attendance',
      title: 'Student Face Recognition Attendance System',
      desc: 'Automated student presence tracking tool using OpenCV to detect faces via webcam feeds and record verified attendance logs.',
      arch: [
        { title: 'Webcam Feed', sub: 'Video Capture Stream' },
        { title: 'Haar Cascade', sub: 'Frontal Face Detection' },
        { title: 'LBPH Recognizer', sub: 'Feature Comparison' },
        { title: 'Attendance Ledger', sub: 'Timestamped CSV' }
      ],
      problem: 'Manual roll calls in university lecture halls consume valuable classroom instructional time and are susceptible to proxy attendance.',
      solution: 'Built a real-time computer vision pipeline that preprocesses grayscale camera frames, crops bounding boxes, extracts facial embeddings, and verifies enrolled students.',
      tradeoffs: 'Adopted Haar Cascade and LBPH over heavy deep learning models (like ResNet) to enable smooth real-time 30 FPS inference on standard student laptop CPUs without GPU requirements.',
      lessons: 'Gained hands-on experience handling illumination variance, camera framing noise, threshold tuning, and writing idempotent CSV logging routines.',
      github: 'https://github.com/[GitHub-URL]/face-recognition-attendance'
    },
    todo: {
      badge: 'State Management & DOM',
      title: 'Daily Focus & Todo Tracker',
      desc: 'A responsive task organizer with category filtering, priority tagging, and zero-dependency local browser persistence.',
      arch: [
        { title: 'DOM Events', sub: 'Click / Keypress Listeners' },
        { title: 'State Manager', sub: 'In-memory Task Array' },
        { title: 'Persistence Layer', sub: 'Window.localStorage' },
        { title: 'UI Renderer', sub: 'Dynamic DOM Tree' }
      ],
      problem: 'Most beginner todo apps lose state on browser refresh, lack keyboard accessibility, and suffer from layout shift when items are added.',
      solution: 'Engineered clean event delegation, predictable state mutation handlers, and JSON serialization to ensure instant task recovery across sessions.',
      tradeoffs: 'Avoided third-party state libraries to master the core event loop, DOM reconciliation techniques, and accessible ARIA attributes.',
      lessons: 'Understood the importance of debouncing, input sanitization to block XSS attacks, and maintaining clean separation between data models and UI views.',
      github: 'https://github.com/[GitHub-URL]/todo-app'
    },
    nutriguide: {
      badge: 'Under Active Development',
      title: 'NutriGuide — Diet & Nutrition Assistant',
      desc: 'Nutritional calculation tool under development to help individuals reach fitness goals with macro breakdowns and personalized food suggestions.',
      arch: [
        { title: 'User Profile Form', sub: 'Biometrics & Activity' },
        { title: 'Caloric Formula Engine', sub: 'Mifflin-St Jeor Math' },
        { title: 'AI Assistant', sub: 'Gemini Generative API' },
        { title: 'Meal Plan Output', sub: 'Structured Daily Breakdown' }
      ],
      problem: 'Generic diet charts fail to account for individual dietary preferences, allergies, cultural food staples, and realistic budget constraints.',
      solution: 'Pairing proven physiological nutrition formulas with AI-assisted recipe suggestions customized to user food preferences and allergies.',
      tradeoffs: 'Routing generative queries through a secure server proxy rather than direct client calls to protect API keys and apply validation bounds.',
      lessons: 'Learning API rate limit management, system prompt engineering, and defensive JSON schema parsing for AI-generated responses.',
      github: 'https://github.com/[GitHub-URL]'
    },
    jobhub: {
      badge: 'Under Active Development',
      title: 'Job Hub — University Placement & Job Portal',
      desc: 'Campus recruitment portal designed to connect undergraduate engineering students with company openings and track interview pipelines.',
      arch: [
        { title: 'Student & Recruiter UI', sub: 'Bootstrap 5 Responsive' },
        { title: 'Auth & Role Guard', sub: 'JWT Verification' },
        { title: 'Application Pipeline', sub: 'Status Transition Engine' },
        { title: 'Database', sub: 'MongoDB Job Collections' }
      ],
      problem: 'College placement communication is scattered across emails, chat groups, and physical notices, causing missed deadlines and confusion.',
      solution: 'Centralizing job postings, eligibility criteria filtering, application deadline countdowns, and resume submission tracking.',
      tradeoffs: 'Implementing role-based access control (Student vs Admin/Recruiter) to protect candidate data privacy at the API layer.',
      lessons: 'Deepening understanding of asynchronous Express middleware, password hashing with bcrypt, and MongoDB query projections.',
      github: 'https://github.com/[GitHub-URL]'
    },
    novamart: {
      badge: 'Under Active Development',
      title: 'NovaMart — E-Commerce Storefront',
      desc: 'Modern online storefront exploring state management across product catalogs, item quantities, and discount coupon validations.',
      arch: [
        { title: 'Product Catalog UI', sub: 'CSS Grid & Category Filters' },
        { title: 'Cart State Manager', sub: 'Session / LocalStorage' },
        { title: 'Checkout Pipeline', sub: 'Discount & Tax Computation' },
        { title: 'Order Confirmation', sub: 'Invoice Summary Modal' }
      ],
      problem: 'Poorly structured e-commerce carts frequently introduce rounding discrepancies, race conditions when editing quantities, and clumsy mobile checkout experiences.',
      solution: 'Designed an immutable cart state reducer that computes taxes, unit prices, and discounts deterministically, paired with a responsive slide-over drawer.',
      tradeoffs: 'Used CSS Grid auto-fit layouts to guarantee responsive product cards across all screen resolutions without media query bloat.',
      lessons: 'Learned floating-point currency safety (storing prices in cents/integers), defensive stock limit checking, and accessible drawer focus trapping.',
      github: 'https://github.com/[GitHub-URL]'
    },
    streakify: {
      badge: 'Productivity & Data Viz',
      title: 'Streakify — Habit & Study Streak Tracker',
      desc: 'Productivity dashboard designed to encourage daily deliberate practice by visualizing coding streaks with interactive canvas heatmaps.',
      arch: [
        { title: 'Activity Logger', sub: 'Daily Check-in Actions' },
        { title: 'Streak Engine', sub: 'Date Math & Streak Calc' },
        { title: 'HTML5 Canvas', sub: 'GitHub-Style Heatmap Grid' },
        { title: 'LocalStorage', sub: 'Audit Log & Milestones' }
      ],
      problem: 'Students frequently lose motivation during independent programming practice due to a lack of immediate visual feedback on their daily consistency.',
      solution: 'Implemented a GitHub-style 52-week contribution heatmap rendered directly on an HTML5 canvas element with hover tooltips and streak milestone badges.',
      tradeoffs: 'Rendered the heatmap on a lightweight 2D canvas context rather than generating 365+ individual DOM elements, keeping rendering time below 10ms.',
      lessons: 'Deepened expertise in HTML5 Canvas 2D APIs, date normalization across leap years and timezones, and responsive canvas DPI scaling.',
      github: 'https://github.com/[GitHub-URL]/streakify-tracker'
    },
    aiworkspace: {
      badge: 'AI & Web Studio',
      title: 'AI Workspace — Multi-Tool Studio & Prompt Lab',
      desc: 'Unified developer workspace integrating multimodal Gemini API capabilities for code explanation, markdown documentation drafting, and prompt experiments.',
      arch: [
        { title: 'Prompt Studio UI', sub: 'Markdown Editor & Presets' },
        { title: 'Server Proxy', sub: 'Express.js & Secret Vault' },
        { title: 'Gemini 2.5 SDK', sub: '@google/genai Multi-turn' },
        { title: 'Response Stream', sub: 'Live Markdown Renderer' }
      ],
      problem: 'Students juggling multiple developer tasks waste time writing boilerplate documentation, interpreting cryptic compiler errors, and testing API prompts.',
      solution: 'Built a multi-tab developer workbench featuring pre-engineered prompt templates for code reviews, time-complexity analysis, and README generation.',
      tradeoffs: 'Strictly routed all AI calls through a lightweight server-side proxy to protect API keys from browser exposure in accordance with industry security best practices.',
      lessons: 'Mastered temperature and system instruction tuning, token usage estimation, and responsive markdown rendering with syntax highlighting.',
      github: 'https://github.com/[GitHub-URL]'
    }
  };

  modalEl.addEventListener('show.bs.modal', (event) => {
    const triggerBtn = event.relatedTarget;
    if (!triggerBtn) return;

    const projectId = triggerBtn.getAttribute('data-project-id');
    const fallbackTitle = triggerBtn.getAttribute('data-project-title') || 'Project Case Study';
    const fallbackDesc = triggerBtn.getAttribute('data-project-desc') || 'Project overview and implementation notes.';

    const project = (projectId && caseStudyData[projectId]) ? caseStudyData[projectId] : {
      badge: 'Project Case Study',
      title: fallbackTitle,
      desc: fallbackDesc,
      arch: [
        { title: 'User Interface', sub: 'HTML5 & CSS3' },
        { title: 'Application Logic', sub: 'JavaScript' },
        { title: 'Data Persistence', sub: 'Storage / DB' }
      ],
      problem: 'Addressing usability requirements, state persistence, and responsive customer workflows.',
      solution: 'Engineered modular components and clean data normalization pipelines.',
      tradeoffs: 'Prioritized modularity, clean error handling, and cross-browser responsiveness over heavy external dependencies.',
      lessons: 'Reinforced the value of semantic structure, defensive state validation, and clean Git commits.',
      github: 'https://github.com/[GitHub-URL]'
    };

    // Update Elements
    const badgeEl = document.getElementById('modalProjectBadge');
    const titleEl = document.getElementById('modalProjectTitle');
    const descEl = document.getElementById('modalProjectDesc');
    const problemEl = document.getElementById('modalProblemStatement');
    const solutionEl = document.getElementById('modalTechnicalSolution');
    const tradeoffsEl = document.getElementById('modalTradeoffs');
    const lessonsEl = document.getElementById('modalLessonsLearned');
    const githubLinkEl = document.getElementById('modalProjectGithubLink');
    const archContainer = document.getElementById('modalArchDiagram');

    if (badgeEl) badgeEl.textContent = project.badge;
    if (titleEl) titleEl.textContent = project.title;
    if (descEl) descEl.textContent = project.desc;
    if (problemEl) problemEl.textContent = project.problem;
    if (solutionEl) solutionEl.textContent = project.solution;
    if (tradeoffsEl) tradeoffsEl.textContent = project.tradeoffs;
    if (lessonsEl) lessonsEl.textContent = project.lessons;
    if (githubLinkEl) githubLinkEl.href = project.github;

    // Project Preview Image & Under Development Badge
    const imgContainer = document.getElementById('modalProjectImageContainer');
    const imgEl = document.getElementById('modalProjectImg');
    const imgBadgeEl = document.getElementById('modalImageBadge');

    if (imgContainer && imgEl) {
      if (project.image) {
        imgEl.src = project.image;
        imgContainer.style.display = 'block';
        if (imgBadgeEl) {
          imgBadgeEl.style.display = project.isUnderDev ? 'inline-block' : 'none';
        }
      } else {
        imgContainer.style.display = 'none';
      }
    }

    // Render Architecture Nodes
    if (archContainer && project.arch && project.arch.length > 0) {
      archContainer.innerHTML = project.arch.map((node, idx) => {
        const isLast = idx === project.arch.length - 1;
        return `
          <div class="arch-node">
            <div class="arch-node-title">${node.title}</div>
            <div class="arch-node-sub">${node.sub}</div>
          </div>
          ${!isLast ? '<div class="arch-arrow"><i class="bi bi-arrow-right"></i></div>' : ''}
        `;
      }).join('');
    }

    // Render Tech Stack Table if present
    const techStackContainer = document.getElementById('modalTechStackContainer');
    const techStackBody = document.getElementById('modalTechStackBody');

    if (techStackContainer && techStackBody) {
      if (project.techStack && project.techStack.length > 0) {
        techStackBody.innerHTML = project.techStack.map((item) => `
          <tr class="align-middle">
            <td class="fw-bold text-primary">${item.layer}</td>
            <td><code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary border border-primary-subtle">${item.tech}</code></td>
            <td class="text-secondary">${item.purpose}</td>
          </tr>
        `).join('');
        techStackContainer.style.display = 'block';
      } else {
        techStackContainer.style.display = 'none';
      }
    }
  });
}

/**
 * 6. Contact Form Validation and Demonstration Modal
 */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'Please enter a valid name (at least 2 characters).');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setError(subjectInput, 'Please enter a subject (at least 3 characters).');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, 'Please enter your message (at least 10 characters).');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (isValid) {
      const senderName = encodeURIComponent(nameInput.value.trim());
      const senderEmail = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const body = encodeURIComponent(
        `Hi Nanda,\n\n${messageInput.value.trim()}\n\nFrom: ${decodeURIComponent(senderName)} (${decodeURIComponent(senderEmail)})`
      );

      const mailtoLink = `mailto:nandapulluri11@gmail.com?subject=${subject}&body=${body}`;

      // Update mailto button inside the confirmation modal
      const mailtoBtn = document.getElementById('confirmMailtoBtn');
      if (mailtoBtn) {
        mailtoBtn.setAttribute('href', mailtoLink);
      }

      // Show Bootstrap Modal
      const modalEl = document.getElementById('contactSuccessModal');
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }

      // Reset form
      form.reset();
    }
  });

  function setError(inputEl, message) {
    const parent = inputEl.closest('.form-group');
    if (!parent) return;
    parent.classList.add('has-error');
    const feedback = parent.querySelector('.invalid-feedback-custom');
    if (feedback) feedback.textContent = message;
  }

  function clearError(inputEl) {
    const parent = inputEl.closest('.form-group');
    if (!parent) return;
    parent.classList.remove('has-error');
  }

  // Clear errors on typing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });
}

/**
 * 5. Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 6. Dynamic Year in Footer
 */
function initYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * 7. AI Chatbot Widget (Gemini Multi-Turn Assistant)
 */
function initAIChat() {
  const launcherBtn = document.getElementById('aiChatLauncherBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('aiChatCloseBtn');
  const clearBtn = document.getElementById('aiChatClearBtn');
  const navbarChatBtn = document.getElementById('openChatNavbarBtn');
  const chatForm = document.getElementById('aiChatForm');
  const chatInput = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSendBtn');
  const messagesContainer = document.getElementById('aiChatMessages');
  const launcherChatIcon = document.getElementById('launcherChatIcon');
  const launcherCloseIcon = document.getElementById('launcherCloseIcon');
  const quickPromptsContainer = document.getElementById('aiQuickPrompts');

  if (!launcherBtn || !chatWindow || !chatForm || !chatInput || !messagesContainer) {
    return;
  }

  // Conversation history: array of { role: 'user' | 'model', content: string }
  let conversationHistory = [];
  let isGenerating = false;

  // Toggle Chat Window
  function toggleChat(forceOpen = null) {
    const isHidden = chatWindow.classList.contains('d-none');
    const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

    if (shouldOpen) {
      chatWindow.classList.remove('d-none');
      launcherChatIcon?.classList.add('d-none');
      launcherCloseIcon?.classList.remove('d-none');
      setTimeout(() => {
        chatInput.focus();
        scrollToBottom();
      }, 100);
    } else {
      chatWindow.classList.add('d-none');
      launcherChatIcon?.classList.remove('d-none');
      launcherCloseIcon?.classList.add('d-none');
    }
  }

  launcherBtn.addEventListener('click', () => toggleChat());
  closeBtn?.addEventListener('click', () => toggleChat(false));
  navbarChatBtn?.addEventListener('click', () => toggleChat(true));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chatWindow.classList.contains('d-none')) {
      toggleChat(false);
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // Handle Enter to send, Shift+Enter for newline
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // Quick Prompt buttons
  if (quickPromptsContainer) {
    quickPromptsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-quick-prompt');
      if (btn && !isGenerating) {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt) {
          chatInput.value = prompt;
          chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }
    });
  }

  // Handle Clear Conversation
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (conversationHistory.length === 0) return;
      conversationHistory = [];
      resetChatMessages();
    });
  }

  function resetChatMessages() {
    messagesContainer.innerHTML = `
      <div class="ai-message ai-message-model mb-3">
        <div class="ai-message-avatar">
          <i class="bi bi-robot"></i>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-bubble">
            <p class="mb-1"><strong>Conversation reset.</strong></p>
            <p class="mb-2">How can I assist you with Nanda Kishore's portfolio today?</p>
          </div>
          <span class="ai-message-time">Just now</span>
        </div>
      </div>
      <div class="ai-quick-prompts mb-2" id="aiQuickPrompts">
        <span class="small text-secondary d-block mb-1.5 fw-semibold" style="font-size: 0.72rem;">Suggested questions:</span>
        <div class="d-flex flex-wrap gap-1.5">
          <button class="btn btn-sm btn-quick-prompt" type="button" data-prompt="Can you tell me about the DriveX project architecture and tech stack?">
            🚗 DriveX Project
          </button>
          <button class="btn btn-sm btn-quick-prompt" type="button" data-prompt="What are Nanda Kishore's core technical skills and programming proficiencies?">
            ⚡ Core Skills
          </button>
          <button class="btn btn-sm btn-quick-prompt" type="button" data-prompt="Why should a tech company hire Nanda for a Software Engineering Internship?">
            💼 Why Hire Nanda?
          </button>
          <button class="btn btn-sm btn-quick-prompt" type="button" data-prompt="What certifications has Nanda earned from IBM SkillsBuild?">
            🎓 IBM Certifications
          </button>
          <button class="btn btn-sm btn-quick-prompt" type="button" data-prompt="How can I contact Nanda or schedule an interview with him?">
            📬 Contact Details
          </button>
        </div>
      </div>
    `;
    scrollToBottom();
  }

  function showLoadingIndicator() {
    const loadingEl = document.createElement('div');
    loadingEl.id = 'aiChatInlineLoading';
    loadingEl.className = 'ai-message ai-message-model mb-3';
    loadingEl.innerHTML = `
      <div class="ai-message-avatar">
        <i class="bi bi-robot"></i>
      </div>
      <div class="ai-message-content">
        <div class="ai-message-bubble py-2 px-3">
          <div class="ai-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    messagesContainer.appendChild(loadingEl);
    scrollToBottom();
  }

  function hideLoadingIndicator() {
    const loadingEl = document.getElementById('aiChatInlineLoading');
    if (loadingEl) {
      loadingEl.remove();
    }
  }

  // Form Submit Handler
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isGenerating) return;

    const userText = chatInput.value.trim();
    if (!userText) return;

    // Reset input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // 1. Render User Message
    appendMessage('user', userText);

    // 2. Add to conversation history
    conversationHistory.push({
      role: 'user',
      content: userText,
    });

    // 3. Set loading state
    isGenerating = true;
    sendBtn.disabled = true;
    showLoadingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationHistory,
          model: 'gemini-3.8-flash',
          rolePersona: 'recruiter',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned error (${response.status})`);
      }

      const replyText = data.reply || "I didn't receive a response.";

      // 4. Add model reply to history
      conversationHistory.push({
        role: 'model',
        content: replyText,
      });

      // 5. Hide loading and render Assistant Reply
      hideLoadingIndicator();
      appendMessage('model', replyText);
    } catch (err) {
      console.error('Chat request failed:', err);
      hideLoadingIndicator();
      appendErrorMessage(err.message || 'Unable to connect to the Gemini API.');
    } finally {
      isGenerating = false;
      sendBtn.disabled = false;
      hideLoadingIndicator();
      scrollToBottom();
      chatInput.focus();
    }
  });

  function appendMessage(role, text) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageEl = document.createElement('div');
    messageEl.className = `ai-message ai-message-${role} mb-3`;

    if (role === 'user') {
      messageEl.innerHTML = `
        <div class="ai-message-avatar">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-bubble">
            <p class="mb-0">${escapeHtml(text)}</p>
          </div>
          <span class="ai-message-time">${timeStr}</span>
        </div>
      `;
    } else {
      const formattedHtml = formatMarkdown(text);
      messageEl.innerHTML = `
        <div class="ai-message-avatar">
          <i class="bi bi-robot"></i>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-bubble">
            ${formattedHtml}
          </div>
          <span class="ai-message-time">${timeStr}</span>
        </div>
      `;
    }

    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }

  function appendErrorMessage(errorText) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageEl = document.createElement('div');
    messageEl.className = 'ai-message ai-message-model mb-3';
    messageEl.innerHTML = `
      <div class="ai-message-avatar" style="background-color: rgba(239, 68, 68, 0.15); color: #ef4444;">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </div>
      <div class="ai-message-content">
        <div class="ai-message-bubble border-danger-subtle" style="background-color: var(--bg-surface);">
          <p class="text-danger fw-semibold mb-1">
            <i class="bi bi-x-circle me-1"></i> Gemini API Notice
          </p>
          <p class="small text-secondary mb-2">${escapeHtml(errorText)}</p>
          <p class="small text-secondary mb-0" style="font-size: 0.72rem;">Please make sure your GEMINI_API_KEY is active in the AI Studio Settings &gt; Secrets panel, or try again.</p>
        </div>
        <span class="ai-message-time">${timeStr}</span>
      </div>
    `;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let safe = escapeHtml(text);

    // Code blocks ```code```
    safe = safe.replace(/```(?:([a-zA-Z0-9]+)\n)?([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Parse bullet lines
    const lines = safe.split('\n');
    let inList = false;
    const output = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const bulletMatch = line.match(/^(\*|-|\+)\s+(.+)/);

      if (bulletMatch) {
        if (!inList) {
          output.push('<ul class="mb-2">');
          inList = true;
        }
        output.push(`<li>${bulletMatch[2]}</li>`);
      } else {
        if (inList) {
          output.push('</ul>');
          inList = false;
        }
        if (line.trim().length > 0) {
          output.push(`<p class="mb-1.5">${line}</p>`);
        }
      }
    }

    if (inList) {
      output.push('</ul>');
    }

    return output.join('');
  }
}


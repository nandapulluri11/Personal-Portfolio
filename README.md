# Personal Portfolio Website — Project 01

A clean, modern, responsive personal portfolio website developed by **Nanda Kishore**, a 2nd-year B.Tech undergraduate student in Computer Science & Engineering / Information Technology.

Built with **HTML5**, **CSS3**, **Vanilla JavaScript**, and **Bootstrap 5.3**, this portfolio presents academic credentials, technical skills, verified course achievements, practical projects, and contact channels in a clean, recruiter-friendly single-page interface.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Sections Breakdown](#sections-breakdown)
- [Netlify Deployment Guide](#netlify-deployment-guide)
- [Future Improvements](#future-improvements)
- [Author & Connect](#author--connect)

---

## Overview

- **Student:** Nanda Kishore
- **Academic Standing:** B.Tech 2nd Year (Expected Graduation: 2028)
- **Focus Areas:** Software Engineering, Full-Stack Web Development, Artificial Intelligence & Machine Learning Fundamentals
- **Purpose:** Academic portfolio, internship applications, technical showcase, placement preparation, and recruiter evaluation.

---

## Key Features

1. **Clean Visual Hierarchy & Modern UI:**
   - 8px-based consistent layout grid with refined contrast and typography.
   - Built with Google Fonts (*Plus Jakarta Sans* and *JetBrains Mono*).
   - Card elevations, subtle borders, and smooth transition states.

2. **Dark / Light Mode Toggle:**
   - Instant theme switching with persistent user preference stored in browser `localStorage`.
   - Automatic fallback to system preference via `prefers-color-scheme`.

3. **Sticky Responsive Navigation:**
   - Fixed header with frosted glass backdrop blur.
   - Mobile hamburger collapse menu with automatic collapse upon link selection.
   - Dynamic active scrollspy highlighting the currently viewed section.

4. **Honest Skill Representation:**
   - Clearly separated skill categories: Frontend, Programming, Backend & APIs, Databases, Tools & Platforms, and AI / Emerging Tech.
   - Distinct badges (`Fundamentals`, `Hands-on`, `Currently Learning`) without unrealistic percentage metrics.

5. **Showcase of Practical Projects:**
   - **Featured Project:** *DriveX — Peer-to-Peer Car Rental Marketplace*
   - Real-world student projects: *Book Library Management System*, *Student Face Recognition System*, *Daily Focus & Todo Tracker*, *NutriGuide*, *Job Hub*, and *NovaMart*.
   - Filter tabs: All Projects, Full Stack / Web, Python & AI, and Under Development.
   - Interactive project detail modals and source code links.

6. **Interactive Modals & Validation:**
   - Accessible modal dialogues for project overviews, IBM SkillsBuild certification verification, and resume file access instructions.
   - Contact form with client-side field validation and option to open prefilled inquiries directly in your preferred email client.

7. **Gemini AI Career & Portfolio Chatbot:**
   - Multi-turn interactive conversational assistant powered by `@google/genai` (`gemini-3.8-flash`, `gemini-3.5-flash`, `gemini-3.1-flash-lite`, and `gemini-3.1-pro-preview`).
   - Dynamic role personas: *Recruiter & Career Fit*, *Tech Interviewer & DSA Coach*, and *Peer & Project Collaborator*.
   - Floating launcher widget, suggested prompt chips, auto-scrolling message thread, markdown code formatting with syntax styling, and session reset.

8. **Accessibility & SEO Optimization:**
   - Fully semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
   - Accessible form controls with explicit `<label>` tags and ARIA support.
   - Skip-to-content accessibility link.
   - Complete OpenGraph and Twitter meta cards.
   - `prefers-reduced-motion` media queries honoring user animation preferences.

---

## Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Markup & Semantics** | HTML5 Semantic Tags, Accessible ARIA Landmarks |
| **Styling & Layout** | CSS3 Custom Properties (Design Tokens), Bootstrap 5.3 Framework, Flexbox & CSS Grid |
| **Icons & Fonts** | Bootstrap Icons, Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*) |
| **Client-Side Scripting** | Modern Vanilla JavaScript (ES6+), DOM APIs, LocalStorage API |
| **Bundling / Dev Server** | Vite (Development preview & static asset pipeline) |
| **Deployment Target** | Netlify / Vercel / GitHub Pages (Static hosting) |

---

## Project Structure

```text
portfolio/
│
├── index.html                    # Main HTML5 entry point & semantic structure
├── css/
│   └── style.css                 # Custom CSS variables, typography, animations, dark mode
│
├── js/
│   └── script.js                 # Vanilla JS for navbar, theme toggle, filters, form validation
│
├── assets/
│   ├── images/                   # High-DPI SVG previews and profile graphics
│   │   ├── profile-placeholder.svg
│   │   ├── drivex.svg
│   │   ├── library-system.svg
│   │   ├── face-recognition.svg
│   │   ├── todo-app.svg
│   │   ├── nutriguide.svg
│   │   └── jobhub.svg
│   │
│   └── resume/
│       └── README.txt            # Resume PDF storage directory & guidance
│
├── metadata.json                 # Project descriptor
├── package.json                  # Scripts and development dependencies
└── README.md                     # Documentation & deployment guide
```

---

## Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[GitHub-Username]/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Open directly in browser:**
   Because this is built with standard HTML5, CSS3, and JavaScript, you can simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

3. **Or run with Vite / Live Server:**
   ```bash
   npm install
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## Sections Breakdown

1. **Hero:** Introduction, academic status, call-to-actions (View Projects, Download Resume, Contact Me), and social links.
2. **About Me:** Academic overview, personal statement, quick stat counters, and learning philosophy.
3. **Skills:** Categorized matrix of languages, frameworks, databases, developer tools, and AI technologies.
4. **Education:** Degree details, expected graduation year, college placeholder, and core coursework.
5. **Projects:** Large featured card and filterable grid with status indicators (`Completed` / `Under Development`).
6. **Certifications:** Verified IBM SkillsBuild course badges with credential details.
7. **Achievements:** Technical fests, hackathons, and workshops.
8. **Learning Journey:** 6-phase progression roadmap demonstrating continuous technical evolution.
9. **Contact:** Direct email, phone placeholder, location, and validated contact form with email client launcher.
10. **Footer:** Quick navigation links, copyright attribution, and dynamic year.

---

## Netlify Deployment Guide

Deploying this static portfolio to Netlify takes less than 2 minutes:

### Method A: Connect with GitHub (Recommended)
1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Personal Portfolio Website"
   git branch -M main
   git remote add origin https://github.com/[GitHub-Username]/personal-portfolio.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://www.netlify.com/).
3. Click **"Add new site"** > **"Import an existing project"**.
4. Choose **GitHub** and select your `personal-portfolio` repository.
5. Build settings:
   - **Base directory:** Leave blank (root).
   - **Build command:** `npm run build` (or leave empty if deploying plain static HTML/CSS/JS).
   - **Publish directory:** `dist` (if using Vite build) or `.` (root for pure static).
6. Click **"Deploy site"**.
7. Test the live HTTPS URL provided by Netlify!

### Method B: Netlify Drop (Manual Drag-and-Drop)
1. In your local terminal, run `npm run build`.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` directory directly into the drop zone.
4. Your portfolio is immediately live!

---

## Future Improvements

- [ ] Add real-time GitHub activity feed using public GitHub REST API.
- [ ] Connect contact form to Formspree, EmailJS, or Netlify Forms for serverless submissions without opening an external mail client.
- [ ] Add blog/articles section to share notes on DSA problems and AI experiments.
- [ ] Integrate interactive code snippets and project demo videos.

---

## Author & Connect

**Nanda Kishore**  
B.Tech 2nd Year Student | Aspiring Software & AI Engineer  
- **Email:** [nandapulluri11@gmail.com](mailto:nandapulluri11@gmail.com)  
- **GitHub:** [https://github.com/[GitHub-Username]](https://github.com/[GitHub-Username])  
- **LinkedIn:** [https://linkedin.com/in/[LinkedIn-Username]](https://linkedin.com/in/[LinkedIn-Username])  

---

*© 2026 Nanda Kishore. All rights reserved.*

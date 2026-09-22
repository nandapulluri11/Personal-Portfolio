/**
 * ============================================================================
 * PORTFOLIO CONFIGURATION - NANDA KISHORE
 * Single source of truth for personal details, contact info, social links,
 * education, and project repositories.
 * 
 * Update your personal URLs and placeholders here in one central location.
 * ============================================================================
 */

window.PORTFOLIO_CONFIG = {
  personal: {
    fullName: "Nanda Kishore",
    shortName: "Nanda",
    initials: "NK",
    role: "Aspiring Software & AI Engineer | Full-Stack Enthusiast",
    statusBadge: "B.Tech 2nd Year Student • Actively Learning & Building",
    email: "nandapulluri11@gmail.com",
    // Phone number set as available upon request
    phone: null, 
    // Location details
    location: "Hyderabad, Telangana, India",
    locationDetail: "Open to on-site, hybrid, & remote internship roles",
    bioLead: "Building my foundation in software development, AI, and full-stack web technologies through hands-on projects, rigorous problem-solving, and continuous learning.",
    careerObjective: "Seeking internship opportunities to contribute, learn, and grow in software development, collaborative engineering teams, and real-world system design.",
  },

  education: {
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering (AI & ML)",
    year: "Currently in 2nd Year",
    timeline: "2024 – 2028 (Expected)",
    // Configurable university name:
    institutionName: "Malla Reddy University",
    intermediate: {
      title: "Senior Secondary Education (Class XII / Intermediate)",
      stream: "Mathematics, Physics & Chemistry (MPC Stream)",
      timeline: "Completed 2024",
      institutionName: "Sri Chaitanya Junior Kalasala",
    }
  },

  socialLinks: {
    github: "https://github.com/nandapulluri11",
    linkedin: "https://www.linkedin.com/in/nandapulluri11/",
  },

  resume: {
    pdfPath: "/assets/resume/resume.pdf",
    downloadFileName: "Nanda_Kishore_Resume.pdf",
    hasPdfFile: false, // Set to true once resume.pdf is placed in /assets/resume/resume.pdf
  },

  // Project links & repository configuration
  projects: {
    drivex: {
      github: "https://github.com/nandapulluri11",
      status: "Under Development (75%)",
    },
    library: {
      github: "https://github.com/nandapulluri11",
      status: "Completed",
    },
    vision: {
      github: "https://github.com/nandapulluri11",
      status: "Completed",
    },
    todo: {
      github: "https://github.com/nandapulluri11",
      status: "Completed",
    },
    streakify: {
      github: "https://github.com/nandapulluri11",
      status: "Completed",
    }
  }
};

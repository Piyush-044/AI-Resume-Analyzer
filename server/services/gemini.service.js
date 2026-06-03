import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import {
  ATS_ANALYSIS_PROMPT,
  JOB_MATCH_PROMPT,
  REWRITER_PROMPT,
  COVER_LETTER_PROMPT,
  INTERVIEW_QUESTIONS_PROMPT,
  INTERVIEW_EVALUATE_PROMPT,
  CAREER_ROADMAP_PROMPT,
  LINKEDIN_OPTIMIZER_PROMPT,
  PORTFOLIO_GENERATOR_PROMPT,
  RESUME_PARSER_PROMPT,
  JOB_RECOMMENDATIONS_PROMPT,
} from '../utils/promptTemplates.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_TEXT_LENGTH = 12000;

// Tries env model first, then common fallbacks if model name 404s
const MODEL_FALLBACKS = [
  env.geminiModel,
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
].filter((m, i, arr) => m && arr.indexOf(m) === i);

console.log('Gemini model fallback list:', MODEL_FALLBACKS);
console.log('Active Gemini Key Prefix:', env.geminiApiKey ? env.geminiApiKey.substring(0, 15) : 'None');

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

const truncate = (text) => {
  if (!text) return '';
  return text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;
};

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new ApiError(502, 'Failed to parse AI response');
  }
};

const mapGeminiError = (err) => {
  console.error('Gemini API Error details:', err);
  const msg = err?.message || '';
  if (err?.status === 404 || msg.includes('not found')) {
    return new ApiError(
      502,
      'Gemini model not available. Set GEMINI_MODEL=gemini-2.0-flash in server/.env'
    );
  }
  if (err?.status === 400 || msg.includes('API key')) {
    return new ApiError(401, 'Invalid Gemini API key. Create one at aistudio.google.com/apikey');
  }
  if (err?.status === 429 || msg.includes('quota')) {
    return new ApiError(429, 'Gemini API quota exceeded. Try again later.');
  }
  return new ApiError(502, msg || 'AI service error');
};

const generate = async (prompt) => {
  if (!env.geminiApiKey || env.geminiApiKey.includes('PASTE_')) {
    throw new ApiError(500, 'Gemini API key not configured. Get a key at aistudio.google.com/apikey and set GEMINI_API_KEY in server/.env');
  }

  let lastError;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      console.log('Trying model:', modelName);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseJsonResponse(text);
    } catch (err) {
      lastError = err;
      const retryable =
        err?.status === 404 || String(err?.message || '').includes('not found');
      if (retryable) continue;
      throw mapGeminiError(err);
    }
  }
  throw mapGeminiError(lastError);
};

export const geminiService = {
  async analyzeATS(resumeText) {
    try {
      const data = await generate(ATS_ANALYSIS_PROMPT(truncate(resumeText)));
      return {
        atsScore: Math.min(100, Math.max(0, Number(data.atsScore) || 0)),
        missingSkills: data.missingSkills || [],
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        suggestions: data.suggestions || [],
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock ATS analysis:', err.message);
      return getMockATSAnalysis(resumeText);
    }
  },

  async matchJob(resumeText, jobDescription) {
    try {
      const data = await generate(
        JOB_MATCH_PROMPT(truncate(resumeText), truncate(jobDescription))
      );
      return {
        matchScore: Math.min(100, Math.max(0, Number(data.matchScore) || 0)),
        missingSkills: data.missingSkills || [],
        recommendedSkills: data.recommendedSkills || [],
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock Job Matching:', err.message);
      return getMockJobMatch(resumeText, jobDescription);
    }
  },

  async rewriteBullets(bullets) {
    try {
      const data = await generate(REWRITER_PROMPT(bullets));
      return { bullets: data.bullets || bullets };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock bullet rewriting:', err.message);
      return getMockBullets(bullets);
    }
  },

  async generateCoverLetter(resumeText, jobRole, jobDescription = '') {
    try {
      const data = await generate(
        COVER_LETTER_PROMPT(truncate(resumeText), jobRole, jobDescription)
      );
      return { coverLetter: data.coverLetter || '' };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock cover letter generation:', err.message);
      return { coverLetter: getMockCoverLetter(resumeText, jobRole, jobDescription) };
    }
  },

  async generateInterviewQuestions(resumeText, jobDescription = '') {
    try {
      const data = await generate(
        INTERVIEW_QUESTIONS_PROMPT(truncate(resumeText), truncate(jobDescription))
      );
      return { questions: data.questions || [] };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock interview questions:', err.message);
      return getMockInterviewQuestions(resumeText, jobDescription);
    }
  },

  async evaluateAnswer(question, answer) {
    try {
      const data = await generate(INTERVIEW_EVALUATE_PROMPT(question, answer));
      return {
        score: Math.min(100, Math.max(0, Number(data.score) || 0)),
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        modelAnswer: data.modelAnswer || '',
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock answer evaluation:', err.message);
      return getMockAnswerEvaluation(question, answer);
    }
  },

  async generateCareerRoadmap(resumeText, targetRole) {
    try {
      const data = await generate(CAREER_ROADMAP_PROMPT(truncate(resumeText), targetRole));
      return {
        targetRole: data.targetRole || targetRole,
        phases: data.phases || [],
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock career roadmap:', err.message);
      return getMockCareerRoadmap(resumeText, targetRole);
    }
  },

  async optimizeLinkedIn(resumeText) {
    try {
      const data = await generate(LINKEDIN_OPTIMIZER_PROMPT(truncate(resumeText)));
      return {
        headline: data.headline || '',
        about: data.about || '',
        experienceSnippets: data.experienceSnippets || [],
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock LinkedIn optimization:', err.message);
      return getMockLinkedInOptimization(resumeText);
    }
  },

  async generatePortfolio(resumeText) {
    try {
      const data = await generate(PORTFOLIO_GENERATOR_PROMPT(truncate(resumeText)));
      return { htmlCode: data.htmlCode || '' };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock portfolio website generation:', err.message);
      return getMockPortfolioWebsite(resumeText);
    }
  },

  async parseResume(resumeText) {
    try {
      const data = await generate(RESUME_PARSER_PROMPT(truncate(resumeText)));
      return {
        personalInfo: data.personalInfo || {},
        education: data.education || [],
        experience: data.experience || [],
        skills: data.skills || [],
      };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock resume parsing:', err.message);
      return getMockParsedResume(resumeText);
    }
  },

  async getJobRecommendations(resumeText) {
    try {
      const data = await generate(JOB_RECOMMENDATIONS_PROMPT(truncate(resumeText)));
      return { jobs: data.jobs || [] };
    } catch (err) {
      console.warn('Gemini API failed, falling back to mock job recommendations:', err.message);
      return getMockJobRecommendations(resumeText);
    }
  },
};

// Mock fallback generator functions in case of API Key / Quota failure
const getMockATSAnalysis = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  let missingSkills = ['System Design', 'CI/CD Pipelines', 'Unit Testing (Jest/Mocha)'];
  let strengths = ['Strong understanding of JavaScript/ES6+', 'Hands-on experience with modern frameworks', 'Good communication and team collaboration'];
  let weaknesses = ['Lack of cloud deployment experience (AWS/GCP)', 'Limited exposure to SQL/NoSQL databases', 'No mentions of automated testing frameworks'];
  let suggestions = [
    'Add projects showing AWS or Docker deployment.',
    'Include unit testing libraries like Jest or Cypress under skills.',
    'Mention database optimization techniques if applicable.'
  ];
  let atsScore = 65;

  if (text.includes('react') || text.includes('frontend') || text.includes('html') || text.includes('css')) {
    atsScore = 72;
    missingSkills = ['State Management (Redux Toolkit/Zustand)', 'Next.js & SSR concepts', 'TypeScript integration', 'Performance Optimization (Lighthouse)'];
    strengths = ['Excellent responsive design skills using Tailwind/CSS', 'Proficient in React component lifecycle and Hooks', 'Component-driven development approach'];
    weaknesses = ['Missing TypeScript experience in large codebases', 'No mention of frontend unit testing (Jest/RTL)', 'Limited SEO optimization details'];
    suggestions = [
      'Rewrite projects to highlight typescript migration.',
      'Add Jest and React Testing Library to the Skills section.',
      'Include metrics like "Improved page speed by 25% using code-splitting".'
    ];
  } else if (text.includes('python') || text.includes('node') || text.includes('backend') || text.includes('database')) {
    atsScore = 68;
    missingSkills = ['Redis caching mechanism', 'Microservices Architecture', 'Dockerization & Kubernetes', 'Message Queues (RabbitMQ/Kafka)'];
    strengths = ['Solid understanding of RESTful APIs', 'Database schema design and normalization', 'Asynchronous programming patterns'];
    weaknesses = ['Lack of containerization tools (Docker/Kubernetes)', 'No exposure to cloud services (AWS/Azure)', 'API security headers (Helmet/CORS) not highlighted'];
    suggestions = [
      'Add a backend project highlighting Docker compose deployment.',
      'Include SQL/NoSQL indexing methods under backend skills.',
      'Mention JWT authentication and RBAC security patterns.'
    ];
  }

  return {
    atsScore,
    missingSkills,
    strengths,
    weaknesses,
    suggestions
  };
};

const getMockJobMatch = (resumeText, jobDescription) => {
  const resume = (resumeText || '').toLowerCase();
  const job = (jobDescription || '').toLowerCase();
  
  let matchScore = 75;
  let missingSkills = ['Docker', 'AWS Lambda', 'GraphQL'];
  let recommendedSkills = ['TypeScript', 'Kubernetes', 'CI/CD'];

  const jobWords = job.split(/\W+/).filter(w => w.length > 3);
  const matched = jobWords.filter(w => resume.includes(w));
  
  if (jobWords.length > 0) {
    matchScore = Math.min(95, Math.max(30, Math.round((matched.length / jobWords.length) * 100)));
  }

  if (job.includes('react') || job.includes('frontend')) {
    missingSkills = ['Tailwind CSS', 'Redux', 'Jest'];
    recommendedSkills = ['TypeScript', 'Next.js', 'Vite'];
  } else if (job.includes('node') || job.includes('backend')) {
    missingSkills = ['MongoDB', 'Express', 'Redis'];
    recommendedSkills = ['Docker', 'AWS', 'PostgreSQL'];
  }

  return {
    matchScore,
    missingSkills,
    recommendedSkills
  };
};

const getMockBullets = (bullets) => {
  if (!Array.isArray(bullets)) return { bullets: [] };
  return {
    bullets: bullets.map(b => {
      if (b.includes('Responsible for')) {
        return b.replace('Responsible for', 'Spearheaded the development and optimization of');
      }
      return `Successfully optimized ${b.toLowerCase()} to improve user engagement by 15% and reduce server response time by 20%.`;
    })
  };
};

const getMockCoverLetter = (resumeText, jobRole, jobDescription = '') => {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobRole || 'Software Engineer'} position. With my background in software development and hands-on experience in building scalable web applications, I am confident in my ability to contribute value to your engineering team.

My technical background aligns well with the requirements outlined in the job description. I have a proven track record of designing responsive interfaces, implementing robust backend APIs, and collaborating with cross-functional teams. I am particularly excited about this role because it offers the opportunity to work with cutting-edge technologies and solve complex technical challenges.

Thank you for your time and consideration. I look forward to the possibility of discussing how my skills and experience can help your team succeed.

Sincerely,
Candidate`;
};

const getMockInterviewQuestions = (resumeText, jobDescription) => {
  const text = (resumeText || '').toLowerCase();
  const jd = (jobDescription || '').toLowerCase();

  let questions = [
    {
      id: 1,
      question: "Can you describe a challenging software bug you encountered and how you systematically debugged it?",
      type: "Technical"
    },
    {
      id: 2,
      question: "How do you handle conflict or differing opinions with team members when deciding on a technology implementation?",
      type: "Behavioral"
    },
    {
      id: 3,
      question: "Based on the projects listed in your resume, what would you do differently if you had to start one of them again from scratch?",
      type: "Resume-specific"
    }
  ];

  if (text.includes('react') || text.includes('frontend') || jd.includes('react') || jd.includes('frontend')) {
    questions = [
      {
        id: 1,
        question: "Explain the difference between useMemo and useCallback hooks in React, and when you should use them.",
        type: "Technical"
      },
      {
        id: 2,
        question: "How do you ensure a web application is highly performant and accessible (SEO, Lighthouse score, screen readers)?",
        type: "Technical"
      },
      {
        id: 3,
        question: "Can you detail how you structured state management in one of the frontend projects mentioned on your resume?",
        type: "Resume-specific"
      }
    ];
  } else if (text.includes('python') || text.includes('node') || text.includes('backend') || jd.includes('node') || jd.includes('backend')) {
    questions = [
      {
        id: 1,
        question: "How do Node.js clustering and worker threads work to handle CPU-intensive tasks?",
        type: "Technical"
      },
      {
        id: 2,
        question: "How would you design a rate limiter for a public API endpoint to prevent abuse or DDoS attacks?",
        type: "Technical"
      },
      {
        id: 3,
        question: "On your resume, you worked with databases. How do you go about optimization, indexing, and reducing query latency?",
        type: "Resume-specific"
      }
    ];
  }

  return { questions };
};

const getMockAnswerEvaluation = (question, answer) => {
  const ans = (answer || '').toLowerCase();
  let score = 50;
  let strengths = [];
  let improvements = [];
  let modelAnswer = "";

  if (ans.length > 100) {
    score = 85;
    strengths = [
      "Provides detailed technical explanation or context.",
      "Clear articulation of the problem-solving strategy.",
      "Used professional terminology and structured the response logically."
    ];
    improvements = [
      "You could add a specific metric (e.g., % improvement) to show the business impact of your decision.",
      "Briefly mention how you communicated with stake-holders or team members."
    ];
  } else if (ans.length > 20) {
    score = 65;
    strengths = [
      "Answer is clear and on-topic.",
      "Demonstrates fundamental understanding of the concept."
    ];
    improvements = [
      "Elaborate with a practical example from your previous work experience (STAR method: Situation, Task, Action, Result).",
      "Dive deeper into the technical mechanics rather than keeping it high-level."
    ];
  } else {
    score = 30;
    strengths = [
      "Acknowledged the question directly."
    ];
    improvements = [
      "The answer is extremely brief. Try using the STAR framework to structure a detailed response.",
      "Incorporate specific technical terms or tools to show familiarity."
    ];
  }

  const qLower = question.toLowerCase();
  if (qLower.includes('usememo') || qLower.includes('usecallback')) {
    modelAnswer = "useMemo caches the *result* of a calculation between re-renders, while useCallback caches the *callback function instance* itself. You should use useMemo for expensive computations (e.g., sorting a large array) and useCallback when passing a callback prop to an optimized child component (like React.memo) to prevent unnecessary re-renders of that child.";
  } else if (qLower.includes('rate limiter') || qLower.includes('rate limiting')) {
    modelAnswer = "To design a rate limiter, I would use Redis to store requests count keyed by client IP or JWT token. Using a Sliding Window Log or Token Bucket algorithm, I would inspect the requests window. If requests exceed the threshold, I would return a 429 Too Many Requests status code with a Retry-After header. Utilizing Redis ensures fast, sub-millisecond reads/writes and distributed compatibility.";
  } else if (qLower.includes('clustering') || qLower.includes('worker thread')) {
    modelAnswer = "Node.js runs in a single thread, but we can utilize all CPU cores via the 'cluster' module, which spawns multiple instances (processes) of the app sharing the same port (using round-robin load balancing). For CPU-bound tasks inside a single process, we should use 'worker_threads' to run JavaScript in parallel, keeping the main event loop unblocked for handling inbound I/O requests.";
  } else {
    modelAnswer = "A strong answer should follow the STAR framework. Start by describing a specific Situation (e.g., 'In my last project...'), the Task or goal, the concrete Actions you took (e.g., 'I analyzed the bottlenecks using dev tools and restructured the component...'), and the quantifiable Result (e.g., 'reducing page load times by 40%').";
  }

  return {
    score,
    strengths,
    improvements,
    modelAnswer
  };
};

const getMockCareerRoadmap = (resumeText, targetRole) => {
  const text = (resumeText || '').toLowerCase();
  const role = targetRole || 'Senior Software Engineer';

  let phases = [
    {
      phaseNumber: 1,
      title: "Strengthening Backend Fundamentals",
      description: "Build robust foundational knowledge in database optimization, concurrency, and security protocols.",
      skillsToLearn: ["Database Indexing", "JWT & OAuth 2.0", "Redis Caching"],
      projectIdea: {
        title: "Secure Distributed E-commerce Backend",
        description: "Develop a Node.js/Express API with secure JWT authentication, rate limiting, and Redis caching. Measure and optimize database query response times."
      },
      resources: ["Designing Data-Intensive Applications (Book)", "Backend Engineering Course on Udemy"]
    },
    {
      phaseNumber: 2,
      title: "Containerization and DevOps Integration",
      description: "Learn how to wrap applications in secure, lightweight environments and automate continuous deployment pipelines.",
      skillsToLearn: ["Docker", "GitHub Actions CI/CD", "AWS (EC2, S3, RDS)"],
      projectIdea: {
        title: "Multi-container Dockerized App Deployment",
        description: "Containerize a React/Node/MongoDB app using Docker Compose. Write GitHub Actions workflows to auto-test and deploy to AWS Elastic Beanstalk or Render."
      },
      resources: ["Docker & Kubernetes: The Practical Guide (Academind)", "AWS Certified Developer Study Guide"]
    },
    {
      phaseNumber: 3,
      title: "System Design and Scaling",
      description: "Understand architectural patterns for scaling systems to millions of users, focusing on reliability and fault tolerance.",
      skillsToLearn: ["Microservices Architecture", "Message Brokers (Kafka/RabbitMQ)", "System Design Patterns"],
      projectIdea: {
        title: "Event-Driven Real-time Notification System",
        description: "Implement a microservices-based system using Kafka to stream real-time events. Deliver notifications via WebSockets with dynamic fallback routing."
      },
      resources: ["ByteByteGo System Design Primer", "System Design Interview by Alex Xu"]
    }
  ];

  const roleLower = role.toLowerCase();
  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('ui') || roleLower.includes('ux')) {
    phases = [
      {
        phaseNumber: 1,
        title: "Advanced JavaScript & TypeScript Integration",
        description: "Transition from basic JS to highly typed, scalable structures using TypeScript, focusing on design patterns.",
        skillsToLearn: ["TypeScript", "Advanced React Patterns (Compound Components)", "Zustand State Management"],
        projectIdea: {
          title: "Fully Typed Enterprise Dashboard",
          description: "Build a responsive grid-based analytics dashboard using React, Tailwind, TypeScript, and Zustand. Implement full keyboard accessibility and theme toggles."
        },
        resources: ["Understanding TypeScript (Course)", "You Don't Know JS Yet (Book Series)"]
      },
      {
        phaseNumber: 2,
        title: "Performance & Rendering Optimization",
        description: "Learn React performance tuning, Next.js Server Components, Static Site Generation (SSG), and Server-Side Rendering (SSR).",
        skillsToLearn: ["Next.js (App Router)", "Web Vitals & Lighthouse Optimization", "React Server Components"],
        projectIdea: {
          title: "High-Performance Content Site with SSR/ISR",
          description: "Migrate a client-side React app to Next.js. Optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) to achieve perfect 100/100 Lighthouse scores."
        },
        resources: ["Official Next.js Learn Tutorial", "Google Web.dev Learn Performance Guide"]
      },
      {
        phaseNumber: 3,
        title: "Modern Frontend Testing & CI/CD Pipelines",
        description: "Implement unit testing, integration testing, and end-to-end user flow testing to ensure application resilience.",
        skillsToLearn: ["Jest & React Testing Library", "Cypress / Playwright", "Frontend CI/CD & CDN Caching"],
        projectIdea: {
          title: "E2E Tested Collaborative Workspace App",
          description: "Develop a workspace application. Write 80%+ coverage unit tests and visual regression checks using Playwright. Deploy to Vercel/Cloudflare Pages with automated PR testing."
        },
        resources: ["Testing JavaScript by Kent C. Dodds", "Playwright Documentation and Tutorials"]
      }
    ];
  } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre') || roleLower.includes('aws')) {
    phases = [
      {
        phaseNumber: 1,
        title: "Linux, Networking & Container Basics",
        description: "Master terminal command execution, shell scripting, basic networking layers, and containerization principles.",
        skillsToLearn: ["Bash Scripting", "Linux Server Admin", "Docker & Multi-stage Builds"],
        projectIdea: {
          title: "Automated Linux Backup and Docker Host Setup",
          description: "Write custom bash scripts to automate daily DB backups to remote cloud object storage. Set up an isolated Docker Bridge network for local applications."
        },
        resources: ["Linux Command Line and Shell Scripting Bible", "Docker Mastery on Udemy"]
      },
      {
        phaseNumber: 2,
        title: "Infrastructure as Code (IaC) & Cloud Orchestration",
        description: "Automate cloud resources provisioning using code, and manage multi-container applications at scale.",
        skillsToLearn: ["Terraform", "Kubernetes (K8s)", "AWS (VPC, IAM, EKS)"],
        projectIdea: {
          title: "Declarative AWS Infrastructure with Terraform",
          description: "Write Terraform files to provision an AWS VPC, EC2 clusters, RDS database, and an S3 bucket. Deploy a highly-available Node app using Kubernetes manifests."
        },
        resources: ["Terraform Up & Running (Book)", "Certified Kubernetes Administrator (CKA) Course"]
      },
      {
        phaseNumber: 3,
        title: "Continuous Delivery & Observability",
        description: "Set up automated git-ops deployment pipelines and advanced monitoring to detect application failures before users do.",
        skillsToLearn: ["GitOps (ArgoCD)", "Prometheus & Grafana", "ELK Stack / Centralized Logging"],
        projectIdea: {
          title: "GitOps Powered CD Pipeline with Live Monitoring",
          description: "Establish a complete CD pipeline that triggers deployments to Kubernetes on Git commits. Connect Prometheus to scrape metrics and build Grafana dashboards."
        },
        resources: ["ArgoCD Official Docs", "Monitoring Systems with Prometheus (Book)"]
      }
    ];
  }

  return {
    targetRole: role,
    phases
  };
};

const getMockLinkedInOptimization = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  let headline = "Software Engineer | Full Stack Developer | Building scalable web apps";
  let about = "I am a passionate Software Engineer with a solid track record of developing fast, responsive frontend systems and robust backend APIs. I love solving complex engineering challenges and writing clean, maintainable code.\n\nThroughout my career, I have integrated multiple state-management architectures, set up automation pipelines, and optimized databases. I look forward to working on high-impact projects and growing with ambitious engineering teams.";
  let experienceSnippets = [
    {
      company: "Tech Solution Corp",
      role: "Software Developer",
      bullet: "Spearheaded integration of RESTful endpoints, slashing API response times by 35%."
    }
  ];

  if (text.includes('react') || text.includes('frontend')) {
    headline = "React Developer | Frontend Engineer | Next.js & UI/UX enthusiast";
    about = "I am a dedicated Frontend Developer specializing in React, Next.js, and modern CSS frameworks like Tailwind CSS. My focus lies in designing stunning user interfaces that deliver intuitive and highly responsive experiences.\n\nI build fast, accessible web applications with pixel-perfect precision and optimize Lighthouse scores to achieve near-perfect performance. I am excited to collaborate on next-generation web products.";
    experienceSnippets = [
      {
        company: "Innovate Web Lab",
        role: "Frontend Engineer",
        bullet: "Migrated legacy client application to React 18, increasing user engagement by 20%."
      }
    ];
  } else if (text.includes('node') || text.includes('backend') || text.includes('python')) {
    headline = "Backend Engineer | Node.js Developer | Systems & API Architect";
    about = "I am a Backend Engineer focused on building secure, scalable microservices and database engines. I specialize in Node.js, Express, and both SQL and NoSQL databases.\n\nFrom implementing secure JWT authentication policies to optimizing database indexes and cache hit rates using Redis, I focus on system reliability, database speed, and application security.";
    experienceSnippets = [
      {
        company: "Core Cloud Systems",
        role: "Backend Architect",
        bullet: "Redesigned relational schema models, resulting in a 40% query performance optimization."
      }
    ];
  }

  return { headline, about, experienceSnippets };
};

const getMockPortfolioWebsite = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  let name = "Alex Developer";
  let role = "Full Stack Engineer";
  let skills = ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript"];
  let projectTitle = "SaaS Analytics Dashboard";
  let projectDesc = "An interactive real-time dashboard monitoring critical business KPIs, built using React, Recharts, and Express.";

  if (text.includes('react') || text.includes('frontend')) {
    name = "Jordan Frontend Developer";
    role = "Frontend Engineer";
    skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Jest", "HTML/CSS"];
    projectTitle = "Collaborative Whiteboard App";
    projectDesc = "A collaborative, real-time board editor featuring drawing tools, built with React and Socket.io.";
  } else if (text.includes('node') || text.includes('backend') || text.includes('python')) {
    name = "Morgan Backend Developer";
    role = "Backend Engineer";
    skills = ["Node.js", "Express", "Python", "MongoDB", "PostgreSQL", "Docker", "Redis", "AWS"];
    projectTitle = "Microservices Order Engine";
    projectDesc = "A secure transaction pipeline running inside Docker, utilizing message queues (RabbitMQ) to scale transaction processing.";
  }

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${name} - Personal Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 scroll-smooth">
    <!-- Header -->
    <header class="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">\${name}</span>
            <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#about" class="hover:text-indigo-600 transition">About</a>
                <a href="#skills" class="hover:text-indigo-600 transition">Skills</a>
                <a href="#projects" class="hover:text-indigo-600 transition">Projects</a>
                <a href="#contact" class="hover:text-indigo-600 transition">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero -->
    <section class="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <span class="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Available for hire</span>
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Hi, I'm <span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">\${name}</span></h1>
        <p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8">A highly skilled \${role} building performant, responsive web apps and digital experiences.</p>
        <div class="flex items-center justify-center gap-4">
            <a href="#projects" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition">View My Work</a>
            <a href="#contact" class="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-6 py-3 rounded-lg transition">Contact Me</a>
        </div>
    </section>

    <!-- About -->
    <section id="about" class="py-20 bg-white border-y border-slate-100 px-6">
        <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-3xl font-bold tracking-tight mb-4">About Me</h2>
                <p class="text-slate-500 leading-relaxed mb-4">I'm a dedicated \${role} specializing in building clean, elegant user interfaces and scalable APIs. I enjoy transforming complex problems into simple, high-performing websites.</p>
                <p class="text-slate-500 leading-relaxed">My engineering philosophy is rooted in performance, accessibility, and clean architecture. I'm always looking to master new tools and collaborate on innovative projects.</p>
            </div>
            <div class="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl aspect-video flex items-center justify-center border border-indigo-200/50 shadow-inner">
                <span class="text-indigo-600 font-semibold text-lg">&lt;Code /&gt;</span>
            </div>
        </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="py-20 px-6 max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold tracking-tight text-center mb-12">My Core Skills</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            \${skills.map(s => '<div class="bg-white border border-slate-200/60 p-4 rounded-xl text-center shadow-sm hover:-translate-y-1 transition duration-205"><span class="font-medium text-slate-800">' + s + '</span></div>').join('')}
        </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="py-20 bg-white border-t border-slate-100 px-6">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold tracking-tight text-center mb-12">Featured Project</h2>
            <div class="bg-slate-50 rounded-2xl border border-slate-155 p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div class="bg-indigo-600 rounded-xl aspect-video flex items-center justify-center text-white font-bold shadow-md">
                    \${projectTitle}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">\${projectTitle}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">\${projectDesc}</p>
                    <span class="text-xs font-semibold tracking-wide uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">React • Node.js • Tailwind</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="py-20 bg-slate-900 text-white text-center px-6">
        <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold mb-4">Let's Connect</h2>
            <p class="text-slate-400 mb-8 max-w-md mx-auto">I'm currently open to new opportunities, freelance contracts, or technical collaborations.</p>
            <a href="mailto:hello@yourdomain.com" class="inline-block bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-md transition">Email Me</a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 bg-slate-950 text-slate-500 text-sm text-center">
        <p>&copy; \${new Date().getFullYear()} \${name}. All rights reserved.</p>
    </footer>
</body>
</html>`;

  return { htmlCode };
};

const getMockParsedResume = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  
  let fullName = "Jane Doe";
  let email = "jane.doe@gmail.com";
  let phone = "+1 (555) 019-2834";
  let website = "https://janedoe.dev";
  let summary = "Experienced Web Engineer with a demonstrated history of delivering modern front-end application architecture.";
  
  let school = "State University of Technology";
  let degree = "Bachelor of Science in Computer Science";
  let year = "2020 - 2024";

  let company = "Global Software Solutions";
  let role = "Software Engineer";
  let duration = "2024 - Present";
  let description = "Designed database configurations, created modern UI styles, and automated server-side build steps.";

  let skills = ["JavaScript", "React", "Node.js", "Express", "HTML/CSS", "Git", "SQL"];

  if (text.includes('react') || text.includes('frontend')) {
    fullName = "Riya Sharma";
    email = "riya.sharma@outlook.com";
    phone = "+91 98765 43210";
    website = "https://riyasharma.github.io";
    summary = "Creative Frontend Specialist with 2+ years of experience structuring beautiful React layouts and refining animations.";
    school = "Delhi Technical University";
    degree = "B.Tech in Computer Engineering";
    year = "2019 - 2023";
    company = "Creative Web Studio";
    role = "React Developer";
    duration = "2023 - 2025";
    description = "Developed single-page interfaces, refined pixel alignment with Tailwind, and implemented Redux context blocks.";
    skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Jest", "HTML5/CSS3"];
  } else if (text.includes('node') || text.includes('backend') || text.includes('python')) {
    fullName = "Amit Patel";
    email = "amit.patel@techcorp.in";
    phone = "+91 91234 56789";
    website = "https://amitpatel.dev";
    summary = "Backend Engineering Professional passionate about API development, relational database schemas, and microservices caching.";
    school = "Indian Institute of Technology";
    degree = "M.Tech in Software Systems";
    year = "2018 - 2022";
    company = "Enterprise Cloud Ltd";
    role = "Backend Developer";
    duration = "2022 - Present";
    description = "Constructed modular Express routers, deployed docker containers to AWS, and utilized Redis pipelines for caching queries.";
    skills = ["Node.js", "Express", "Python", "MongoDB", "PostgreSQL", "Docker", "AWS", "Redis"];
  }

  return {
    personalInfo: { fullName, email, phone, website, summary },
    education: [{ school, degree, year }],
    experience: [{ company, role, duration, description }],
    skills
  };
};

const getMockJobRecommendations = (resumeText) => {
  const text = (resumeText || '').toLowerCase();
  
  let jobs = [
    {
      id: 1,
      title: "Full Stack Engineer",
      company: "Innovaccer Tech",
      location: "Bengaluru, India (Hybrid)",
      salary: "₹12,00,000 - ₹18,00,000 / year",
      matchScore: 82,
      description: "Build robust, customer-facing interfaces and scale the server side architecture. Collaborative team environment.",
      matchingSkills: ["JavaScript", "HTML/CSS", "Node.js", "Git"],
      missingSkills: ["AWS Cloud Deployment", "TypeScript Integration", "System Design"]
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "TCS Systems Ltd",
      location: "Noida, India (On-site)",
      salary: "₹6,00,000 - ₹9,00,000 / year",
      matchScore: 75,
      description: "Support client projects by analyzing code structure, configuring databases, and debugging server bugs.",
      matchingSkills: ["SQL", "JavaScript", "HTML/CSS"],
      missingSkills: ["React Context Hooks", "Jest Testing Framework", "CI/CD Deployment Pipelines"]
    },
    {
      id: 3,
      title: "Junior Devops Associate",
      company: "Cognizant Solutions",
      location: "Remote (India)",
      salary: "₹8,00,000 - ₹11,00,000 / year",
      matchScore: 68,
      description: "Maintain docker clusters, coordinate build processes, and write shell automation scripts.",
      matchingSkills: ["Git", "Command Line Networking"],
      missingSkills: ["Docker Containerization", "Terraform Infrastructure", "GitHub Actions CI/CD"]
    }
  ];

  if (text.includes('react') || text.includes('frontend')) {
    jobs = [
      {
        id: 1,
        title: "Frontend Developer (React)",
        company: "Paytm Payments",
        location: "Noida, India (Hybrid)",
        salary: "₹14,00,000 - ₹20,00,000 / year",
        matchScore: 92,
        description: "Join the consumer portal engineering unit. Work on state management, responsive designs, and Lighthouse rendering speeds.",
        matchingSkills: ["React", "Tailwind CSS", "Redux", "JavaScript"],
        missingSkills: ["TypeScript Migration", "Next.js Server Side Rendering", "Cypress E2E Testing"]
      },
      {
        id: 2,
        title: "React Web Architect",
        company: "Zomato Ltd",
        location: "Gurugram, India (On-site)",
        salary: "₹24,00,000 - ₹32,00,000 / year",
        matchScore: 80,
        description: "Optimize large-scale React assets loading speed and establish reusable component design systems.",
        matchingSkills: ["React", "Tailwind CSS", "JavaScript"],
        missingSkills: ["Next.js App Router", "Lighthouse Performance Auditing", "React Native Mobile Dev"]
      },
      {
        id: 3,
        title: "UI Engineer",
        company: "BrowserStack Corp",
        location: "Mumbai, India (Remote)",
        salary: "₹18,00,000 - ₹24,00,000 / year",
        matchScore: 85,
        description: "Focus on UI consistency, keyboard accessibility, cross-browser compatibility, and modular styling overrides.",
        matchingSkills: ["React", "HTML5/CSS3", "JavaScript"],
        missingSkills: ["TypeScript Interface Types", "Jest & React Testing Library", "Storybook Component Testing"]
      }
    ];
  } else if (text.includes('node') || text.includes('backend') || text.includes('python')) {
    jobs = [
      {
        id: 1,
        title: "Backend Engineer (Node.js)",
        company: "Swiggy Delivery",
        location: "Bengaluru, India (Hybrid)",
        salary: "₹16,00,000 - ₹22,00,000 / year",
        matchScore: 90,
        description: "Implement high-throughput REST APIs, structure database schema logic, and manage Redis indexing pipelines.",
        matchingSkills: ["Node.js", "Express", "MongoDB", "Redis"],
        missingSkills: ["Docker Container Builds", "Message Brokers (Kafka/RabbitMQ)", "Kubernetes Cluster Routing"]
      },
      {
        id: 2,
        title: "Systems Software Engineer",
        company: "Jio Platforms",
        location: "Navi Mumbai, India (On-site)",
        salary: "₹12,0,000 - ₹18,00,000 / year",
        matchScore: 78,
        description: "Design relational database normalization scripts, write API routers, and configure JWT authorization frameworks.",
        matchingSkills: ["Node.js", "PostgreSQL", "MongoDB"],
        missingSkills: ["AWS IAM Security Configurations", "Docker Swarm Deployment", "TypeScript Backend Interfaces"]
      },
      {
        id: 3,
        title: "Cloud DevOps Associate",
        company: "Freshworks Corp",
        location: "Chennai, India (Remote)",
        salary: "₹14,00,000 - ₹19,00,000 / year",
        matchScore: 83,
        description: "Orchestrate build stages, automate AWS server scripts, containerize local backend APIs, and configure alerts.",
        matchingSkills: ["Docker", "AWS Services", "MongoDB"],
        missingSkills: ["Terraform Scripting", "GitHub Actions workflows", "Kubernetes Scaling Policies"]
      }
    ];
  }

  return { jobs };
};



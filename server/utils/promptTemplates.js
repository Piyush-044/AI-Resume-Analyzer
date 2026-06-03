export const ATS_ANALYSIS_PROMPT = (resumeText) => `
Analyze this resume for ATS (Applicant Tracking System) compatibility.
Return ONLY valid JSON with this exact structure (no markdown):
{
  "atsScore": <number 0-100>,
  "missingSkills": [<strings>],
  "strengths": [<strings>],
  "weaknesses": [<strings>],
  "suggestions": [<strings>]
}

Resume:
${resumeText}
`;

export const JOB_MATCH_PROMPT = (resumeText, jobDescription) => `
Compare this resume against the job description.
Return ONLY valid JSON (no markdown):
{
  "matchScore": <number 0-100>,
  "missingSkills": [<skills in JD but not in resume>],
  "recommendedSkills": [<skills to add or emphasize>]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

export const REWRITER_PROMPT = (bullets) => `
Rewrite these resume bullet points for ATS compatibility and professional language.
Return ONLY valid JSON (no markdown):
{
  "bullets": [<improved bullet strings, same count as input>]
}

Input bullets:
${JSON.stringify(bullets)}
`;

export const COVER_LETTER_PROMPT = (resumeText, jobRole, jobDescription) => `
Write a professional cover letter based on the resume and job role.
Return ONLY valid JSON (no markdown):
{
  "coverLetter": "<full cover letter text, 3-4 paragraphs>"
}

Job Role: ${jobRole}
${jobDescription ? `Job Description:\n${jobDescription}` : ''}

Resume:
${resumeText}
`;

export const INTERVIEW_QUESTIONS_PROMPT = (resumeText, jobDescription = '') => `
Generate 3 tailored interview questions based on the candidate's resume and target job description (if provided).
Provide a mix of technical, behavioral, and resume-specific/project-specific questions.
Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "id": 1,
      "question": "<question text>",
      "type": "Technical|Behavioral|Resume-specific"
    }
  ]
}

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : ''}
`;

export const INTERVIEW_EVALUATE_PROMPT = (question, answer) => `
Evaluate the candidate's answer for the following interview question.
Return ONLY valid JSON (no markdown):
{
  "score": <number 0-100>,
  "strengths": [<strengths of the response>],
  "improvements": [<concrete suggestions to improve the answer>],
  "modelAnswer": "<an exemplary model answer for reference>"
}

Question:
${question}

Candidate Answer:
${answer}
`;

export const CAREER_ROADMAP_PROMPT = (resumeText, targetRole) => `
Create a personalized learning and upskilling roadmap for a candidate with the following resume who wants to transition into the role of: "${targetRole}".
Provide 3 chronological phases.
Return ONLY valid JSON (no markdown):
{
  "targetRole": "${targetRole}",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "<phase title, e.g. Mastering Backend Architecture>",
      "description": "<short description of what this phase focuses on>",
      "skillsToLearn": [<skills to acquire>],
      "projectIdea": {
        "title": "<practical project title>",
        "description": "<project summary, technologies to use, and metrics to target>"
      },
      "resources": [<suggested books, online courses, or certs>]
    }
  ]
}

Resume:
${resumeText}
`;

export const LINKEDIN_OPTIMIZER_PROMPT = (resumeText) => `
Optimize the candidate's professional presence for LinkedIn based on this resume.
Return ONLY valid JSON (no markdown):
{
  "headline": "<punchy, keyword-optimized headline>",
  "about": "<engaging, story-driven 'About' section in first-person, 2-3 paragraphs>",
  "experienceSnippets": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "bullet": "<one highly optimized, impact-driven description bullet starting with action verb>"
    }
  ]
}

Resume:
${resumeText}
`;

export const PORTFOLIO_GENERATOR_PROMPT = (resumeText) => `
Generate a single-file, highly modern responsive personal portfolio landing page in HTML/Tailwind CSS based on this resume.
It must include a Hero section, About section, Experience, Projects, Skills, and Contact details.
Use modern color schemes, sleek animations, cards, grids, and Tailwind classes.
Do NOT use markdown, scripts to external frameworks, or complex external dependencies. Keep it a clean single-file index.html.
Return ONLY valid JSON (no markdown):
{
  "htmlCode": "<entire HTML code starting with <!DOCTYPE html> and containing Tailwind CDN link in head>"
}

Resume:
${resumeText}
`;

export const RESUME_PARSER_PROMPT = (resumeText) => `
Parse this resume text into structured fields.
Return ONLY valid JSON (no markdown):
{
  "personalInfo": {
    "fullName": "<name>",
    "email": "<email>",
    "phone": "<phone>",
    "website": "<website/portfolio>",
    "summary": "<profile summary>"
  },
  "education": [
    {
      "school": "<school name>",
      "degree": "<degree & major>",
      "year": "<graduation year or timeline>"
    }
  ],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<employment duration>",
      "description": "<summary of accomplishments>"
    }
  ],
  "skills": [<skills list>]
}

Resume:
${resumeText}
`;

export const JOB_RECOMMENDATIONS_PROMPT = (resumeText) => `
Analyze this resume and suggest 3 matching job listings.
Return ONLY valid JSON (no markdown):
{
  "jobs": [
    {
      "id": 1,
      "title": "<job title, e.g. Senior Frontend Developer>",
      "company": "<company name>",
      "location": "<city, state or Remote>",
      "salary": "<salary estimate>",
      "matchScore": <suitability score 0-100>,
      "description": "<brief description of the recommended role>",
      "matchingSkills": [<matching skills>],
      "missingSkills": [<skills to acquire for this role>]
    }
  ]
}

Resume:
${resumeText}
`;



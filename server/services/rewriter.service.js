import { resumeService } from './resume.service.js';
import { pdfService } from './pdf.service.js';
import { geminiService } from './gemini.service.js';

export const rewriterService = {
  async rewrite(userId, resumeId, bullets) {
    if (bullets?.length) {
      return geminiService.rewriteBullets(bullets);
    }
    const resume = await resumeService.getByIdForUser(resumeId, userId);
    const text = await pdfService.extractFromResume(resume);
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 20 && (l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l)))
      .slice(0, 10);
    const input = lines.length ? lines : [text.slice(0, 500)];
    return geminiService.rewriteBullets(input);
  },
};

/**
 * Deterministic, non-generative résumé text heuristics.
 * Returns null for any field that is not clearly present — never invents facts.
 */
import {
  EXTRACTOR_VERSION,
  resumeExtractionResultSchema,
  type ResumeExtractionResult,
} from "./resume-extraction";

const EXPERIENCE_SECTION =
  /(?:work experience|experience|employment history)\s*[:\n]+([\s\S]*?)(?=\n(?:education|skills|projects|summary)\b|$)/i;
const EDUCATION_SECTION =
  /(?:education)\s*[:\n]+([\s\S]*?)(?=\n(?:experience|skills|projects|work experience|summary)\b|$)/i;
const SKILLS_SECTION =
  /(?:skills|technologies)\s*[:\n]+([\s\S]*?)(?=\n(?:experience|education|projects|work experience|summary)\b|$)/i;

function trimOrNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Parses plain-text résumé content into schema-constrained proposals.
 * Prefer structured sections; skip ambiguous blocks rather than guessing.
 */
export function extractResumeProposalsFromText(
  text: string,
): ResumeExtractionResult {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return resumeExtractionResultSchema.parse({
      summary: null,
      workExperiences: [],
      education: [],
      skills: [],
      projects: [],
    });
  }

  const workExperiences: ResumeExtractionResult["workExperiences"] =
    [];
  const experienceMatch = EXPERIENCE_SECTION.exec(normalized);
  if (experienceMatch?.[1]) {
    const block = experienceMatch[1].trim();
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8);
    for (const line of lines) {
      const atMatch = /^(.+?)\s+at\s+(.+)$/i.exec(line);
      const dashMatch = /^(.+?)\s[-–—]\s(.+)$/.exec(line);
      if (atMatch) {
        workExperiences.push({
          title: trimOrNull(atMatch[1]),
          company: trimOrNull(atMatch[2]),
          startDate: null,
          endDate: null,
          description: null,
          technologies: [],
          achievements: [],
          sourceSpan: {
            start: experienceMatch.index,
            end: experienceMatch.index + experienceMatch[0].length,
            excerpt: line.slice(0, 160),
          },
          confidence: 0.55,
        });
      } else if (dashMatch) {
        workExperiences.push({
          title: trimOrNull(dashMatch[1]),
          company: trimOrNull(dashMatch[2]),
          startDate: null,
          endDate: null,
          description: null,
          technologies: [],
          achievements: [],
          sourceSpan: {
            start: experienceMatch.index,
            end: experienceMatch.index + experienceMatch[0].length,
            excerpt: line.slice(0, 160),
          },
          confidence: 0.5,
        });
      }
    }
  }

  const education: ResumeExtractionResult["education"] = [];
  const educationMatch = EDUCATION_SECTION.exec(normalized);
  if (educationMatch?.[1]) {
    const line = educationMatch[1]
      .split("\n")
      .map((entry) => entry.trim())
      .find(Boolean);
    if (line) {
      education.push({
        school: trimOrNull(line),
        degree: null,
        fieldOfStudy: null,
        startDate: null,
        endDate: null,
        sourceSpan: {
          start: educationMatch.index,
          end: educationMatch.index + educationMatch[0].length,
          excerpt: line.slice(0, 160),
        },
        confidence: 0.5,
      });
    }
  }

  const skills: ResumeExtractionResult["skills"] = [];
  const skillsMatch = SKILLS_SECTION.exec(normalized);
  if (skillsMatch?.[1]) {
    const tokens = skillsMatch[1]
      .split(/[,•|\n]/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && token.length < 40)
      .slice(0, 30);
    for (const name of tokens) {
      skills.push({
        name,
        category: "Skills",
        yearsOfExperience: null,
        confidence: 0.6,
      });
    }
  }

  return resumeExtractionResultSchema.parse({
    summary: null,
    workExperiences,
    education,
    skills,
    projects: [],
  });
}

export { EXTRACTOR_VERSION };

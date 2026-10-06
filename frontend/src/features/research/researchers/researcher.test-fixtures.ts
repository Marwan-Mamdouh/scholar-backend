import type {
  AcademicResearcher,
  ScholarAuthor,
  ScholarCollaborator,
  ScholarProfile,
} from "./researcher.type";
import { toScholarProfile } from "./researcher.utils";

export function makeResearcher(overrides: Partial<AcademicResearcher> = {}): AcademicResearcher {
  return {
    id: 1,
    firstName: "Raghied",
    lastName: "Atta",
    institutionName: "Unknown",
    department: null,
    affiliation: null,
    mainTopic: "VLSI",
    subtopics: "Micro-electronics / MEMs",
    scholarId: "AbCdEf123",
    linkedinUrl: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export const RESEARCHERS: AcademicResearcher[] = [
  makeResearcher(),
  makeResearcher({
    id: 2,
    firstName: "Sarah",
    lastName: "El-Ghandour",
    institutionName: "American University in Cairo",
    department: "School of Sciences",
    mainTopic: "NLP",
    subtopics: ["Machine Learning", "Arabic Dialects"],
    scholarId: "123456",
  }),
  makeResearcher({
    id: 3,
    firstName: "Omar",
    lastName: "Morsi",
    institutionName: "Alexandria University",
    department: "Marine Biology",
    mainTopic: null,
    subtopics: null,
    scholarId: null,
  }),
];

const PAPER_TITLES = [
  "Performance enhancement of conical solar stills",
  "Multimode optical fiber strain monitoring for smart infrastructures",
  "Nano-Materials-Based Printed Glucose Sensor",
  "Effect of applying air pressure during wet etching",
  "Enhanced oxygen evolution based on silicon nanowires",
  "Photonic crystal fiber sensor design",
  "Low power VLSI adder architectures",
];

export function makeScholarAuthor(overrides: Partial<ScholarAuthor> = {}): ScholarAuthor {
  return {
    authorId: "145053999",
    name: "R. Atta",
    url: "https://www.semanticscholar.org/author/145053999",
    hIndex: 9,
    paperCount: 37,
    citationCount: 321,
    primaryField: "Materials Science",
    papers: PAPER_TITLES.map((title, index) => ({
      paperId: `p${index + 1}`,
      title,
      year: [2026, 2023, 2023, 2022, 2022, 2019, null][index],
      venue: index === 6 ? null : `Journal ${index + 1}`,
      citationCount: [4, 5, 6, 4, 2, 30, 1][index],
      url: `https://www.semanticscholar.org/paper/p${index + 1}`,
      fieldsOfStudy: [
        ["Materials Science"],
        ["Engineering", "Materials Science"],
        ["Medicine"],
        ["Materials Science"],
        null,
        ["Engineering"],
        ["Computer Science"],
      ][index],
    })),
    ...overrides,
  };
}

export const COLLABORATORS: ScholarCollaborator[] = [
  { id: "11", name: "G. Ensell", count: 6 },
  { id: "10", name: "G. Reed", count: 7 },
  { id: "12", name: "A. Evans", count: 3 },
];

export function makeScholarProfile(
  author: Partial<ScholarAuthor> = {},
  collaborators: ScholarCollaborator[] = COLLABORATORS,
): ScholarProfile {
  return toScholarProfile(makeScholarAuthor(author), collaborators);
}

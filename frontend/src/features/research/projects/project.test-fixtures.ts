import type { Paginated } from "@/src/lib/api-client";
import type { GraduationProject } from "./project.type";

export function makeProject(overrides: Partial<GraduationProject> = {}): GraduationProject {
  return {
    id: 1,
    isSponsored: true,
    sponsorCompanyId: 7,
    university: "Cairo University",
    faculty: "Faculty of Engineering",
    industry: "Semiconductors",
    domains: ["Microwave", "Antennas"],
    supervisor: "Dr. Abd El Rahman Abo Taleb",
    coSupervisor: "Eng. Nour El Deen El Hout, Eng. Sara Nassef",
    projectTitle: "FPGA-Based Digital Design And Verification Of The RISC-V Core",
    noOfStudents: 5,
    documentationLink: "https://example.com/fpga-riscv",
    postedAt: "2025-03-01T00:00:00.000Z",
    sponsorCompany: { id: 7, name: "Siemens EDA", industry: "EDA", website: null },
    ...overrides,
  };
}

export function makePage(
  data: GraduationProject[],
  total = data.length,
  page = 1,
  limit = 12,
): Paginated<GraduationProject> {
  return {
    success: true,
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

/** `count` projects with ids starting at `from` */
export function makeProjects(count: number, from = 1): GraduationProject[] {
  return Array.from({ length: count }, (_, index) =>
    makeProject({ id: from + index, projectTitle: `Project ${from + index}` }),
  );
}

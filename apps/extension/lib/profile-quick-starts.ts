import type { ApplicantProfileInput } from "@searchparty/shared";

export interface ProfileQuickStart {
  id: string;
  label: string;
  description: string;
  profile: ApplicantProfileInput;
}

export const profileQuickStarts: ProfileQuickStart[] = [
  {
    id: "full-stack-engineer",
    label: "Full Stack Engineer",
    description:
      "Balanced software profile for frontend, backend, APIs, and databases.",
    profile: {
      name: "Full Stack Engineer",
      targetRole: "Full Stack Engineer",
      summary:
        "Full stack profile focused on building reliable product experiences across frontend, backend, APIs, and data layers.",
      preferredTone: "confident",
      workExperiences: [],
      skills: [
        {
          name: "TypeScript",
          category: "Engineering",
          yearsOfExperience: 4,
        },
        {
          name: "Node.js",
          category: "Backend",
          yearsOfExperience: 4,
        },
        {
          name: "REST APIs",
          category: "Backend",
          yearsOfExperience: 4,
        },
        {
          name: "React",
          category: "Frontend",
          yearsOfExperience: 4,
        },
      ],
      projects: [],
    },
  },
  {
    id: "graphic-designer",
    label: "Graphic Designer",
    description:
      "Creative profile for visual design, brand systems, and campaign assets.",
    profile: {
      name: "Graphic Designer",
      targetRole: "Graphic Designer",
      summary:
        "Design profile focused on brand consistency, visual storytelling, campaign assets, and polished client-ready creative work.",
      preferredTone: "friendly",
      workExperiences: [],
      skills: [
        {
          name: "Adobe Creative Suite",
          category: "Design",
          yearsOfExperience: 4,
        },
        {
          name: "Brand Identity",
          category: "Design",
          yearsOfExperience: 3,
        },
        {
          name: "Layout Design",
          category: "Design",
          yearsOfExperience: 4,
        },
      ],
      projects: [],
    },
  },
  {
    id: "customer-service",
    label: "Customer Service Representative",
    description:
      "Support profile for customer care, issue resolution, and communication.",
    profile: {
      name: "Customer Service Representative",
      targetRole: "Customer Service Representative",
      summary:
        "Customer support profile focused on clear communication, fast issue resolution, empathy, and dependable service quality.",
      preferredTone: "professional",
      workExperiences: [],
      skills: [
        {
          name: "Customer Support",
          category: "Service",
          yearsOfExperience: 3,
        },
        {
          name: "Conflict Resolution",
          category: "Service",
          yearsOfExperience: 3,
        },
        {
          name: "CRM Tools",
          category: "Tools",
          yearsOfExperience: 2,
        },
      ],
      projects: [],
    },
  },
  {
    id: "sales",
    label: "Sales",
    description:
      "Revenue profile for pipeline management, discovery, and closing.",
    profile: {
      name: "Sales",
      targetRole: "Sales Representative",
      summary:
        "Sales profile focused on relationship building, consultative discovery, pipeline ownership, and consistent follow-through.",
      preferredTone: "confident",
      workExperiences: [],
      skills: [
        {
          name: "Lead Qualification",
          category: "Sales",
          yearsOfExperience: 3,
        },
        {
          name: "CRM Pipeline Management",
          category: "Sales",
          yearsOfExperience: 3,
        },
        {
          name: "Client Communication",
          category: "Sales",
          yearsOfExperience: 4,
        },
      ],
      projects: [],
    },
  },
  {
    id: "operations-coordinator",
    label: "Operations Coordinator",
    description:
      "Organized profile for scheduling, process improvement, and team support.",
    profile: {
      name: "Operations Coordinator",
      targetRole: "Operations Coordinator",
      summary:
        "Operations profile focused on keeping teams organized, improving processes, coordinating schedules, and supporting reliable execution.",
      preferredTone: "professional",
      workExperiences: [],
      skills: [
        {
          name: "Process Coordination",
          category: "Operations",
          yearsOfExperience: 3,
        },
        {
          name: "Scheduling",
          category: "Operations",
          yearsOfExperience: 3,
        },
        {
          name: "Documentation",
          category: "Operations",
          yearsOfExperience: 3,
        },
      ],
      projects: [],
    },
  },
];

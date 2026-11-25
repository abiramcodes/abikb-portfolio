/**
 * Canonical project data for the AF-82 console.
 *
 * One typed source consumed by the home tuner, the /projects tape
 * library, the authored-tools section, and the search palette.
 * Fields carry only facts that already exist in the source
 * components (Projects, WorkProjects, AuthoredProjects). Nothing is
 * invented here.
 */

export type Bank = "A" | "B";

export interface Project {
  id: string;
  /** "A" = tools and demos built in the open, "B" = what I built at work. */
  bank: Bank;
  name: string;
  /** Short label for dial detents; must stay recognisable. */
  shortLabel: string;
  /** Benefit-led, sourced from the existing descriptions. */
  description: string;
  tech: string[];
  /** Work projects only. */
  scale?: string;
  /** Work projects only. */
  stats?: string[];
  /** Real install commands, preserved exactly. */
  command?: string;
  github?: string;
  docs?: string;
  /** Where a further action exists, e.g. /projects#anchor. */
  internalHref?: string;
  /** Artwork key for personal projects. */
  slug?: string;
}

export const SIDE_A: Project[] = [
  {
    id: "ng-point",
    bank: "A",
    name: "ng-point",
    shortLabel: "Point",
    description:
      "Point at the screen, capture the context. Alt+Click any element in a running Angular app to capture an LLM-ready context block (component, file:line, template) for your AI coding agent. Redacted at capture, never in production bundles.",
    tech: ["Angular", "TypeScript"],
    command: "npm i -D @abiramcodes/ng-point",
    github: "https://github.com/abiramcodes/ng-point",
    docs: "https://abiramcodes.github.io/ng-point/",
    slug: "ng-point",
  },
  {
    id: "angular-doctor",
    bank: "A",
    name: "angular-doctor",
    shortLabel: "Doctor",
    description:
      "Know the health of the estate before you touch it. Deterministic scans give a CLI health score, categorized diagnostics, and an agent-ready report with an Oxlint and template ESLint stack. One command, zero config.",
    tech: ["Angular", "Node CLI"],
    command: "npx @abiramcodes/angular-doctor@latest",
    github: "https://github.com/abiramcodes/angular-doctor",
    docs: "https://ngdoctor.dev/",
    slug: "angular-doctor",
  },
  {
    id: "md-pdf-converter",
    bank: "A",
    name: "md-Pdf-converter",
    shortLabel: "PDF",
    description:
      "Markdown in, PDF out. A web application that converts Markdown files to PDF format, built with Angular for the frontend and NestJS for the backend.",
    tech: ["Angular", "NestJS"],
    github: "https://github.com/abiramcodes/MD-PDF",
    slug: "md-pdf-converter",
  },
  {
    id: "dynamic-forms-demo",
    bank: "A",
    name: "dynamic-forms-demo",
    shortLabel: "Forms",
    description:
      "Forms that assemble themselves, live on stage. Demo application for the ng India Chennai Meetup, 2025, demonstrating dynamic components and forms.",
    tech: ["Angular"],
    github: "https://github.com/abiramcodes/dynamic-forms-demo",
    slug: "dynamic-forms-demo",
  },
  {
    id: "mini-url",
    bank: "A",
    name: "mini-url",
    shortLabel: "Mini",
    description:
      "Long links in, short links out. A UI for generating shortened URLs, built as part of the coding challenges by John Crickett.",
    tech: ["Angular"],
    github: "https://github.com/abiramcodes/mini-url-frontEnd",
    slug: "mini-url",
  },
];

export const SIDE_B: Project[] = [
  {
    id: "micro-frontend-platform",
    bank: "B",
    name: "Micro Frontend Platform",
    shortLabel: "Platform",
    description:
      "Architected a Shell + Remote MFE platform with seamless routing, leading a team of 4 developers. Received an Applause Award for delivery.",
    tech: ["Angular 22", "Native Federation", "React 19", "Module Federation", "Nginx", "Ingress"],
    scale: "Multi-app platform",
    stats: ["Team of 4", "Applause Award"],
    internalHref: "/projects#micro-frontend-platform",
  },
  {
    id: "large-scale-ui-migration",
    bank: "B",
    name: "Large-Scale UI Migration",
    shortLabel: "Migration",
    description:
      "Migrated PrimeNG to Optimus UI and Angular 21 to 22 with Signal APIs across 8 micro frontend repos, leveraging AI agents for speed.",
    tech: ["Angular 22", "Optimus UI", "Claude Code", "Copilot"],
    scale: "Micro Frontends (Multiple Repo's)",
    stats: ["8 repos", "AI-assisted"],
    internalHref: "/projects#large-scale-ui-migration",
  },
  {
    id: "framework-modernization",
    bank: "B",
    name: "Framework Modernization",
    shortLabel: "Framework",
    description:
      "Led Angular 17 to 20 migration with zero defects, earning an Applause Award. Reduced build size and improved runtime performance.",
    tech: ["Angular 20", "Jest", "Karma", "Standalone APIs"],
    scale: "Enterprise app",
    stats: ["0 defects", "Applause Award"],
    internalHref: "/projects#framework-modernization",
  },
  {
    id: "state-driven-dashboard",
    bank: "B",
    name: "State-Driven Dashboard",
    shortLabel: "Dashboard",
    description:
      "Built complex UI workflows with NgRx state management, reducing redundant API calls by 50% and page load times by 40%.",
    tech: ["Angular 15+", "NgRx", "Angular Material", "Azure"],
    scale: "5+ modules",
    stats: ["-50% API calls", "-40% load time"],
    internalHref: "/projects#state-driven-dashboard",
  },
];

export const PROJECTS: Project[] = [...SIDE_A, ...SIDE_B];

export const BANKS: Record<Bank, Project[]> = {
  A: SIDE_A,
  B: SIDE_B,
};

export const BANK_LABEL: Record<Bank, string> = {
  A: "Side A",
  B: "Side B",
};

export const BANK_SUB: Record<Bank, string> = {
  A: "Shipped tools",
  B: "Client work",
};

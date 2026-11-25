// Single source of truth for site content. Every component, page,
// and the ⌘K palette read from here so names, links, descriptions,
// and counts cannot drift between surfaces.

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
  lines: string[];
  icon: string;
}

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://www.github.com/abiramcodes",
    handle: "@abiramcodes",
    lines: ["Frontend Engineer", "Author of ng-point & angular-doctor"],
    icon: "M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abirama-kannan-baskar",
    handle: "in/abirama-kannan-baskar",
    lines: ["Frontend Consultant at Deloitte USI", "Angular · React · Micro Frontends"],
    icon: "M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606ZM7.2 8.809H4V19.5h3.2V8.809Z",
  },
  {
    label: "X",
    href: "https://x.com/abiramcodes",
    handle: "@abiramcodes",
    lines: ["Frontend engineer", "Angular, React, and open source"],
    icon: "M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z",
  },
];

export interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  link: string;
  docs?: string;
  command?: string;
  /** npm tools featured on the home page. */
  featured?: boolean;
  /** Live-HTML product fragment shown in the card. */
  fragment?: "ng-point" | "angular-doctor";
  keywords: string;
}

export const projects: Project[] = [
  {
    id: "ng-point",
    name: "ng-point",
    tech: "Angular, TypeScript",
    description:
      "Dev-mode Angular library - Alt+Click any element in your running app to capture an LLM ready context block (component, file:line, template) for your AI coding agent. Redacted at capture; production builds never load it.",
    link: "https://github.com/abiramcodes/ng-point",
    docs: "https://abiramcodes.github.io/ng-point/",
    command: "npm i -D @abiramcodes/ng-point",
    featured: true,
    fragment: "ng-point",
    keywords: "alt click llm agent context dev-mode library angular",
  },
  {
    id: "angular-doctor",
    name: "angular-doctor",
    tech: "Angular, Node CLI",
    description:
      "Deterministic health scans for Angular codebases - CLI health score, categorized diagnostics, and an agent-ready report with an Oxlint + template ESLint stack.",
    link: "https://github.com/abiramcodes/angular-doctor",
    docs: "https://ngdoctor.dev/",
    command: "npx @abiramcodes/angular-doctor@latest",
    featured: true,
    fragment: "angular-doctor",
    keywords: "health scan score diagnostics cli lint",
  },
  {
    id: "md-pdf-converter",
    name: "md-Pdf-converter",
    tech: "Angular, NestJS",
    description:
      "A web application that converts Markdown files to PDF format, built using Angular for the frontend and NestJS for the backend.",
    link: "https://github.com/abiramcodes/MD-PDF",
    keywords: "markdown pdf nestjs puppeteer",
  },
  {
    id: "dynamic-forms-demo",
    name: "dynamic-forms-demo",
    tech: "Angular",
    description:
      "Demo application used in the ng India Chennai Meetup, 2025. Demonstrates dynamic components and forms.",
    link: "https://github.com/abiramcodes/dynamic-forms-demo",
    keywords: "ng india chennai meetup talk demo forms",
  },
  {
    id: "mini-url",
    name: "mini-url",
    tech: "Angular",
    description:
      "A UI for generating shortened URLs, developed as part of coding challenges by John Crickett.",
    link: "https://github.com/abiramcodes/mini-url-frontEnd",
    keywords: "url shortener coding challenge",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

type PrUrl = `https://github.com/${string}/pull/${number}`;

export interface Contribution {
  project: string;
  /** Short label for the ⌘K palette. */
  short: string;
  projectUrl: string;
  url: PrUrl[];
  keywords: string;
}

export const contributions: Contribution[] = [
  {
    project: "pangular-inspector",
    short: "pangular-inspector",
    projectUrl: "https://github.com/pangular-inspector/devtools",
    url: [
      "https://github.com/pangular-inspector/devtools/pull/28",
      "https://github.com/pangular-inspector/devtools/pull/45",
      "https://github.com/pangular-inspector/devtools/pull/62",
      "https://github.com/pangular-inspector/devtools/pull/200",
      "https://github.com/pangular-inspector/devtools/pull/201",
    ],
    keywords: "devtools signals di routes chrome extension",
  },
  {
    project: "spartan ng",
    short: "spartan-ng",
    projectUrl: "https://github.com/spartan-ng/spartan",
    url: [
      "https://github.com/spartan-ng/spartan/pull/981",
      "https://github.com/spartan-ng/spartan/pull/980",
      "https://github.com/spartan-ng/spartan/pull/979",
    ],
    keywords: "spartan full stack angular ui",
  },
  {
    project: "ng-primitives",
    short: "ng-primitives",
    projectUrl: "https://github.com/ng-primitives/ng-primitives",
    url: ["https://github.com/ng-primitives/ng-primitives/pull/499"],
    keywords: "headless accessible primitives",
  },
  {
    project: "ng-icons",
    short: "ng-icons",
    projectUrl: "https://github.com/ng-icons/ng-icons",
    url: [
      "https://github.com/ng-icons/ng-icons/pull/202",
      "https://github.com/ng-icons/ng-icons/pull/203",
      "https://github.com/ng-icons/ng-icons/pull/204",
    ],
    keywords: "icon library",
  },
  {
    project: "free-Code-Camp",
    short: "freeCodeCamp",
    projectUrl: "https://github.com/freeCodeCamp/freeCodeCamp",
    url: ["https://github.com/freeCodeCamp/freeCodeCamp/pull/62576"],
    keywords: "curriculum learn",
  },
  {
    project: "carbon-components-angular",
    short: "carbon-components-angular",
    projectUrl: "https://github.com/carbon-design-system/carbon-components-angular",
    url: [
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2945",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2939",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2789",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2764",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2748",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2741",
      "https://github.com/carbon-design-system/carbon-components-angular/pull/2740",
    ],
    keywords: "ibm design system",
  },
];

/** The one PR count every surface quotes. Derived, never typed twice. */
export const totalPRs = contributions.reduce((sum, c) => sum + c.url.length, 0);

export interface RepoMeta {
  description: string;
  language: string | null;
}

// Snapshots from the GitHub API, used when a build-time fetch fails
// or rate-limits so the hover card never renders empty.
export const FALLBACK_META: Record<string, RepoMeta> = {
  "pangular-inspector/devtools": {
    description: "Angular DevTools: inspect components, signals, DI, and routes. Runs as a Chrome extension and standalone app.",
    language: "TypeScript",
  },
  "spartan-ng/spartan": {
    description: "Cutting-edge tools powering Angular full-stack development.",
    language: "TypeScript",
  },
  "ng-primitives/ng-primitives": {
    description: "Headless, composable primitives for building accessible UI components in Angular.",
    language: "TypeScript",
  },
  "ng-icons/ng-icons": {
    description: "The ultimate icon library for Angular",
    language: "TypeScript",
  },
  "freeCodeCamp/freeCodeCamp": {
    description: "freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science.",
    language: "TypeScript",
  },
  "carbon-design-system/carbon-components-angular": {
    description: "An Angular implementation of the Carbon Design System for IBM.",
    language: "TypeScript",
  },
};

export function repoSlug(url: string): string {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : "";
}

export function prNumber(url: string): string {
  return "#" + url.split("/pull/")[1];
}

export interface Role {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export const roles: Role[] = [
  {
    company: "Deloitte USI",
    role: "Frontend Consultant",
    duration: "Jun 2025 - Present",
    highlights: [
      "Architected Shell + Remote micro frontend platform (Angular, React 19, Native Federation, Nginx); leading a team of 4. Received Applause Award for delivery.",
      "Led Angular 17 to 20 migration with zero defects (Applause Award). Reduced build size and improved runtime performance.",
      "Migrated PrimeNG to Optimus UI and Angular 21 to 22 with Signal APIs across 8 repos using AI agents (Claude Code, Copilot).",
      "85% test coverage with Jest and Karma.",
    ],
  },
  {
    company: "Tata Consultancy Services",
    role: "Frontend Developer",
    duration: "Dec 2021 - Jun 2025",
    highlights: [
      "5+ modules with accessibility compliance; 100+ bugs fixed with GitHub Actions CI/CD on Azure.",
      "Cut redundant API calls by 50% with NgRx; cut page load times by 40% with virtual scrolling.",
      "Migrated Angular 13 (Modular) to Angular 17 (Standalone). Reduced build size.",
      "80% test coverage with Jest.",
    ],
  },
];

export interface WorkCard {
  title: string;
  description: string;
  tech: string[];
  scale: string;
  stats: string[];
}

export const workCards: WorkCard[] = [
  {
    title: "Micro Frontend Platform",
    description: "Architected a Shell + Remote MFE platform with seamless routing, leading a team of 4 developers. Received an Applause Award for delivery.",
    tech: ["Angular 22", "Native Federation", "React 19", "Module Federation", "Nginx", "Ingress"],
    scale: "Multi-app platform",
    stats: ["Team of 4", "Applause Award"],
  },
  {
    title: "Large-Scale UI Migration",
    description: "Migrated PrimeNG to Optimus UI and Angular 21 to 22 with Signal APIs across 8 micro frontend repos, leveraging AI agents for speed.",
    tech: ["Angular 22", "Optimus UI", "Claude Code", "Copilot"],
    scale: "Micro Frontends (Multiple Repos)",
    stats: ["8 repos", "AI-assisted"],
  },
  {
    title: "Framework Modernization",
    description: "Led Angular 17 to 20 migration with zero defects, earning an Applause Award. Reduced build size and improved runtime performance.",
    tech: ["Angular 20", "Jest", "Karma", "Standalone APIs"],
    scale: "Enterprise app",
    stats: ["0 defects", "Applause Award"],
  },
  {
    title: "State-Driven Dashboard",
    description: "Built complex UI workflows with NgRx state management, reducing redundant API calls by 50% and page load times by 40%.",
    tech: ["Angular 15+", "NgRx", "Angular Material", "Azure"],
    scale: "5+ modules",
    stats: ["-50% API calls", "-40% load time"],
  },
];

export interface Talk {
  title: string;
  event: string;
  eventUrl: string;
  date: string;
  demoUrl?: string;
}

export const talks: Talk[] = [
  {
    title: "Building Flexible UI's with Dynamic Components and Forms in Angular",
    event: "ng-India Chennai",
    eventUrl: "https://www.nomadcoder.ai/event/8",
    date: "Sept 2025",
    demoUrl: "https://github.com/abiramcodes/dynamic-forms-demo/tree/development",
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
  primary?: boolean;
}

export interface NavPage {
  label: string;
  href: string;
  /** Short label for the mobile dock; defaults to `label`. */
  dockLabel?: string;
  keywords: string;
}

/** The one page list behind the desktop nav, mobile dock, and ⌘K. */
export const navPages: NavPage[] = [
  { label: "Home", href: "/", keywords: "hero intro abiram" },
  { label: "Projects", href: "/projects", keywords: "tools work apps demos" },
  { label: "Open Source", href: "/open-source", dockLabel: "OSS", keywords: "oss contributions prs merged" },
  { label: "Skills", href: "/skills", keywords: "stack angular react ai tooling" },
  { label: "Experience", href: "/experience", dockLabel: "Work", keywords: "work roles deloitte tcs" },
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    primary: true,
    items: ["HTML", "CSS / SCSS", "JavaScript (ES6+)", "TypeScript", "Angular 20+", "React.js 19+", "Astro", "Micro-Frontends"],
  },
  {
    label: "Libraries & Tools",
    items: [
      "Angular Material", "PrimeNG / Optimus UI", "Ionic 7+", "Git & GitHub", "RESTful APIs", "RxJs", "NgRx",
      "TanStack Query", "TanStack Table", "TanStack Form", "Zod", "TailwindCSS", "Native Federation",
      "Module Federation", "Rspack", "Figma (Basic)",
    ],
  },
  {
    label: "AI Tooling",
    items: ["Claude Code", "GitHub Copilot", "OpenCode", "Muse CLI", "Antigravity CLI", "Cursor CLI"],
  },
];

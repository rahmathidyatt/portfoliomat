import { GitHubRepo, TechCategory, TechNode, ProjectGraphNode, GraphEdge, SimilarProject } from '../types';

export interface TechDefinition {
  id: string;
  name: string;
  category: TechCategory;
  color: string;
  match: (repo: GitHubRepo) => boolean;
}

export const CATEGORY_COLORS: Record<TechCategory, string> = {
  language: '#38bdf8', // Sky / Cyan
  framework: '#a855f7', // Violet
  database: '#10b981', // Emerald
  ai: '#f59e0b', // Amber
  tool: '#ec4899', // Rose / Pink
};

export const CATEGORY_LABELS_EN: Record<TechCategory, string> = {
  language: 'Programming Languages',
  framework: 'Frameworks & Libraries',
  database: 'Databases & Systems',
  ai: 'AI & Data Science',
  tool: 'Tools & Automation',
};

export const CATEGORY_LABELS_ID: Record<TechCategory, string> = {
  language: 'Bahasa Pemrograman',
  framework: 'Framework & Pustaka',
  database: 'Basis Data & Sistem',
  ai: 'AI & Sains Data',
  tool: 'Alat & Otomasi',
};

// Canonical catalog of technologies matched against repositories
export const TECH_CATALOG: TechDefinition[] = [
  {
    id: 'tech-python',
    name: 'Python',
    category: 'language',
    color: '#38bdf8',
    match: (r) =>
      r.language?.toLowerCase() === 'python' ||
      r.topics?.includes('python') ||
      r.name.toLowerCase().includes('python'),
  },
  {
    id: 'tech-typescript',
    name: 'TypeScript',
    category: 'language',
    color: '#3178c6',
    match: (r) =>
      r.language?.toLowerCase() === 'typescript' ||
      r.topics?.includes('typescript') ||
      r.name.includes('codematt') ||
      r.name.includes('portfoliomat'),
  },
  {
    id: 'tech-javascript',
    name: 'JavaScript',
    category: 'language',
    color: '#facc15',
    match: (r) =>
      r.language?.toLowerCase() === 'javascript' ||
      r.topics?.includes('javascript') ||
      r.name.includes('brighton') ||
      r.name.includes('sipudes') ||
      r.name.includes('code-reader'),
  },
  {
    id: 'tech-php',
    name: 'PHP',
    category: 'language',
    color: '#818cf8',
    match: (r) =>
      r.language?.toLowerCase() === 'php' ||
      r.topics?.includes('php') ||
      r.name.includes('E-Commerce') ||
      r.name.includes('Pustaka') ||
      r.name.includes('Weighted'),
  },
  {
    id: 'tech-html5',
    name: 'HTML5',
    category: 'language',
    color: '#fb923c',
    match: (r) =>
      r.language?.toLowerCase() === 'html' ||
      r.topics?.some((t) => t.includes('html')) ||
      r.name.includes('Portfolio') ||
      r.name.includes('code-reader'),
  },
  {
    id: 'tech-css3',
    name: 'CSS3',
    category: 'language',
    color: '#38bdf8',
    match: (r) =>
      r.language?.toLowerCase() === 'css' ||
      r.topics?.some((t) => t.includes('css')) ||
      r.name.includes('Portfolio') ||
      r.name.includes('code-reader'),
  },
  {
    id: 'tech-react',
    name: 'React',
    category: 'framework',
    color: '#22d3ee',
    match: (r) =>
      r.topics?.includes('react') ||
      r.name.includes('codematt') ||
      r.name.includes('portfoliomat') ||
      r.name.includes('brighton'),
  },
  {
    id: 'tech-codeigniter',
    name: 'CodeIgniter',
    category: 'framework',
    color: '#f87171',
    match: (r) =>
      r.topics?.includes('codeigniter') ||
      r.name.includes('E-Commerce') ||
      r.name.includes('Pustaka'),
  },
  {
    id: 'tech-bootstrap',
    name: 'Bootstrap',
    category: 'framework',
    color: '#a78bfa',
    match: (r) =>
      r.topics?.some((t) => t.includes('bootstrap')) ||
      r.name.includes('Portfolio_II') ||
      r.name.includes('E-Commerce') ||
      r.name.includes('Pustaka') ||
      r.name.includes('sipudes'),
  },
  {
    id: 'tech-tailwind',
    name: 'Tailwind CSS',
    category: 'framework',
    color: '#38bdf8',
    match: (r) =>
      r.topics?.includes('tailwind') ||
      r.name.includes('portfoliomat') ||
      r.name.includes('codematt-relay'),
  },
  {
    id: 'tech-mysql',
    name: 'MySQL',
    category: 'database',
    color: '#06b6d4',
    match: (r) =>
      r.topics?.includes('mysql') ||
      r.topics?.includes('database') ||
      r.name.includes('E-Commerce') ||
      r.name.includes('Pustaka') ||
      r.name.includes('Weighted') ||
      r.name.includes('sipudes'),
  },
  {
    id: 'tech-nlp-ml',
    name: 'NLP & ML',
    category: 'ai',
    color: '#fbbf24',
    match: (r) =>
      r.topics?.some((t) => ['nlp', 'machine-learning', 'sentiment-analysis'].includes(t)) ||
      r.name.includes('sentiment'),
  },
  {
    id: 'tech-ai-agents',
    name: 'AI Agents',
    category: 'ai',
    color: '#c084fc',
    match: (r) =>
      r.topics?.includes('ai-agent') ||
      r.name.includes('codematt-agent'),
  },
  {
    id: 'tech-vite',
    name: 'Vite',
    category: 'tool',
    color: '#818cf8',
    match: (r) =>
      r.topics?.includes('vite') ||
      r.name.includes('portfoliomat'),
  },
  {
    id: 'tech-speech-api',
    name: 'Web Speech API',
    category: 'tool',
    color: '#2dd4bf',
    match: (r) =>
      r.topics?.includes('text-to-speech') ||
      r.name.includes('code-reader'),
  },
  {
    id: 'tech-dss',
    name: 'Decision Support (DSS)',
    category: 'tool',
    color: '#14b8a6',
    match: (r) =>
      r.topics?.some((t) => ['dss', 'weighted-product', 'algorithm'].includes(t)) ||
      r.name.includes('Weighted'),
  },
  {
    id: 'tech-automation',
    name: 'Messaging & Automation',
    category: 'tool',
    color: '#4ade80',
    match: (r) =>
      r.topics?.some((t) => ['automation', 'outreach', 'messaging', 'marketing-automation'].includes(t)) ||
      r.name.includes('relay') ||
      r.name.includes('messenger') ||
      r.name.includes('codematt-agent'),
  },
];

export interface GraphDataset {
  projects: ProjectGraphNode[];
  techs: TechNode[];
  edges: GraphEdge[];
  similarityMap: Map<string, SimilarProject[]>;
}

export function buildGraphDataset(repos: GitHubRepo[], width = 960, height = 580): GraphDataset {
  // 1. Identify which technologies are used by at least 1 repository
  const techUsage = new Map<string, { definition: TechDefinition; projectIds: number[] }>();

  TECH_CATALOG.forEach((def) => {
    techUsage.set(def.id, { definition: def, projectIds: [] });
  });

  const projectNodes: ProjectGraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Map each repo to its matching technologies
  repos.forEach((repo) => {
    const matchedTechIds: string[] = [];

    TECH_CATALOG.forEach((def) => {
      if (def.match(repo)) {
        matchedTechIds.push(def.id);
        const record = techUsage.get(def.id);
        if (record && !record.projectIds.includes(repo.id)) {
          record.projectIds.push(repo.id);
        }
      }
    });

    // Fallback: If repo has language not in matchedTechIds, add dynamic tech
    if (repo.language && !matchedTechIds.some((id) => id.includes(repo.language!.toLowerCase()))) {
      const dynamicId = `tech-${repo.language.toLowerCase()}`;
      if (!techUsage.has(dynamicId)) {
        techUsage.set(dynamicId, {
          definition: {
            id: dynamicId,
            name: repo.language,
            category: 'language',
            color: CATEGORY_COLORS.language,
            match: () => true,
          },
          projectIds: [repo.id],
        });
      } else {
        const rec = techUsage.get(dynamicId)!;
        if (!rec.projectIds.includes(repo.id)) {
          rec.projectIds.push(repo.id);
        }
      }
      matchedTechIds.push(dynamicId);
    }

    const displayName = repo.name.replace(/[-_]/g, ' ');

    projectNodes.push({
      id: `project-${repo.id}`,
      repoId: repo.id,
      name: repo.name,
      displayName,
      repo,
      techIds: matchedTechIds,
      primaryLanguage: repo.language,
      x: 0,
      y: 0,
    });
  });

  // Only keep technologies that have at least 1 project
  const activeTechNodes: TechNode[] = [];
  techUsage.forEach((record, techId) => {
    if (record.projectIds.length > 0) {
      activeTechNodes.push({
        id: techId,
        name: record.definition.name,
        category: record.definition.category,
        color: record.definition.color,
        projectCount: record.projectIds.length,
        projectIds: record.projectIds,
        x: 0,
        y: 0,
      });
    }
  });

  // Sort technologies by category so related ones stay clustered
  const categoryOrder: Record<TechCategory, number> = {
    language: 1,
    framework: 2,
    database: 3,
    ai: 4,
    tool: 5,
  };
  activeTechNodes.sort((a, b) => {
    if (categoryOrder[a.category] !== categoryOrder[b.category]) {
      return categoryOrder[a.category] - categoryOrder[b.category];
    }
    return b.projectCount - a.projectCount;
  });

  // 2. Compute Constellation Radial Layout Coordinates
  const cx = width / 2;
  const cy = height / 2;
  const techRadius = Math.min(width, height) * 0.23; // Inner orbit
  const projRadius = Math.min(width, height) * 0.40; // Outer orbit

  // Place technologies around the inner ring
  const numTechs = activeTechNodes.length;
  activeTechNodes.forEach((tech, idx) => {
    const angle = (idx / numTechs) * 2 * Math.PI - Math.PI / 2;
    tech.x = Math.round(cx + techRadius * Math.cos(angle));
    tech.y = Math.round(cy + techRadius * Math.sin(angle));
  });

  // Place project nodes around the outer orbit
  // Position projects near the angular center of their connected technologies for optimal clustering
  const techPositionMap = new Map<string, { x: number; y: number; angle: number }>();
  activeTechNodes.forEach((tech, idx) => {
    const angle = (idx / numTechs) * 2 * Math.PI - Math.PI / 2;
    techPositionMap.set(tech.id, { x: tech.x, y: tech.y, angle });
  });

  const numProjects = projectNodes.length;
  projectNodes.forEach((proj, idx) => {
    let targetAngle: number;

    if (proj.techIds.length > 0) {
      // Average angle of connected tech nodes
      let sinSum = 0;
      let cosSum = 0;
      proj.techIds.forEach((tId) => {
        const pos = techPositionMap.get(tId);
        if (pos) {
          sinSum += Math.sin(pos.angle);
          cosSum += Math.cos(pos.angle);
        }
      });
      targetAngle = Math.atan2(sinSum, cosSum);
    } else {
      targetAngle = (idx / numProjects) * 2 * Math.PI - Math.PI / 2;
    }

    // Slightly adjust radius slightly based on index to reduce collision
    const jitterRadius = projRadius + ((idx % 3) - 1) * 14;
    proj.x = Math.round(cx + jitterRadius * Math.cos(targetAngle));
    proj.y = Math.round(cy + jitterRadius * Math.sin(targetAngle));
  });

  // 3. Build Edges between Project and Tech nodes
  projectNodes.forEach((proj) => {
    proj.techIds.forEach((tId) => {
      const tech = activeTechNodes.find((tn) => tn.id === tId);
      if (tech) {
        edges.push({
          id: `${proj.id}-${tech.id}`,
          projectId: proj.id,
          techId: tech.id,
          techName: tech.name,
          color: tech.color,
        });
      }
    });
  });

  // 4. Compute Project-to-Project Shared Similarity Matrix
  const similarityMap = new Map<string, SimilarProject[]>();

  projectNodes.forEach((projA) => {
    const similarities: SimilarProject[] = [];

    projectNodes.forEach((projB) => {
      if (projA.id === projB.id) return;

      // Find intersection of technologies
      const sharedTechIds = projA.techIds.filter((tId) => projB.techIds.includes(tId));
      if (sharedTechIds.length > 0) {
        const sharedTechNames = sharedTechIds
          .map((id) => activeTechNodes.find((tn) => tn.id === id)?.name)
          .filter(Boolean) as string[];

        similarities.push({
          projectNode: projB,
          sharedTechs: sharedTechNames,
          score: sharedTechIds.length,
        });
      }
    });

    // Sort by most shared technologies first
    similarities.sort((a, b) => b.score - a.score);
    similarityMap.set(projA.id, similarities);
  });

  return {
    projects: projectNodes,
    techs: activeTechNodes,
    edges,
    similarityMap,
  };
}

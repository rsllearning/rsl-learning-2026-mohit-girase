import projectsData from '@/data/projects.json';
import { Project, ProjectDoc, ProjectStatus } from './types';

const allProjects: Project[] = projectsData as unknown as Project[];

export async function getAllProjects(): Promise<Project[]> {
  return allProjects;
}

export interface ProjectFilterParams {
  search?: string;
  status?: string;
  category?: string;
  sort?: string;
  simulateDelay?: number;
  simulateError?: boolean;
}

export async function getFilteredProjects(params?: ProjectFilterParams): Promise<Project[]> {
  // Optional artificial delay for demonstrating loading states
  if (params?.simulateDelay && params.simulateDelay > 0) {
    await new Promise((resolve) => setTimeout(resolve, params.simulateDelay));
  }

  if (params?.simulateError) {
    throw new Error('Simulated Server Failure: Could not retrieve projects from database.');
  }

  let results = [...allProjects];

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(q)) ||
        p.lead.name.toLowerCase().includes(q)
    );
  }

  if (params?.status && params.status !== 'all') {
    results = results.filter((p) => p.status.toLowerCase() === params.status?.toLowerCase());
  }

  if (params?.category && params.category !== 'all') {
    results = results.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
  }

  if (params?.sort) {
    switch (params.sort) {
      case 'progress-desc':
        results.sort((a, b) => b.progress - a.progress);
        break;
      case 'progress-asc':
        results.sort((a, b) => a.progress - b.progress);
        break;
      case 'title-asc':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        results.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-desc':
        results.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      default:
        break;
    }
  }

  return results;
}

export async function getProjectById(
  id: string,
  options?: { simulateDelay?: number; simulateError?: boolean }
): Promise<Project | null> {
  if (options?.simulateDelay && options.simulateDelay > 0) {
    await new Promise((resolve) => setTimeout(resolve, options.simulateDelay));
  }

  if (options?.simulateError) {
    throw new Error(`Simulated Error: Failed to fetch project record for ID "${id}".`);
  }

  const project = allProjects.find((p) => p.id === id);
  return project || null;
}

export async function getProjectDocBySlug(
  projectId: string,
  slugSegments: string[]
): Promise<{ doc: ProjectDoc | null; project: Project | null }> {
  const project = await getProjectById(projectId);
  if (!project) return { doc: null, project: null };

  const normalizedRequestedSlug = slugSegments.map((s) => s.toLowerCase());

  // Try exact match first
  const exact = project.docs.find((d) => {
    if (d.slug.length !== normalizedRequestedSlug.length) return false;
    return d.slug.every((seg, idx) => seg.toLowerCase() === normalizedRequestedSlug[idx]);
  });

  if (exact) {
    return { doc: exact, project };
  }

  // If not found in defined docs, dynamically construct a structured placeholder doc for the catch-all demonstration
  const displayTitle =
    slugSegments.length > 0
      ? slugSegments
          .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '))
          .join(' / ')
      : 'Overview Documentation';

  const syntheticDoc: ProjectDoc = {
    slug: slugSegments,
    title: displayTitle,
    category: slugSegments.length > 0 ? slugSegments[0].toUpperCase() : 'General',
    summary: `Documentation for ${slugSegments.join(' / ') || 'Root'} in ${project.title}.`,
    content: `### Documentation Path: /projects/${projectId}/docs/${slugSegments.join('/')}

This section is dynamically resolved by the **Catch-All Route** (\`app/projects/[id]/docs/[...slug]/page.tsx\`).

- **Target Project**: ${project.title} (ID: ${project.id})
- **Requested Slug Segments**: \`${JSON.stringify(slugSegments)}\`
- **Route Depth**: ${slugSegments.length} segment(s)

You can explore other documented topics for this project or add sub-pages under this path.`,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  return { doc: syntheticDoc, project };
}

export function getProjectCategories(): string[] {
  const set = new Set<string>();
  allProjects.forEach((p) => set.add(p.category));
  return Array.from(set);
}

export function getProjectStatuses(): ProjectStatus[] {
  return ['active', 'in-progress', 'completed', 'on-hold', 'planning'];
}

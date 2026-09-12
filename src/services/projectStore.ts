import type { Project } from "../types/projects";

const STORAGE_KEY = "buildos_projects";
const SELECTED_PROJECT_KEY = "buildos_selected_project";

/* =========================================================
   GET PROJECTS
========================================================= */

export function getProjects(): Project[] {
    if (typeof window === "undefined") {
        return [];
    }

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Failed to load projects:",
            error
        );

        return [];
    }
}

/* =========================================================
   SAVE PROJECT
========================================================= */

export function saveProject(
    project: Project
): void {
    const projects = getProjects();

    const index = projects.findIndex(
        (item) => item.id === project.id
    );

    if (index >= 0) {
        projects[index] = project;
    } else {
        projects.unshift(project);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );

    const selected = getSelectedProject();

    if (selected?.id === project.id) {
        setSelectedProject(project);
    }
}

/* =========================================================
   UPDATE PROJECT
========================================================= */

export function updateProject(
    id: string,
    updates: Partial<Project>
): Project | undefined {
    const projects = getProjects();

    const index = projects.findIndex(
        (project) => project.id === id
    );

    if (index === -1) {
        console.error(
            `Project "${id}" was not found.`
        );

        return undefined;
    }

    const updated: Project = {
        ...projects[index],
        ...updates,
    };

    projects[index] = updated;

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
    );

    const selected = getSelectedProject();

    if (selected?.id === id) {
        setSelectedProject(updated);
    }

    return updated;
}

/* =========================================================
   GET PROJECT BY ID
========================================================= */

export function getProjectById(
    id: string
): Project | undefined {
    return getProjects().find(
        (project) => project.id === id
    );
}

/* =========================================================
   DELETE PROJECT
========================================================= */

export function deleteProject(
    id: string
): void {
    const projects = getProjects();

    const updated = projects.filter(
        (project) => project.id !== id
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
    );

    localStorage.removeItem(
        `buildos_completed_${id}`
    );

    const selected = getSelectedProject();

    if (selected?.id === id) {
        clearSelectedProject();
    }
}

/* =========================================================
   SELECTED PROJECT
========================================================= */

export function getSelectedProject():
    | Project
    | null {
    if (typeof window === "undefined") {
        return null;
    }

    const saved = localStorage.getItem(
        SELECTED_PROJECT_KEY
    );

    if (!saved) {
        return null;
    }

    try {
        return JSON.parse(saved) as Project;
    } catch (error) {
        console.error(
            "Failed to load selected project:",
            error
        );

        return null;
    }
}

export function setSelectedProject(
    project: Project
): void {
    localStorage.setItem(
        SELECTED_PROJECT_KEY,
        JSON.stringify(project)
    );
}

export function clearSelectedProject(): void {
    localStorage.removeItem(
        SELECTED_PROJECT_KEY
    );
}
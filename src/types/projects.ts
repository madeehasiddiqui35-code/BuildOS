export interface Project {
    id: string;
    name: string;
    idea: string;

    blueprint?: any;

    implementation?: any;

    status:
        | "In Progress"
        | "Completed";

    createdAt: string;
}
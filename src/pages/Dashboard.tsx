import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Project,
} from "../types/projects";

import {
    getProjects,
    setSelectedProject,
} from "../services/projectStore";

function Dashboard() {
    const navigate =
        useNavigate();

    const [projects, setProjects] =
        useState<Project[]>([]);

    /* =========================================================
       LOAD PROJECTS
    ========================================================= */

    useEffect(() => {
        setProjects(
            getProjects()
        );
    }, []);

    /* =========================================================
       NEW PROJECT
    ========================================================= */

    function handleNewProject() {
        navigate("/create");
    }

    /* =========================================================
       OPEN BLUEPRINT
    ========================================================= */

    function handleOpenProject(
        project: Project
    ) {
        const blueprint =
            project.blueprint;

        if (
            !blueprint ||
            typeof blueprint !== "object"
        ) {
            alert(
                "This project does not contain a valid blueprint."
            );

            return;
        }

        /*
         * Keep the exact blueprint returned by the backend.
         */

        const updatedProject: Project = {
            ...project,
            blueprint,
        };

        setSelectedProject(
            updatedProject
        );

        /*
         * Pass the blueprint through router state.
         *
         * Blueprint.tsx already knows how to read:
         *
         * location.state.blueprint
         */

        navigate(
            `/blueprint/${project.id}`,
            {
                state: {
                    blueprint,
                    project:
                        updatedProject,
                },
            }
        );
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h1 className="text-4xl font-bold text-blue-900">
                            Your Dashboard
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Manage your AI-generated product blueprints.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleNewProject
                        }
                        className="
                            bg-gradient-to-r
                            from-blue-700
                            to-purple-600
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            shadow-lg
                            hover:scale-105
                            transition
                        "
                    >
                        + New Project
                    </button>

                </div>

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    {/* TOTAL */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-gray-500">
                            Total Projects
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {
                                projects.length
                            }
                        </h2>

                    </div>

                    {/* IN PROGRESS */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-gray-500">
                            In Progress
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {
                                projects.filter(
                                    (
                                        project
                                    ) =>
                                        project.status ===
                                        "In Progress"
                                ).length
                            }
                        </h2>

                    </div>

                    {/* COMPLETED */}

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-gray-500">
                            Completed
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {
                                projects.filter(
                                    (
                                        project
                                    ) =>
                                        project.status ===
                                        "Completed"
                                ).length
                            }
                        </h2>

                    </div>

                </div>

                {/* =================================================
                    PROJECTS
                ================================================= */}

                <div>

                    <div className="flex items-center justify-between mb-5">

                        <h2 className="text-2xl font-bold">
                            Your Projects
                        </h2>

                    </div>

                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {projects.length === 0 ? (

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow
                                p-12
                                text-center
                            "
                        >

                            <div className="text-5xl mb-4">
                                🚀
                            </div>

                            <h3 className="text-2xl font-bold">
                                No projects yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create your first project and let your
                                AI engineering team build the blueprint.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    handleNewProject
                                }
                                className="
                                    mt-6
                                    bg-black
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    hover:bg-gray-800
                                    transition
                                "
                            >
                                Create Your First Project
                            </button>

                        </div>

                    ) : (

                        /* =================================================
                           PROJECT GRID
                        ================================================= */

                        <div
                            className="
                                grid
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            {projects.map(
                                (
                                    project
                                ) => (

                                    <div
                                        key={
                                            project.id
                                        }
                                        className="
                                            bg-white
                                            rounded-2xl
                                            shadow
                                            p-6
                                            hover:shadow-xl
                                            transition
                                        "
                                    >

                                        {/* PROJECT NAME */}

                                        <h3 className="text-xl font-bold">
                                            {
                                                project.name
                                            }
                                        </h3>

                                        {/* IDEA */}

                                        <p className="text-gray-600 mt-2 line-clamp-3">
                                            {
                                                project.idea
                                            }
                                        </p>

                                        {/* STATUS */}

                                        <div className="mt-5">

                                            <span
                                                className="
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    bg-blue-100
                                                    text-blue-700
                                                    text-sm
                                                "
                                            >
                                                {
                                                    project.status
                                                }
                                            </span>

                                        </div>

                                        {/* BLUEPRINT */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleOpenProject(
                                                    project
                                                )
                                            }
                                            className="
                                                mt-5
                                                w-full
                                                bg-black
                                                text-white
                                                py-3
                                                rounded-xl
                                                font-semibold
                                                hover:bg-gray-800
                                                hover:scale-[1.02]
                                                transition
                                            "
                                        >
                                            Open Blueprint →
                                        </button>

                                        {/* BUILD WORKSPACE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/build/${project.id}`
                                                )
                                            }
                                            className="
                                                mt-3
                                                w-full
                                                bg-blue-700
                                                text-white
                                                py-3
                                                rounded-xl
                                                font-semibold
                                                hover:bg-blue-800
                                                transition
                                            "
                                        >
                                            Open Build Workspace →
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>
        </div>
    );
}

export default Dashboard;
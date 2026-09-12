import {
    useEffect,
    useState,
} from "react";

import {
    motion,
} from "framer-motion";

import {
    useNavigate,
} from "react-router-dom";

import AgentPipeline from "../components/AgentPipeline";

import {
    generateProject,
} from "../services/api";

import {
    saveProject,
    setSelectedProject,
} from "../services/projectStore";

import type {
    Project,
} from "../types/projects";

type AgentKey =
    | "CEO"
    | "ProductManager"
    | "Architect"
    | "UIUX"
    | "Developer"
    | "CodeReview"
    | "Debate"
    | "Testing"
    | "QADelivery";

function CreateProject() {
    const navigate =
        useNavigate();

    const [idea, setIdea] =
        useState("");

    const [submitted, setSubmitted] =
        useState(false);

    const [complete, setComplete] =
        useState(false);

    const [blueprint, setBlueprint] =
        useState<any>(null);

    const [backendComplete, setBackendComplete] =
        useState(false);

    const [agentStage, setAgentStage] =
        useState<AgentKey | "Waiting">(
            "Waiting"
        );

    /*
     * IMPORTANT:
     * This order now matches the ACTUAL backend
     * agentRoutes.js execution order.
     *
     * 1. CEO
     * 2. Product Manager
     * 3. Architect
     * 4. UI/UX
     * 5. Developer
     * 6. Code Review
     * 7. Debate
     * 8. Testing
     * 9. QA & Delivery
     */

    const stages: AgentKey[] = [
        "CEO",
        "ProductManager",
        "Architect",
        "UIUX",
        "Developer",
        "CodeReview",
        "Debate",
        "Testing",
        "QADelivery",
    ];

    const [status, setStatus] =
        useState<Record<AgentKey, string>>({
            CEO: "Waiting",
            ProductManager: "Waiting",
            Architect: "Waiting",
            UIUX: "Waiting",
            Developer: "Waiting",
            CodeReview: "Waiting",
            Debate: "Waiting",
            Testing: "Waiting",
            QADelivery: "Waiting",
        });

    /* =========================================================
       ANIMATE PIPELINE
    ========================================================= */

    useEffect(() => {
        if (
            agentStage === "Waiting" ||
            complete
        ) {
            return;
        }

        const timer =
            setTimeout(() => {
                const currentIndex =
                    stages.indexOf(
                        agentStage
                    );

                const current =
                    stages[currentIndex];

                const next =
                    stages[currentIndex + 1];

                if (!current) {
                    return;
                }

                setStatus(
                    (previous) => ({
                        ...previous,

                        [current]:
                            "Completed ✅",

                        ...(next
                            ? {
                                  [next]:
                                      "Working...",
                              }
                            : {}),
                    })
                );

                if (next) {
                    setAgentStage(next);
                } else {
                    setAgentStage(
                        "Waiting"
                    );

                    if (backendComplete) {
                        setComplete(true);
                    }
                }
            }, 900);

        return () =>
            clearTimeout(timer);
    }, [
        agentStage,
        complete,
        backendComplete,
    ]);

    /* =========================================================
       BACKEND COMPLETION
    ========================================================= */

    useEffect(() => {
        if (
            backendComplete &&
            agentStage === "Waiting" &&
            submitted &&
            !complete
        ) {
            setComplete(true);
        }
    }, [
        backendComplete,
        agentStage,
        submitted,
        complete,
    ]);

    /* =========================================================
       SUBMIT
    ========================================================= */

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!idea.trim()) {
            alert(
                "Please describe your idea first."
            );

            return;
        }

        try {
            setSubmitted(true);
            setComplete(false);
            setBlueprint(null);
            setBackendComplete(false);

            setStatus({
                CEO: "Working...",
                ProductManager: "Waiting",
                Architect: "Waiting",
                UIUX: "Waiting",
                Developer: "Waiting",
                CodeReview: "Waiting",
                Debate: "Waiting",
                Testing: "Waiting",
                QADelivery: "Waiting",
            });

            setAgentStage("CEO");

            console.log(
                "🚀 Generating project:",
                idea
            );

            const result =
                await generateProject(
                    idea
                );

            console.log(
                "✅ GENERATED BLUEPRINT:",
                result
            );

            if (
                !result ||
                typeof result !== "object"
            ) {
                throw new Error(
                    "The backend returned an invalid blueprint."
                );
            }

            setBlueprint(result);

            setBackendComplete(true);

            /*
             * Save project immediately after
             * successful blueprint generation.
             */

            const newProject: Project = {
                id: Date.now().toString(),

                name:
                    idea.length > 40
                        ? idea.substring(0, 40) +
                          "..."
                        : idea,

                idea,

                blueprint: result,

                status: "Completed",

                createdAt:
                    new Date().toISOString(),
            };

            saveProject(
                newProject
            );

            setSelectedProject(
                newProject
            );

            localStorage.setItem(
                "buildos_selected_project",
                JSON.stringify(
                    newProject
                )
            );
        } catch (error: any) {
            console.error(
                "❌ PROJECT GENERATION ERROR:",
                error
            );

            setSubmitted(false);
            setComplete(false);
            setAgentStage(
                "Waiting"
            );
            setBackendComplete(false);

            alert(
                error?.response
                    ?.data?.error ||
                    error?.message ||
                    "Something went wrong while generating your blueprint."
            );
        }
    }

    /* =========================================================
       VIEW BLUEPRINT
    ========================================================= */

    function handleViewBlueprint() {
        if (!blueprint) {
            return;
        }

        const project =
            localStorage.getItem(
                "buildos_selected_project"
            );

        if (project) {
            try {
                const parsed =
                    JSON.parse(project);

                navigate(
                    `/blueprint/${parsed.id}`,
                    {
                        state: {
                            blueprint,
                            project: parsed,
                        },
                    }
                );

                return;
            } catch {
                console.warn(
                    "Could not parse saved project."
                );
            }
        }

        navigate(
            "/blueprint",
            {
                state: {
                    blueprint,
                },
            }
        );
    }

    /* =========================================================
       START BUILDING
    ========================================================= */

    function handleStartBuilding() {
        const project =
            localStorage.getItem(
                "buildos_selected_project"
            );

        if (!project) {
            alert(
                "Project could not be found."
            );

            return;
        }

        try {
            const parsed =
                JSON.parse(project);

            navigate(
                `/build/${parsed.id}`
            );
        } catch {
            alert(
                "Could not open the project."
            );
        }
    }

    /* =========================================================
       RESET
    ========================================================= */

    function handleReset() {
        setSubmitted(false);
        setComplete(false);
        setBlueprint(null);
        setBackendComplete(false);
        setAgentStage("Waiting");
        setIdea("");

        setStatus({
            CEO: "Waiting",
            ProductManager: "Waiting",
            Architect: "Waiting",
            UIUX: "Waiting",
            Developer: "Waiting",
            CodeReview: "Waiting",
            Debate: "Waiting",
            Testing: "Waiting",
            QADelivery: "Waiting",
        });
    }

    return (
        <div className="relative min-h-screen bg-gray-50 p-8 overflow-hidden">

            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div
                className="
                    absolute
                    top-0
                    left-0
                    w-full
                    h-72
                    bg-blue-100
                    blur-3xl
                    opacity-40
                    -z-10
                "
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -30,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                }}
                className="
                    bg-white
                    p-6
                    rounded-2xl
                    shadow-xl
                "
            >
                <h1
                    className="
                        text-5xl
                        font-bold
                        text-blue-900
                    "
                >
                    BuildOS
                </h1>

                <p
                    className="
                        text-lg
                        text-gray-600
                        mt-3
                    "
                >
                    Your AI Product Engineering Team
                </p>

                <p
                    className="
                        text-sm
                        text-gray-400
                        mt-2
                    "
                >
                    9 specialized AI agents working together
                </p>
            </motion.div>

            {/* =================================================
                INPUT
            ================================================= */}

            {!submitted ? (
                <motion.form
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        bg-white/80
                        backdrop-blur-xl
                        border
                        border-gray-200
                        shadow-2xl
                        rounded-3xl
                        p-8
                        max-w-2xl
                        mx-auto
                        mt-10
                    "
                >
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-gray-800
                            mb-2
                        "
                    >
                        What do you want to build?
                    </h2>

                    <p
                        className="
                            text-gray-500
                            mb-5
                        "
                    >
                        Describe your software idea and let
                        your AI engineering team turn it into
                        a buildable plan.
                    </p>

                    <input
                        className="
                            w-full
                            border
                            rounded-xl
                            p-4
                            text-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                        placeholder="e.g. An AI resume builder..."
                        value={idea}
                        onChange={(
                            event
                        ) =>
                            setIdea(
                                event.target.value
                            )
                        }
                    />

                    <button
                        type="submit"
                        className="
                            mt-5
                            w-full
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-700
                            to-purple-600
                            text-white
                            font-semibold
                            shadow-lg
                            hover:scale-[1.02]
                            transition
                        "
                    >
                        🚀 Generate with AI
                    </button>
                </motion.form>
            ) : (
                <>
                    {/* =================================================
                        PIPELINE HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mt-8
                        "
                    >
                        <div>
                            <motion.h2
                                animate={
                                    complete
                                        ? {
                                              opacity: 1,
                                          }
                                        : {
                                              opacity: [
                                                  0.5,
                                                  1,
                                                  0.5,
                                              ],
                                          }
                                }
                                transition={{
                                    repeat:
                                        complete
                                            ? 0
                                            : Infinity,
                                    duration: 1.5,
                                }}
                                className="
                                    text-2xl
                                    font-bold
                                "
                            >
                                {complete
                                    ? "Blueprint Generated Successfully 🎉"
                                    : "BuildOS agents are working..."}
                            </motion.h2>

                            {!complete && (
                                <p className="text-gray-500 mt-1">
                                    {agentStage !==
                                    "Waiting"
                                        ? `${agentStage} is currently working...`
                                        : "Preparing your engineering team..."}
                                </p>
                            )}
                        </div>

                        {complete && (
                            <button
                                type="button"
                                onClick={
                                    handleReset
                                }
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-white
                                    border
                                    text-gray-600
                                    hover:bg-gray-50
                                "
                            >
                                ← New Project
                            </button>
                        )}
                    </div>

                    {/* =================================================
                        PIPELINE
                    ================================================= */}

                    <AgentPipeline
                        currentAgent={
                            agentStage
                        }
                        status={status}
                    />

                    {/* =================================================
                        COMPLETION
                    ================================================= */}

                    {complete &&
                        blueprint && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.5,
                                }}
                                className="
                                    bg-gradient-to-r
                                    from-blue-700
                                    to-purple-700
                                    text-white
                                    rounded-3xl
                                    p-8
                                    shadow-xl
                                    mt-8
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div className="text-4xl">
                                        🚀
                                    </div>

                                    <div>
                                        <h2
                                            className="
                                                text-3xl
                                                font-bold
                                            "
                                        >
                                            Your Product
                                            Blueprint is Ready
                                        </h2>

                                        <p
                                            className="
                                                mt-2
                                                text-blue-100
                                            "
                                        >
                                            BuildOS transformed
                                            your idea into a
                                            structured engineering
                                            plan.
                                        </p>
                                    </div>
                                </div>

                                {/* =================================================
                                    AGENT SUMMARY
                                ================================================= */}

                                <div
                                    className="
                                        grid
                                        md:grid-cols-3
                                        gap-4
                                        mt-6
                                    "
                                >
                                    <div className="bg-white/20 rounded-xl p-4">
                                        <h3 className="font-bold">
                                            👥 9 AI Agents
                                        </h3>

                                        <p className="text-sm mt-1 text-blue-100">
                                            Specialized agents
                                            collaborating across
                                            the full lifecycle
                                        </p>
                                    </div>

                                    <div className="bg-white/20 rounded-xl p-4">
                                        <h3 className="font-bold">
                                            📋 Product Strategy
                                        </h3>

                                        <p className="text-sm mt-1 text-blue-100">
                                            Users, features,
                                            UX and product
                                            direction
                                        </p>
                                    </div>

                                    <div className="bg-white/20 rounded-xl p-4">
                                        <h3 className="font-bold">
                                            🏗️ Engineering Plan
                                        </h3>

                                        <p className="text-sm mt-1 text-blue-100">
                                            Architecture,
                                            implementation,
                                            testing and deployment
                                        </p>
                                    </div>
                                </div>

                                {/* =================================================
                                    AGENT WORKFLOW
                                ================================================= */}

                                <div className="mt-6 bg-black/20 rounded-2xl p-5">

                                    <p className="text-sm text-blue-100 mb-3">
                                        AI Engineering Workflow
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 text-sm">

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🧠 CEO
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            📋 Product
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🏗️ Architect
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🎨 UI/UX
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            👨‍💻 Developer
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🔍 Review
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🗣️ Debate
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🧪 Testing
                                        </span>

                                        <span>→</span>

                                        <span className="bg-white/15 px-3 py-2 rounded-lg">
                                            🚚 QA
                                        </span>

                                    </div>
                                </div>

                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="grid md:grid-cols-2 gap-4 mt-8">

                                    <button
                                        type="button"
                                        onClick={
                                            handleViewBlueprint
                                        }
                                        className="
                                            w-full
                                            py-4
                                            rounded-xl
                                            bg-white
                                            text-blue-700
                                            font-bold
                                            text-lg
                                            shadow-lg
                                            hover:scale-[1.02]
                                            transition
                                        "
                                    >
                                        View Complete Blueprint →
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleStartBuilding
                                        }
                                        className="
                                            w-full
                                            py-4
                                            rounded-xl
                                            bg-black
                                            text-white
                                            font-bold
                                            text-lg
                                            shadow-lg
                                            hover:bg-gray-900
                                            hover:scale-[1.02]
                                            transition
                                        "
                                    >
                                        🚀 Start Building →
                                    </button>

                                </div>

                            </motion.div>
                        )}
                </>
            )}
        </div>
    );
}

export default CreateProject;
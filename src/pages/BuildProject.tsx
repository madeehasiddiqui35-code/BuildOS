import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    ArrowLeft,
    Code2,
    FolderTree,
    ListChecks,
    Rocket,
    CheckCircle2,
    Loader2,
} from "lucide-react";

function BuildProject() {
    const [isImplementing, setIsImplementing] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const blueprint = location.state?.blueprint;

    if (!blueprint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg border border-gray-200">
                    <div className="text-5xl mb-5">🏗️</div>

                    <h1 className="text-3xl font-bold text-blue-900">
                        No Blueprint Found
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Open a generated blueprint first before starting a build.
                    </p>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="
                            mt-6
                            px-6
                            py-3
                            rounded-xl
                            bg-blue-700
                            text-white
                            font-semibold
                            hover:bg-blue-800
                            transition
                        "
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const developer = blueprint?.developer;
    const architect = blueprint?.architect;
    const roadmap = blueprint?.roadmap;

    const implementationSteps =
        developer?.implementationSteps || [];

    const projectStructure =
        developer?.projectStructure || [];

    const codingPriorities =
        developer?.codingPriorities || [];

    const developerNotes =
        developer?.developerNotes || "";

    // ======================================================
    // START IMPLEMENTATION
    // ======================================================

    const handleStartImplementation = async () => {
    try {
        setIsImplementing(true);
        setError("");

        console.log("=================================");
        console.log("🛠️ STARTING IMPLEMENTATION");
        console.log("=================================");

        const response = await fetch(
            "http://localhost:5000/api/agents/implementation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    blueprint,
                }),
            }
        );

        console.log(
            "Implementation HTTP status:",
            response.status
        );

        const data = await response.json();

        console.log("🛠️ IMPLEMENTATION RESPONSE");
        console.log(data);

        if (!response.ok) {
            throw new Error(
                data?.error ||
                    `Implementation request failed with status ${response.status}`
            );
        }

        if (!data?.success) {
            throw new Error(
                data?.error ||
                    "Implementation Agent failed."
            );
        }

        if (!data?.implementation) {
            throw new Error(
                "Implementation Agent returned no implementation."
            );
        }

        console.log(
            "Generated files:",
            data.implementation.files?.length || 0
        );

        navigate("/implementation", {
            state: {
                blueprint,
                implementation: data.implementation,
            },
        });

    } catch (err: any) {
        console.error(
            "❌ Implementation error:",
            err
        );

        setError(
            err?.message ||
                "Implementation failed. Please try again."
        );
    } finally {
        setIsImplementing(false);
    }
};
    return (
        <div className="min-h-screen bg-gray-50">

            {/* ======================================================
                NAVBAR
            ====================================================== */}

            <nav
                className="
                    bg-white/95
                    backdrop-blur-xl
                    border-b
                    border-gray-200
                    px-6
                    py-4
                    sticky
                    top-0
                    z-30
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        flex
                        items-center
                        justify-between
                    "
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-600
                            hover:text-blue-700
                            transition
                            font-medium
                        "
                    >
                        <ArrowLeft size={18} />

                        Back to Blueprint
                    </button>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-green-600
                            font-semibold
                            text-sm
                        "
                    >
                        <CheckCircle2 size={18} />

                        Blueprint Ready
                    </div>
                </div>
            </nav>

            {/* ======================================================
                MAIN
            ====================================================== */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-5
                    md:px-6
                    py-8
                    md:py-10
                "
            >

                {/* ==================================================
                    HERO
                ================================================== */}

                <section
                    className="
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-950
                        via-blue-900
                        to-purple-800
                        text-white
                        p-8
                        md:p-12
                        shadow-2xl
                    "
                >
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-white/10
                                border
                                border-white/20
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Rocket size={28} />
                        </div>

                        <div>

                            <p
                                className="
                                    text-blue-200
                                    text-sm
                                    font-bold
                                    tracking-widest
                                "
                            >
                                BUILDOS
                            </p>

                            <h1
                                className="
                                    text-3xl
                                    md:text-5xl
                                    font-bold
                                    mt-1
                                "
                            >
                                Build Workspace
                            </h1>

                        </div>
                    </div>

                    <p
                        className="
                            text-blue-100
                            text-lg
                            mt-6
                            max-w-3xl
                            leading-relaxed
                        "
                    >
                        Your blueprint is ready. BuildOS has
                        converted the architecture into an
                        implementation workspace for your
                        development team.
                    </p>

                    {blueprint?.idea && (
                        <div
                            className="
                                mt-7
                                bg-white/10
                                border
                                border-white/15
                                rounded-2xl
                                p-5
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-blue-200
                                    font-bold
                                    tracking-widest
                                "
                            >
                                PROJECT
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-semibold
                                    mt-2
                                "
                            >
                                {blueprint.idea}
                            </p>
                        </div>
                    )}
                </section>

                {/* ==================================================
                    BUILD STATUS
                ================================================== */}

                <section
                    className="
                        grid
                        md:grid-cols-3
                        gap-5
                        mt-8
                    "
                >

                    <BuildStat
                        icon={<FolderTree size={22} />}
                        value={projectStructure.length}
                        label="Project Components"
                    />

                    <BuildStat
                        icon={<ListChecks size={22} />}
                        value={implementationSteps.length}
                        label="Implementation Steps"
                    />

                    <BuildStat
                        icon={<Code2 size={22} />}
                        value={
                            roadmap?.phases?.length || 0
                        }
                        label="Build Phases"
                    />

                </section>

                {/* ==================================================
                    ARCHITECTURE
                ================================================== */}

                <section className="mt-8">

                    <BuildCard
                        title="Technical Architecture"
                        icon={<FolderTree size={22} />}
                    >

                        {architect ? (
                            <div className="space-y-4">

                                {architect.architecture && (
                                    <div>

                                        <h3
                                            className="
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            Architecture
                                        </h3>

                                        <p
                                            className="
                                                text-gray-600
                                                mt-2
                                                leading-relaxed
                                            "
                                        >
                                            {architect.architecture}
                                        </p>

                                    </div>
                                )}

                                {architect.techStack && (
                                    <div>

                                        <h3
                                            className="
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            Technology Stack
                                        </h3>

                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                gap-2
                                                mt-3
                                            "
                                        >

                                            {Array.isArray(
                                                architect.techStack
                                            ) ? (
                                                architect.techStack.map(
                                                    (
                                                        tech: any,
                                                        index: number
                                                    ) => (
                                                        <span
                                                            key={index}
                                                            className="
                                                                px-3
                                                                py-2
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-700
                                                                font-medium
                                                                text-sm
                                                            "
                                                        >
                                                            {typeof tech ===
                                                            "string"
                                                                ? tech
                                                                : JSON.stringify(
                                                                      tech
                                                                  )}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-600">
                                                    {JSON.stringify(
                                                        architect.techStack
                                                    )}
                                                </span>
                                            )}

                                        </div>

                                    </div>
                                )}

                            </div>
                        ) : (
                            <Empty text="Architecture data unavailable." />
                        )}

                    </BuildCard>

                </section>

                {/* ==================================================
                    PROJECT STRUCTURE
                ================================================== */}

                <section className="mt-8">

                    <BuildCard
                        title="Project Structure"
                        icon={<FolderTree size={22} />}
                    >

                        {projectStructure.length > 0 ? (
                            <div className="space-y-3">

                                {projectStructure.map(
                                    (
                                        item: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                                                bg-gray-50
                                                border
                                                border-gray-200
                                                rounded-xl
                                                p-4
                                            "
                                        >

                                            <h3
                                                className="
                                                    font-bold
                                                    text-gray-900
                                                "
                                            >
                                                {item.component ||
                                                    item.name ||
                                                    `Component ${index + 1}`}
                                            </h3>

                                            {item.description && (
                                                <p
                                                    className="
                                                        text-gray-600
                                                        mt-1
                                                    "
                                                >
                                                    {item.description}
                                                </p>
                                            )}

                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <Empty text="Project structure unavailable." />
                        )}

                    </BuildCard>

                </section>

                {/* ==================================================
                    IMPLEMENTATION STEPS
                ================================================== */}

                <section className="mt-8">

                    <BuildCard
                        title="Implementation Plan"
                        icon={<ListChecks size={22} />}
                    >

                        {implementationSteps.length > 0 ? (
                            <div className="space-y-4">

                                {implementationSteps.map(
                                    (
                                        step: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                                                flex
                                                gap-4
                                                items-start
                                                border-b
                                                border-gray-100
                                                pb-4
                                                last:border-0
                                            "
                                        >

                                            <div
                                                className="
                                                    w-9
                                                    h-9
                                                    rounded-full
                                                    bg-blue-700
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                    shrink-0
                                                "
                                            >
                                                {step.step ||
                                                    index + 1}
                                            </div>

                                            <div>

                                                <h3
                                                    className="
                                                        font-bold
                                                        text-gray-900
                                                    "
                                                >
                                                    {step.title ||
                                                        step.name ||
                                                        `Step ${index + 1}`}
                                                </h3>

                                                {step.description && (
                                                    <p
                                                        className="
                                                            text-gray-600
                                                            mt-1
                                                            leading-relaxed
                                                        "
                                                    >
                                                        {step.description}
                                                    </p>
                                                )}

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <Empty text="Implementation steps unavailable." />
                        )}

                    </BuildCard>

                </section>

                {/* ==================================================
                    CODING PRIORITIES
                ================================================== */}

                <section className="mt-8">

                    <BuildCard
                        title="Coding Priorities"
                        icon={<Code2 size={22} />}
                    >

                        {codingPriorities.length > 0 ? (
                            <div className="space-y-3">

                                {codingPriorities.map(
                                    (
                                        priority: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                                                flex
                                                gap-3
                                                items-start
                                                bg-blue-50
                                                rounded-xl
                                                p-4
                                            "
                                        >

                                            <span
                                                className="
                                                    font-bold
                                                    text-blue-700
                                                "
                                            >
                                                {index + 1}.
                                            </span>

                                            <span
                                                className="
                                                    text-gray-700
                                                "
                                            >
                                                {typeof priority ===
                                                "string"
                                                    ? priority
                                                    : priority.description ||
                                                      priority.title ||
                                                      JSON.stringify(
                                                          priority
                                                      )}
                                            </span>

                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <Empty text="Coding priorities unavailable." />
                        )}

                    </BuildCard>

                </section>

                {/* ==================================================
                    DEVELOPER NOTES
                ================================================== */}

                {developerNotes && (
                    <section className="mt-8">

                        <BuildCard
                            title="Developer Notes"
                            icon={<Code2 size={22} />}
                        >

                            <div
                                className="
                                    bg-gray-950
                                    text-green-400
                                    rounded-2xl
                                    p-5
                                    whitespace-pre-wrap
                                    font-mono
                                    text-sm
                                    leading-6
                                    overflow-x-auto
                                "
                            >
                                {developerNotes}
                            </div>

                        </BuildCard>

                    </section>
                )}

                {/* ==================================================
                    START IMPLEMENTATION
                ================================================== */}

                <section
                    className="
                        mt-8
                        rounded-3xl
                        bg-gradient-to-r
                        from-blue-700
                        to-purple-700
                        p-8
                        md:p-10
                        text-white
                        shadow-xl
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-6
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-blue-200
                                    text-sm
                                    font-bold
                                    tracking-widest
                                "
                            >
                                READY TO CODE
                            </p>

                            <h2
                                className="
                                    text-2xl
                                    md:text-3xl
                                    font-bold
                                    mt-2
                                "
                            >
                                Your implementation plan is ready.
                            </h2>

                            <p
                                className="
                                    text-blue-100
                                    mt-2
                                    max-w-xl
                                "
                            >
                                The Implementation Agent will now
                                transform the Developer Agent's plan
                                into detailed development tasks,
                                testing, dependencies, and risks.
                            </p>

                        </div>

                        <div className="flex flex-col items-center">

                            <button
                                onClick={
                                    handleStartImplementation
                                }
                                disabled={isImplementing}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-white
                                    text-blue-700
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-bold
                                    shadow-lg
                                    hover:scale-105
                                    transition
                                    whitespace-nowrap
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    disabled:hover:scale-100
                                "
                            >

                                {isImplementing ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Building...
                                    </>
                                ) : (
                                    <>
                                        <Code2 size={18} />

                                        Start Implementation
                                    </>
                                )}

                            </button>

                            {error && (
                                <p
                                    className="
                                        text-red-200
                                        text-sm
                                        mt-3
                                        max-w-md
                                        text-center
                                    "
                                >
                                    {error}
                                </p>
                            )}

                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}


// ======================================================
// BUILD STAT
// ======================================================

function BuildStat({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
}) {
    return (
        <div
            className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-6
                shadow-sm
            "
        >

            <div className="flex items-center gap-3">

                <div
                    className="
                        w-11
                        h-11
                        rounded-xl
                        bg-blue-50
                        text-blue-700
                        flex
                        items-center
                        justify-center
                    "
                >
                    {icon}
                </div>

                <div>

                    <p className="text-2xl font-bold">
                        {value}
                    </p>

                    <p className="text-sm text-gray-500">
                        {label}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// BUILD CARD
// ======================================================

function BuildCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                p-6
                md:p-8
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-3
                    mb-6
                "
            >

                <div
                    className="
                        w-11
                        h-11
                        rounded-xl
                        bg-blue-50
                        text-blue-700
                        flex
                        items-center
                        justify-center
                    "
                >
                    {icon}
                </div>

                <h2
                    className="
                        text-2xl
                        font-bold
                        text-gray-900
                    "
                >
                    {title}
                </h2>

            </div>

            {children}

        </div>
    );
}


// ======================================================
// EMPTY
// ======================================================

function Empty({
    text,
}: {
    text: string;
}) {
    return (
        <div
            className="
                bg-gray-50
                border
                border-gray-100
                rounded-xl
                p-5
                text-gray-500
            "
        >
            {text}
        </div>
    );
}


export default BuildProject;
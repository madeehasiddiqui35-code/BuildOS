import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Circle,
    Code2,
    Rocket,
    Terminal,
    Map,
    AlertCircle,
    Loader2,
    FolderTree,
    Layers3,
    Database,
    ShieldCheck,
} from "lucide-react";

import {
    getProjectById,
    updateProject,
} from "../services/projectStore";

import {
    generateImplementation,
} from "../services/api";

/* =========================================================
   HELPERS
========================================================= */

function isObject(value: any): boolean {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function asArray(value: any): any[] {
    return Array.isArray(value) ? value : [];
}

function textValue(value: any): string {
    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (value === null || value === undefined) {
        return "";
    }

    if (isObject(value)) {
        return (
            value.description ||
            value.text ||
            value.name ||
            value.title ||
            value.step ||
            value.component ||
            value.path ||
            JSON.stringify(value)
        );
    }

    return String(value);
}

/*
 * Some BuildOS responses may be wrapped like:
 *
 * {
 *   blueprint: {...}
 * }
 *
 * or:
 *
 * {
 *   result: {
 *      blueprint: {...}
 *   }
 * }
 *
 * or:
 *
 * {
 *   data: {...}
 * }
 */
function normalizeBlueprint(data: any): any {
    if (!data) {
        return null;
    }

    let source = data;

    for (let i = 0; i < 5; i++) {
        if (!isObject(source)) {
            break;
        }

        if (
            isObject(source.blueprint)
        ) {
            source = source.blueprint;
            continue;
        }

        if (
            isObject(source.result?.blueprint)
        ) {
            source =
                source.result.blueprint;
            continue;
        }

        if (
            isObject(source.result)
        ) {
            source = source.result;
            continue;
        }

        if (
            isObject(source.data)
        ) {
            source = source.data;
            continue;
        }

        break;
    }

    return source;
}

/*
 * Find the first useful value from a list
 * of possible property names.
 */
function firstValue(
    source: any,
    keys: string[],
    fallback: any = undefined
) {
    if (!source || !isObject(source)) {
        return fallback;
    }

    for (const key of keys) {
        const value =
            source[key];

        if (
            value !== undefined &&
            value !== null
        ) {
            return value;
        }
    }

    return fallback;
}

/*
 * Recursively search an object for a property.
 * This makes the UI resilient if an agent response
 * puts architecture/developer data one level deeper.
 */
function findProperty(
    source: any,
    keys: string[],
    maxDepth = 4
): any {
    if (
        !source ||
        maxDepth < 0
    ) {
        return undefined;
    }

    if (!isObject(source)) {
        return undefined;
    }

    for (const key of keys) {
        if (
            source[key] !== undefined &&
            source[key] !== null
        ) {
            return source[key];
        }
    }

    for (const value of Object.values(source)) {
        if (isObject(value)) {
            const found =
                findProperty(
                    value,
                    keys,
                    maxDepth - 1
                );

            if (
                found !== undefined &&
                found !== null
            ) {
                return found;
            }
        }
    }

    return undefined;
}

/*
 * Convert object-style architecture data
 * into displayable sections.
 */
function getArchitectureEntries(
    architecture: any
) {
    if (!architecture) {
        return [];
    }

    if (
        Array.isArray(
            architecture
        )
    ) {
        return architecture.map(
            (
                item,
                index
            ) => ({
                key:
                    item?.name ||
                    item?.title ||
                    `Component ${index + 1}`,
                value:
                    textValue(item),
            })
        );
    }

    if (
        !isObject(
            architecture
        )
    ) {
        return [
            {
                key: "Architecture",
                value:
                    textValue(
                        architecture
                    ),
            },
        ];
    }

    return Object.entries(
        architecture
    ).map(
        ([key, value]) => ({
            key,
            value:
                typeof value ===
                "string"
                    ? value
                    : JSON.stringify(
                          value,
                          null,
                          2
                      ),
        })
    );
}

/* =========================================================
   COMPONENT
========================================================= */

function BuildWorkspace() {
    const { id } =
        useParams<{ id: string }>();

    const navigate =
        useNavigate();

    const [project, setProject] =
        useState<any>(null);

    const [
        completedTasks,
        setCompletedTasks,
    ] = useState<string[]>([]);

    const [
        isImplementing,
        setIsImplementing,
    ] = useState(false);

    const [error, setError] =
        useState("");

    /* =====================================================
       LOAD PROJECT
    ===================================================== */

    useEffect(() => {
        if (!id) {
            return;
        }

        const savedProject =
            getProjectById(id);

        if (!savedProject) {
            setProject(null);
            return;
        }

        setProject(savedProject);

        const savedTasks =
            localStorage.getItem(
                `buildos_completed_${id}`
            );

        if (!savedTasks) {
            setCompletedTasks([]);
            return;
        }

        try {
            const parsed =
                JSON.parse(
                    savedTasks
                );

            if (
                Array.isArray(parsed)
            ) {
                setCompletedTasks(
                    parsed
                );
            } else {
                setCompletedTasks([]);
            }
        } catch (error) {
            console.error(
                "Failed to load completed tasks:",
                error
            );

            setCompletedTasks([]);
        }
    }, [id]);

    /* =====================================================
       BLUEPRINT
    ===================================================== */

    const blueprint = useMemo(() => {
        if (!project) {
            return null;
        }

        const source =
            project?.blueprint ??
            project;

        return normalizeBlueprint(
            source
        );
    }, [project]);

    /* =====================================================
       ARCHITECTURE
    ===================================================== */

    const architecture = useMemo(() => {
        if (!blueprint) {
            return {};
        }

        const direct =
            firstValue(
                blueprint,
                [
                    "architecture",
                    "technicalArchitecture",
                    "systemArchitecture",
                    "technicalDesign",
                ]
            );

        if (
            direct &&
            (
                isObject(direct) ||
                Array.isArray(direct)
            )
        ) {
            return direct;
        }

        const nested =
            findProperty(
                blueprint,
                [
                    "architecture",
                    "technicalArchitecture",
                    "systemArchitecture",
                    "technicalDesign",
                ]
            );

        return nested || {};
    }, [blueprint]);

    const architectureEntries =
        useMemo(
            () =>
                getArchitectureEntries(
                    architecture
                ),
            [architecture]
        );

    /* =====================================================
       DEVELOPER
    ===================================================== */

    const developer = useMemo(() => {
        if (!blueprint) {
            return {};
        }

        const direct =
            firstValue(
                blueprint,
                [
                    "developer",
                    "development",
                    "developerPlan",
                    "implementation",
                ]
            );

        if (
            direct &&
            isObject(direct)
        ) {
            return direct;
        }

        const nested =
            findProperty(
                blueprint,
                [
                    "developer",
                    "development",
                    "developerPlan",
                ]
            );

        return nested || {};
    }, [blueprint]);

    /* =====================================================
       PROJECT STRUCTURE
    ===================================================== */

    const projectStructure =
        useMemo(() => {
            const direct =
                firstValue(
                    developer,
                    [
                        "projectStructure",
                        "structure",
                        "folderStructure",
                        "fileStructure",
                        "components",
                    ],
                    undefined
                );

            if (
                Array.isArray(
                    direct
                )
            ) {
                return direct;
            }

            if (
                isObject(direct)
            ) {
                return Object.entries(
                    direct
                ).map(
                    ([key, value]) => ({
                        name: key,
                        description:
                            textValue(
                                value
                            ),
                    })
                );
            }

            const nested =
                findProperty(
                    blueprint,
                    [
                        "projectStructure",
                        "folderStructure",
                        "fileStructure",
                        "components",
                    ]
                );

            if (
                Array.isArray(
                    nested
                )
            ) {
                return nested;
            }

            if (
                isObject(nested)
            ) {
                return Object.entries(
                    nested
                ).map(
                    ([key, value]) => ({
                        name: key,
                        description:
                            textValue(
                                value
                            ),
                    })
                );
            }

            return [];
        }, [
            developer,
            blueprint,
        ]);

    /* =====================================================
       IMPLEMENTATION STEPS
    ===================================================== */

    const implementationSteps =
        useMemo(() => {
            const direct =
                firstValue(
                    developer,
                    [
                        "implementationSteps",
                        "steps",
                        "implementationPlan",
                        "developmentSteps",
                        "tasks",
                    ],
                    undefined
                );

            if (
                Array.isArray(
                    direct
                )
            ) {
                return direct;
            }

            const nested =
                findProperty(
                    blueprint,
                    [
                        "implementationSteps",
                        "developmentSteps",
                    ]
                );

            return asArray(
                nested
            );
        }, [
            developer,
            blueprint,
        ]);

    /* =====================================================
       ROADMAP
    ===================================================== */

    const roadmap =
        useMemo(() => {
            const direct =
                firstValue(
                    blueprint,
                    [
                        "roadmap",
                        "engineeringRoadmap",
                        "developmentRoadmap",
                    ]
                );

            if (
                direct &&
                isObject(direct)
            ) {
                return direct;
            }

            const nested =
                findProperty(
                    blueprint,
                    [
                        "roadmap",
                        "engineeringRoadmap",
                        "developmentRoadmap",
                    ]
                );

            return nested || {};
        }, [blueprint]);

    const phases =
        useMemo(() => {
            const value =
                firstValue(
                    roadmap,
                    [
                        "phases",
                        "steps",
                        "stages",
                    ],
                    []
                );

            return asArray(
                value
            );
        }, [roadmap]);

    /* =====================================================
       CODING PRIORITIES
    ===================================================== */

    const codingPriorities =
        useMemo(() => {
            const value =
                firstValue(
                    developer,
                    [
                        "codingPriorities",
                        "priorities",
                        "developmentPriorities",
                        "technicalPriorities",
                    ],
                    undefined
                );

            if (
                Array.isArray(value)
            ) {
                return value;
            }

            const nested =
                findProperty(
                    blueprint,
                    [
                        "codingPriorities",
                        "developmentPriorities",
                        "technicalPriorities",
                    ]
                );

            return asArray(
                nested
            );
        }, [
            developer,
            blueprint,
        ]);

    /* =====================================================
       TECHNOLOGY STACK
    ===================================================== */

    const techStack =
        useMemo(() => {
            const value =
                firstValue(
                    architecture,
                    [
                        "technologyStack",
                        "techStack",
                        "technologies",
                        "stack",
                    ],
                    undefined
                );

            if (
                Array.isArray(value)
            ) {
                return value;
            }

            if (
                isObject(value)
            ) {
                return Object.entries(
                    value
                ).flatMap(
                    ([category, items]) => {
                        if (
                            Array.isArray(
                                items
                            )
                        ) {
                            return items.map(
                                (item) =>
                                    `${category}: ${textValue(item)}`
                            );
                        }

                        return [
                            `${category}: ${textValue(items)}`,
                        ];
                    }
                );
            }

            return [];
        }, [
            architecture,
        ]);

    /* =====================================================
       TOTAL TASKS
    ===================================================== */

    const totalTasks =
        useMemo(() => {
            const roadmapTasks =
                phases.reduce(
                    (
                        total: number,
                        phase: any
                    ) => {
                        const tasks =
                            Array.isArray(
                                phase?.tasks
                            )
                                ? phase.tasks
                                      .length
                                : 0;

                        return (
                            total +
                            tasks
                        );
                    },
                    0
                );

            return (
                roadmapTasks +
                implementationSteps.length
            );
        }, [
            phases,
            implementationSteps,
        ]);

    const completedCount =
        completedTasks.length;

    const progress =
        totalTasks > 0
            ? Math.min(
                  100,
                  Math.round(
                      (completedCount /
                          totalTasks) *
                          100
                  )
              )
            : 0;

    /* =====================================================
       TOGGLE TASK
    ===================================================== */

    function toggleTask(
        taskId: string
    ) {
        setCompletedTasks(
            (previous) => {
                const updated =
                    previous.includes(
                        taskId
                    )
                        ? previous.filter(
                              (
                                  item
                              ) =>
                                  item !==
                                  taskId
                          )
                        : [
                              ...previous,
                              taskId,
                          ];

                if (id) {
                    localStorage.setItem(
                        `buildos_completed_${id}`,
                        JSON.stringify(
                            updated
                        )
                    );
                }

                return updated;
            }
        );
    }

    /* =====================================================
       START IMPLEMENTATION
    ===================================================== */

    async function handleStartImplementation() {
    if (!blueprint) {
        setError(
            "No blueprint is available."
        );

        return;
    }

    try {
        setIsImplementing(true);

        setError("");

        console.log(
            "================================="
        );

        console.log(
            "🛠️ STARTING IMPLEMENTATION"
        );

        console.log(
            "================================="
        );

        const data =
            await generateImplementation(
                blueprint
            );

        console.log(
            "Implementation response:",
            data
        );

        if (!data) {
            throw new Error(
                "No response from the server."
            );
        }

        if (
            data.success === false
        ) {
            throw new Error(
                data.error ||
                    "Implementation Agent failed."
            );
        }

        const implementation =
            data?.implementation ||
            data?.result?.implementation ||
            data?.data?.implementation ||
            data?.result ||
            data?.data ||
            data;

        if (!implementation) {
            throw new Error(
                "No implementation was returned by the server."
            );
        }

        console.log(
            "Generated files:",
            Array.isArray(
                implementation?.files
            )
                ? implementation.files.length
                : 0
        );

        let updatedProject =
            project;

        if (id) {
            const updated =
                updateProject(
                    id,
                    {
                        implementation,
                        status:
                            "In Progress",
                    }
                );

            if (updated) {
                updatedProject =
                    updated;

                setProject(
                    updated
                );
            }
        }

        navigate(
            `/implementation/${id}`,
            {
                state: {
                    blueprint,
                    implementation,
                    project:
                        updatedProject,
                },
            }
        );
    } catch (err: any) {
        console.error(
            "❌ Implementation error:",
            err
        );

        const message =
            err?.response?.data?.error ||
            err?.message ||
            "Implementation failed. Please try again.";

        setError(message);
    } finally {
        setIsImplementing(false);
    }
}

    /* =====================================================
       PROJECT NOT FOUND
    ===================================================== */

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center max-w-lg">
                    <div className="text-5xl mb-5">
                        🚧
                    </div>

                    <h1 className="text-3xl font-bold text-blue-900">
                        Build Not Found
                    </h1>

                    <p className="text-gray-600 mt-3">
                        We couldn't find this
                        project in your
                        BuildOS workspace.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
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
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    /* =====================================================
       PROJECT NAME
    ===================================================== */

    const projectName =
        project.name ||
        project.title ||
        blueprint?.idea ||
        "Your Product";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav
                className="
                    bg-white
                    border-b
                    border-gray-200
                    sticky
                    top-0
                    z-30
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        px-5
                        md:px-6
                        py-4
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/blueprint/${project.id}`,
                                {
                                    state: {
                                        blueprint,
                                        project,
                                    },
                                }
                            )
                        }
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
                        <ArrowLeft
                            size={18}
                        />

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
                        <CheckCircle2
                            size={17}
                        />

                        Build Workspace
                    </div>
                </div>
            </nav>

            {/* =================================================
                MAIN
            ================================================= */}

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

                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    className="
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-950
                        via-blue-900
                        to-purple-800
                        text-white
                        p-8
                        md:p-10
                        shadow-2xl
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-8
                        "
                    >
                        <div>
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-white/10
                                    border
                                    border-white/20
                                    text-blue-100
                                    text-sm
                                "
                            >
                                <span
                                    className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-green-400
                                        animate-pulse
                                    "
                                />

                                BUILD IN PROGRESS
                            </div>

                            <p
                                className="
                                    text-blue-200
                                    text-sm
                                    font-bold
                                    mt-6
                                    tracking-widest
                                "
                            >
                                BUILDOS
                            </p>

                            <h1
                                className="
                                    text-4xl
                                    md:text-5xl
                                    font-bold
                                    mt-2
                                "
                            >
                                {projectName}
                            </h1>

                            <p
                                className="
                                    text-blue-100
                                    mt-4
                                    max-w-2xl
                                    leading-relaxed
                                "
                            >
                                Your blueprint is
                                ready. Follow the
                                engineering roadmap
                                to turn your idea into
                                a real product.
                            </p>
                        </div>

                        {/* PROGRESS */}

                        <div
                            className="
                                bg-white/10
                                border
                                border-white/10
                                rounded-2xl
                                p-6
                                min-w-[240px]
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >
                                <span
                                    className="
                                        text-blue-100
                                        text-sm
                                    "
                                >
                                    Build Progress
                                </span>

                                <span className="font-bold text-xl">
                                    {progress}%
                                </span>
                            </div>

                            <div
                                className="
                                    mt-3
                                    h-3
                                    bg-white/10
                                    rounded-full
                                    overflow-hidden
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        bg-green-400
                                        rounded-full
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>

                            <p
                                className="
                                    text-blue-200
                                    text-xs
                                    mt-3
                                "
                            >
                                {completedCount}{" "}
                                of{" "}
                                {totalTasks}{" "}
                                tasks completed
                            </p>
                        </div>
                    </div>
                </section>

                {/* =================================================
                    QUICK STATS
                ================================================= */}

                <section
                    className="
                        grid
                        grid-cols-2
                        lg:grid-cols-4
                        gap-4
                        mt-8
                    "
                >
                    <WorkspaceStat
                        icon={
                            <FolderTree
                                size={21}
                            />
                        }
                        label="Project Components"
                        value={
                            projectStructure.length
                        }
                    />

                    <WorkspaceStat
                        icon={
                            <Code2
                                size={21}
                            />
                        }
                        label="Implementation Steps"
                        value={
                            implementationSteps.length
                        }
                    />

                    <WorkspaceStat
                        icon={
                            <Map
                                size={21}
                            />
                        }
                        label="Build Phases"
                        value={
                            phases.length
                        }
                    />

                    <WorkspaceStat
                        icon={
                            <Layers3
                                size={21}
                            />
                        }
                        label="Architecture Areas"
                        value={
                            architectureEntries.length
                        }
                    />
                </section>

                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section
                    className="
                        grid
                        md:grid-cols-3
                        gap-4
                        mt-8
                    "
                >
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/blueprint/${project.id}`,
                                {
                                    state: {
                                        blueprint,
                                        project,
                                    },
                                }
                            )
                        }
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            p-5
                            text-left
                            hover:border-blue-300
                            hover:shadow-md
                            transition
                        "
                    >
                        <Map
                            className="text-blue-700"
                            size={24}
                        />

                        <h3 className="font-bold text-lg mt-3">
                            View Blueprint
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Review the
                            AI-generated plan.
                        </p>
                    </button>

                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            p-5
                        "
                    >
                        <Code2
                            className="text-purple-700"
                            size={24}
                        />

                        <h3 className="font-bold text-lg mt-3">
                            Implementation
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Follow the
                            developer's
                            implementation plan.
                        </p>
                    </div>

                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            p-5
                        "
                    >
                        <Rocket
                            className="text-green-600"
                            size={24}
                        />

                        <h3 className="font-bold text-lg mt-3">
                            Deployment
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            Prepare your
                            product for launch.
                        </p>
                    </div>
                </section>

                {/* =================================================
                    TECHNICAL ARCHITECTURE
                ================================================= */}

                <section className="mt-8">
                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-3xl
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
                                mb-7
                            "
                        >
                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-blue-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <Layers3
                                    className="text-blue-700"
                                    size={23}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Technical Architecture
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Architecture decisions generated by the Architect Agent.
                                </p>
                            </div>
                        </div>

                        {architectureEntries.length >
                        0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {architectureEntries.map(
                                    (
                                        entry,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                bg-gray-50
                                                border
                                                border-gray-100
                                                rounded-2xl
                                                p-5
                                            "
                                        >
                                            <h3 className="font-bold text-gray-900 capitalize">
                                                {entry.key.replace(
                                                    /([A-Z])/g,
                                                    " $1"
                                                )}
                                            </h3>

                                            <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                                                {
                                                    entry.value
                                                }
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    bg-yellow-50
                                    text-yellow-800
                                    rounded-xl
                                    p-5
                                "
                            >
                                <AlertCircle
                                    size={19}
                                    className="inline mr-2"
                                />

                                Architecture
                                data unavailable.
                            </div>
                        )}

                        {/* TECHNOLOGY STACK */}

                        {techStack.length >
                            0 && (
                            <div className="mt-7 pt-7 border-t border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Database
                                        size={
                                            21
                                        }
                                        className="text-purple-700"
                                    />

                                    <h3 className="text-lg font-bold">
                                        Technology Stack
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {techStack.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    index
                                                }
                                                className="
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    bg-purple-50
                                                    text-purple-700
                                                    text-sm
                                                    font-medium
                                                "
                                            >
                                                {textValue(
                                                    item
                                                )}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* =================================================
                    PROJECT STRUCTURE
                ================================================= */}

                <section className="mt-8">
                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-3xl
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
                                mb-7
                            "
                        >
                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-purple-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <FolderTree
                                    className="text-purple-700"
                                    size={23}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Project Structure
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Components and structure recommended for the build.
                                </p>
                            </div>
                        </div>

                        {projectStructure.length >
                        0 ? (
                            <div className="grid md:grid-cols-2 gap-3">
                                {projectStructure.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                border
                                                border-gray-200
                                                rounded-2xl
                                                p-5
                                                hover:border-blue-200
                                                hover:shadow-sm
                                                transition
                                            "
                                        >
                                            <h3 className="font-bold text-gray-900">
                                                {typeof item ===
                                                "string"
                                                    ? item
                                                    : item?.component ||
                                                      item?.name ||
                                                      item?.path ||
                                                      item?.title ||
                                                      `Component ${
                                                          index +
                                                          1
                                                      }`}
                                            </h3>

                                            {typeof item !==
                                                "string" &&
                                                (
                                                    item?.description ||
                                                    item?.purpose ||
                                                    item?.role
                                                ) && (
                                                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                                        {item.description ||
                                                            item.purpose ||
                                                            item.role}
                                                    </p>
                                                )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    bg-yellow-50
                                    text-yellow-800
                                    rounded-xl
                                    p-5
                                "
                            >
                                <AlertCircle
                                    size={19}
                                    className="inline mr-2"
                                />

                                Project
                                structure
                                unavailable.
                            </div>
                        )}
                    </div>
                </section>

                {/* =================================================
                    ROADMAP
                ================================================= */}

                <section className="mt-8">
                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-3xl
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
                                mb-8
                            "
                        >
                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-blue-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <Map
                                    className="text-blue-700"
                                    size={23}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Engineering Roadmap
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Work through the phases generated by your AI team.
                                </p>
                            </div>
                        </div>

                        {phases.length >
                        0 ? (
                            <div className="space-y-6">
                                {phases.map(
                                    (
                                        phase: any,
                                        phaseIndex: number
                                    ) => (
                                        <div
                                            key={
                                                phaseIndex
                                            }
                                            className="
                                                border
                                                border-gray-200
                                                rounded-2xl
                                                overflow-hidden
                                            "
                                        >
                                            <div
                                                className="
                                                    bg-gray-50
                                                    p-5
                                                    flex
                                                    items-center
                                                    gap-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        w-10
                                                        h-10
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
                                                    {phaseIndex +
                                                        1}
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {phase?.name ||
                                                            phase?.title ||
                                                            `Phase ${
                                                                phaseIndex +
                                                                1
                                                            }`}
                                                    </h3>

                                                    {(phase?.goal ||
                                                        phase?.description) && (
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            {phase.goal ||
                                                                phase.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                {Array.isArray(
                                                    phase?.tasks
                                                ) &&
                                                phase
                                                    .tasks
                                                    .length >
                                                    0 ? (
                                                    <div className="space-y-2">
                                                        {phase.tasks.map(
                                                            (
                                                                task: any,
                                                                taskIndex: number
                                                            ) => {
                                                                const taskText =
                                                                    textValue(
                                                                        task
                                                                    );

                                                                const taskId =
                                                                    `phase-${phaseIndex}-task-${taskIndex}`;

                                                                const isComplete =
                                                                    completedTasks.includes(
                                                                        taskId
                                                                    );

                                                                return (
                                                                    <button
                                                                        key={
                                                                            taskId
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleTask(
                                                                                taskId
                                                                            )
                                                                        }
                                                                        className={`
                                                                            w-full
                                                                            flex
                                                                            items-center
                                                                            gap-3
                                                                            text-left
                                                                            p-3
                                                                            rounded-xl
                                                                            transition
                                                                            ${
                                                                                isComplete
                                                                                    ? "bg-green-50"
                                                                                    : "bg-gray-50 hover:bg-blue-50"
                                                                            }
                                                                        `}
                                                                    >
                                                                        {isComplete ? (
                                                                            <CheckCircle2
                                                                                size={
                                                                                    20
                                                                                }
                                                                                className="text-green-600 shrink-0"
                                                                            />
                                                                        ) : (
                                                                            <Circle
                                                                                size={
                                                                                    20
                                                                                }
                                                                                className="text-gray-400 shrink-0"
                                                                            />
                                                                        )}

                                                                        <span
                                                                            className={
                                                                                isComplete
                                                                                    ? "text-gray-400 line-through"
                                                                                    : "text-gray-700"
                                                                            }
                                                                        >
                                                                            {
                                                                                taskText
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">
                                                        No detailed
                                                        tasks were
                                                        generated.
                                                    </p>
                                                )}

                                                {(phase?.deliverable ||
                                                    phase?.output) && (
                                                    <div
                                                        className="
                                                            mt-4
                                                            bg-blue-50
                                                            text-blue-800
                                                            rounded-xl
                                                            p-4
                                                            text-sm
                                                        "
                                                    >
                                                        <strong>
                                                            Deliverable:
                                                        </strong>{" "}
                                                        {phase.deliverable ||
                                                            phase.output}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    bg-yellow-50
                                    text-yellow-800
                                    rounded-xl
                                    p-5
                                "
                            >
                                <AlertCircle
                                    size={20}
                                    className="inline mr-2"
                                />

                                No roadmap phases
                                were found.
                            </div>
                        )}
                    </div>
                </section>

                {/* =================================================
                    IMPLEMENTATION PLAN
                ================================================= */}

                <section className="mt-8">
                    <div
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-3xl
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
                            <Terminal
                                className="text-purple-700"
                                size={25}
                            />

                            <div>
                                <h2 className="text-2xl font-bold">
                                    Developer
                                    Implementation
                                    Plan
                                </h2>

                                <p className="text-gray-500 text-sm mt-1">
                                    Generated implementation steps from your Developer Agent.
                                </p>
                            </div>
                        </div>

                        {implementationSteps.length >
                        0 ? (
                            <div className="space-y-3">
                                {implementationSteps.map(
                                    (
                                        step: any,
                                        index: number
                                    ) => {
                                        const stepText =
                                            textValue(
                                                step
                                            );

                                        const stepId =
                                            `implementation-${index}`;

                                        const isComplete =
                                            completedTasks.includes(
                                                stepId
                                            );

                                        return (
                                            <button
                                                key={
                                                    stepId
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleTask(
                                                        stepId
                                                    )
                                                }
                                                className={`
                                                    w-full
                                                    flex
                                                    items-center
                                                    gap-3
                                                    text-left
                                                    p-4
                                                    rounded-xl
                                                    border
                                                    transition
                                                    ${
                                                        isComplete
                                                            ? "bg-green-50 border-green-200"
                                                            : "bg-gray-50 border-gray-100 hover:border-blue-200"
                                                    }
                                                `}
                                            >
                                                {isComplete ? (
                                                    <CheckCircle2
                                                        size={
                                                            20
                                                        }
                                                        className="text-green-600 shrink-0"
                                                    />
                                                ) : (
                                                    <Circle
                                                        size={
                                                            20
                                                        }
                                                        className="text-gray-400 shrink-0"
                                                    />
                                                )}

                                                <span
                                                    className={
                                                        isComplete
                                                            ? "text-gray-400 line-through"
                                                            : "text-gray-700"
                                                    }
                                                >
                                                    {index +
                                                        1}
                                                    .{" "}
                                                    {
                                                        stepText
                                                    }
                                                </span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <p
                                className="
                                    bg-gray-50
                                    rounded-xl
                                    p-5
                                    text-gray-500
                                "
                            >
                                No implementation
                                steps are
                                available.
                            </p>
                        )}
                    </div>
                </section>

                {/* =================================================
                    CODING PRIORITIES
                ================================================= */}

                {codingPriorities.length >
                    0 && (
                    <section className="mt-8">
                        <div
                            className="
                                bg-white
                                border
                                border-gray-200
                                rounded-3xl
                                shadow-sm
                                p-6
                                md:p-8
                            "
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck
                                    className="text-green-600"
                                    size={24}
                                />

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Coding Priorities
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Important engineering considerations for the build.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {codingPriorities.map(
                                    (
                                        priority: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                                bg-gray-50
                                                rounded-xl
                                                p-4
                                            "
                                        >
                                            <div
                                                className="
                                                    w-8
                                                    h-8
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
                                                {index +
                                                    1}
                                            </div>

                                            <p className="text-gray-700 pt-1">
                                                {textValue(
                                                    priority
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* =================================================
                    START IMPLEMENTATION
                ================================================= */}

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
                            <p className="text-blue-200 text-sm font-bold tracking-widest">
                                READY TO CODE
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold mt-2">
                                Turn the plan into code.
                            </h2>

                            <p className="text-blue-100 mt-2 max-w-xl">
                                The Implementation Agent
                                will transform your
                                engineering plan into
                                starter files and
                                development next steps.
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={
                                    handleStartImplementation
                                }
                                disabled={
                                    isImplementing
                                }
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

                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Code2
                                            size={18}
                                        />

                                        Start
                                        Implementation
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

                {/* =================================================
                    TERMINAL
                ================================================= */}

                <section className="mt-8">
                    <div
                        className="
                            bg-gray-950
                            rounded-3xl
                            p-6
                            md:p-8
                            text-green-400
                            shadow-xl
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                text-white
                            "
                        >
                            <Terminal
                                size={21}
                            />

                            <h2 className="font-bold text-lg">
                                BuildOS Agent Console
                            </h2>
                        </div>

                        <div
                            className="
                                mt-5
                                font-mono
                                text-sm
                                leading-7
                            "
                        >
                            <p>
                                <span className="text-blue-400">
                                    $
                                </span>{" "}
                                buildos start
                            </p>

                            <p>
                                ✓ Blueprint loaded
                            </p>

                            <p>
                                ✓ Architecture loaded
                            </p>

                            <p>
                                ✓ Project structure loaded
                            </p>

                            <p>
                                ✓ Roadmap loaded
                            </p>

                            <p>
                                ✓ Developer plan loaded
                            </p>

                            <p>
                                <span className="text-yellow-400">
                                    →
                                </span>{" "}
                                Ready to begin
                                implementation
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function WorkspaceStat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div
            className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
            "
        >
            <div
                className="
                    w-10
                    h-10
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

            <p className="text-gray-500 text-sm mt-4">
                {label}
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-1">
                {value}
            </p>
        </div>
    );
}

export default BuildWorkspace;
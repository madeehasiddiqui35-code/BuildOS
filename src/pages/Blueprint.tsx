import {
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    useLocation,
    useParams,
} from "react-router-dom";

import { getProjectById } from "../services/projectStore";

/* =========================================================
   TYPES
========================================================= */

type AnyObject = Record<string, any>;

interface BlueprintProps {
    blueprint?: AnyObject | null | undefined;
}

interface Phase {
    name?: string;
    title?: string;
    goal?: string;
    description?: string;
    deliverable?: string;
    tasks?: any[];
    [key: string]: any;
}

interface AgentDefinition {
    key: string;
    icon: string;
    name: string;
    role: string;
    description: string;
    highlight?: boolean;
}

/* =========================================================
   CONSTANTS
========================================================= */

const TOTAL_AGENTS = 9;

const AGENTS: AgentDefinition[] = [
    {
        key: "ceo",
        icon: "🧠",
        name: "CEO",
        role: "Coordinator",
        description: "Defines vision, product direction and success criteria.",
    },
    {
        key: "productManager",
        icon: "📋",
        name: "Product",
        role: "Strategy",
        description: "Turns the idea into features, users and requirements.",
    },
    {
        key: "architect",
        icon: "🏗️",
        name: "Architect",
        role: "Architecture",
        description: "Designs the technical system and engineering structure.",
        highlight: true,
    },
    {
        key: "uiux",
        icon: "🎨",
        name: "UI/UX",
        role: "Design",
        description: "Plans screens, components and the user experience.",
    },
    {
        key: "developer",
        icon: "👨‍💻",
        name: "Developer",
        role: "Implementation",
        description: "Converts the blueprint into an actionable build plan.",
    },
    {
        key: "codeReview",
        icon: "🔍",
        name: "Code Review",
        role: "Quality",
        description: "Challenges the engineering plan and identifies issues.",
        highlight: true,
    },
    {
        key: "debate",
        icon: "🗣️",
        name: "Debate",
        role: "Architecture Review",
        description: "Resolves engineering disagreements before implementation.",
        highlight: true,
    },
    {
        key: "testing",
        icon: "🧪",
        name: "Testing",
        role: "Validation",
        description: "Defines critical tests, quality checks and risks.",
        highlight: true,
    },
    {
        key: "qaDelivery",
        icon: "🚚",
        name: "QA & Delivery",
        role: "Release",
        description: "Finalizes deployment, roadmap and release readiness.",
        highlight: true,
    },
];

/* =========================================================
   HELPERS
========================================================= */

function isObject(value: any): value is AnyObject {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function displayValue(value: any): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map((item: any) => displayValue(item))
            .filter(Boolean)
            .join(", ");
    }

    if (isObject(value)) {
        const preferredKeys = [
            "name",
            "title",
            "description",
            "goal",
            "summary",
            "text",
            "content",
            "value",
            "step",
            "task",
            "deliverable",
            "decision",
            "reasoning",
        ];

        for (const key of preferredKeys) {
            if (
                value[key] !== undefined &&
                value[key] !== null &&
                value[key] !== ""
            ) {
                const result = displayValue(value[key]);

                if (result) {
                    return result;
                }
            }
        }

        return Object.entries(value)
            .map(([key, val]) => {
                const text = displayValue(val);

                return text
                    ? `${key}: ${text}`
                    : "";
            })
            .filter(Boolean)
            .join(" • ");
    }

    return String(value);
}

function displayItem(
    item: any,
    fallback: string
): string {
    const result = displayValue(item);

    return result || fallback;
}

function getArray(
    source: any,
    keys: string[]
): any[] {
    if (!source) {
        return [];
    }

    for (const key of keys) {
        if (Array.isArray(source[key])) {
            return source[key];
        }
    }

    return [];
}

function getObject(
    source: any,
    keys: string[]
): AnyObject {
    if (!source) {
        return {};
    }

    for (const key of keys) {
        if (isObject(source[key])) {
            return source[key];
        }
    }

    return {};
}

/* =========================================================
   NORMALIZE ROADMAP
========================================================= */

function normalizePhases(
    blueprint: AnyObject
): Phase[] {
    const roadmapCandidates = [
        blueprint?.roadmap,
        blueprint?.developmentRoadmap,
        blueprint?.buildRoadmap,
        blueprint?.implementationRoadmap,
        blueprint?.developer?.roadmap,
    ];

    for (const roadmap of roadmapCandidates) {
        if (!roadmap) {
            continue;
        }

        if (Array.isArray(roadmap)) {
            return roadmap;
        }

        if (isObject(roadmap)) {
            const phases = getArray(
                roadmap,
                [
                    "phases",
                    "roadmap",
                    "steps",
                    "stages",
                ]
            );

            if (phases.length > 0) {
                return phases;
            }
        }
    }

    if (Array.isArray(blueprint?.phases)) {
        return blueprint.phases;
    }

    return [];
}

function normalizeRoadmap(
    blueprint: AnyObject
): AnyObject {
    const roadmapCandidates = [
        blueprint?.roadmap,
        blueprint?.developmentRoadmap,
        blueprint?.buildRoadmap,
        blueprint?.implementationRoadmap,
        blueprint?.developer?.roadmap,
    ];

    for (const roadmap of roadmapCandidates) {
        if (Array.isArray(roadmap)) {
            return {
                phases: roadmap,
            };
        }

        if (isObject(roadmap)) {
            return roadmap;
        }
    }

    return {};
}

/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const roadmap = normalizeRoadmap(
        safeBlueprint
    );

    const phases = normalizePhases(
        safeBlueprint
    );

    const launchPlan = getArray(
        roadmap,
        [
            "launchPlan",
            "launch",
            "launchSteps",
        ]
    );

    const summary =
        safeBlueprint?.ceo?.summary ||
        safeBlueprint?.ceo?.analysis ||
        safeBlueprint?.ceo?.description ||
        safeBlueprint?.summary ||
        safeBlueprint?.analysis ||
        "BuildOS analyzed your idea through a team of specialized AI agents and produced a complete product engineering blueprint.";

    return (
        <div className="space-y-6">

            <SectionCard
                title="BuildOS Analysis"
                icon="🤖"
            >
                <p className="text-gray-600 leading-relaxed">
                    {displayValue(summary)}
                </p>
            </SectionCard>

            <div className="grid md:grid-cols-2 gap-6">

                <SectionCard
                    title="Development Roadmap"
                    icon="🗺️"
                >
                    {phases.length > 0 ? (
                        <div className="space-y-4">
                            {phases.map(
                                (
                                    phase: Phase,
                                    index: number
                                ) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 items-start"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {phase?.name ||
                                                    phase?.title ||
                                                    `Phase ${
                                                        index + 1
                                                    }`}
                                            </p>

                                            <p className="text-sm text-gray-600 mt-1">
                                                {phase?.goal ||
                                                    phase?.description ||
                                                    "Phase details available in the Roadmap tab."}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <EmptyState text="Roadmap phases were not returned by the AI pipeline." />
                    )}
                </SectionCard>

                <SectionCard
                    title="Milestones"
                    icon="🏆"
                >
                    {phases.length > 0 ? (
                        <div className="space-y-3">
                            {phases.map(
                                (
                                    phase: Phase,
                                    index: number
                                ) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                    >
                                        <p className="font-semibold">
                                            {phase?.deliverable ||
                                                phase?.name ||
                                                phase?.title ||
                                                `Phase ${
                                                    index + 1
                                                }`}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Phase{" "}
                                            {index + 1}:{" "}
                                            {phase?.name ||
                                                phase?.title ||
                                                "Unnamed phase"}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <EmptyState text="Milestone data was not returned by the AI pipeline." />
                    )}
                </SectionCard>

            </div>

            {launchPlan.length > 0 && (
                <SectionCard
                    title="Launch Plan"
                    icon="🚀"
                >
                    <div className="space-y-3">
                        {launchPlan.map(
                            (
                                step: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    <span className="font-bold text-blue-700">
                                        {index + 1}.
                                    </span>

                                    <span className="text-gray-700">
                                        {displayItem(
                                            step,
                                            `Step ${
                                                index + 1
                                            }`
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </SectionCard>
            )}

        </div>
    );
}

/* =========================================================
   PRODUCT
========================================================= */

function ProductSection({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const productData = getObject(
        safeBlueprint,
        [
            "productManager",
            "product",
            "productStrategy",
            "strategy",
        ]
    );

    const strategy = getObject(
        safeBlueprint,
        [
            "productStrategy",
            "strategy",
            "productManager",
        ]
    );

    const mvpFeatures = getArray(
        productData,
        [
            "mvpFeatures",
            "features",
            "MVPFeatures",
            "coreFeatures",
        ]
    );

    const finalFeatures =
        mvpFeatures.length > 0
            ? mvpFeatures
            : getArray(
                  strategy,
                  [
                      "features",
                      "mvpFeatures",
                      "coreFeatures",
                  ]
              );

    const userStories = getArray(
        productData,
        [
            "userStories",
            "stories",
        ]
    );

    const finalUserStories =
        userStories.length > 0
            ? userStories
            : getArray(
                  strategy,
                  [
                      "userStories",
                      "stories",
                  ]
              );

    const acceptanceCriteria =
        getArray(
            productData,
            [
                "acceptanceCriteria",
                "criteria",
            ]
        );

    const finalCriteria =
        acceptanceCriteria.length > 0
            ? acceptanceCriteria
            : getArray(
                  strategy,
                  [
                      "acceptanceCriteria",
                      "criteria",
                  ]
              );

    const users = getArray(
        strategy,
        [
            "users",
            "targetUsers",
            "targetAudience",
        ]
    ).length
        ? getArray(strategy, [
              "users",
              "targetUsers",
              "targetAudience",
          ])
        : getArray(safeBlueprint, [
              "targetUsers",
              "targetAudience",
          ]);

    return (
        <div className="space-y-6">

            <SectionCard
                title="MVP Features"
                icon="🚀"
            >
                {finalFeatures.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {finalFeatures.map(
                            (
                                feature: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition"
                                >
                                    <div className="flex justify-between gap-3">
                                        <h3 className="font-bold text-lg">
                                            {displayItem(
                                                feature,
                                                `Feature ${
                                                    index + 1
                                                }`
                                            )}
                                        </h3>

                                        {isObject(feature) &&
                                            feature?.priority && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full h-fit font-semibold">
                                                    {
                                                        feature.priority
                                                    }
                                                </span>
                                            )}
                                    </div>

                                    {isObject(feature) &&
                                        feature?.description && (
                                            <p className="text-gray-600 mt-2 leading-relaxed">
                                                {
                                                    feature.description
                                                }
                                            </p>
                                        )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="MVP feature data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="User Stories"
                icon="👥"
            >
                {finalUserStories.length > 0 ? (
                    <div className="space-y-3">
                        {finalUserStories.map(
                            (
                                story: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    {displayItem(
                                        story,
                                        `User Story ${
                                            index + 1
                                        }`
                                    )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="User story data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Acceptance Criteria"
                icon="✅"
            >
                {finalCriteria.length > 0 ? (
                    <div className="space-y-3">
                        {finalCriteria.map(
                            (
                                criteria: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-3 bg-gray-50 rounded-xl p-4"
                                >
                                    <span className="text-green-600 font-bold">
                                        ✓
                                    </span>

                                    <span className="text-gray-700">
                                        {displayItem(
                                            criteria,
                                            `Criteria ${
                                                index + 1
                                            }`
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Acceptance criteria unavailable." />
                )}
            </SectionCard>

            {users.length > 0 && (
                <SectionCard
                    title="Target Users"
                    icon="🎯"
                >
                    <div className="flex flex-wrap gap-3">
                        {users.map(
                            (
                                user: any,
                                index: number
                            ) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium"
                                >
                                    {displayItem(
                                        user,
                                        `User ${
                                            index + 1
                                        }`
                                    )}
                                </span>
                            )
                        )}
                    </div>
                </SectionCard>
            )}

        </div>
    );
}

/* =========================================================
   DESIGN
========================================================= */

function DesignSection({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const design = getObject(
        safeBlueprint,
        [
            "uiux",
            "uiUx",
            "uiuxDesign",
            "design",
            "ui",
        ]
    );

    const pages = getArray(
        design,
        [
            "pages",
            "screens",
        ]
    );

    const components = getArray(
        design,
        [
            "components",
            "uiComponents",
        ]
    );

    const userFlow = getArray(
        design,
        [
            "userFlow",
            "userFlows",
            "flow",
        ]
    );

    const uxPriorities = getArray(
        design,
        [
            "uxPriorities",
            "priorities",
        ]
    );

    return (
        <div className="space-y-6">

            <SectionCard
                title="Design Direction"
                icon="🎨"
            >
                <p className="text-gray-700 text-lg leading-relaxed">
                    {displayValue(
                        design?.designDirection ||
                        design?.direction ||
                        design?.description ||
                        "Design direction unavailable."
                    )}
                </p>
            </SectionCard>

            <SectionCard
                title="Pages"
                icon="📄"
            >
                {pages.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-3">
                        {pages.map(
                            (
                                page: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-4 font-medium border border-gray-100"
                                >
                                    {displayItem(
                                        page,
                                        `Page ${
                                            index + 1
                                        }`
                                    )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Page data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="UI Components"
                icon="🧩"
            >
                {components.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {components.map(
                            (
                                component: any,
                                index: number
                            ) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium"
                                >
                                    {displayItem(
                                        component,
                                        `Component ${
                                            index + 1
                                        }`
                                    )}
                                </span>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Component data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="User Flow"
                icon="🔄"
            >
                {userFlow.length > 0 ? (
                    <div className="space-y-3">
                        {userFlow.map(
                            (
                                step: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-4 items-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 flex-1">
                                        {displayItem(
                                            step,
                                            `Step ${
                                                index + 1
                                            }`
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="User flow unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="UX Priorities"
                icon="⭐"
            >
                {uxPriorities.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {uxPriorities.map(
                            (
                                priority: any,
                                index: number
                            ) => (
                                <span
                                    key={index}
                                    className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full"
                                >
                                    {displayItem(
                                        priority,
                                        `Priority ${
                                            index + 1
                                        }`
                                    )}
                                </span>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="UX priorities unavailable." />
                )}
            </SectionCard>

        </div>
    );
}

/* =========================================================
   ENGINEERING
========================================================= */

function EngineeringSection({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const engineering = getObject(
        safeBlueprint,
        [
            "developer",
            "development",
            "engineering",
            "implementation",
        ]
    );

    const finalArchitecture = getObject(
        safeBlueprint,
        [
            "architecture",
            "technicalDesign",
            "technicalArchitecture",
        ]
    );

    const architectData = getObject(
        safeBlueprint,
        ["architect"]
    );

    const architecture =
        Object.keys(finalArchitecture).length > 0
            ? finalArchitecture
            : architectData;

    const projectStructure = getArray(
        engineering,
        [
            "projectStructure",
            "structure",
            "files",
        ]
    );

    const dependencies =
        engineering?.dependencies ||
        safeBlueprint?.dependencies;

    const implementationSteps = getArray(
        engineering,
        [
            "implementationSteps",
            "steps",
            "developmentSteps",
        ]
    );

    return (
        <div className="space-y-6">

            <SectionCard
                title="Architecture"
                icon="🏗️"
            >
                {Object.keys(architecture).length > 0 ? (
                    <div className="space-y-4">
                        {Object.entries(
                            architecture
                        ).map(
                            (
                                [key, value]
                            ) => (
                                <div
                                    key={key}
                                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                                >
                                    <h3 className="font-bold capitalize">
                                        {key.replace(
                                            /([A-Z])/g,
                                            " $1"
                                        )}
                                    </h3>

                                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                                        {displayValue(
                                            value
                                        )}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Architecture data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Project Structure"
                icon="📁"
            >
                {projectStructure.length > 0 ? (
                    <div>
                        {projectStructure.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="border-b last:border-0 py-4"
                                >
                                    <h3 className="font-bold">
                                        {displayItem(
                                            item,
                                            `Component ${
                                                index + 1
                                            }`
                                        )}
                                    </h3>

                                    {isObject(item) &&
                                        item?.description && (
                                            <p className="text-gray-600 mt-1">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Project structure unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Dependencies"
                icon="📦"
            >
                {isObject(dependencies) ? (
                    <div className="space-y-5">
                        {Object.entries(
                            dependencies
                        ).map(
                            (
                                [
                                    category,
                                    dependencyList,
                                ]
                            ) => (
                                <div key={category}>
                                    <h3 className="font-bold text-lg capitalize mb-3">
                                        {category}
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(
                                            dependencyList
                                        ) ? (
                                            dependencyList.map(
                                                (
                                                    dependency: any,
                                                    index: number
                                                ) => (
                                                    <span
                                                        key={
                                                            index
                                                        }
                                                        className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm"
                                                    >
                                                        {displayItem(
                                                            dependency,
                                                            `Dependency ${
                                                                index +
                                                                1
                                                            }`
                                                        )}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-gray-600">
                                                {displayValue(
                                                    dependencyList
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Dependency data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Implementation Steps"
                icon="⚙️"
            >
                {implementationSteps.length > 0 ? (
                    <div>
                        {implementationSteps.map(
                            (
                                item: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-4 py-4 border-b last:border-0"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            {isObject(item)
                                                ? item?.step ||
                                                  item?.title ||
                                                  item?.name ||
                                                  `Step ${
                                                      index + 1
                                                  }`
                                                : `Step ${
                                                    index + 1
                                                  }`}
                                        </h3>

                                        <p className="text-gray-600 mt-1">
                                            {isObject(item)
                                                ? item?.description ||
                                                  displayValue(item)
                                                : displayValue(item)}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Implementation plan unavailable." />
                )}
            </SectionCard>

        </div>
    );
}

/* =========================================================
   TESTING
========================================================= */

function TestingSection({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const testing = getObject(
        safeBlueprint,
        [
            "testing",
            "qaDelivery",
            "qa",
            "qualityAssurance",
        ]
    );

    const criticalTests = getArray(
        testing,
        [
            "criticalTests",
            "tests",
            "testCases",
        ]
    );

    const risks = getArray(
        testing,
        [
            "risks",
            "criticalRisks",
        ]
    );

    const ready =
        testing?.readyForDeployment ??
        testing?.deploymentReady ??
        testing?.ready ??
        false;

    return (
        <div className="space-y-6">

            <SectionCard
                title="Testing Strategy"
                icon="🧪"
            >
                <p className="text-gray-600 leading-relaxed">
                    {displayValue(
                        testing?.strategy ||
                        testing?.testingStrategy ||
                        testing?.description ||
                        "Testing strategy unavailable."
                    )}
                </p>
            </SectionCard>

            <SectionCard
                title="Critical Tests"
                icon="🔍"
            >
                {criticalTests.length > 0 ? (
                    <div className="space-y-3">
                        {criticalTests.map(
                            (
                                test: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-4"
                                >
                                    <strong>
                                        Test{" "}
                                        {index + 1}
                                    </strong>

                                    <p className="text-gray-600 mt-1">
                                        {displayItem(
                                            test,
                                            `Test ${
                                                index + 1
                                            }`
                                        )}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Critical test data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Risks"
                icon="⚠️"
            >
                {risks.length > 0 ? (
                    <div className="space-y-3">
                        {risks.map(
                            (
                                risk: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="bg-red-50 text-red-800 rounded-xl p-4"
                                >
                                    {displayItem(
                                        risk,
                                        `Risk ${
                                            index + 1
                                        }`
                                    )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Risk data unavailable." />
                )}
            </SectionCard>

            <SectionCard
                title="Deployment Readiness"
                icon="🚀"
            >
                <div
                    className={`rounded-xl p-5 font-semibold ${
                        ready
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                    }`}
                >
                    {ready
                        ? "✓ Ready for deployment"
                        : "⚠ Not ready for deployment"}
                </div>
            </SectionCard>

        </div>
    );
}

/* =========================================================
   DEPLOYMENT
========================================================= */

function DeploymentSection({
    blueprint,
}: BlueprintProps) {
    const deployment = getObject(
        blueprint,
        [
            "deployment",
            "deploy",
            "deploymentPlan",
        ]
    );

    const steps = getArray(
        deployment,
        [
            "steps",
            "deploymentSteps",
            "plan",
        ]
    );

    return (
        <SectionCard
            title="Deployment Plan"
            icon="🚀"
        >

            {deployment?.platform && (
                <div className="bg-blue-50 text-blue-800 rounded-xl p-4 mb-5">
                    <strong>
                        Platform:
                    </strong>{" "}
                    {displayValue(
                        deployment.platform
                    )}
                </div>
            )}

            {steps.length > 0 ? (
                <div>
                    {steps.map(
                        (
                            step: any,
                            index: number
                        ) => (
                            <div
                                key={index}
                                className="flex gap-4 py-5 border-b last:border-0"
                            >
                                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                                    {index + 1}
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        {isObject(step)
                                            ? step?.title ||
                                              step?.name ||
                                              step?.step ||
                                              `Step ${
                                                  index + 1
                                              }`
                                            : `Step ${
                                                index + 1
                                              }`}
                                    </h3>

                                    <p className="text-gray-600 mt-1">
                                        {isObject(step)
                                            ? step?.description ||
                                              displayValue(step)
                                            : displayValue(step)}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <EmptyState text="Deployment plan unavailable." />
            )}

        </SectionCard>
    );
}

/* =========================================================
   ROADMAP
========================================================= */

function RoadmapSection({
    blueprint,
}: BlueprintProps) {
    const safeBlueprint = blueprint || {};

    const roadmap = normalizeRoadmap(
        safeBlueprint
    );

    const phases = normalizePhases(
        safeBlueprint
    );

    const dependencies = getArray(
        roadmap,
        [
            "dependencies",
            "prerequisites",
        ]
    );

    const launchPlan = getArray(
        roadmap,
        [
            "launchPlan",
            "launch",
            "launchSteps",
        ]
    );

    return (
        <div className="space-y-6">

            <SectionCard
                title="Development Roadmap"
                icon="🗺️"
            >
                {phases.length > 0 ? (
                    <div className="space-y-5">
                        {phases.map(
                            (
                                phase: Phase,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                                            {index + 1}
                                        </div>

                                        <h3 className="text-xl font-bold">
                                            {phase?.name ||
                                                phase?.title ||
                                                `Phase ${
                                                    index + 1
                                                }`}
                                        </h3>
                                    </div>

                                    {(phase?.goal ||
                                        phase?.description) && (
                                        <p className="text-gray-600 mt-4 leading-relaxed">
                                            {phase.goal ||
                                                phase.description}
                                        </p>
                                    )}

                                    {Array.isArray(
                                        phase?.tasks
                                    ) &&
                                        phase.tasks.length >
                                            0 && (
                                            <div className="mt-4 space-y-2">
                                                {phase.tasks.map(
                                                    (
                                                        task: any,
                                                        taskIndex: number
                                                    ) => (
                                                        <div
                                                            key={
                                                                taskIndex
                                                            }
                                                            className="bg-gray-50 rounded-lg p-3 text-gray-700"
                                                        >
                                                            <span className="text-green-600 font-bold">
                                                                ✓
                                                            </span>{" "}
                                                            {displayItem(
                                                                task,
                                                                `Task ${
                                                                    taskIndex +
                                                                    1
                                                                }`
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                    {phase?.deliverable && (
                                        <div className="mt-4 bg-blue-50 text-blue-800 rounded-xl p-4">
                                            <strong>
                                                Deliverable:
                                            </strong>{" "}
                                            {
                                                phase.deliverable
                                            }
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <EmptyState text="Roadmap phases were not returned by the AI pipeline." />
                )}
            </SectionCard>

            {dependencies.length > 0 && (
                <SectionCard
                    title="Dependencies"
                    icon="🔗"
                >
                    <div className="space-y-2">
                        {dependencies.map(
                            (
                                dependency: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-xl p-3"
                                >
                                    {displayItem(
                                        dependency,
                                        `Dependency ${
                                            index + 1
                                        }`
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </SectionCard>
            )}

            {launchPlan.length > 0 && (
                <SectionCard
                    title="Launch Plan"
                    icon="🚀"
                >
                    <div className="space-y-2">
                        {launchPlan.map(
                            (
                                step: any,
                                index: number
                            ) => (
                                <div
                                    key={index}
                                    className="flex gap-3 bg-gray-50 rounded-xl p-3"
                                >
                                    <span className="font-bold text-blue-700">
                                        {index + 1}.
                                    </span>

                                    <span>
                                        {displayItem(
                                            step,
                                            `Step ${
                                                index + 1
                                            }`
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </SectionCard>
            )}

        </div>
    );
}

/* =========================================================
   DEBATE
========================================================= */

function DebateSection({
    blueprint,
}: BlueprintProps) {
    const debate = getObject(
        blueprint,
        [
            "debate",
            "architectureDebate",
            "reviewDebate",
        ]
    );

    return (
        <SectionCard
            title="Architecture Debate"
            icon="🗣️"
        >
            {Object.keys(debate).length > 0 ? (
                <div className="space-y-6">

                    {debate.topic && (
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">
                                Debate Topic
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {displayValue(
                                    debate.topic
                                )}
                            </p>
                        </div>
                    )}

                    {debate.architectArgument && (
                        <DebateBox
                            title="🏗️ Architect Argument"
                            text={
                                debate.architectArgument
                            }
                            className="bg-blue-50"
                            titleClass="text-blue-900"
                        />
                    )}

                    {debate.developerArgument && (
                        <DebateBox
                            title="👨‍💻 Developer Argument"
                            text={
                                debate.developerArgument
                            }
                            className="bg-purple-50"
                            titleClass="text-purple-900"
                        />
                    )}

                    {debate.reviewerOpinion && (
                        <DebateBox
                            title="🔍 Reviewer Opinion"
                            text={
                                debate.reviewerOpinion
                            }
                            className="bg-gray-50"
                            titleClass="text-gray-900"
                        />
                    )}

                    {debate.finalDecision && (
                        <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-5">
                            <h3 className="font-bold text-green-900 text-lg">
                                ✅ Final Decision
                            </h3>

                            <p className="text-gray-800 mt-2 font-medium">
                                {displayValue(
                                    debate.finalDecision
                                )}
                            </p>
                        </div>
                    )}

                    {debate.reasoning && (
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">
                                Why?
                            </h3>

                            <p className="text-gray-600 mt-2 leading-relaxed">
                                {displayValue(
                                    debate.reasoning
                                )}
                            </p>
                        </div>
                    )}

                </div>
            ) : (
                <EmptyState text="Debate data unavailable." />
            )}
        </SectionCard>
    );
}

function DebateBox({
    title,
    text,
    className,
    titleClass,
}: {
    title: string;
    text: any;
    className: string;
    titleClass: string;
}) {
    return (
        <div
            className={`${className} rounded-2xl p-5`}
        >
            <h3
                className={`font-bold ${titleClass}`}
            >
                {title}
            </h3>

            <p className="text-gray-700 mt-2 leading-relaxed">
                {displayValue(text)}
            </p>
        </div>
    );
}

/* =========================================================
   REUSABLE CARD
========================================================= */

function SectionCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: string;
    children: ReactNode;
}) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-7">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">
                    {icon}
                </span>

                <h2 className="text-2xl font-bold text-gray-900">
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
    text,
}: {
    text: string;
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-5 text-gray-500 border border-gray-100">
            {text}
        </div>
    );
}

/* =========================================================
   AGENT STATUS
========================================================= */

function AgentCard({
    agent,
    available,
}: {
    agent: AgentDefinition;
    available: boolean;
}) {
    return (
        <div
            className={`
                relative
                border
                rounded-2xl
                p-4
                text-center
                bg-white
                transition
                hover:-translate-y-1
                hover:shadow-md
                ${
                    agent.highlight
                        ? "border-blue-200 ring-1 ring-blue-50"
                        : "border-gray-200"
                }
            `}
        >
            {agent.highlight && (
                <div className="absolute top-2 right-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full block" />
                </div>
            )}

            <div className="text-2xl mb-2">
                {agent.icon}
            </div>

            <div className="font-bold text-gray-900 text-sm">
                {agent.name}
            </div>

            <div className="text-xs text-gray-500 mt-1">
                {agent.role}
            </div>

            <div
                className={`text-[10px] font-semibold mt-3 ${
                    available
                        ? "text-green-600"
                        : "text-yellow-600"
                }`}
            >
                {available
                    ? "✓ OUTPUT READY"
                    : "⚠ OUTPUT MISSING"}
            </div>
        </div>
    );
}

/* =========================================================
   WORKFLOW VISUAL
========================================================= */

function AgentWorkflow({
    blueprint,
}: {
    blueprint: AnyObject;
}) {
    return (
        <div className="mt-7 rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                <div>
                    <h3 className="font-bold text-gray-900">
                        Engineering Workflow
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Idea → strategy → architecture → implementation → validation → delivery
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    {TOTAL_AGENTS} agents orchestrated
                </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

                {AGENTS.map(
                    (
                        agent,
                        index
                    ) => {
                        const available =
                            isObject(
                                blueprint?.[
                                    agent.key
                                ]
                            );

                        return (
                            <div
                                key={agent.key}
                                className="flex items-center gap-2"
                            >

                                <div
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-2
                                        rounded-xl
                                        border
                                        text-xs
                                        font-semibold
                                        ${
                                            available
                                                ? "bg-white border-gray-200 text-gray-700"
                                                : "bg-yellow-50 border-yellow-200 text-yellow-700"
                                        }
                                    `}
                                >
                                    <span>
                                        {agent.icon}
                                    </span>

                                    <span>
                                        {agent.name}
                                    </span>
                                </div>

                                {index <
                                    AGENTS.length -
                                        1 && (
                                    <span className="text-gray-400 font-bold">
                                        →
                                    </span>
                                )}

                            </div>
                        );
                    }
                )}

            </div>

            <div className="mt-5 grid md:grid-cols-4 gap-3">

                <WorkflowStage
                    label="Plan"
                    description="CEO + Product"
                    icon="🧠"
                />

                <WorkflowStage
                    label="Design"
                    description="Architect + UI/UX"
                    icon="🏗️"
                />

                <WorkflowStage
                    label="Build & Review"
                    description="Developer + Review + Debate"
                    icon="🔍"
                    emphasized
                />

                <WorkflowStage
                    label="Validate & Ship"
                    description="Testing + QA"
                    icon="🚀"
                    emphasized
                />

            </div>

        </div>
    );
}

function WorkflowStage({
    label,
    description,
    icon,
    emphasized = false,
}: {
    label: string;
    description: string;
    icon: string;
    emphasized?: boolean;
}) {
    return (
        <div
            className={`
                rounded-xl
                p-4
                border
                ${
                    emphasized
                        ? "bg-white border-blue-200"
                        : "bg-white border-gray-200"
                }
            `}
        >
            <div className="flex items-center gap-2">
                <span>
                    {icon}
                </span>

                <span className="font-bold text-gray-800">
                    {label}
                </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
                {description}
            </p>
        </div>
    );
}

/* =========================================================
   MAIN BLUEPRINT
========================================================= */

function Blueprint({
    blueprint,
}: BlueprintProps) {
    const [activeTab, setActiveTab] =
        useState<string>("overview");

    const location = useLocation();

    const { id } =
        useParams<{ id: string }>();

    const resolvedBlueprint = useMemo(() => {

        /*
         * 1. Explicit prop
         */
        if (isObject(blueprint)) {
            return blueprint;
        }

        /*
         * 2. Router state
         */
        const stateBlueprint =
            (location.state as any)?.blueprint;

        if (isObject(stateBlueprint)) {
            return stateBlueprint;
        }

        /*
         * 3. Saved project
         */
        if (id) {
            const project =
                getProjectById(id);

            const projectBlueprint =
                (project as any)?.blueprint;

            if (isObject(projectBlueprint)) {
                return projectBlueprint;
            }
        }

        return null;
    }, [
        blueprint,
        location.state,
        id,
    ]);

    const normalizedBlueprint =
        useMemo(
            () =>
                isObject(resolvedBlueprint)
                    ? resolvedBlueprint
                    : {},
            [resolvedBlueprint]
        );

    const phases = useMemo(
        () =>
            normalizePhases(
                normalizedBlueprint
            ),
        [normalizedBlueprint]
    );

    /*
     * The BuildOS system is designed around
     * exactly 9 specialized agents.
     *
     * We intentionally keep the displayed
     * system size at 9 even if one agent's
     * output is missing, while showing the
     * individual output status on each card.
     */

    const availableAgentCount =
        useMemo(() => {
            return AGENTS.filter(
                (agent) =>
                    isObject(
                        normalizedBlueprint?.[
                            agent.key
                        ]
                    )
            ).length;
        }, [normalizedBlueprint]);

    const engineering =
        useMemo(
            () =>
                getObject(
                    normalizedBlueprint,
                    [
                        "developer",
                        "development",
                        "engineering",
                        "implementation",
                    ]
                ),
            [normalizedBlueprint]
        );

    const engineeringAreas =
        useMemo(() => {
            let count = 0;

            const architecture =
                getObject(
                    normalizedBlueprint,
                    [
                        "architecture",
                        "technicalDesign",
                        "technicalArchitecture",
                    ]
                );

            if (
                Object.keys(
                    architecture
                ).length > 0
            ) {
                count++;
            }

            if (
                getArray(
                    engineering,
                    [
                        "projectStructure",
                        "structure",
                        "files",
                    ]
                ).length > 0
            ) {
                count++;
            }

            if (
                engineering?.dependencies
            ) {
                count++;
            }

            if (
                getArray(
                    engineering,
                    [
                        "implementationSteps",
                        "steps",
                        "developmentSteps",
                    ]
                ).length > 0
            ) {
                count++;
            }

            if (
                normalizedBlueprint?.testing ||
                normalizedBlueprint?.qaDelivery
            ) {
                count++;
            }

            if (
                normalizedBlueprint?.deployment
            ) {
                count++;
            }

            return count;
        }, [
            normalizedBlueprint,
            engineering,
        ]);

    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: "🤖",
        },
        {
            id: "product",
            label: "Product",
            icon: "📋",
        },
        {
            id: "design",
            label: "Design",
            icon: "🎨",
        },
        {
            id: "engineering",
            label: "Engineering",
            icon: "🏗️",
        },
        {
            id: "testing",
            label: "Testing",
            icon: "🧪",
        },
        {
            id: "deployment",
            label: "Deployment",
            icon: "🚀",
        },
        {
            id: "roadmap",
            label: "Roadmap",
            icon: "🗺️",
        },
        {
            id: "debate",
            label: "Debate",
            icon: "🗣️",
        },
    ];

    if (!resolvedBlueprint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg border border-gray-200">
                    <div className="text-5xl mb-5">
                        🤖
                    </div>

                    <h1 className="text-3xl font-bold text-blue-900">
                        No Blueprint Found
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Generate a project first, or open one from your dashboard.
                    </p>
                </div>
            </div>
        );
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case "product":
                return (
                    <ProductSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "design":
                return (
                    <DesignSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "engineering":
                return (
                    <EngineeringSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "testing":
                return (
                    <TestingSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "deployment":
                return (
                    <DeploymentSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "roadmap":
                return (
                    <RoadmapSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "debate":
                return (
                    <DebateSection
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );

            case "overview":
            default:
                return (
                    <Overview
                        blueprint={
                            normalizedBlueprint
                        }
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}

            <div className="bg-white border-b border-gray-200">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="flex flex-wrap items-center gap-3 mb-3">

                        <span className="text-3xl">
                            🤖
                        </span>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            ✓ Blueprint Generated
                        </span>

                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100">
                            {TOTAL_AGENTS}-Agent Pipeline
                        </span>

                    </div>

                    <h1 className="text-4xl font-bold text-gray-900">
                        Product Blueprint
                    </h1>

                    <p className="text-gray-600 mt-2 text-lg max-w-3xl">
                        Your AI product engineering
                        team transformed your idea
                        into a structured,
                        buildable plan — with
                        architecture, review,
                        debate, testing and
                        delivery decisions.
                    </p>

                </div>
            </div>

            {/* STATS */}

            <div className="max-w-7xl mx-auto px-6 py-6">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <StatCard
                        icon="🤖"
                        value={
                            TOTAL_AGENTS
                        }
                        label="AI Agents"
                        subtitle={
                            availableAgentCount ===
                            TOTAL_AGENTS
                                ? "All outputs ready"
                                : `${availableAgentCount}/${TOTAL_AGENTS} outputs ready`
                        }
                    />

                    <StatCard
                        icon="🗺️"
                        value={
                            phases.length
                        }
                        label="Roadmap Phases"
                        subtitle="Build sequence"
                    />

                    <StatCard
                        icon="🏗️"
                        value={
                            engineeringAreas
                        }
                        label="Engineering Areas"
                        subtitle="Technical coverage"
                    />

                    <StatCard
                        icon="🚀"
                        value="MVP"
                        label="Target"
                        subtitle="Build-ready scope"
                    />

                </div>
            </div>

            {/* TEAM */}

            <div className="max-w-7xl mx-auto px-6 pb-6">

                <SectionCard
                    title="Your AI Product Engineering Team"
                    icon="⚡"
                >

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

                        <div>
                            <p className="text-gray-600">
                                BuildOS orchestrated{" "}
                                <strong className="text-gray-900">
                                    {TOTAL_AGENTS} specialized AI agents
                                </strong>{" "}
                                to transform the idea into a structured engineering plan.
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Each agent owns a different engineering responsibility instead of generating one generic AI response.
                            </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

                            <span className="text-sm font-semibold text-gray-700">
                                {availableAgentCount ===
                                TOTAL_AGENTS
                                    ? "9/9 outputs ready"
                                    : `${availableAgentCount}/9 outputs ready`}
                            </span>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3">

                        {AGENTS.map(
                            (agent) => (
                                <AgentCard
                                    key={
                                        agent.key
                                    }
                                    agent={
                                        agent
                                    }
                                    available={isObject(
                                        normalizedBlueprint?.[
                                            agent.key
                                        ]
                                    )}
                                />
                            )
                        )}

                    </div>

                    <AgentWorkflow
                        blueprint={
                            normalizedBlueprint
                        }
                    />

                    <div className="mt-5 text-center text-xs text-gray-400">
                        BuildOS Orchestrator • 9-agent product engineering pipeline
                    </div>

                </SectionCard>
            </div>

            {/* TABS */}

            <div className="max-w-7xl mx-auto px-6">

                <div className="bg-white rounded-2xl border border-gray-200 p-2 flex gap-2 overflow-x-auto">

                    {tabs.map(
                        (tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                    setActiveTab(
                                        tab.id
                                    )
                                }
                                className={`
                                    whitespace-nowrap
                                    px-4 py-3
                                    rounded-xl
                                    font-medium
                                    transition
                                    flex
                                    items-center
                                    gap-2
                                    ${
                                        activeTab ===
                                        tab.id
                                            ? "bg-blue-700 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }
                                `}
                            >
                                <span>
                                    {tab.icon}
                                </span>

                                <span>
                                    {tab.label}
                                </span>

                                {tab.id ===
                                    "debate" && (
                                    <span
                                        className={`
                                            text-[9px]
                                            px-1.5
                                            py-0.5
                                            rounded-full
                                            font-bold
                                            ${
                                                activeTab ===
                                                tab.id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-blue-50 text-blue-700"
                                            }
                                        `}
                                    >
                                        AI REVIEW
                                    </span>
                                )}

                            </button>
                        )
                    )}

                </div>
            </div>

            {/* CONTENT */}

            <main className="max-w-7xl mx-auto px-6 py-8">
                {renderActiveTab()}
            </main>

        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    icon,
    value,
    label,
    subtitle,
}: {
    icon: string;
    value: string | number;
    label: string;
    subtitle?: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">

            <div className="text-2xl mb-2">
                {icon}
            </div>

            <div className="text-3xl font-bold text-gray-900">
                {value}
            </div>

            <div className="text-sm text-gray-500 mt-1">
                {label}
            </div>

            {subtitle && (
                <div className="text-[11px] text-gray-400 mt-1">
                    {subtitle}
                </div>
            )}

        </div>
    );
}

export default Blueprint;


type BlueprintSectionProps = {
    blueprint: any;
};

function getText(value: any, fallback = ""): string {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    if (typeof value === "object") {
        return (
            value.name ||
            value.title ||
            value.description ||
            value.component ||
            value.step ||
            value.goal ||
            value.technology ||
            JSON.stringify(value)
        );
    }

    return fallback;
}

function getArray(value: any): any[] {
    return Array.isArray(value) ? value : [];
}

function BlueprintSection({
    blueprint,
}: BlueprintSectionProps) {
    /*
    |--------------------------------------------------------------------------
    | NORMALIZE BLUEPRINT DATA
    |--------------------------------------------------------------------------
    |
    | Your backend stores QA/Delivery data inside:
    |
    | blueprint.qaDelivery
    |
    | while older frontend code expected:
    |
    | blueprint.testing
    | blueprint.deployment
    | blueprint.mentor
    | blueprint.roadmap
    |
    | We support BOTH formats here.
    |
    */

    const productManager =
        blueprint?.productManager || {};

    const uiux =
        blueprint?.uiux || {};

    const architect =
        blueprint?.architect || {};

    const developer =
        blueprint?.developer || {};

    const codeReview =
        blueprint?.codeReview || {};

    const qaDelivery =
        blueprint?.qaDelivery || {};

    const testing =
        blueprint?.testing ||
        qaDelivery?.testing ||
        qaDelivery?.qa ||
        {};

    const deployment =
        blueprint?.deployment ||
        qaDelivery?.deployment ||
        {};

    const mentor =
        blueprint?.mentor ||
        qaDelivery?.mentor ||
        {};

    const roadmap =
        blueprint?.roadmap ||
        qaDelivery?.roadmap ||
        {};

    const debate =
        blueprint?.debate ||
        blueprint?.architectureDebate ||
        {};

    /*
    |--------------------------------------------------------------------------
    | ROADMAP NORMALIZATION
    |--------------------------------------------------------------------------
    */

    const roadmapPhases = getArray(
        roadmap?.phases
    );

    const roadmapDependencies = getArray(
        roadmap?.dependencies
    );

    const launchPlan = getArray(
        roadmap?.launchPlan
    );

    /*
    |--------------------------------------------------------------------------
    | DEPLOYMENT NORMALIZATION
    |--------------------------------------------------------------------------
    */

    const deploymentSteps =
        getArray(
            deployment?.steps
        ).length > 0
            ? getArray(
                  deployment?.steps
              )
            : getArray(
                  deployment?.deploymentSteps
              );

    /*
    |--------------------------------------------------------------------------
    | TESTING NORMALIZATION
    |--------------------------------------------------------------------------
    */

    const criticalTests = getArray(
        testing?.criticalTests
    );

    const risks = getArray(
        testing?.risks
    );

    const testCases =
        getArray(
            testing?.testCases
        ).length > 0
            ? getArray(
                  testing?.testCases
              )
            : criticalTests;

    /*
    |--------------------------------------------------------------------------
    | PRODUCT STRATEGY
    |--------------------------------------------------------------------------
    */

    const features = getArray(
        productManager?.features
    );

    /*
    |--------------------------------------------------------------------------
    | UI/UX
    |--------------------------------------------------------------------------
    */

    const screens = getArray(
        uiux?.screens
    );

    /*
    |--------------------------------------------------------------------------
    | ARCHITECTURE
    |--------------------------------------------------------------------------
    */

    const systemComponents = getArray(
        architect?.systemComponents
    );

    const techStack =
        architect?.techStack &&
        typeof architect.techStack ===
            "object"
            ? architect.techStack
            : {};

    /*
    |--------------------------------------------------------------------------
    | DEVELOPER
    |--------------------------------------------------------------------------
    */

    const projectStructure = getArray(
        developer?.projectStructure
    );

    const implementationSteps = getArray(
        developer?.implementationSteps
    );

    /*
    |--------------------------------------------------------------------------
    | CODE REVIEW
    |--------------------------------------------------------------------------
    */

    const issues = getArray(
        codeReview?.issues
    );

    const improvements = getArray(
        codeReview?.improvements
    );

    /*
    |--------------------------------------------------------------------------
    | MENTOR
    |--------------------------------------------------------------------------
    */

    const mentorAdvice =
        getArray(
            mentor?.advice
        ).length > 0
            ? getArray(
                  mentor?.advice
              )
            : getArray(
                  mentor?.learningPoints
              );

    return (
        <div className="mt-10 space-y-8">

            {/* =========================================================
                PRODUCT STRATEGY
            ========================================================= */}

            {Object.keys(productManager).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">
                            📋
                        </div>

                        <div>
                            <p className="text-sm text-blue-600 font-semibold">
                                PRODUCT STRATEGY
                            </p>

                            <h2 className="text-3xl font-bold text-blue-900">
                                Product Manager
                            </h2>
                        </div>
                    </div>

                    {productManager?.problem && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold">
                                Problem
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {getText(
                                    productManager.problem
                                )}
                            </p>
                        </div>
                    )}

                    {productManager?.targetUsers && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold">
                                Target Users
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {Array.isArray(
                                    productManager.targetUsers
                                )
                                    ? productManager.targetUsers
                                          .map(
                                              (
                                                  user: any
                                              ) =>
                                                  getText(
                                                      user
                                                  )
                                          )
                                          .join(
                                              ", "
                                          )
                                    : getText(
                                          productManager.targetUsers
                                      )}
                            </p>
                        </div>
                    )}

                    {features.length > 0 && (
                        <div className="mt-6">

                            <h3 className="text-lg font-bold">
                                Features
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">

                                {features.map(
                                    (
                                        feature: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-blue-50 rounded-xl p-4"
                                        >
                                            <p className="font-semibold">
                                                {getText(
                                                    feature,
                                                    `Feature ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                UI / UX
            ========================================================= */}

            {Object.keys(uiux).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">
                            🎨
                        </div>

                        <div>
                            <p className="text-sm text-purple-600 font-semibold">
                                USER EXPERIENCE
                            </p>

                            <h2 className="text-3xl font-bold text-purple-900">
                                UI / UX Design
                            </h2>
                        </div>
                    </div>

                    {screens.length > 0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Screens
                            </h3>

                            <div className="grid md:grid-cols-2 gap-5 mt-4">

                                {screens.map(
                                    (
                                        screen: any,
                                        index: number
                                    ) => {
                                        const components =
                                            getArray(
                                                screen?.components
                                            );

                                        return (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="border rounded-2xl p-5"
                                            >

                                                <h4 className="font-bold text-lg">
                                                    🖥️{" "}
                                                    {getText(
                                                        screen,
                                                        `Screen ${
                                                            index +
                                                            1
                                                        }`
                                                    )}
                                                </h4>

                                                {screen?.description && (
                                                    <p className="text-gray-600 mt-2">
                                                        {
                                                            screen.description
                                                        }
                                                    </p>
                                                )}

                                                {components.length >
                                                    0 && (
                                                    <ul className="mt-4 space-y-2">
                                                        {components.map(
                                                            (
                                                                component: any,
                                                                i: number
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        i
                                                                    }
                                                                    className="text-gray-600"
                                                                >
                                                                    ✓{" "}
                                                                    {getText(
                                                                        component
                                                                    )}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                ARCHITECTURE
            ========================================================= */}

            {Object.keys(architect).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">
                        <div className="text-4xl">
                            🏗️
                        </div>

                        <div>
                            <p className="text-sm text-green-600 font-semibold">
                                TECHNICAL DESIGN
                            </p>

                            <h2 className="text-3xl font-bold text-green-900">
                                System Architecture
                            </h2>
                        </div>
                    </div>

                    {Object.keys(techStack).length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Technology Stack
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">

                                {Object.entries(
                                    techStack
                                ).map(
                                    (
                                        [
                                            key,
                                            value,
                                        ]: [
                                            string,
                                            any
                                        ]
                                    ) => (
                                        <div
                                            key={
                                                key
                                            }
                                            className="bg-gray-50 rounded-xl p-5"
                                        >

                                            <p className="text-sm text-gray-500 uppercase">
                                                {key.replace(
                                                    /([A-Z])/g,
                                                    " $1"
                                                )}
                                            </p>

                                            <p className="font-semibold text-lg mt-1">
                                                {getText(
                                                    value
                                                )}
                                            </p>

                                            {value &&
                                                typeof value ===
                                                    "object" &&
                                                value.reason && (
                                                    <p className="text-gray-600 mt-2 text-sm">
                                                        {
                                                            value.reason
                                                        }
                                                    </p>
                                                )}

                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {systemComponents.length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                System Components
                            </h3>

                            <div className="space-y-4 mt-4">

                                {systemComponents.map(
                                    (
                                        component: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="border rounded-2xl p-5 bg-gray-50"
                                        >

                                            <h4 className="font-bold text-lg">
                                                ⚙️{" "}
                                                {getText(
                                                    component,
                                                    `Component ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </h4>

                                            {component?.responsibility && (
                                                <p className="text-gray-600 mt-2">
                                                    {
                                                        component.responsibility
                                                    }
                                                </p>
                                            )}

                                            {component?.technology && (
                                                <p className="text-sm text-blue-600 font-semibold mt-3">
                                                    {
                                                        component.technology
                                                    }
                                                </p>
                                            )}

                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                ENGINEERING / DEVELOPER
            ========================================================= */}

            {Object.keys(developer).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            👨‍💻
                        </div>

                        <div>
                            <p className="text-sm text-orange-600 font-semibold">
                                ENGINEERING
                            </p>

                            <h2 className="text-3xl font-bold text-orange-900">
                                Development Plan
                            </h2>
                        </div>

                    </div>

                    {projectStructure.length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Project Structure
                            </h3>

                            <div className="space-y-3 mt-4">

                                {projectStructure.map(
                                    (
                                        item: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-gray-50 rounded-xl p-4"
                                        >

                                            <p className="font-semibold">
                                                📁{" "}
                                                {getText(
                                                    item,
                                                    `Component ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </p>

                                            {item?.description && (
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
                        </div>
                    )}

                    {implementationSteps.length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Implementation Steps
                            </h3>

                            <div className="space-y-4 mt-4">

                                {implementationSteps.map(
                                    (
                                        step: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="border-l-4 border-blue-600 pl-5"
                                        >

                                            <p className="font-bold">
                                                Step{" "}
                                                {step?.step ||
                                                    index +
                                                        1}
                                            </p>

                                            <p className="text-gray-600 mt-1">
                                                {getText(
                                                    step,
                                                    `Implementation step ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                CODE REVIEW
            ========================================================= */}

            {Object.keys(codeReview).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            🔍
                        </div>

                        <h2 className="text-3xl font-bold text-blue-900">
                            Code Review
                        </h2>

                    </div>

                    {issues.length > 0 && (
                        <div className="mt-6">

                            <h3 className="font-bold text-lg">
                                Issues Found
                            </h3>

                            <div className="space-y-3 mt-3">

                                {issues.map(
                                    (
                                        issue: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-red-50 rounded-xl p-4"
                                        >
                                            ⚠️{" "}
                                            {getText(
                                                issue,
                                                `Issue ${
                                                    index +
                                                    1
                                                }`
                                            )}
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {improvements.length >
                        0 && (
                        <div className="mt-6">

                            <h3 className="font-bold text-lg">
                                Improvements
                            </h3>

                            <div className="space-y-3 mt-3">

                                {improvements.map(
                                    (
                                        item: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-green-50 rounded-xl p-4"
                                        >
                                            ✅{" "}
                                            {getText(
                                                item,
                                                `Improvement ${
                                                    index +
                                                    1
                                                }`
                                            )}
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                TESTING
            ========================================================= */}

            {(Object.keys(testing).length >
                0 ||
                criticalTests.length >
                    0 ||
                risks.length >
                    0) && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            🧪
                        </div>

                        <div>
                            <p className="text-sm text-purple-600 font-semibold">
                                QUALITY ASSURANCE
                            </p>

                            <h2 className="text-3xl font-bold text-purple-900">
                                Testing Strategy
                            </h2>
                        </div>

                    </div>

                    {testing?.strategy && (
                        <div className="mt-6">
                            <h3 className="text-xl font-bold">
                                Strategy
                            </h3>

                            <p className="text-gray-600 mt-2 leading-relaxed">
                                {
                                    testing.strategy
                                }
                            </p>
                        </div>
                    )}

                    {testCases.length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Critical Tests
                            </h3>

                            <div className="space-y-4 mt-4">

                                {testCases.map(
                                    (
                                        test: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="border rounded-xl p-5"
                                        >

                                            <h3 className="font-bold">
                                                🧪{" "}
                                                {getText(
                                                    test,
                                                    `Test ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </h3>

                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {risks.length >
                        0 && (
                        <div className="mt-8">

                            <h3 className="text-xl font-bold">
                                Risks
                            </h3>

                            <div className="space-y-3 mt-4">

                                {risks.map(
                                    (
                                        risk: any,
                                        index: number
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-red-50 text-red-800 rounded-xl p-4"
                                        >
                                            ⚠️{" "}
                                            {getText(
                                                risk,
                                                `Risk ${
                                                    index +
                                                    1
                                                }`
                                            )}
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {typeof testing?.readyForDeployment ===
                        "boolean" && (
                        <div
                            className={`mt-8 rounded-xl p-5 font-semibold ${
                                testing.readyForDeployment
                                    ? "bg-green-50 text-green-700"
                                    : "bg-yellow-50 text-yellow-700"
                            }`}
                        >
                            {testing.readyForDeployment
                                ? "✓ Ready for deployment"
                                : "⚠ Not ready for deployment"}
                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                DEPLOYMENT
            ========================================================= */}

            {(Object.keys(deployment).length >
                0 ||
                deploymentSteps.length >
                    0) && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            🚀
                        </div>

                        <div>
                            <p className="text-sm text-blue-600 font-semibold">
                                DELIVERY
                            </p>

                            <h2 className="text-3xl font-bold text-blue-900">
                                Deployment Plan
                            </h2>
                        </div>

                    </div>

                    {deployment?.platform && (
                        <div className="mt-6 bg-blue-50 text-blue-800 rounded-xl p-4">
                            <strong>
                                Platform:
                            </strong>{" "}
                            {
                                deployment.platform
                            }
                        </div>
                    )}

                    {deploymentSteps.length >
                        0 && (
                        <div className="space-y-5 mt-8">

                            {deploymentSteps.map(
                                (
                                    step: any,
                                    index: number
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="flex gap-4 items-start"
                                    >

                                        <div className="bg-blue-100 text-blue-700 rounded-full w-9 h-9 flex items-center justify-center font-bold shrink-0">
                                            {index +
                                                1}
                                        </div>

                                        <div>
                                            <h3 className="font-bold">
                                                {typeof step ===
                                                "string"
                                                    ? `Step ${
                                                          index +
                                                          1
                                                      }`
                                                    : step?.title ||
                                                      step?.name ||
                                                      step?.step ||
                                                      `Step ${
                                                          index +
                                                          1
                                                      }`}
                                            </h3>

                                            <p className="text-gray-600 mt-1">
                                                {getText(
                                                    step
                                                )}
                                            </p>
                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                MENTOR
            ========================================================= */}

            {(Object.keys(mentor).length >
                0 ||
                mentorAdvice.length >
                    0) && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            🎓
                        </div>

                        <div>
                            <p className="text-sm text-blue-600 font-semibold">
                                GUIDANCE
                            </p>

                            <h2 className="text-3xl font-bold text-blue-900">
                                Technical Guidance
                            </h2>
                        </div>

                    </div>

                    {mentor?.explanation && (
                        <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                            {
                                mentor.explanation
                            }
                        </p>
                    )}

                    {mentorAdvice.length >
                        0 && (
                        <ul className="mt-6 space-y-3">

                            {mentorAdvice.map(
                                (
                                    point: any,
                                    index: number
                                ) => (
                                    <li
                                        key={
                                            index
                                        }
                                        className="bg-blue-50 rounded-xl p-4"
                                    >
                                        💡{" "}
                                        {getText(
                                            point,
                                            `Advice ${
                                                index +
                                                1
                                            }`
                                        )}
                                    </li>
                                )
                            )}

                        </ul>
                    )}

                </section>
            )}

            {/* =========================================================
                ROADMAP
            ========================================================= */}

            <section className="bg-white rounded-3xl shadow-lg p-8">

                <div className="flex items-center gap-4">

                    <div className="text-4xl">
                        🗺️
                    </div>

                    <div>
                        <p className="text-sm text-indigo-600 font-semibold">
                            EXECUTION
                        </p>

                        <h2 className="text-3xl font-bold text-indigo-900">
                            Development Roadmap
                        </h2>
                    </div>

                </div>

                {roadmapPhases.length >
                    0 ? (
                    <div className="space-y-5 mt-8">

                        {roadmapPhases.map(
                            (
                                phase: any,
                                index: number
                            ) => {

                                const tasks =
                                    getArray(
                                        phase?.tasks
                                    );

                                return (
                                    <div
                                        key={
                                            index
                                        }
                                        className="border border-gray-200 rounded-2xl p-6"
                                    >

                                        <div className="flex items-center gap-4">

                                            <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold shrink-0">
                                                {index +
                                                    1}
                                            </div>

                                            <h3 className="text-xl font-bold">
                                                {getText(
                                                    phase,
                                                    `Phase ${
                                                        index +
                                                        1
                                                    }`
                                                )}
                                            </h3>

                                        </div>

                                        {phase?.goal && (
                                            <p className="text-gray-600 mt-4">
                                                {
                                                    phase.goal
                                                }
                                            </p>
                                        )}

                                        {tasks.length >
                                            0 && (
                                            <div className="mt-4 space-y-2">

                                                {tasks.map(
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
                                                            {getText(
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
                                );
                            }
                        )}

                    </div>
                ) : (
                    <div className="mt-6 bg-yellow-50 text-yellow-700 rounded-xl p-5">
                        Roadmap data unavailable.
                    </div>
                )}

                {roadmapDependencies.length >
                    0 && (
                    <div className="mt-8">

                        <h3 className="text-xl font-bold">
                            Dependencies
                        </h3>

                        <div className="space-y-2 mt-4">

                            {roadmapDependencies.map(
                                (
                                    dependency: any,
                                    index: number
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="bg-gray-50 rounded-xl p-3"
                                    >
                                        🔗{" "}
                                        {getText(
                                            dependency
                                        )}
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                )}

                {launchPlan.length >
                    0 && (
                    <div className="mt-8">

                        <h3 className="text-xl font-bold">
                            Launch Plan
                        </h3>

                        <div className="space-y-3 mt-4">

                            {launchPlan.map(
                                (
                                    step: any,
                                    index: number
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="flex gap-3 bg-gray-50 rounded-xl p-3"
                                    >
                                        <span className="font-bold text-indigo-700">
                                            {index +
                                                1}
                                            .
                                        </span>

                                        <span>
                                            {getText(
                                                step
                                            )}
                                        </span>
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                )}

            </section>

            {/* =========================================================
                ARCHITECTURE DEBATE
            ========================================================= */}

            {Object.keys(debate).length >
                0 && (
                <section className="bg-white rounded-3xl shadow-lg p-8">

                    <div className="flex items-center gap-4">

                        <div className="text-4xl">
                            🗣️
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-semibold">
                                COLLABORATION
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900">
                                Architecture Debate
                            </h2>
                        </div>

                    </div>

                    {debate?.topic && (
                        <div className="mt-8">
                            <h3 className="font-bold text-lg">
                                Debate Topic
                            </h3>

                            <p className="text-gray-600 mt-2">
                                {
                                    debate.topic
                                }
                            </p>
                        </div>
                    )}

                    {debate?.architectArgument && (
                        <div className="mt-6 bg-blue-50 rounded-2xl p-5">
                            <h3 className="font-bold text-blue-900">
                                🏗️ Architect
                                Argument
                            </h3>

                            <p className="text-gray-700 mt-2">
                                {
                                    debate.architectArgument
                                }
                            </p>
                        </div>
                    )}

                    {debate?.developerArgument && (
                        <div className="mt-6 bg-purple-50 rounded-2xl p-5">
                            <h3 className="font-bold text-purple-900">
                                👨‍💻 Developer
                                Argument
                            </h3>

                            <p className="text-gray-700 mt-2">
                                {
                                    debate.developerArgument
                                }
                            </p>
                        </div>
                    )}

                    {debate?.reviewerOpinion && (
                        <div className="mt-6 bg-gray-50 rounded-2xl p-5">
                            <h3 className="font-bold text-gray-900">
                                🔍 Reviewer
                                Opinion
                            </h3>

                            <p className="text-gray-700 mt-2">
                                {
                                    debate.reviewerOpinion
                                }
                            </p>
                        </div>
                    )}

                    {debate?.finalDecision && (
                        <div className="mt-6 border-2 border-green-200 bg-green-50 rounded-2xl p-5">

                            <h3 className="font-bold text-green-900 text-lg">
                                ✅ Final Decision
                            </h3>

                            <p className="text-gray-800 mt-2 font-medium">
                                {
                                    debate.finalDecision
                                }
                            </p>

                        </div>
                    )}

                    {debate?.reasoning && (
                        <div className="mt-6">

                            <h3 className="font-bold text-lg">
                                Why?
                            </h3>

                            <p className="text-gray-600 mt-2 leading-relaxed">
                                {
                                    debate.reasoning
                                }
                            </p>

                        </div>
                    )}

                </section>
            )}

            {/* =========================================================
                DEBUG
            ========================================================= */}

            <details className="bg-gray-900 text-white rounded-3xl p-6">

                <summary className="cursor-pointer font-semibold">
                    🔧 Developer Debug — View Raw Blueprint JSON
                </summary>

                <pre className="mt-5 overflow-auto text-sm text-green-300 whitespace-pre-wrap">
                    {JSON.stringify(
                        blueprint,
                        null,
                        2
                    )}
                </pre>

            </details>

        </div>
    );
}

export default BlueprintSection;
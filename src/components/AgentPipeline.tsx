import { motion } from "framer-motion";

type Props = {
    currentAgent: string;
    status: Record<string, string>;
};

type Agent = {
    name: string;
    icon: string;
    key: string;
    description: string;
};

function AgentPipeline({ currentAgent, status }: Props) {
    const agents: Agent[] = [
        {
            name: "CEO Agent",
            icon: "👑",
            key: "CEO",
            description: "Defines the product vision and business direction.",
        },
        {
            name: "Product Manager",
            icon: "📋",
            key: "ProductManager",
            description: "Turns the idea into clear MVP requirements.",
        },
        {
            name: "Architect Agent",
            icon: "🏗️",
            key: "Architect",
            description: "Designs the technical architecture and stack.",
        },
        {
            name: "UI/UX Agent",
            icon: "🎨",
            key: "UIUX",
            description: "Designs the user experience and interface structure.",
        },
        {
            name: "Developer Agent",
            icon: "👨‍💻",
            key: "Developer",
            description: "Creates the implementation plan and coding priorities.",
        },
        {
            name: "Code Review Agent",
            icon: "🔍",
            key: "CodeReview",
            description: "Reviews engineering decisions and identifies issues.",
        },
        {
            name: "Debate Agent",
            icon: "🗣️",
            key: "Debate",
            description: "Challenges technical decisions and resolves trade-offs.",
        },
        {
            name: "Testing Agent",
            icon: "🧪",
            key: "Testing",
            description: "Creates the MVP testing and quality strategy.",
        },
        {
            name: "QA & Delivery Agent",
            icon: "🚀",
            key: "QADelivery",
            description: "Validates the product and prepares it for delivery.",
        },
    ];

    const getAgentState = (key: string) => {
        const agentStatus = status?.[key] || "";

        if (
            currentAgent === key ||
            agentStatus.toLowerCase().includes("working")
        ) {
            return "working";
        }

        if (
            agentStatus.toLowerCase().includes("completed") ||
            agentStatus.toLowerCase().includes("complete")
        ) {
            return "completed";
        }

        if (
            agentStatus.toLowerCase().includes("failed") ||
            agentStatus.toLowerCase().includes("error")
        ) {
            return "failed";
        }

        return "waiting";
    };

    const getStatusText = (key: string) => {
        const state = getAgentState(key);

        if (state === "working") return "Working...";
        if (state === "completed") return "Completed";
        if (state === "failed") return "Failed";

        return "Waiting";
    };

    const completedCount = agents.filter(
        (agent) => getAgentState(agent.key) === "completed"
    ).length;

    const workingCount = agents.filter(
        (agent) => getAgentState(agent.key) === "working"
    ).length;

    const progress = Math.round(
        (completedCount / agents.length) * 100
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-gray-100">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-6 mb-8">

                <div>
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Agentic Workflow
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        AI Engineering Team
                    </h2>

                    <p className="text-gray-500 mt-1 max-w-2xl">
                        Nine specialized AI agents collaborate to transform
                        your idea into a structured, buildable product.
                    </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2">

                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">

                        <span
                            className={`w-2 h-2 rounded-full ${
                                workingCount > 0
                                    ? "bg-blue-500 animate-pulse"
                                    : completedCount === agents.length
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                            }`}
                        />

                        <span className="text-sm font-medium text-gray-600">
                            {workingCount > 0
                                ? "Pipeline Active"
                                : completedCount === agents.length
                                ? "Pipeline Complete"
                                : "Pipeline Ready"}
                        </span>

                    </div>

                    <span className="text-xs text-gray-400">
                        {completedCount}/{agents.length} completed
                    </span>

                </div>

            </div>


            {/* PROGRESS */}

            <div className="mb-8">

                <div className="flex items-center justify-between mb-2">

                    <span className="text-sm font-semibold text-gray-700">
                        Engineering Progress
                    </span>

                    <span className="text-sm font-bold text-blue-600">
                        {progress}%
                    </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                        className="h-full bg-blue-500 rounded-full"
                    />

                </div>

            </div>


            {/* PIPELINE */}

            <div className="relative">

                {agents.map((agent, index) => {

                    const state = getAgentState(agent.key);

                    return (
                        <div
                            key={agent.key}
                            className="relative flex items-center"
                        >

                            {/* CONNECTING LINE */}

                            {index !== agents.length - 1 && (
                                <div
                                    className={`absolute left-[27px] top-[64px] w-[2px] h-[52px] ${
                                        state === "completed"
                                            ? "bg-green-300"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}


                            {/* AGENT CARD */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                transition={{
                                    delay: index * 0.05,
                                }}
                                whileHover={{
                                    x: 5,
                                }}
                                className={`
                                    relative
                                    z-10
                                    flex
                                    items-center
                                    gap-4
                                    w-full
                                    p-4
                                    mb-3
                                    rounded-2xl
                                    border
                                    transition-all
                                    duration-300

                                    ${
                                        state === "working"
                                            ? "bg-blue-50 border-blue-400 shadow-md shadow-blue-100"
                                            : state === "completed"
                                            ? "bg-green-50 border-green-200"
                                            : state === "failed"
                                            ? "bg-red-50 border-red-300"
                                            : "bg-gray-50 border-gray-200"
                                    }
                                `}
                            >

                                {/* ICON */}

                                <div
                                    className={`
                                        w-14
                                        h-14
                                        shrink-0
                                        rounded-2xl
                                        flex
                                        items-center
                                        justify-center
                                        text-2xl
                                        transition-all
                                        duration-300

                                        ${
                                            state === "working"
                                                ? "bg-blue-100 scale-105"
                                                : state === "completed"
                                                ? "bg-green-100"
                                                : state === "failed"
                                                ? "bg-red-100"
                                                : "bg-white"
                                        }
                                    `}
                                >
                                    {agent.icon}
                                </div>


                                {/* INFO */}

                                <div className="flex-1 min-w-0">

                                    <div className="flex items-center justify-between gap-4">

                                        <h3 className="font-bold text-gray-900">
                                            {agent.name}
                                        </h3>

                                        <span
                                            className={`
                                                shrink-0
                                                text-xs
                                                font-semibold
                                                px-3
                                                py-1
                                                rounded-full

                                                ${
                                                    state === "working"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : state === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : state === "failed"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-200 text-gray-500"
                                                }
                                            `}
                                        >
                                            {getStatusText(agent.key)}
                                        </span>

                                    </div>


                                    <p className="text-sm text-gray-500 mt-1">
                                        {agent.description}
                                    </p>


                                    {/* STATUS */}

                                    <div className="mt-2 flex items-center gap-2">

                                        {state === "working" && (
                                            <motion.div
                                                className="flex gap-1"
                                                initial={{
                                                    opacity: 0.4,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.8,
                                                    repeatType: "reverse",
                                                }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            </motion.div>
                                        )}

                                        {state === "completed" && (
                                            <span className="text-green-600 text-sm font-bold">
                                                ✓
                                            </span>
                                        )}

                                        {state === "failed" && (
                                            <span className="text-red-600 text-sm font-bold">
                                                ⚠
                                            </span>
                                        )}

                                        <p className="text-xs text-gray-400 truncate">
                                            {status?.[agent.key] ||
                                                "Waiting for previous agent..."}
                                        </p>

                                    </div>

                                </div>

                            </motion.div>

                        </div>
                    );
                })}

            </div>


            {/* FOOTER */}

            <div className="mt-6 pt-6 border-t border-gray-100">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                        <p className="text-sm font-semibold text-gray-700">
                            {completedCount} of {agents.length} agents completed
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            BuildOS orchestrates the entire engineering workflow.
                        </p>

                    </div>

                    <div className="flex items-center gap-2">

                        <span className="text-sm font-semibold text-blue-600">
                            BuildOS Orchestrator
                        </span>

                        <span className="text-lg">
                            ⚡
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AgentPipeline;
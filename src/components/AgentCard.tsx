import { motion } from "framer-motion";

type AgentCardProps = {
    name: string;
    description: string;
    status: string;
    agentKey:
        | "CEO"
        | "ProductManager"
        | "UIUX"
        | "Architect"
        | "Developer"
        | "CodeReview"
        | "Testing"
        | "Deployment"
        | "Mentor"
        | "Roadmap";
};

function AgentCard({
    name,
    description,
    status,
    agentKey,
}: AgentCardProps) {

    const icons = {
        CEO: "👑",
        ProductManager: "📋",
        UIUX: "🎨",
        Architect: "🏗️",
        Developer: "👨‍💻",
        CodeReview: "🔍",
        Testing: "🧪",
        Deployment: "🚀",
        Mentor: "🎓",
        Roadmap: "🗺️",
    };

    const isWorking = status.includes("Working");
    const isCompleted = status.includes("Completed");
    const isFailed =
        status.includes("Failed") ||
        status.includes("Error");

    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                y: -4,
            }}
            animate={
                isWorking
                    ? {
                          boxShadow:
                              "0px 0px 25px rgba(59,130,246,0.25)",
                      }
                    : {}
            }
            transition={{
                duration: 0.2,
            }}
            className={`border rounded-2xl px-6 py-5 shadow-md bg-white transition ${
                isWorking
                    ? "border-blue-400"
                    : isCompleted
                    ? "border-green-200"
                    : isFailed
                    ? "border-red-300"
                    : "border-gray-100"
            }`}
        >

            {/* HEADER */}

            <div className="flex items-center gap-3">

                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                    {icons[agentKey]}
                </div>

                <div>
                    <h2 className="text-xl font-bold">
                        {name}
                    </h2>

                    <p className="text-xs text-gray-400">
                        AI Engineering Agent
                    </p>
                </div>

            </div>


            {/* DESCRIPTION */}

            <p className="text-gray-600 mt-4 leading-relaxed">
                {description}
            </p>


            {/* STATUS */}

            <div className="mt-5 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                    Status
                </span>

                <span
                    className={`px-4 py-1.5 rounded-full font-semibold text-sm ${
                        isWorking
                            ? "bg-yellow-100 text-yellow-700"
                            : isCompleted
                            ? "bg-green-100 text-green-700"
                            : isFailed
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {isWorking && "⚡ "}
                    {isCompleted && "✓ "}
                    {isFailed && "⚠ "}
                    {status || "Waiting"}
                </span>

            </div>

        </motion.div>
    );
}

export default AgentCard;
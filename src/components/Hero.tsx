import { ArrowRight, Sparkles, Brain, Code2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
    const navigate = useNavigate();

    function handleClick() {
        navigate("/create");
    }

    return (
        <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white">

            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute top-32 right-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 text-center">

                {/* AI Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-sm mb-8"
                >
                    <Sparkles size={16} />
                    AI-Powered Product Engineering
                </motion.div>


                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-blue-950 leading-[1.05] max-w-6xl mx-auto"
                >
                    Turn Your Idea Into a{" "}
                    <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Buildable Product
                    </span>
                </motion.h1>


                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8 text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
                >
                    BuildOS brings together a team of AI agents that transforms
                    your software idea into product strategy, UI/UX, architecture,
                    development guidance, testing, and a launch roadmap.
                </motion.p>


                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >

                    <button
                        onClick={handleClick}
                        className="
                            group
                            flex
                            items-center
                            gap-3
                            px-8
                            py-4
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-700
                            to-purple-600
                            text-white
                            text-lg
                            font-bold
                            shadow-xl
                            shadow-blue-200
                            hover:shadow-2xl
                            hover:scale-[1.02]
                            transition-all
                        "
                    >
                        Build My Idea

                        <ArrowRight
                            size={21}
                            className="group-hover:translate-x-1 transition"
                        />
                    </button>


                    <button
                        onClick={() => {
                            document
                                .getElementById("how-it-works")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="
                            px-8
                            py-4
                            rounded-2xl
                            border
                            border-gray-300
                            bg-white
                            text-gray-700
                            text-lg
                            font-semibold
                            hover:bg-gray-50
                            hover:border-gray-400
                            transition
                        "
                    >
                        See How It Works
                    </button>

                </motion.div>


                {/* Agent Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="mt-20 max-w-5xl mx-auto"
                >

                    <div className="
                        rounded-3xl
                        border
                        border-gray-200
                        bg-white/80
                        backdrop-blur-xl
                        shadow-2xl
                        shadow-blue-100
                        p-6
                        md:p-8
                    ">

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Agent 1 */}
                            <Agent
                                icon={<Brain size={22} />}
                                title="Product"
                                description="Strategy"
                            />

                            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-blue-200 to-purple-200" />

                            {/* Agent 2 */}
                            <Agent
                                icon={<Sparkles size={22} />}
                                title="Architect"
                                description="System Design"
                            />

                            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-blue-200 to-purple-200" />

                            {/* Agent 3 */}
                            <Agent
                                icon={<Code2 size={22} />}
                                title="Developer"
                                description="Implementation"
                            />

                            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-blue-200 to-purple-200" />

                            {/* Agent 4 */}
                            <Agent
                                icon={<ShieldCheck size={22} />}
                                title="QA"
                                description="Testing & Launch"
                            />

                        </div>

                    </div>

                </motion.div>


                {/* Bottom Trust Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8 text-sm text-gray-400"
                >
                    One idea → Multiple AI specialists → One complete product blueprint
                </motion.p>

            </div>
        </section>
    );
}


function Agent({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="flex items-center gap-3 min-w-[150px]"
        >

            <div className="
                w-11
                h-11
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-purple-600
                flex
                items-center
                justify-center
                text-white
                shadow-md
            ">
                {icon}
            </div>

            <div className="text-left">
                <p className="font-bold text-blue-950">
                    {title}
                </p>

                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>

        </motion.div>
    );
}

export default Hero;
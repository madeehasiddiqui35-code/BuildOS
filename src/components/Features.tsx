import { motion } from "framer-motion";
import {
    Brain,
    Palette,
    Boxes,
    Code2,
    Search,
    FlaskConical,
    Rocket,
    Map,
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Product Strategy",
        description:
            "Turn your raw idea into clear users, problems, features, and product requirements.",
        tag: "PLAN",
    },
    {
        icon: Palette,
        title: "UI / UX Design",
        description:
            "Define the screens, user experience, and interface structure your product needs.",
        tag: "DESIGN",
    },
    {
        icon: Boxes,
        title: "System Architecture",
        description:
            "Get a technical architecture, technology stack, and system structure tailored to your idea.",
        tag: "ARCHITECT",
    },
    {
        icon: Code2,
        title: "Implementation",
        description:
            "Break the product into realistic engineering tasks that developers can actually follow.",
        tag: "BUILD",
    },
    {
        icon: Search,
        title: "Code Review",
        description:
            "Identify technical risks, security concerns, and improvements before development begins.",
        tag: "REVIEW",
    },
    {
        icon: FlaskConical,
        title: "Testing & QA",
        description:
            "Create a practical testing strategy and identify risks before your product reaches users.",
        tag: "TEST",
    },
    {
        icon: Rocket,
        title: "Deployment",
        description:
            "Plan how your application can move from development to production with a clear launch strategy.",
        tag: "SHIP",
    },
    {
        icon: Map,
        title: "Development Roadmap",
        description:
            "Turn everything into an ordered roadmap with phases, dependencies, milestones, and priorities.",
        tag: "ROADMAP",
    },
];

function Features() {
    return (
        <section
            id="features"
            className="relative py-32 px-6 bg-gray-50 overflow-hidden"
        >

            {/* Background decoration */}
            <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto">

                {/* =========================
                    SECTION HEADER
                ========================== */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >

                    <div className="
                        inline-flex
                        items-center
                        px-4
                        py-2
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-sm
                        font-bold
                        tracking-wide
                    ">
                        8 SPECIALIZED AI AGENTS
                    </div>

                    <h2 className="
                        text-4xl
                        md:text-5xl
                        lg:text-6xl
                        font-bold
                        text-gray-900
                        mt-6
                        leading-tight
                    ">
                        Your entire product team.
                        <span className="block text-blue-700">
                            Powered by AI.
                        </span>
                    </h2>

                    <p className="
                        text-gray-600
                        text-lg
                        md:text-xl
                        mt-6
                        leading-relaxed
                    ">
                        BuildOS brings specialized AI agents together to
                        take your idea from product strategy all the way
                        to testing and launch.
                    </p>

                </motion.div>


                {/* =========================
                    AGENT PIPELINE
                ========================== */}

                <div className="
                    grid
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                    mt-20
                ">

                    {features.map((feature, index) => {

                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{
                                    opacity: 0,
                                    y: 35,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    margin: "-50px",
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.06,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="
                                    group
                                    relative
                                    bg-white
                                    border
                                    border-gray-200
                                    rounded-3xl
                                    p-8
                                    min-h-[300px]
                                    shadow-sm
                                    hover:shadow-2xl
                                    hover:border-blue-200
                                    transition-all
                                    duration-300
                                    overflow-hidden
                                "
                            >

                                {/* Card number */}

                                <div className="
                                    absolute
                                    top-6
                                    right-7
                                    text-sm
                                    font-bold
                                    text-gray-300
                                    group-hover:text-blue-200
                                    transition
                                ">
                                    {String(index + 1).padStart(2, "0")}
                                </div>


                                {/* Glow */}

                                <div className="
                                    absolute
                                    -top-16
                                    -right-16
                                    w-40
                                    h-40
                                    bg-blue-100
                                    rounded-full
                                    blur-3xl
                                    opacity-0
                                    group-hover:opacity-70
                                    transition-opacity
                                " />


                                {/* Icon */}

                                <div className="
                                    relative
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-blue-50
                                    to-purple-50
                                    border
                                    border-blue-100
                                    flex
                                    items-center
                                    justify-center
                                    text-blue-700
                                    group-hover:scale-110
                                    group-hover:rotate-2
                                    transition-all
                                    duration-300
                                ">
                                    <Icon size={27} />
                                </div>


                                {/* Tag */}

                                <p className="
                                    relative
                                    mt-7
                                    text-xs
                                    font-bold
                                    tracking-[0.18em]
                                    text-blue-600
                                ">
                                    {feature.tag}
                                </p>


                                {/* Title */}

                                <h3 className="
                                    relative
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    mt-2
                                ">
                                    {feature.title}
                                </h3>


                                {/* Description */}

                                <p className="
                                    relative
                                    text-gray-600
                                    mt-4
                                    leading-relaxed
                                ">
                                    {feature.description}
                                </p>


                                {/* Hover action */}

                                <div className="
                                    relative
                                    mt-6
                                    text-blue-700
                                    font-semibold
                                    opacity-0
                                    translate-y-2
                                    group-hover:opacity-100
                                    group-hover:translate-y-0
                                    transition-all
                                ">
                                    AI Agent →
                                </div>

                            </motion.div>
                        );
                    })}

                </div>


                {/* =========================
                    BOTTOM MESSAGE
                ========================== */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="
                        mt-20
                        text-center
                    "
                >

                    <p className="
                        text-gray-500
                        text-base
                    ">
                        One idea.
                        <span className="mx-3 text-blue-500">→</span>
                        Eight AI specialists.
                        <span className="mx-3 text-blue-500">→</span>
                        One complete product blueprint.
                    </p>

                </motion.div>

            </div>

        </section>
    );
}

export default Features;
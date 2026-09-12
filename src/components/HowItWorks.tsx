import { motion } from "framer-motion";
import {
    Lightbulb,
    Brain,
    Boxes,
    Code2,
    Rocket,
    ArrowDown,
    ArrowRight,
} from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Lightbulb,
        title: "Describe Your Idea",
        description:
            "Tell BuildOS what you want to build. No technical specification required.",
        label: "INPUT",
    },
    {
        number: "02",
        icon: Brain,
        title: "AI Product Strategy",
        description:
            "The Product Manager turns your idea into users, problems, features, and requirements.",
        label: "ANALYZE",
    },
    {
        number: "03",
        icon: Boxes,
        title: "Architecture & Design",
        description:
            "UI/UX and Architecture agents design the product experience and technical foundation.",
        label: "DESIGN",
    },
    {
        number: "04",
        icon: Code2,
        title: "Engineering Intelligence",
        description:
            "Developer, Review, Debate, and QA agents refine the implementation and identify risks.",
        label: "ENGINEER",
    },
    {
        number: "05",
        icon: Rocket,
        title: "Your Build Blueprint",
        description:
            "Get a complete product plan, roadmap, testing strategy, and deployment guidance.",
        label: "DELIVER",
    },
];

function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative py-32 px-6 bg-white overflow-hidden"
        >

            {/* Background decoration */}

            <div className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-[600px]
                h-[300px]
                bg-blue-100/30
                blur-3xl
                rounded-full
            " />

            <div className="relative max-w-7xl mx-auto">

                {/* =========================
                    HEADER
                ========================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-center max-w-3xl mx-auto"
                >

                    <div className="
                        inline-flex
                        items-center
                        px-4
                        py-2
                        rounded-full
                        bg-purple-100
                        text-purple-700
                        text-sm
                        font-bold
                        tracking-wide
                    ">
                        FROM IDEA TO BLUEPRINT
                    </div>

                    <h2 className="
                        text-4xl
                        md:text-5xl
                        lg:text-6xl
                        font-bold
                        text-blue-950
                        mt-6
                        leading-tight
                    ">
                        How BuildOS
                        <span className="text-purple-600">
                            {" "}thinks with you
                        </span>
                    </h2>

                    <p className="
                        text-lg
                        md:text-xl
                        text-gray-600
                        mt-6
                        leading-relaxed
                    ">
                        Your idea moves through a coordinated team of
                        specialized AI agents — each responsible for a
                        different stage of product engineering.
                    </p>

                </motion.div>


                {/* =========================
                    WORKFLOW
                ========================== */}

                <div className="relative mt-24">

                    {/* Desktop connecting line */}

                    <div className="
                        hidden
                        lg:block
                        absolute
                        top-10
                        left-[10%]
                        right-[10%]
                        h-1
                        rounded-full
                        bg-gradient-to-r
                        from-blue-200
                        via-purple-300
                        to-blue-200
                    " />


                    <div className="
                        grid
                        md:grid-cols-2
                        lg:grid-cols-5
                        gap-8
                    ">

                        {steps.map((step, index) => {

                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.number}
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    className="relative"
                                >

                                    {/* Step Icon */}

                                    <div className="
                                        relative
                                        z-10
                                        flex
                                        justify-center
                                    ">

                                        <motion.div
                                            whileHover={{
                                                scale: 1.08,
                                                y: -4,
                                            }}
                                            className="
                                                w-20
                                                h-20
                                                rounded-2xl
                                                bg-white
                                                border-4
                                                border-blue-100
                                                shadow-xl
                                                flex
                                                items-center
                                                justify-center
                                                text-blue-700
                                                transition
                                            "
                                        >
                                            <Icon size={30} />
                                        </motion.div>

                                    </div>


                                    {/* Mobile arrow */}

                                    {index < steps.length - 1 && (
                                        <div className="
                                            flex
                                            justify-center
                                            my-4
                                            lg:hidden
                                            text-blue-300
                                        ">
                                            <ArrowDown size={22} />
                                        </div>
                                    )}


                                    {/* Card */}

                                    <motion.div
                                        whileHover={{
                                            y: -8,
                                        }}
                                        className="
                                            mt-6
                                            bg-gray-50
                                            border
                                            border-gray-200
                                            rounded-3xl
                                            p-7
                                            min-h-[260px]
                                            shadow-sm
                                            hover:bg-white
                                            hover:border-blue-200
                                            hover:shadow-xl
                                            transition-all
                                            duration-300
                                            text-center
                                        "
                                    >

                                        {/* Label */}

                                        <span className="
                                            inline-flex
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-blue-100
                                            text-blue-700
                                            text-[11px]
                                            font-bold
                                            tracking-[0.15em]
                                        ">
                                            {step.label}
                                        </span>


                                        {/* Number */}

                                        <p className="
                                            mt-5
                                            text-xs
                                            font-bold
                                            tracking-widest
                                            text-gray-400
                                        ">
                                            STEP {step.number}
                                        </p>


                                        {/* Title */}

                                        <h3 className="
                                            text-xl
                                            font-bold
                                            text-gray-900
                                            mt-2
                                        ">
                                            {step.title}
                                        </h3>


                                        {/* Description */}

                                        <p className="
                                            text-gray-600
                                            mt-4
                                            leading-relaxed
                                            text-sm
                                        ">
                                            {step.description}
                                        </p>

                                    </motion.div>


                                    {/* Desktop arrow */}

                                    {index < steps.length - 1 && (
                                        <ArrowRight
                                            className="
                                                hidden
                                                lg:block
                                                absolute
                                                top-8
                                                -right-6
                                                z-20
                                                text-purple-400
                                            "
                                            size={24}
                                        />
                                    )}

                                </motion.div>
                            );
                        })}

                    </div>

                </div>


                {/* =========================
                    FINAL RESULT
                ========================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.97,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="
                        relative
                        mt-24
                        overflow-hidden
                        rounded-[2rem]
                        bg-gradient-to-br
                        from-blue-800
                        via-indigo-700
                        to-purple-700
                        p-10
                        md:p-14
                        text-center
                        text-white
                        shadow-2xl
                    "
                >

                    {/* Decorative glow */}

                    <div className="
                        absolute
                        top-0
                        left-1/2
                        -translate-x-1/2
                        w-96
                        h-40
                        bg-white/10
                        blur-3xl
                        rounded-full
                    " />


                    <div className="relative">

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-full
                            bg-white/10
                            border
                            border-white/20
                            text-blue-100
                            text-sm
                            font-semibold
                        ">
                            <Rocket size={16} />
                            FINAL OUTPUT
                        </div>


                        <h3 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            mt-6
                        ">
                            One idea.
                            <span className="text-blue-200">
                                {" "}An entire AI engineering team.
                            </span>
                        </h3>


                        <p className="
                            max-w-2xl
                            mx-auto
                            mt-5
                            text-blue-100
                            text-lg
                            leading-relaxed
                        ">
                            BuildOS coordinates specialized agents to
                            transform your idea into a structured,
                            development-ready blueprint.
                        </p>


                        {/* Output pills */}

                        <div className="
                            flex
                            flex-wrap
                            justify-center
                            gap-3
                            mt-8
                        ">

                            {[
                                "Product Strategy",
                                "UI / UX",
                                "Architecture",
                                "Engineering",
                                "Testing",
                                "Deployment",
                                "Roadmap",
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="
                                        px-4
                                        py-2
                                        rounded-full
                                        bg-white/10
                                        border
                                        border-white/15
                                        text-sm
                                        text-white
                                    "
                                >
                                    {item}
                                </span>
                            ))}

                        </div>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}

export default HowItWorks;

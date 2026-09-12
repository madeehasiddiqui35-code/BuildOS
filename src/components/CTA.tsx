import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA() {
    const navigate = useNavigate();

    function handleStart() {
        navigate("/create");
    }

    return (
        <section
            id="get-started"
            className="
                relative
                py-32
                px-6
                bg-gray-50
                overflow-hidden
            "
        >

            {/* Background glow */}

            <div className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[600px]
                h-[350px]
                bg-blue-200/30
                blur-3xl
                rounded-full
            " />


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
                    duration: 0.7,
                }}
                className="
                    relative
                    max-w-5xl
                    mx-auto
                    rounded-[2.5rem]
                    overflow-hidden
                    bg-gradient-to-br
                    from-blue-950
                    via-blue-800
                    to-purple-800
                    px-8
                    py-16
                    md:px-16
                    md:py-20
                    text-center
                    text-white
                    shadow-2xl
                "
            >

                {/* Decorative elements */}

                <div className="
                    absolute
                    -top-20
                    -left-20
                    w-60
                    h-60
                    bg-blue-400/20
                    rounded-full
                    blur-3xl
                " />

                <div className="
                    absolute
                    -bottom-20
                    -right-20
                    w-60
                    h-60
                    bg-purple-400/20
                    rounded-full
                    blur-3xl
                " />


                <div className="relative">

                    {/* Badge */}

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
                        <Sparkles size={16} />
                        START BUILDING WITH AI
                    </div>


                    {/* Heading */}

                    <h2 className="
                        text-4xl
                        md:text-5xl
                        lg:text-6xl
                        font-bold
                        mt-7
                        leading-tight
                    ">
                        Have an idea?
                        <span className="
                            block
                            text-blue-200
                        ">
                            Let's turn it into a blueprint.
                        </span>
                    </h2>


                    {/* Description */}

                    <p className="
                        max-w-2xl
                        mx-auto
                        mt-6
                        text-lg
                        md:text-xl
                        text-blue-100
                        leading-relaxed
                    ">
                        Stop staring at a blank screen.
                        Give BuildOS your idea and let an AI
                        product engineering team figure out
                        what to build, how to build it, and
                        what to do next.
                    </p>


                    {/* CTA */}

                    <motion.button
                        onClick={handleStart}
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="
                            group
                            mt-10
                            inline-flex
                            items-center
                            gap-3
                            px-8
                            py-4
                            rounded-2xl
                            bg-white
                            text-blue-900
                            font-bold
                            text-lg
                            shadow-xl
                            hover:shadow-2xl
                            transition
                        "
                    >
                        Build My Idea

                        <ArrowRight
                            size={20}
                            className="
                                group-hover:translate-x-1
                                transition
                            "
                        />
                    </motion.button>


                    {/* Trust indicators */}

                    <div className="
                        flex
                        flex-wrap
                        justify-center
                        gap-6
                        mt-10
                        text-sm
                        text-blue-200
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">
                            <Brain size={16} />
                            AI-powered analysis
                        </div>

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">
                            <Rocket size={16} />
                            Development-ready output
                        </div>

                    </div>

                </div>

            </motion.div>

        </section>
    );
}

export default CTA;
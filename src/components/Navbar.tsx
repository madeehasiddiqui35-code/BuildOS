import { Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="
            sticky
            top-0
            z-50
            w-full
            bg-white/90
            backdrop-blur-xl
            border-b
            border-gray-200/70
        ">

            <div className="
                w-full
                px-8
                lg:px-14
                xl:px-20
                py-5
                flex
                items-center
                justify-between
            ">

                {/* =========================
                    LEFT — BUILDOS
                ========================== */}

                <motion.button
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                        flex
                        items-center
                        gap-3
                        cursor-pointer
                    "
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
                        shadow-md
                    ">
                        <Sparkles
                            className="text-white"
                            size={23}
                        />
                    </div>

                    <div className="text-left">

                        <h2 className="
                            text-2xl
                            font-bold
                            text-blue-950
                            leading-none
                        ">
                            BuildOS
                        </h2>

                        <p className="
                            hidden
                            md:block
                            text-[10px]
                            text-gray-500
                            tracking-[0.18em]
                            mt-1.5
                        ">
                            AI PRODUCT ENGINEERING
                        </p>

                    </div>

                </motion.button>


                {/* =========================
                    RIGHT — NAVIGATION
                ========================== */}

                <div className="
                    flex
                    items-center
                    gap-3
                    md:gap-5
                ">

                    {/* Dashboard */}

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="
                            hidden
                            md:flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            text-gray-600
                            font-medium
                            hover:bg-gray-100
                            hover:text-blue-700
                            transition-all
                        "
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>


                    {/* Sign In */}

                    <button
                        onClick={() => navigate("/login")}
                        className="
                            px-5
                            py-3
                            rounded-xl
                            text-gray-700
                            font-medium
                            hover:bg-gray-100
                            hover:text-blue-700
                            transition-all
                        "
                    >
                        Sign In
                    </button>


                    {/* Get Started */}

                    <motion.button
                        onClick={() => navigate("/create")}
                        whileHover={{
                            scale: 1.04,
                            y: -1,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            px-6
                            py-3
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-700
                            to-purple-600
                            text-white
                            font-semibold
                            shadow-lg
                            shadow-blue-200/60
                            hover:shadow-xl
                            hover:shadow-blue-200
                            transition-all
                        "
                    >
                        Get Started

                        <ArrowRight
                            size={18}
                            className="
                                group-hover:translate-x-1
                                transition-transform
                            "
                        />

                    </motion.button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;

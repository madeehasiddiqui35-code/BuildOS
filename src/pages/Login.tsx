import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSignIn(event: React.FormEvent) {
        event.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            alert("Please enter email and password");
            return;
        }

        console.log("Login successful");
        console.log("Email:", email);

        navigate("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 relative overflow-hidden">

            {/* Background decorations */}
            <div className="
                absolute
                -top-32
                -left-32
                w-96
                h-96
                bg-blue-200
                rounded-full
                blur-3xl
                opacity-40
            " />

            <div className="
                absolute
                -bottom-32
                -right-32
                w-96
                h-96
                bg-purple-200
                rounded-full
                blur-3xl
                opacity-40
            " />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="
                    relative
                    w-full
                    max-w-md
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    border
                    border-gray-100
                    p-8
                "
            >

                {/* Logo */}
                <div className="text-center">

                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="
                            mx-auto
                            w-16
                            h-16
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-700
                            to-purple-600
                            flex
                            items-center
                            justify-center
                            text-3xl
                            shadow-lg
                        "
                    >
                        🚀
                    </motion.div>

                    <h1 className="
                        text-3xl
                        font-bold
                        text-blue-950
                        mt-5
                    ">
                        Welcome back
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Sign in to continue building with BuildOS
                    </p>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSignIn}
                    className="mt-8"
                >

                    {/* Email */}
                    <div>

                        <label className="
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                            mb-2
                        ">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="
                                w-full
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                py-3
                                text-gray-800
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-blue-500
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* Password */}
                    <div className="mt-5">

                        <div className="flex justify-between items-center mb-2">

                            <label className="
                                text-sm
                                font-semibold
                                text-gray-700
                            ">
                                Password
                            </label>

                            <button
                                type="button"
                                className="
                                    text-sm
                                    text-blue-600
                                    hover:text-blue-800
                                    font-medium
                                "
                            >
                                Forgot password?
                            </button>

                        </div>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="
                                w-full
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                py-3
                                text-gray-800
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-blue-500
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* Sign in */}
                    <button
                        type="submit"
                        className="
                            mt-7
                            w-full
                            py-3.5
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-700
                            to-purple-600
                            text-white
                            font-bold
                            shadow-lg
                            hover:shadow-xl
                            hover:scale-[1.02]
                            active:scale-[0.98]
                            transition
                        "
                    >
                        Sign In →
                    </button>

                </form>


                {/* Divider */}
                <div className="flex items-center gap-4 my-7">

                    <div className="flex-1 h-px bg-gray-200" />

                    <span className="text-sm text-gray-400">
                        or
                    </span>

                    <div className="flex-1 h-px bg-gray-200" />

                </div>


                {/* Back to home */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="
                        w-full
                        py-3
                        rounded-xl
                        border
                        border-gray-200
                        text-gray-700
                        font-semibold
                        hover:bg-gray-50
                        transition
                    "
                >
                    ← Back to BuildOS
                </button>


                {/* Footer */}
                <p className="
                    text-center
                    text-sm
                    text-gray-400
                    mt-6
                ">
                    BuildOS · Your AI Product Engineering Team
                </p>

            </motion.div>

        </div>
    );
}

export default Login;
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Code2,
    Copy,
    Download,
    FileCode2,
    ListChecks,
    Loader2,
    RefreshCw,
    Sparkles,
} from "lucide-react";

import {
    getProjectById,
} from "../services/projectStore";

import {
    generateImplementation,
} from "../services/api";

/* =========================================================
   TYPES
========================================================= */

type AnyObject = Record<string, any>;

interface ImplementationFile {
    path?: string;
    language?: string;
    content?: string;
}

interface ImplementationData {
    projectName?: string;
    summary?: string;
    source?: string;
    generatedBy?: string;
    fallbackReason?: string;
    files?: ImplementationFile[];
    nextSteps?: any[];
}

/* =========================================================
   HELPERS
========================================================= */

function isObject(
    value: any
): value is AnyObject {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function normalizeImplementation(
    data: any
): ImplementationData | null {
    if (!data) {
        return null;
    }

    let current = data;

    for (let i = 0; i < 8; i++) {
        if (!current) {
            return null;
        }

        if (
            isObject(
                current.implementation
            )
        ) {
            current =
                current.implementation;

            continue;
        }

        if (
            isObject(
                current.result
            )
        ) {
            current =
                current.result;

            continue;
        }

        if (
            isObject(
                current.data
            )
        ) {
            current =
                current.data;

            continue;
        }

        break;
    }

    if (!isObject(current)) {
        return null;
    }

    return current as ImplementationData;
}

function textValue(
    value: any
): string {
    if (
        typeof value === "string"
    ) {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (isObject(value)) {
        return (
            value.description ||
            value.text ||
            value.name ||
            value.title ||
            value.step ||
            value.path ||
            JSON.stringify(
                value,
                null,
                2
            )
        );
    }

    return String(value);
}

/* =========================================================
   COMPONENT
========================================================= */

function Implementation() {
    const location =
        useLocation();

    const navigate =
        useNavigate();

    const { id } =
        useParams<{
            id: string;
        }>();

    const [
        project,
        setProject,
    ] = useState<any>(null);

    const [
        implementation,
        setImplementation,
    ] =
        useState<ImplementationData | null>(
            null
        );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        regenerating,
        setRegenerating,
    ] = useState(false);

    const [
        copiedFile,
        setCopiedFile,
    ] =
        useState<string | null>(
            null
        );

    const [
        error,
        setError,
    ] = useState("");

    /* =====================================================
       LOAD
    ===================================================== */

    useEffect(() => {
        setLoading(true);

        const state =
            location.state as
                | {
                      implementation?: any;
                      project?: any;
                      blueprint?: any;
                  }
                | null;

        let foundProject =
            state?.project ||
            null;

        let foundImplementation =
            state?.implementation ||
            null;

        if (
            !foundProject &&
            id
        ) {
            foundProject =
                getProjectById(id);
        }

        if (
            !foundImplementation &&
            foundProject?.implementation
        ) {
            foundImplementation =
                foundProject.implementation;
        }

        if (foundProject) {
            setProject(
                foundProject
            );
        } else {
            setProject(null);
        }

        setImplementation(
            normalizeImplementation(
                foundImplementation
            )
        );

        setLoading(false);
    }, [
        id,
        location.state,
    ]);

    /* =====================================================
       BLUEPRINT
    ===================================================== */

    const blueprint =
        useMemo(() => {
            const state =
                location.state as
                    | {
                          blueprint?: any;
                      }
                    | null;

            if (
                state?.blueprint
            ) {
                return state.blueprint;
            }

            return (
                project?.blueprint ||
                null
            );
        }, [
            location.state,
            project,
        ]);

    /* =====================================================
       FILES
    ===================================================== */

    const files =
        useMemo(() => {
            if (!implementation) {
                return [];
            }

            return Array.isArray(
                implementation.files
            )
                ? implementation.files
                : [];
        }, [
            implementation,
        ]);

    /* =====================================================
       NEXT STEPS
    ===================================================== */

    const nextSteps =
        useMemo(() => {
            if (!implementation) {
                return [];
            }

            return Array.isArray(
                implementation.nextSteps
            )
                ? implementation.nextSteps
                : [];
        }, [
            implementation,
        ]);

    /* =====================================================
       PROJECT NAME
    ===================================================== */

    const projectName =
        implementation?.projectName ||
        project?.name ||
        project?.idea ||
        blueprint?.idea ||
        "BuildOS Project";

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary =
        implementation?.summary ||
        "Initial MVP implementation generated by BuildOS.";

    /* =====================================================
       SOURCE
    ===================================================== */

    const isFallback =
        implementation?.source ===
            "fallback" ||
        implementation?.generatedBy
            ?.toLowerCase()
            .includes(
                "fallback"
            );

    /* =====================================================
       COPY FILE
    ===================================================== */

    async function handleCopy(
        file: ImplementationFile
    ) {
        const content =
            file.content || "";

        try {
            await navigator.clipboard.writeText(
                content
            );

            setCopiedFile(
                file.path || "file"
            );

            window.setTimeout(
                () => {
                    setCopiedFile(null);
                },
                1800
            );
        } catch {
            setError(
                "Could not copy this file."
            );
        }
    }

    /* =====================================================
       EXPORT FILES
    ===================================================== */

    function handleDownload() {
        if (files.length === 0) {
            return;
        }

        try {
            files.forEach(
                (
                    file,
                    index
                ) => {
                    const content =
                        file?.content || "";

                    const filePath =
                        file?.path ||
                        `generated-file-${index + 1}.txt`;

                    const blob =
                        new Blob(
                            [content],
                            {
                                type:
                                    "text/plain;charset=utf-8",
                            }
                        );

                    const url =
                        URL.createObjectURL(
                            blob
                        );

                    const link =
                        document.createElement(
                            "a"
                        );

                    link.href = url;

                    link.download =
                        filePath
                            .split("/")
                            .pop() ||
                        `generated-file-${index + 1}.txt`;

                    document.body.appendChild(
                        link
                    );

                    link.click();

                    document.body.removeChild(
                        link
                    );

                    URL.revokeObjectURL(
                        url
                    );
                }
            );
        } catch (downloadError) {
            console.error(
                downloadError
            );

            setError(
                "Could not export the generated files."
            );
        }
    }

    /* =====================================================
       REGENERATE
    ===================================================== */

    async function handleRegenerate() {
        if (
            !blueprint ||
            regenerating
        ) {
            return;
        }

        try {
            setError("");

            setRegenerating(
                true
            );

            const newImplementation =
                await generateImplementation(
                    blueprint
                );

            const normalized =
                normalizeImplementation(
                    newImplementation
                );

            if (!normalized) {
                throw new Error(
                    "The backend returned an invalid implementation."
                );
            }

            setImplementation(
                normalized
            );
        } catch (
            regenerationError
        ) {
            console.error(
                regenerationError
            );

            setError(
                regenerationError instanceof Error
                    ? regenerationError.message
                    : "Implementation regeneration failed."
            );
        } finally {
            setRegenerating(
                false
            );
        }
    }

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2
                        size={42}
                        className="animate-spin text-blue-700 mx-auto"
                    />

                    <p className="text-gray-600 mt-4 font-medium">
                        Loading implementation...
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       NO IMPLEMENTATION
    ===================================================== */

    if (!implementation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg border border-gray-200">

                    <div className="text-5xl mb-5">
                        🛠️
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        No implementation found
                    </h1>

                    <p className="text-gray-600 mt-3">
                        The Implementation Agent has not generated an implementation yet.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            if (id) {
                                navigate(
                                    `/build/${id}`
                                );
                            } else {
                                navigate(
                                    "/dashboard"
                                );
                            }
                        }}
                        className="
                            mt-6
                            bg-blue-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            hover:bg-blue-800
                            transition
                        "
                    >
                        Back to Build
                    </button>

                </div>
            </div>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav
                className="
                    bg-white
                    border-b
                    border-gray-200
                    px-6
                    py-4
                    sticky
                    top-0
                    z-30
                "
            >
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <button
                        type="button"
                        onClick={() => {
                            if (id) {
                                navigate(
                                    `/build/${id}`
                                );
                            } else {
                                navigate(
                                    -1
                                );
                            }
                        }}
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-600
                            hover:text-blue-700
                            transition
                            font-medium
                        "
                    >
                        <ArrowLeft
                            size={18}
                        />

                        Back to Build
                    </button>

                    <div className="flex items-center gap-3">

                        <div
                            className={`
                                flex
                                items-center
                                gap-2
                                font-semibold
                                text-sm
                                px-4
                                py-2
                                rounded-full
                                ${
                                    isFallback
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-green-100 text-green-700"
                                }
                            `}
                        >

                            {isFallback ? (
                                <Sparkles
                                    size={17}
                                />
                            ) : (
                                <CheckCircle2
                                    size={17}
                                />
                            )}

                            {isFallback
                                ? "Fallback Generated"
                                : "AI Generated"}

                        </div>

                    </div>

                </div>
            </nav>

            {/* =================================================
                MAIN
            ================================================= */}

            <main
                className="
                    max-w-7xl
                    mx-auto
                    px-5
                    md:px-6
                    py-10
                "
            >

                {/* =================================================
                    PIPELINE
                ================================================= */}

                <section
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-3xl
                        p-5
                        mb-8
                        shadow-sm
                    "
                >

                    <div className="flex items-center justify-between gap-4 mb-5">

                        <div>

                            <p className="text-xs font-bold tracking-widest text-blue-700">
                                BUILDOS ENGINEERING PIPELINE
                            </p>

                            <h2 className="text-lg font-bold text-gray-900 mt-1">
                                Blueprint → Implementation
                            </h2>

                        </div>

                        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={16} />
                            Final Agent Stage
                        </div>

                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">

                        {[
                            "CEO",
                            "Product",
                            "Architect",
                            "UI/UX",
                            "Developer",
                            "Review",
                            "Debate",
                            "Testing",
                            "QA",
                            "Implementation",
                        ].map(
                            (
                                agent,
                                index
                            ) => {

                                const active =
                                    agent ===
                                    "Implementation";

                                return (
                                    <div
                                        key={
                                            agent
                                        }
                                        className={`
                                            rounded-xl
                                            px-3
                                            py-3
                                            text-center
                                            border
                                            ${
                                                active
                                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                                    : "bg-gray-50 border-gray-200 text-gray-500"
                                            }
                                        `}
                                    >

                                        <div
                                            className={`
                                                text-[10px]
                                                font-bold
                                                ${
                                                    active
                                                        ? "text-blue-700"
                                                        : "text-gray-400"
                                                }
                                            `}
                                        >
                                            {index +
                                                1}
                                        </div>

                                        <div className="text-xs font-semibold mt-1">
                                            {agent}
                                        </div>

                                        {active && (
                                            <CheckCircle2
                                                size={13}
                                                className="mx-auto mt-1"
                                            />
                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                </section>

                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    className="
                        rounded-3xl
                        bg-gradient-to-br
                        from-blue-950
                        via-blue-900
                        to-purple-800
                        text-white
                        p-8
                        md:p-12
                        shadow-2xl
                    "
                >

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

                        <div>

                            <p
                                className="
                                    text-blue-200
                                    text-sm
                                    font-bold
                                    tracking-widest
                                "
                            >
                                BUILDOS
                            </p>

                            <h1
                                className="
                                    text-4xl
                                    md:text-5xl
                                    font-bold
                                    mt-2
                                "
                            >
                                Implementation Ready
                            </h1>

                            <p
                                className="
                                    text-blue-100
                                    text-lg
                                    mt-5
                                    max-w-3xl
                                "
                            >
                                Your AI engineering team transformed the product blueprint into a practical starter implementation.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={
                                    handleRegenerate
                                }
                                disabled={
                                    regenerating
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    bg-white
                                    text-blue-900
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-bold
                                    hover:bg-blue-50
                                    transition
                                    disabled:opacity-60
                                "
                            >

                                {regenerating ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RefreshCw
                                        size={18}
                                    />
                                )}

                                {regenerating
                                    ? "Regenerating..."
                                    : "Regenerate"}

                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDownload
                                }
                                disabled={
                                    files.length ===
                                    0
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    bg-white/10
                                    border
                                    border-white/20
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-bold
                                    hover:bg-white/20
                                    transition
                                    disabled:opacity-50
                                "
                            >
                                <Download
                                    size={18}
                                />

                                Export Files
                            </button>

                        </div>

                    </div>

                    <div
                        className="
                            mt-8
                            bg-white/10
                            border
                            border-white/15
                            rounded-2xl
                            p-5
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-blue-200
                                font-bold
                                tracking-widest
                            "
                        >
                            PROJECT
                        </p>

                        <p
                            className="
                                text-xl
                                font-semibold
                                mt-2
                            "
                        >
                            {projectName}
                        </p>

                    </div>

                </section>

                {/* =================================================
                    FALLBACK
                ================================================= */}

                {isFallback && (
                    <section
                        className="
                            mt-6
                            bg-amber-50
                            border
                            border-amber-200
                            rounded-2xl
                            p-5
                        "
                    >

                        <div className="flex gap-3">

                            <Sparkles
                                className="text-amber-600 shrink-0"
                                size={21}
                            />

                            <div>

                                <h3 className="font-bold text-amber-900">
                                    Starter fallback implementation
                                </h3>

                                <p className="text-amber-800 text-sm mt-1">
                                    The AI implementation response was unavailable, so BuildOS generated a safe starter implementation instead of leaving the project empty.
                                </p>

                                {implementation.fallbackReason && (
                                    <p className="text-amber-700 text-xs mt-2">
                                        {implementation.fallbackReason}
                                    </p>
                                )}

                            </div>

                        </div>

                    </section>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div
                        className="
                            mt-6
                            bg-red-50
                            border
                            border-red-200
                            text-red-700
                            rounded-2xl
                            p-4
                        "
                    >
                        {error}
                    </div>
                )}

                {/* =================================================
                    STATS
                ================================================= */}

                <section
                    className="
                        grid
                        sm:grid-cols-3
                        gap-5
                        mt-8
                    "
                >

                    <StatCard
                        label="Generated Files"
                        value={
                            files.length
                        }
                    />

                    <StatCard
                        label="Next Steps"
                        value={
                            nextSteps.length
                        }
                    />

                    <StatCard
                        label="Implementation"
                        value={
                            isFallback
                                ? "FALLBACK"
                                : "READY"
                        }
                    />

                </section>

                {/* =================================================
                    BLUEPRINT → IMPLEMENTATION
                ================================================= */}

                <section
                    className="
                        mt-8
                        grid
                        md:grid-cols-3
                        gap-4
                    "
                >

                    <FlowCard
                        number="01"
                        title="Blueprint"
                        description="Product strategy, architecture and engineering decisions."
                        completed
                    />

                    <FlowCard
                        number="02"
                        title="Implementation Agent"
                        description="Transforms the validated blueprint into starter source files."
                        completed
                        active
                    />

                    <FlowCard
                        number="03"
                        title="Development"
                        description="Use the generated files as the starting point for the real product."
                    />

                </section>

                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="mt-8">

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-gray-200
                            shadow-sm
                            p-6
                            md:p-8
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                mb-4
                            "
                        >

                            <Code2
                                className="text-blue-700"
                            />

                            <h2 className="text-2xl font-bold">
                                Implementation Summary
                            </h2>

                        </div>

                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {summary}
                        </p>

                    </div>

                </section>

                {/* =================================================
                    GENERATED FILES
                ================================================= */}

                <section className="mt-8">

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-gray-200
                            shadow-sm
                            p-6
                            md:p-8
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                gap-4
                                mb-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <FileCode2
                                    className="text-blue-700"
                                />

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        Generated Files
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {files.length} file
                                        {files.length === 1
                                            ? ""
                                            : "s"} generated from the blueprint
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleDownload
                                }
                                disabled={
                                    files.length ===
                                    0
                                }
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-blue-700
                                    text-white
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    font-semibold
                                    hover:bg-blue-800
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                <Download
                                    size={17}
                                />

                                Export All
                            </button>

                        </div>

                        {files.length ===
                        0 ? (
                            <div
                                className="
                                    bg-gray-50
                                    rounded-2xl
                                    p-8
                                    text-center
                                    text-gray-500
                                "
                            >
                                No files were generated.
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {files.map(
                                    (
                                        file,
                                        index
                                    ) => {

                                        const filePath =
                                            file?.path ||
                                            `generated-file-${index + 1}`;

                                        const language =
                                            file?.language ||
                                            "text";

                                        const content =
                                            file?.content ||
                                            "";

                                        const copied =
                                            copiedFile ===
                                            filePath;

                                        return (
                                            <div
                                                key={`${filePath}-${index}`}
                                                className="
                                                    border
                                                    border-gray-200
                                                    rounded-2xl
                                                    overflow-hidden
                                                    shadow-sm
                                                "
                                            >

                                                <div
                                                    className="
                                                        bg-gray-100
                                                        px-5
                                                        py-3
                                                        flex
                                                        flex-col
                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                        gap-3
                                                    "
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-white
                                                                border
                                                                border-gray-200
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <FileCode2
                                                                size={17}
                                                                className="text-blue-700"
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="font-bold text-gray-900 break-all">
                                                                {filePath}
                                                            </p>

                                                            <p className="text-xs text-gray-500 mt-1 uppercase">
                                                                {language}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCopy(
                                                                file
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            bg-white
                                                            border
                                                            border-gray-200
                                                            px-3
                                                            py-2
                                                            rounded-lg
                                                            text-sm
                                                            font-semibold
                                                            hover:bg-gray-50
                                                            transition
                                                        "
                                                    >

                                                        {copied ? (
                                                            <CheckCircle2
                                                                size={16}
                                                                className="text-green-600"
                                                            />
                                                        ) : (
                                                            <Copy
                                                                size={16}
                                                            />
                                                        )}

                                                        {copied
                                                            ? "Copied"
                                                            : "Copy"}

                                                    </button>

                                                </div>

                                                <pre
                                                    className="
                                                        bg-gray-950
                                                        text-green-400
                                                        p-5
                                                        overflow-x-auto
                                                        text-sm
                                                        leading-6
                                                        whitespace-pre-wrap
                                                        break-words
                                                        max-h-[600px]
                                                        overflow-y-auto
                                                    "
                                                >
                                                    <code>
                                                        {content}
                                                    </code>
                                                </pre>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                </section>

                {/* =================================================
                    NEXT STEPS
                ================================================= */}

                <section className="mt-8">

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-gray-200
                            shadow-sm
                            p-6
                            md:p-8
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                mb-6
                            "
                        >

                            <ListChecks
                                className="text-purple-700"
                            />

                            <h2 className="text-2xl font-bold">
                                Next Steps
                            </h2>

                        </div>

                        {nextSteps.length ===
                        0 ? (
                            <p className="text-gray-500">
                                No additional steps were provided.
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {nextSteps.map(
                                    (
                                        step,
                                        index
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                                                flex
                                                gap-4
                                                items-start
                                                bg-gray-50
                                                rounded-2xl
                                                p-4
                                            "
                                        >

                                            <div
                                                className="
                                                    w-8
                                                    h-8
                                                    rounded-full
                                                    bg-blue-700
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                    shrink-0
                                                "
                                            >
                                                {index +
                                                    1}
                                            </div>

                                            <p className="text-gray-700 pt-1 whitespace-pre-wrap">
                                                {textValue(
                                                    step
                                                )}
                                            </p>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                </section>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <section
                    className="
                        mt-8
                        rounded-3xl
                        bg-gradient-to-r
                        from-blue-700
                        to-purple-700
                        p-8
                        text-white
                        shadow-xl
                    "
                >

                    <div className="flex items-center gap-4">

                        <CheckCircle2
                            size={32}
                        />

                        <div>

                            <h2 className="text-2xl font-bold">
                                Ready for Development
                            </h2>

                            <p className="text-blue-100 mt-1">
                                BuildOS has transformed the product blueprint into a concrete implementation starting point.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                p-6
                shadow-sm
            "
        >

            <p className="text-gray-500 text-sm">
                {label}
            </p>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

        </div>
    );
}

/* =========================================================
   FLOW CARD
========================================================= */

function FlowCard({
    number,
    title,
    description,
    completed = false,
    active = false,
}: {
    number: string;
    title: string;
    description: string;
    completed?: boolean;
    active?: boolean;
}) {
    return (
        <div
            className={`
                rounded-2xl
                border
                p-5
                ${
                    active
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 bg-white"
                }
            `}
        >

            <div className="flex items-center justify-between">

                <span
                    className={`
                        text-xs
                        font-bold
                        ${
                            active
                                ? "text-blue-700"
                                : "text-gray-400"
                        }
                    `}
                >
                    {number}
                </span>

                {completed && (
                    <CheckCircle2
                        size={17}
                        className={
                            active
                                ? "text-blue-700"
                                : "text-green-600"
                        }
                    />
                )}

            </div>

            <h3 className="font-bold text-gray-900 mt-4">
                {title}
            </h3>

            <p className="text-sm text-gray-500 leading-6 mt-2">
                {description}
            </p>

        </div>
    );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default Implementation;
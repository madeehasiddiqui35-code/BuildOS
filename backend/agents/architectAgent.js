import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/* =========================================================
   GROQ CLIENT
========================================================= */

const groq = process.env.GROQ_API_KEY
    ? new Groq({
        apiKey: process.env.GROQ_API_KEY,
    })
    : null;

/* =========================================================
   HELPERS
========================================================= */

function isObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function safeObject(value) {
    return isObject(value) ? value : {};
}

function normalizeString(
    value,
    fallback = ""
) {
    if (
        typeof value === "string" &&
        value.trim()
    ) {
        return value.trim();
    }

    return fallback;
}

function uniqueStrings(values) {
    if (!Array.isArray(values)) {
        return [];
    }

    return [
        ...new Set(
            values
                .filter(
                    (value) =>
                        typeof value === "string"
                )
                .map(
                    (value) =>
                        value.trim()
                )
                .filter(Boolean)
        ),
    ];
}

/* =========================================================
   JSON PARSER
========================================================= */

function parseAIJSON(content) {
    if (!content) {
        throw new Error(
            "Groq returned an empty response."
        );
    }

    let text =
        String(content).trim();

    text = text
        .replace(
            /^```json\s*/i,
            ""
        )
        .replace(
            /^```\s*/i,
            ""
        )
        .replace(
            /\s*```$/i,
            ""
        )
        .trim();

    try {
        return JSON.parse(text);
    } catch {
        // Continue.
    }

    const firstBrace =
        text.indexOf("{");

    const lastBrace =
        text.lastIndexOf("}");

    if (
        firstBrace === -1 ||
        lastBrace === -1 ||
        lastBrace <= firstBrace
    ) {
        throw new Error(
            "Groq did not return a JSON object."
        );
    }

    const possibleJSON =
        text.slice(
            firstBrace,
            lastBrace + 1
        );

    try {
        return JSON.parse(
            possibleJSON
        );
    } catch (error) {
        throw new Error(
            `Groq returned malformed JSON: ${error.message}`
        );
    }
}

/* =========================================================
   FALLBACK ARCHITECTURE
========================================================= */

function createFallbackArchitecture(
    idea,
    productManager
) {
    const pm =
        safeObject(
            productManager
        );

    const features =
        uniqueStrings([
            ...(Array.isArray(
                pm.features
            )
                ? pm.features
                : []),

            ...(Array.isArray(
                pm.coreFeatures
            )
                ? pm.coreFeatures
                : []),

            ...(Array.isArray(
                pm.mvpFeatures
            )
                ? pm.mvpFeatures
                : []),
        ]);

    return {
        architecture: {
            overview:
                `A modular web application architecture for ${idea}, using a React frontend, Node.js and Express backend, and a REST API between the frontend and backend.`,

            pattern:
                "Client-server architecture",

            frontend: {
                technology:
                    "React",

                responsibilities: [
                    "User interface",
                    "User interactions",
                    "Form handling",
                    "API communication",
                    "Application state",
                ],
            },

            backend: {
                technology:
                    "Node.js + Express",

                responsibilities: [
                    "REST API",
                    "Business logic",
                    "Request validation",
                    "Error handling",
                ],
            },

            api: {
                style:
                    "REST",

                communication:
                    "HTTP JSON",
            },

            data: {
                storage:
                    "Persistent database can be added after MVP",

                currentMVP:
                    "Simple in-memory or mock data layer",
            },

            security: [
                "Validate incoming requests",
                "Keep secrets in environment variables",
                "Configure CORS",
            ],

            scalability: [
                "Separate frontend and backend",
                "Keep API routes modular",
                "Use service layers as the application grows",
            ],
        },

        techStack: [
            "React",
            "Node.js",
            "Express",
            "JavaScript",
            "REST API",
        ],

        components: [
            "Frontend application",
            "Express API server",
            "Application routes",
            "Business logic",
            "Data layer",
        ],

        featuresConsidered:
            features.slice(0, 8),

        decisions: [
            "Use a client-server architecture.",
            "Use REST endpoints for frontend/backend communication.",
            "Keep the MVP implementation simple and modular.",
            "Avoid unnecessary infrastructure during the initial build.",
        ],

        risks: [
            "Data persistence will be required for production.",
            "Authentication should be added before production deployment.",
            "API validation should be strengthened as the application grows.",
        ],

        status:
            "fallback",
    };
}

/* =========================================================
   NORMALIZE RESULT
========================================================= */

function normalizeArchitectureResult(
    result,
    idea,
    productManager
) {
    const fallback =
        createFallbackArchitecture(
            idea,
            productManager
        );

    if (!isObject(result)) {
        return fallback;
    }

    return {
        architecture:
            isObject(
                result.architecture
            )
                ? result.architecture
                : fallback.architecture,

        techStack:
            Array.isArray(
                result.techStack
            )
                ? result.techStack
                : fallback.techStack,

        components:
            Array.isArray(
                result.components
            )
                ? result.components
                : fallback.components,

        featuresConsidered:
            Array.isArray(
                result.featuresConsidered
            )
                ? result.featuresConsidered
                : fallback.featuresConsidered,

        decisions:
            Array.isArray(
                result.decisions
            )
                ? result.decisions
                : fallback.decisions,

        risks:
            Array.isArray(
                result.risks
            )
                ? result.risks
                : fallback.risks,

        status:
            normalizeString(
                result.status,
                "ai"
            ),
    };
}

/* =========================================================
   ARCHITECT AGENT
========================================================= */

async function architectAgent({
    idea,
    ceo,
    productManager,
}) {
    console.log(
        "🏗️ Architect Agent started..."
    );

    const safeIdea =
        normalizeString(
            idea,
            "BuildOS project"
        );

    const safeCEO =
        safeObject(ceo);

    const safeProductManager =
        safeObject(
            productManager
        );

    if (!groq) {
        console.warn(
            "⚠️ GROQ_API_KEY missing. Architect using fallback."
        );

        return createFallbackArchitecture(
            safeIdea,
            safeProductManager
        );
    }

    const features =
        uniqueStrings([
            ...(Array.isArray(
                safeProductManager.features
            )
                ? safeProductManager.features
                : []),

            ...(Array.isArray(
                safeProductManager.coreFeatures
            )
                ? safeProductManager.coreFeatures
                : []),

            ...(Array.isArray(
                safeProductManager.mvpFeatures
            )
                ? safeProductManager.mvpFeatures
                : []),
        ]);

    const compactInput = {
        idea: safeIdea,

        ceoSummary:
            normalizeString(
                safeCEO.summary,
                ""
            ).slice(0, 300),

        features:
            features.slice(0, 5),

        mvp:
            Array.isArray(
                safeProductManager.mvpFeatures
            )
                ? safeProductManager
                    .mvpFeatures
                    .slice(0, 5)
                : [],
    };

    const prompt = `
You are the BuildOS Architect Agent.

Create a concise technical architecture.

PRODUCT:
${JSON.stringify(
    compactInput
)}

Return exactly ONE valid JSON object.

Required fields:

{
  "architecture": {
    "overview": "string",
    "pattern": "string",
    "frontend": {
      "technology": "React",
      "responsibilities": ["string"]
    },
    "backend": {
      "technology": "Node.js + Express",
      "responsibilities": ["string"]
    },
    "api": {
      "style": "REST",
      "communication": "HTTP JSON"
    },
    "data": {
      "storage": "string",
      "currentMVP": "string"
    },
    "security": ["string"],
    "scalability": ["string"]
  },
  "techStack": ["string"],
  "components": ["string"],
  "featuresConsidered": ["string"],
  "decisions": ["string"],
  "risks": ["string"]
}

Rules:

- JSON only.
- No markdown.
- No code fences.
- No explanation.
- No extra fields.
- Keep arrays short.
- Frontend must be React.
- Backend must be Node.js + Express.
- API must be REST.
- Do not implement a database.
- Do not implement authentication.
- Do not invent unnecessary technologies.
`;

    let lastError = null;

    for (
        let attempt = 1;
        attempt <= 2;
        attempt++
    ) {
        try {
            console.log(
                `🤖 Architect request attempt ${attempt}...`
            );

            const completion =
                await groq.chat.completions.create({
                    model:
                        "openai/gpt-oss-20b",

                    messages: [
                        {
                            role:
                                "system",

                            content:
                                "Return exactly one valid JSON object and nothing else.",
                        },

                        {
                            role:
                                "user",

                            content:
                                prompt,
                        },
                    ],

                    temperature: 0,

                    max_completion_tokens:
                        attempt === 1
                            ? 1600
                            : 1200,
                });

            const content =
                completion
                    ?.choices?.[0]
                    ?.message
                    ?.content;

            if (!content) {
                throw new Error(
                    "Groq returned no Architect content."
                );
            }

            const parsed =
                parseAIJSON(
                    content
                );

            const result =
                normalizeArchitectureResult(
                    parsed,
                    safeIdea,
                    safeProductManager
                );

            console.log(
                "✅ Architect completed."
            );

            return result;

        } catch (error) {
            lastError = error;

            const status =
                error?.status ||
                error?.response?.status ||
                null;

            const message =
                error?.message ||
                "Unknown Groq Architect error.";

            console.error(
                `❌ Architect attempt ${attempt} failed.`
            );

            console.error(
                "Status:",
                status
            );

            console.error(
                "Message:",
                message
            );

            if (
                status === 429 ||
                /rate limit|tokens per day|TPD|rate_limit/i.test(
                    message
                )
            ) {
                break;
            }
        }
    }

    console.log(
        "🔄 Architect fallback generated."
    );

    return createFallbackArchitecture(
        safeIdea,
        safeProductManager
    );
}

/* =========================================================
   EXPORTS
========================================================= */

export {
    architectAgent,
};

export default architectAgent;

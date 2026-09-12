import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeResult(result) {
    return {
        mvpFeatures:
            Array.isArray(result?.mvpFeatures)
                ? result.mvpFeatures
                : [],

        userStories:
            Array.isArray(result?.userStories)
                ? result.userStories
                : [],

        acceptanceCriteria:
            Array.isArray(result?.acceptanceCriteria)
                ? result.acceptanceCriteria
                : [],
    };
}

async function productManagerAgent(idea, ceo) {
    console.log(
        "📋 Product Manager Agent started..."
    );

    if (!process.env.GROQ_API_KEY) {
        throw new Error(
            "GROQ_API_KEY is missing from environment variables."
        );
    }

    const safeIdea =
        typeof idea === "string"
            ? idea
            : JSON.stringify(idea ?? "");

    const safeCeo =
        ceo !== undefined &&
        ceo !== null
            ? JSON.stringify(ceo)
            : "No CEO analysis available.";

    const prompt = `
You are the Product Manager Agent inside BuildOS.

Your job is to transform the software idea into a SMALL,
realistic MVP product specification.

You MUST return ALL THREE sections:

1. mvpFeatures
2. userStories
3. acceptanceCriteria

Do not omit any section.

SOFTWARE IDEA:
${safeIdea.substring(0, 2000)}

CEO ANALYSIS:
${safeCeo.substring(0, 2500)}

RETURN ONLY JSON.

The response MUST have exactly this structure:

{
  "mvpFeatures": [
    {
      "name": "string",
      "description": "string",
      "priority": "high"
    }
  ],
  "userStories": [
    "string"
  ],
  "acceptanceCriteria": [
    "string"
  ]
}

REQUIREMENTS:

mvpFeatures:
- Return exactly 3 to 5 features.
- Each feature MUST contain:
  - name
  - description
  - priority
- priority MUST be "high", "medium", or "low".
- Keep descriptions short.
- Focus only on essential MVP functionality.

userStories:
- Return exactly 3 to 5 user stories.
- Each must be a simple string.
- Format them naturally, for example:
  "As a user, I want to create an account so that I can save my work."

acceptanceCriteria:
- Return exactly 3 to 6 acceptance criteria.
- Each must be a simple string.
- Make them testable and specific.

IMPORTANT:

- NEVER omit userStories.
- NEVER omit acceptanceCriteria.
- NEVER return only mvpFeatures.
- NEVER add extra top-level properties.
- Do not discuss architecture.
- Do not discuss databases.
- Do not discuss deployment.
- Do not provide code.
- Do not use markdown.
- Do not use code fences.
- Return JSON only.
`;

    const maxRetries = 3;

    for (
        let attempt = 1;
        attempt <= maxRetries;
        attempt++
    ) {
        try {
            console.log(
                `📋 Product Manager AI request ${attempt}/${maxRetries}`
            );

            const completion =
                await groq.chat.completions.create({
                    model: "openai/gpt-oss-20b",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are BuildOS's Product Manager Agent. Always return complete valid JSON containing mvpFeatures, userStories, and acceptanceCriteria.",
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],

                    temperature: 0,

                    max_tokens: 1800,

                    response_format: {
                        type: "json_schema",

                        json_schema: {
                            name:
                                "product_manager_output",

                            strict: true,

                            schema: {
                                type: "object",

                                additionalProperties: false,

                                required: [
                                    "mvpFeatures",
                                    "userStories",
                                    "acceptanceCriteria",
                                ],

                                properties: {
                                    mvpFeatures: {
                                        type: "array",

                                        minItems: 3,

                                        maxItems: 5,

                                        items: {
                                            type: "object",

                                            additionalProperties:
                                                false,

                                            required: [
                                                "name",
                                                "description",
                                                "priority",
                                            ],

                                            properties: {
                                                name: {
                                                    type: "string",
                                                },

                                                description: {
                                                    type: "string",
                                                },

                                                priority: {
                                                    type: "string",

                                                    enum: [
                                                        "high",
                                                        "medium",
                                                        "low",
                                                    ],
                                                },
                                            },
                                        },
                                    },

                                    userStories: {
                                        type: "array",

                                        minItems: 3,

                                        maxItems: 5,

                                        items: {
                                            type: "string",
                                        },
                                    },

                                    acceptanceCriteria: {
                                        type: "array",

                                        minItems: 3,

                                        maxItems: 6,

                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    },
                });

            const content =
                completion
                    ?.choices?.[0]
                    ?.message
                    ?.content;

            console.log(
                "📋 Product Manager response:"
            );

            console.log(content);

            if (!content) {
                throw new Error(
                    "Product Manager returned an empty response."
                );
            }

            let result;

            try {
                result =
                    JSON.parse(content);
            } catch (parseError) {
                console.error(
                    "❌ Product Manager JSON parsing failed."
                );

                console.error(
                    "Raw content:",
                    content
                );

                throw new Error(
                    "Product Manager returned invalid JSON."
                );
            }

            const normalized =
                normalizeResult(result);

            if (
                normalized.mvpFeatures.length <
                3
            ) {
                throw new Error(
                    "Product Manager returned fewer than 3 MVP features."
                );
            }

            if (
                normalized.userStories.length <
                3
            ) {
                throw new Error(
                    "Product Manager returned fewer than 3 user stories."
                );
            }

            if (
                normalized.acceptanceCriteria
                    .length < 3
            ) {
                throw new Error(
                    "Product Manager returned fewer than 3 acceptance criteria."
                );
            }

            console.log(
                "✅ Product Manager Agent completed."
            );

            console.log(
                `   Features: ${normalized.mvpFeatures.length}`
            );

            console.log(
                `   User Stories: ${normalized.userStories.length}`
            );

            console.log(
                `   Acceptance Criteria: ${normalized.acceptanceCriteria.length}`
            );

            return normalized;

        } catch (error) {
            console.error(
                `❌ Product Manager attempt ${attempt} failed`
            );

            console.error(
                error?.message || error
            );

            /*
            |--------------------------------------------------------------------------
            | GROQ RATE LIMIT
            |--------------------------------------------------------------------------
            */

            if (
                error?.status === 429 &&
                attempt < maxRetries
            ) {
                let retryAfter = 2;

                try {
                    const header =
                        error?.headers?.get?.(
                            "retry-after"
                        );

                    if (header) {
                        retryAfter =
                            Number(header);
                    }
                } catch {
                    retryAfter = 2;
                }

                if (
                    !Number.isFinite(
                        retryAfter
                    )
                ) {
                    retryAfter = 2;
                }

                console.log(
                    `⏳ Rate limited. Waiting ${retryAfter}s...`
                );

                await sleep(
                    (retryAfter + 0.5) *
                        1000
                );

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | RETRY INCOMPLETE / INVALID RESPONSE
            |--------------------------------------------------------------------------
            */

            if (
                attempt < maxRetries &&
                (
                    error?.message?.includes(
                        "fewer than"
                    ) ||
                    error?.message?.includes(
                        "invalid JSON"
                    ) ||
                    error?.message?.includes(
                        "empty response"
                    )
                )
            ) {
                console.log(
                    "🔄 Retrying Product Manager..."
                );

                await sleep(1000);

                continue;
            }

            throw error;
        }
    }

    throw new Error(
        "Product Manager Agent failed after retries."
    );
}

export default productManagerAgent;
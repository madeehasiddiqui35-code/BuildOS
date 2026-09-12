import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function extractJSON(text) {
    if (!text) {
        throw new Error(
            "Empty response from UI/UX Agent."
        );
    }

    console.log(
        "\nUI/UX RAW RESPONSE:"
    );

    console.log(text);

    let cleaned = String(text)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // Remove accidental text before JSON
    const start = cleaned.indexOf("{");

    if (start === -1) {
        throw new Error(
            "No JSON object found in UI/UX response."
        );
    }

    cleaned = cleaned.substring(start);

    // Find the matching closing brace instead of
    // blindly relying on lastIndexOf("}")
    let depth = 0;
    let inString = false;
    let escaped = false;
    let end = -1;

    for (let i = 0; i < cleaned.length; i++) {

        const char = cleaned[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (inString) {
            continue;
        }

        if (char === "{") {
            depth++;
        }

        if (char === "}") {
            depth--;

            if (depth === 0) {
                end = i;
                break;
            }
        }
    }

    if (end === -1) {
        console.error(
            "INCOMPLETE UI/UX JSON:"
        );

        console.error(cleaned);

        throw new Error(
            "UI/UX Agent returned incomplete JSON."
        );
    }

    cleaned =
        cleaned.substring(
            0,
            end + 1
        );

    try {

        return JSON.parse(cleaned);

    } catch (error) {

        console.error(
            "INVALID UI/UX JSON:"
        );

        console.error(cleaned);

        throw new Error(
            "UI/UX Agent returned invalid JSON."
        );
    }
}


async function uiuxAgent(idea) {

    console.log(
        "🎨 UI/UX Agent started..."
    );

    const safeIdea =
        typeof idea === "string"
            ? idea
            : JSON.stringify(
                idea ?? ""
            );

    const prompt = `
You are the UI/UX Agent inside BuildOS.

Design a simple MVP user interface for this product.

PRODUCT IDEA:
${safeIdea.substring(0, 2500)}

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "designDirection": "Short description",
  "pages": [
    "Landing",
    "Login",
    "Dashboard"
  ],
  "components": [
    "Header",
    "Form",
    "Card"
  ],
  "userFlow": [
    "Sign up",
    "Log in",
    "Use main feature",
    "Log out"
  ],
  "uxPriorities": [
    "Simplicity",
    "Speed",
    "Clarity"
  ]
}

RULES:

1. Return one JSON object only.

2. designDirection must be a short string.

3. pages must contain 3-6 pages.

4. components must contain 4-8 components.

5. userFlow must contain 4-7 steps.

6. uxPriorities must contain 3-5 priorities.

7. Focus only on the MVP.

8. Do not generate source code.

9. Do not generate markdown.

10. Do not use code fences.

11. Do not explain anything.

12. Do not include any keys outside the requested structure.

Return JSON only.
`;

    try {

        const completion =
            await groq.chat.completions.create({

                model:
                    "openai/gpt-oss-20b",

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a senior UI/UX designer. Return only valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0,

                max_tokens: 700,

                reasoning_effort: "low",

                response_format: {
                    type: "json_schema",

                    json_schema: {

                        name:
                            "buildos_uiux",

                        strict: true,

                        schema: {

                            type: "object",

                            additionalProperties: false,

                            properties: {

                                designDirection: {
                                    type: "string"
                                },

                                pages: {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 6,

                                    items: {
                                        type: "string"
                                    }
                                },

                                components: {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 8,

                                    items: {
                                        type: "string"
                                    }
                                },

                                userFlow: {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 7,

                                    items: {
                                        type: "string"
                                    }
                                },

                                uxPriorities: {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 5,

                                    items: {
                                        type: "string"
                                    }
                                }
                            },

                            required: [
                                "designDirection",
                                "pages",
                                "components",
                                "userFlow",
                                "uxPriorities"
                            ]
                        }
                    }
                }
            });

        const content =
            completion
                ?.choices?.[0]
                ?.message?.content;

        console.log(
            "\n🎨 UI/UX raw response:"
        );

        console.log(content);

        const result =
            extractJSON(content);

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            typeof result.designDirection !==
            "string"
        ) {
            throw new Error(
                "UI/UX designDirection must be a string."
            );
        }

        if (
            !Array.isArray(result.pages)
        ) {
            throw new Error(
                "UI/UX pages must be an array."
            );
        }

        if (
            !Array.isArray(result.components)
        ) {
            throw new Error(
                "UI/UX components must be an array."
            );
        }

        if (
            !Array.isArray(result.userFlow)
        ) {
            throw new Error(
                "UI/UX userFlow must be an array."
            );
        }

        if (
            !Array.isArray(
                result.uxPriorities
            )
        ) {
            throw new Error(
                "UI/UX uxPriorities must be an array."
            );
        }

        console.log(
            "\n📊 UI/UX RESULT"
        );

        console.log(
            "Pages:",
            result.pages.length
        );

        console.log(
            "Components:",
            result.components.length
        );

        console.log(
            "User Flow:",
            result.userFlow.length
        );

        console.log(
            "UX Priorities:",
            result.uxPriorities.length
        );

        console.log(
            "✅ UI/UX Agent completed."
        );

        return result;

    } catch (error) {

        console.error(
            "\n❌ UI/UX Agent failed:"
        );

        console.error(
            "Error name:",
            error?.name
        );

        console.error(
            "Error message:",
            error?.message
        );

        console.error(error);

        throw error;
    }
}

export default uiuxAgent;
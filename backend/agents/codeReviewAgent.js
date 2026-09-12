import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function codeReviewAgent(
    idea,
    productManager,
    architect,
    developer
) {
    console.log("🔍 Code Review Agent started...");

    const context = {
        idea,
        productManager,
        architect,
        developer,
    };

    const safeContext =
        JSON.stringify(context).substring(0, 4500);

    const prompt = `
You are the Code Review Agent inside BuildOS.

Review this MVP:

${safeContext}

Return ONLY ONE JSON OBJECT.

The JSON MUST contain EXACTLY these four fields, in this order:

1. "overallStatus" - one short string
2. "strengths" - array of exactly 2 or 3 short strings
3. "issues" - array of exactly 2 to 4 short strings
4. "recommendations" - array of exactly 2 to 4 short strings

IMPORTANT:
You MUST include "recommendations".
Never omit "recommendations".

Example structure:

{
  "overallStatus": "Needs Refinement",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "issues": [
    "Issue 1",
    "Issue 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Review only:
- correctness
- MVP scope
- reliability
- security
- implementation problems
- unnecessary complexity
- conflicting technologies

Rules:
- Keep every string short.
- Do not explain your reasoning.
- Do not write markdown.
- Do not use code fences.
- Do not add extra fields.
- Do not recommend Kubernetes.
- Do not recommend microservices.
- Do not recommend unnecessary infrastructure.
- Do not recommend authentication unless accounts are required.

Generate the complete JSON object now.
`;

    try {
        const completion =
            await groq.chat.completions.create({
model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a senior software engineer. Return a complete JSON object that strictly follows the requested schema."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                temperature: 0,

                reasoning_effort: "low",

                max_completion_tokens: 900,

                response_format: {
                    type: "json_schema",

                    json_schema: {
                        name: "code_review",

                        strict: true,

                        schema: {
                            type: "object",

                            properties: {
                                overallStatus: {
                                    type: "string"
                                },

                                strengths: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    minItems: 2,
                                    maxItems: 3
                                },

                                issues: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    minItems: 2,
                                    maxItems: 4
                                },

                                recommendations: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    minItems: 2,
                                    maxItems: 4
                                }
                            },

                            required: [
                                "overallStatus",
                                "strengths",
                                "issues",
                                "recommendations"
                            ],

                            additionalProperties: false
                        }
                    }
                }
            });

        const content =
            completion.choices?.[0]?.message?.content;

        console.log(
            "🔍 Code Review raw response:"
        );

        console.log(content);

        if (!content) {
            throw new Error(
                "Code Review Agent returned empty response."
            );
        }

        const result = JSON.parse(content);

        console.log(
            "✅ Code Review Agent completed."
        );

        return result;

    } catch (error) {
        console.error(
            "❌ Code Review Agent failed:"
        );

        console.error(error);

        throw error;
    }

}

export default codeReviewAgent;
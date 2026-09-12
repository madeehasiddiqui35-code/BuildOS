import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function qaDeliveryAgent(
    idea,
    productManager,
    architect,
    developer,
    debate
) {
    console.log("🚀 QA & Delivery Agent started...");

    const context = {
        idea,
        productManager,
        architect,
        developer,
    };

    const safeContext =
        JSON.stringify(context).substring(0, 6500);

    const safeDebate =
        JSON.stringify(debate ?? {}).substring(0, 2200);

    const prompt = `
You are the QA & Delivery Agent inside BuildOS.

Create the FINAL concise QA, deployment, and roadmap plan for the MVP.

PROJECT BLUEPRINT:
${safeContext}

IMPORTANT DEBATE DECISION:
${safeDebate}

The Debate decision is authoritative.

If Debate changes a technology or architecture decision,
the final plan MUST follow that decision.

The output MUST contain ALL FOUR top-level properties:

{
  "testing": {
    "strategy": "...",
    "criticalTests": ["...", "..."],
    "risks": ["...", "..."],
    "readyForDeployment": true
  },
  "deployment": {
    "platform": "...",
    "steps": ["...", "..."]
  },
  "mentor": {
    "advice": ["...", "..."]
  },
  "roadmap": {
    "phases": [],
    "dependencies": [],
    "launchPlan": []
  }
}

NEVER omit "testing".
NEVER return only deployment, mentor, or roadmap.
Return ALL four properties even if some values must be concise.

Focus on:
- critical tests
- important risks
- deployment
- MVP readiness
- implementation roadmap

Rules:
- Keep testing.criticalTests to at most 4 items.
- Keep testing.risks to at most 3 items.
- Keep deployment.steps to at most 4 items.
- Keep mentor.advice to at most 3 items.
- Keep roadmap.phases to at most 4 phases.
- Keep each phase.tasks to at most 4 tasks.
- Keep roadmap.dependencies to at most 4 items.
- Keep roadmap.launchPlan to at most 4 items.
- Do NOT add Kubernetes.
- Do NOT add microservices.
- Do NOT add unnecessary infrastructure.
- Do NOT add authentication unless the MVP requires accounts.
- Keep descriptions concise.
- Do not repeat the entire project blueprint.
- Return ONLY JSON matching the provided schema.

The roadmap must be practical and ordered from MVP implementation to launch.
`;

    try {
        const completion = await groq.chat.completions.create({
model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
    `You are the QA & Delivery Agent inside BuildOS.

You MUST return valid JSON matching the provided schema.

The response MUST contain exactly these four top-level properties:
testing, deployment, mentor, roadmap.

NEVER omit testing.
NEVER omit deployment.
NEVER omit mentor.
NEVER omit roadmap.

Keep every field concise.
Do not invent unrelated technologies.
Follow the project blueprint and authoritative Debate decision.`                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0,
            reasoning_effort: "low",

            // Give enough room for the roadmap,
            // but keep the output deliberately small.
            max_completion_tokens: 1200,

            response_format: {
                type: "json_schema",

                json_schema: {
                    name: "qa_delivery",
                    strict: true,

                    schema: {
                        type: "object",

                        properties: {
                            testing: {
                                type: "object",

                                properties: {
                                    strategy: {
                                        type: "string"
                                    },

                                    criticalTests: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },

                                    risks: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },

                                    readyForDeployment: {
                                        type: "boolean"
                                    }
                                },
                                

                                required: [
                                    "strategy",
                                    "criticalTests",
                                    "risks",
                                    "readyForDeployment"
                                ],

                                additionalProperties: false
                            },

                            deployment: {
                                type: "object",

                                properties: {
                                    platform: {
                                        type: "string"
                                    },

                                    steps: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                },

                                required: [
                                    "platform",
                                    "steps"
                                ],

                                additionalProperties: false
                            },

                            mentor: {
                                type: "object",

                                properties: {
                                    advice: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                },

                                required: [
                                    "advice"
                                ],

                                additionalProperties: false
                            },

                            roadmap: {
                                type: "object",

                                properties: {
                                    phases: {
                                        type: "array",

                                        items: {
                                            type: "object",

                                            properties: {
                                                name: {
                                                    type: "string"
                                                },

                                                goal: {
                                                    type: "string"
                                                },

                                                tasks: {
                                                    type: "array",

                                                    items: {
                                                        type: "string"
                                                    }
                                                },

                                                deliverable: {
                                                    type: "string"
                                                }
                                            },

                                            required: [
                                                "name",
                                                "goal",
                                                "tasks",
                                                "deliverable"
                                            ],

                                            additionalProperties: false
                                        }
                                    },

                                    dependencies: {
                                        type: "array",

                                        items: {
                                            type: "string"
                                        }
                                    },

                                    launchPlan: {
                                        type: "array",

                                        items: {
                                            type: "string"
                                        }
                                    }
                                },

                                required: [
                                    "phases",
                                    "dependencies",
                                    "launchPlan"
                                ],

                                additionalProperties: false
                            }
                        },

                        required: [
                            "testing",
                            "deployment",
                            "mentor",
                            "roadmap"
                        ],

                        additionalProperties: false
                    }
                }
            }
        });

        const content =
            completion.choices?.[0]?.message?.content;

        console.log("🚀 QA & Delivery raw response:");
        console.log(content);

        if (!content) {
            throw new Error(
                "QA & Delivery Agent returned empty response."
            );
        }

       const result = JSON.parse(content);

// Safety validation
const requiredSections = [
    "testing",
    "deployment",
    "mentor",
    "roadmap",
];

for (const section of requiredSections) {
    if (!result[section]) {
        throw new Error(
            `QA & Delivery Agent returned invalid output: missing "${section}"`
        );
    }
}

console.log("✅ QA & Delivery Agent completed.");

return result;
    } catch (error) {
        console.error("❌ QA & Delivery Agent failed:");
        console.error(error);

        throw error;
    }
}

export default qaDeliveryAgent;
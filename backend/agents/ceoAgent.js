import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function ceoAgent(idea) {
    console.log("👑 CEO Agent started...");

    if (!idea || !idea.trim()) {
        throw new Error("Software idea is required.");
    }

    const completion =
        await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "user",
                    content: `
You are the CEO Agent of BuildOS.

Analyze the following software idea:

${idea}

Return ONLY valid JSON.

The JSON must have exactly these top-level fields:

{
  "productName": "string",
  "vision": "string",
  "problem": "string",
  "targetUsers": ["string"],
  "coreFeatures": ["string"],
  "successCriteria": ["string"],

  "architecture": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "apis": ["string"],
    "integrations": ["string"],
    "techStack": ["string"]
  },

  "projectStructure": [
    {
      "path": "string",
      "purpose": "string"
    }
  ],

  "roadmap": {
    "phases": [
      {
        "name": "string",
        "tasks": ["string"]
      }
    ]
  },

  "developer": {
    "implementationSteps": ["string"],
    "codingPriorities": ["string"]
  }
}

Rules:

- productName must be a useful product name.
- vision must describe the product in one concise sentence.
- problem must describe the problem being solved.
- targetUsers must contain useful user types.
- coreFeatures must contain practical MVP features.
- successCriteria must contain measurable or practical success criteria.

Architecture rules:
- frontend must contain the main frontend technologies or architecture components.
- backend must contain the main backend technologies or services.
- database must contain the database or data-storage approach.
- apis must contain important API endpoints or API responsibilities.
- integrations must contain important third-party services or integrations.
- techStack must contain the main technologies used by the MVP.
- Do not invent unnecessary technologies.

Project structure rules:
- projectStructure must contain the important folders and files.
- Each item must contain "path" and "purpose".
- Keep the structure practical for an MVP.

Roadmap rules:
- roadmap.phases must contain logical development phases.
- Each phase must have a name.
- Each phase must contain concrete tasks.
- Keep the roadmap focused on the MVP.

Developer rules:
- implementationSteps must contain concrete development steps.
- codingPriorities must contain the most important implementation priorities.
- Prioritize core functionality, reliability, and the main user experience.

General rules:
- Keep everything concise.
- Do not use markdown.
- Do not include code fences.
- Do not include explanations outside the JSON.
- Every field must contain useful data.
- Arrays must not be empty unless genuinely necessary.
                    `,
                },
            ],

            reasoning_effort: "low",

            max_completion_tokens: 2500,

            response_format: {
                type: "json_object",
            },
        });

    const content =
        completion?.choices?.[0]?.message?.content;

    console.log(
        "👑 CEO RAW RESPONSE:",
        content
    );

    if (!content) {
        throw new Error(
            "CEO Agent returned an empty response."
        );
    }

    try {
        const parsed = JSON.parse(content);

        return parsed;
    } catch (error) {
        console.error(
            "❌ CEO JSON parsing failed:"
        );

        console.error(content);

        throw new Error(
            "CEO Agent returned invalid JSON."
        );
    }
}

export default ceoAgent;
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function debateAgent(idea, architect, developer, codeReview) {
    console.log("🗣️ Debate Agent started...");

    const prompt = `
You are the Debate Agent inside BuildOS.

Compare the Architect, Developer, and Code Review outputs.

PROJECT:
${typeof idea === "string"
    ? idea.substring(0, 1000)
    : JSON.stringify(idea ?? {}).substring(0, 1000)}

ARCHITECT:
${JSON.stringify(architect ?? {}).substring(0, 1800)}

DEVELOPER:
${JSON.stringify(developer ?? {}).substring(0, 1800)}

CODE REVIEW:
${JSON.stringify(codeReview ?? {}).substring(0, 1800)}

Find ONE important engineering disagreement.

Evaluate:
- MVP simplicity
- correctness
- reliability
- implementation effort
- unnecessary complexity

Do not automatically agree with the reviewer.

Choose the simplest technically reliable solution.

Keep every string concise.
Each string must be 1-2 sentences.
`;

    try {
        const completion = await groq.chat.completions.create({
model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a senior software architect making concise engineering decisions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0,
            reasoning_effort: "low",
            max_completion_tokens: 500,

            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "debate_result",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            topic: {
                                type: "string"
                            },
                            architectArgument: {
                                type: "string"
                            },
                            developerArgument: {
                                type: "string"
                            },
                            reviewerOpinion: {
                                type: "string"
                            },
                            finalDecision: {
                                type: "string"
                            },
                            reasoning: {
                                type: "string"
                            }
                        },
                        required: [
                            "topic",
                            "architectArgument",
                            "developerArgument",
                            "reviewerOpinion",
                            "finalDecision",
                            "reasoning"
                        ],
                        additionalProperties: false
                    }
                }
            }
        });

        const content =
            completion.choices?.[0]?.message?.content;

        console.log("🗣️ Debate raw response:");
        console.log(content);

        if (!content) {
            throw new Error("Debate Agent returned empty response.");
        }

        const result = JSON.parse(content);

        console.log("✅ Debate Agent completed.");

        return result;

    } catch (error) {
        console.error("❌ Debate Agent failed:");
        console.error(error);

        throw error;
    }
}

export default debateAgent;
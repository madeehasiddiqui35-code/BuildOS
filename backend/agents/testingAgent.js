import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function testingAgent(idea, developer, architecture) {

    const developerContext = JSON.stringify(developer).slice(0, 3000);
    const architectureContext = JSON.stringify(architecture).slice(0, 2000);

    const prompt = `
You are the Testing Agent inside BuildOS.

Create a simple MVP testing plan based ONLY on the provided product, architecture, and development plan.

PRODUCT:
${idea}

ARCHITECTURE:
${architectureContext}

DEVELOPMENT:
${developerContext}

You MUST return exactly ONE JSON object.

REQUIRED JSON:

{
  "testingStrategy": "Short testing strategy",
  "testCases": [
    {
      "feature": "Feature name",
      "test": "Short test description",
      "priority": "High"
    }
  ],
  "qualityChecks": [
    "Quality check"
  ],
  "risks": [
    "Risk"
  ]
}

MANDATORY REQUIREMENTS:

1. testingStrategy MUST exist and MUST be a string.

2. testCases MUST exist and MUST contain EXACTLY 4 objects.

3. Every testCases object MUST contain:
   - feature
   - test
   - priority

4. priority MUST be exactly one of:
   - High
   - Medium
   - Low

5. qualityChecks MUST exist and MUST contain EXACTLY 3 strings.

6. risks MUST exist and MUST contain EXACTLY 2 strings.

7. Do NOT add any other properties.

8. Do NOT omit any required property.

9. Do NOT use markdown.

10. Do NOT write explanations.

11. Return ONLY JSON.

Before responding, verify that these four properties exist:

testingStrategy
testCases
qualityChecks
risks

Also verify:
- 4 test cases
- 3 quality checks
- 2 risks

Return ONLY the JSON object.
`;

    console.log(
        "🧪 Testing prompt size:",
        prompt.length,
        "characters"
    );

    try {

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a strict JSON generator. Return one complete JSON object containing every required property. Never omit fields.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

model: "openai/gpt-oss-20b",
            temperature: 0,

            max_tokens: 1500,

            response_format: {
                type: "json_object",
            },
        });

        const content =
            completion.choices?.[0]?.message?.content;

        console.log("\n🧪 RAW TESTING RESPONSE:");
        console.log(content);

        if (!content) {
            throw new Error(
                "Testing Agent returned an empty response."
            );
        }

        let result;

        try {
            result = JSON.parse(content);
        } catch (error) {

            console.error(
                "\n❌ TESTING JSON PARSE FAILED"
            );

            console.error(error.message);
            console.error("\nRAW RESPONSE:");
            console.error(content);

            throw new Error(
                "Testing Agent returned invalid JSON."
            );
        }

        /*
         * Validate required fields
         */

        if (
            typeof result.testingStrategy !== "string"
        ) {
            throw new Error(
                "testingStrategy must be a string."
            );
        }

        if (!Array.isArray(result.testCases)) {
            throw new Error(
                "testCases must be an array."
            );
        }

        if (!Array.isArray(result.qualityChecks)) {
            throw new Error(
                "qualityChecks must be an array."
            );
        }

        if (!Array.isArray(result.risks)) {
            throw new Error(
                "risks must be an array."
            );
        }

        /*
         * Validate exact counts
         */

        if (result.testCases.length !== 4) {
            throw new Error(
                `Expected 4 test cases, received ${result.testCases.length}.`
            );
        }

        if (result.qualityChecks.length !== 3) {
            throw new Error(
                `Expected 3 quality checks, received ${result.qualityChecks.length}.`
            );
        }

        if (result.risks.length !== 2) {
            throw new Error(
                `Expected 2 risks, received ${result.risks.length}.`
            );
        }

        /*
         * Validate test case structure
         */

        const validPriorities = [
            "High",
            "Medium",
            "Low",
        ];

        result.testCases.forEach((testCase, index) => {

            if (
                typeof testCase !== "object" ||
                testCase === null
            ) {
                throw new Error(
                    `Test case ${index + 1} is invalid.`
                );
            }

            if (
                typeof testCase.feature !== "string"
            ) {
                throw new Error(
                    `Test case ${index + 1} is missing feature.`
                );
            }

            if (
                typeof testCase.test !== "string"
            ) {
                throw new Error(
                    `Test case ${index + 1} is missing test.`
                );
            }

            if (
                !validPriorities.includes(
                    testCase.priority
                )
            ) {
                throw new Error(
                    `Test case ${index + 1} has invalid priority.`
                );
            }
        });

        /*
         * Validate arrays contain strings
         */

        result.qualityChecks.forEach((check, index) => {

            if (typeof check !== "string") {
                throw new Error(
                    `Quality check ${index + 1} must be a string.`
                );
            }

        });

        result.risks.forEach((risk, index) => {

            if (typeof risk !== "string") {
                throw new Error(
                    `Risk ${index + 1} must be a string.`
                );
            }

        });

        console.log(
            "✅ Testing Agent JSON validated"
        );

        return {
            testingStrategy: result.testingStrategy,
            testCases: result.testCases,
            qualityChecks: result.qualityChecks,
            risks: result.risks,
        };

    } catch (error) {

        console.error(
            "\n❌ TESTING AGENT FAILED"
        );

        console.error(error.message);

        throw error;
    }
}

export default testingAgent;
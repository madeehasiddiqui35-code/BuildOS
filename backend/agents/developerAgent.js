import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


// ======================================================
// SAFE JSON PARSER
// ======================================================

function parseJSON(text) {

    if (!text) {
        throw new Error(
            "Developer Agent returned an empty response."
        );
    }

    let cleaned = String(text)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1 ||
        end <= start
    ) {
        console.error("\nDEVELOPER RAW RESPONSE:");
        console.error(text);

        throw new Error(
            "Developer Agent returned incomplete JSON."
        );
    }

    cleaned = cleaned.substring(
        start,
        end + 1
    );

    try {
        return JSON.parse(cleaned);
    } catch (error) {

        console.error(
            "\nINVALID DEVELOPER JSON:"
        );

        console.error(cleaned);

        throw new Error(
            "Developer Agent returned invalid JSON."
        );
    }
}


// ======================================================
// NORMALIZE DEVELOPER OUTPUT
// ======================================================

function normalizeDeveloper(result) {

    // --------------------------------------------------
    // PROJECT STRUCTURE
    // --------------------------------------------------

    let projectStructure =
        Array.isArray(result?.projectStructure)
            ? result.projectStructure
            : [];

    projectStructure =
        projectStructure
            .filter(
                item =>
                    item &&
                    typeof item.component === "string"
            )
            .map(item => ({
                component:
                    item.component,

                description:
                    typeof item.description === "string"
                        ? item.description
                        : "Project component"
            }));


    // If AI returned nothing, create a safe default.
    if (projectStructure.length === 0) {

        projectStructure = [
            {
                component: "frontend",
                description: "React frontend"
            },
            {
                component: "backend",
                description: "Express backend"
            },
            {
                component: "database",
                description: "Application database"
            }
        ];
    }


    projectStructure =
        projectStructure.slice(0, 5);


    // --------------------------------------------------
    // IMPLEMENTATION STEPS
    // --------------------------------------------------

    let implementationSteps =
        Array.isArray(result?.implementationSteps)
            ? result.implementationSteps
            : [];


    implementationSteps =
        implementationSteps
            .filter(
                step =>
                    step &&
                    typeof step.description === "string"
            )
            .slice(0, 6);


    const defaultSteps = [

        "Initialize the project structure and dependencies",

        "Build the backend API and core business logic",

        "Create the database schema and persistence layer",

        "Build the React frontend and main user interface",

        "Connect the frontend to backend APIs",

        "Test the MVP and prepare it for deployment"

    ];


    while (
        implementationSteps.length < 6
    ) {

        const index =
            implementationSteps.length;

        implementationSteps.push({
            step: index + 1,
            description:
                defaultSteps[index]
        });
    }


    implementationSteps =
        implementationSteps
            .slice(0, 6)
            .map(
                (step, index) => ({

                    step:
                        index + 1,

                    description:
                        typeof step.description === "string" &&
                        step.description.trim()
                            ? step.description.trim()
                            : defaultSteps[index]

                })
            );


    // --------------------------------------------------
    // CODING PRIORITIES
    // --------------------------------------------------
    // ADDED: this is required by the Blueprint /
    // Build Workspace display.

    let codingPriorities =
        Array.isArray(result?.codingPriorities)
            ? result.codingPriorities
            : [];

    codingPriorities =
        codingPriorities
            .filter(
                priority =>
                    typeof priority === "string" ||
                    (
                        priority &&
                        typeof priority === "object"
                    )
            )
            .slice(0, 6);


    if (codingPriorities.length === 0) {

        codingPriorities = [
            "Build the core workflow functionality first",
            "Keep the frontend and backend API integration reliable",
            "Validate workflow data before saving or executing it",
            "Keep the MVP structure simple and maintainable",
            "Test the main user flows before adding secondary features"
        ];
    }


    // --------------------------------------------------
    // DEVELOPER NOTES
    // --------------------------------------------------
    // ADDED: this is required by the Blueprint /
    // Build Workspace display.

    const developerNotes =
        typeof result?.developerNotes === "string"
            ? result.developerNotes
            : "Focus on delivering the core MVP workflow before expanding secondary features.";


    // --------------------------------------------------
    // DEPENDENCIES
    // --------------------------------------------------

    const dependencies =
        result?.dependencies &&
        typeof result.dependencies === "object" &&
        !Array.isArray(result.dependencies)
            ? result.dependencies
            : {};


    let frontend =
        Array.isArray(dependencies.frontend)
            ? dependencies.frontend
            : [];

    let backend =
        Array.isArray(dependencies.backend)
            ? dependencies.backend
            : [];

    let database =
        Array.isArray(dependencies.database)
            ? dependencies.database
            : [];


    if (frontend.length === 0) {
        frontend = [
            "React",
            "React Router"
        ];
    }


    if (backend.length === 0) {
        backend = [
            "Node.js",
            "Express"
        ];
    }


    if (database.length === 0) {
        database = [
            "SQLite"
        ];
    }


    const normalizedDependencies = {

        frontend:
            frontend
                .filter(
                    item =>
                        typeof item === "string"
                )
                .slice(0, 4),

        backend:
            backend
                .filter(
                    item =>
                        typeof item === "string"
                )
                .slice(0, 4),

        database:
            database
                .filter(
                    item =>
                        typeof item === "string"
                )
                .slice(0, 4)

    };


    // --------------------------------------------------
    // ENVIRONMENT VARIABLES
    // --------------------------------------------------

    let environmentVariables =
        Array.isArray(
            result?.environmentVariables
        )
            ? result.environmentVariables
            : [];


    environmentVariables =
        environmentVariables
            .filter(
                item =>
                    typeof item === "string"
            )
            .slice(0, 4);


    if (
        environmentVariables.length === 0
    ) {

        environmentVariables = [
            "PORT",
            "GROQ_API_KEY"
        ];
    }


    // --------------------------------------------------
    // FINAL RESULT
    // --------------------------------------------------

    return {

        projectStructure,

        implementationSteps,

        codingPriorities,

        developerNotes,

        dependencies:
            normalizedDependencies,

        environmentVariables

    };
}


// ======================================================
// DEVELOPER AGENT
// ======================================================

async function developerAgent(
    idea,
    productManager,
    uiux,
    architect
) {

    console.log(
        "👨‍💻 Developer Agent started..."
    );


    const safeIdea =
        String(
            idea ?? ""
        ).slice(0, 800);


    const safeProductManager =
        JSON.stringify(
            productManager ?? {}
        ).slice(0, 1800);


    const safeUIUX =
        JSON.stringify(
            uiux ?? {}
        ).slice(0, 1200);


    const safeArchitect =
        JSON.stringify(
            architect ?? {}
        ).slice(0, 1800);


    const prompt = `
You are the Developer Agent inside BuildOS.

Create a concise MVP implementation plan.

PROJECT IDEA:
${safeIdea}

PRODUCT MANAGER:
${safeProductManager}

UI/UX:
${safeUIUX}

ARCHITECT:
${safeArchitect}

Return exactly ONE JSON object.

Required structure:

{
  "projectStructure": [
    {
      "component": "frontend",
      "description": "React frontend"
    }
  ],

  "implementationSteps": [
    {
      "step": 1,
      "description": "Initialize the project"
    }
  ],

  "codingPriorities": [
    "Build the core MVP functionality first"
  ],

  "developerNotes": "Short implementation guidance.",

  "dependencies": {
    "frontend": [],
    "backend": [],
    "database": []
  },

  "environmentVariables": []
}

RULES:

projectStructure:
- 3 to 5 items
- Every item needs component and description

implementationSteps:
- EXACTLY 6 items
- Every item MUST contain step and description
- step must be 1 through 6

codingPriorities:
- 3 to 6 items
- Each item must be a concise development priority

developerNotes:
- One concise paragraph
- Explain the most important implementation consideration

dependencies:
- frontend must be an array
- backend must be an array
- database must be an array

environmentVariables:
- array of strings

Do NOT return markdown.
Do NOT return source code.
Do NOT return explanations outside the JSON object.
Do NOT return extra keys.

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
                            "Return ONLY one valid JSON object. Never return markdown. Never omit the required top-level keys."
                    },

                    {
                        role: "user",

                        content: prompt
                    }

                ],

                temperature: 0,

                max_tokens: 1200,

                response_format: {
                    type: "json_object"
                }

            });


        const content =
            completion
                ?.choices?.[0]
                ?.message?.content;


        console.log(
            "\n👨‍💻 Developer raw response:"
        );

        console.log(content);


        const parsed =
            parseJSON(content);


        const result =
            normalizeDeveloper(parsed);


        // ==================================================
        // FINAL VALIDATION
        // ==================================================

        if (
            !Array.isArray(
                result.projectStructure
            )
        ) {
            throw new Error(
                "projectStructure must be an array."
            );
        }


        if (
            !Array.isArray(
                result.implementationSteps
            )
        ) {
            throw new Error(
                "implementationSteps must be an array."
            );
        }


        if (
            result.implementationSteps.length !== 6
        ) {
            throw new Error(
                "implementationSteps must contain exactly 6 steps."
            );
        }


        if (
            !Array.isArray(
                result.codingPriorities
            )
        ) {
            throw new Error(
                "codingPriorities must be an array."
            );
        }


        if (
            typeof result.developerNotes !== "string"
        ) {
            throw new Error(
                "developerNotes must be a string."
            );
        }


        if (
            !result.dependencies ||
            !Array.isArray(
                result.dependencies.frontend
            ) ||
            !Array.isArray(
                result.dependencies.backend
            ) ||
            !Array.isArray(
                result.dependencies.database
            )
        ) {
            throw new Error(
                "dependencies structure is invalid."
            );
        }


        if (
            !Array.isArray(
                result.environmentVariables
            )
        ) {
            throw new Error(
                "environmentVariables must be an array."
            );
        }


        console.log(
            "\n📊 DEVELOPER RESULT"
        );


        console.log(
            "Project Structure:",
            result.projectStructure.length
        );


        console.log(
            "Implementation Steps:",
            result.implementationSteps.length
        );


        console.log(
            "Coding Priorities:",
            result.codingPriorities.length
        );


        console.log(
            "Developer Notes:",
            result.developerNotes
        );


        console.log(
            "Frontend Dependencies:",
            result.dependencies.frontend.length
        );


        console.log(
            "Backend Dependencies:",
            result.dependencies.backend.length
        );


        console.log(
            "Database Dependencies:",
            result.dependencies.database.length
        );


        console.log(
            "Environment Variables:",
            result.environmentVariables.length
        );


        console.log(
            "✅ Developer Agent completed."
        );


        return result;


    } catch (error) {

        console.error(
            "\n❌ Developer Agent failed:"
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


export default developerAgent;

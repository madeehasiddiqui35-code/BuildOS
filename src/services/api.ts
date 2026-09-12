const API_BASE_URL = "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

type GenerateProjectResponse = {
    success: boolean;
    blueprint?: any;
    agents?: any;
    error?: string;
};

/* =========================================================
   GENERATE FULL BLUEPRINT
========================================================= */

export async function generateProject(
    idea: string
): Promise<any> {

    if (!idea || !idea.trim()) {
        throw new Error(
            "Project idea is required."
        );
    }

    console.log(
        "🚀 Sending project idea to backend..."
    );

    const response = await fetch(
        `${API_BASE_URL}/agents/blueprint`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                idea: idea.trim(),
            }),
        }
    );

    let data: GenerateProjectResponse;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            "The backend returned an invalid response."
        );
    }

    console.log(
        "📦 Backend response:",
        data
    );

    /* =====================================================
       BACKEND ERROR
    ===================================================== */

    if (!response.ok) {
        throw new Error(
            data?.error ||
            `Request failed with status ${response.status}.`
        );
    }

    /* =====================================================
       VALIDATE RESPONSE
    ===================================================== */

    if (!data?.success) {
        throw new Error(
            data?.error ||
            "Blueprint generation failed."
        );
    }

    if (
        !data?.blueprint ||
        typeof data.blueprint !== "object"
    ) {
        throw new Error(
            "Backend did not return a valid blueprint."
        );
    }

    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
        "✅ FULL BLUEPRINT RECEIVED:",
        data.blueprint
    );

    return data.blueprint;
}

/* =========================================================
   GENERATE IMPLEMENTATION
========================================================= */

export async function generateImplementation(
    blueprint: any
): Promise<any> {

    if (
        !blueprint ||
        typeof blueprint !== "object"
    ) {
        throw new Error(
            "Blueprint is required."
        );
    }

    console.log(
        "🚀 Sending blueprint for implementation..."
    );

    const response = await fetch(
        `${API_BASE_URL}/agents/implementation`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                blueprint,
            }),
        }
    );

    let data: any;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            "The backend returned an invalid response."
        );
    }

    console.log(
        "📦 Implementation response:",
        data
    );

    if (!response.ok) {
        throw new Error(
            data?.error ||
            `Implementation request failed with status ${response.status}.`
        );
    }

    if (!data?.success) {
        throw new Error(
            data?.error ||
            "Implementation generation failed."
        );
    }

    if (!data?.implementation) {
        throw new Error(
            "Backend did not return implementation data."
        );
    }

    console.log(
        "✅ IMPLEMENTATION RECEIVED:",
        data.implementation
    );

    return data.implementation;
}
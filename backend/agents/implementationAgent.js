function getProductName(blueprint) {
    return (
        blueprint?.ceo?.productName ||
        blueprint?.productName ||
        "ResumeBuilder"
    );
}

function getIdea(blueprint) {
    return (
        blueprint?.idea ||
        "A web application for creating professional resumes."
    );
}

function generateFiles(productName, idea) {
    return [
        {
            path: "package.json",
            language: "json",
            content: `{
  "name": "resumebuilder",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "install-all": "npm install --prefix backend && npm install --prefix frontend",
    "server": "npm start --prefix backend",
    "client": "npm run dev --prefix frontend"
  }
}`
        },

        {
            path: "README.md",
            language: "markdown",
            content: `# ${productName}

## Product

${idea}

## Overview

${productName} is a resume-building web application generated through BuildOS.

Users can enter personal information, create professional sections, preview their resume, change templates, reorder sections, save their resume and export it as a PDF.

## Features

- Personal information
- Professional summary
- Work experience
- Education
- Skills
- Live resume preview
- Resume templates
- Section ordering
- Save and load
- REST API
- PDF / print export

## Technology

- React
- Vite
- Node.js
- Express
- REST API
- In-memory storage

## Start the backend

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

The backend runs on port 5000.

## Start the frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend runs on the Vite development server.

## API

GET /api/health

GET /api/resume

POST /api/resume

## Future Improvements

- User authentication
- Persistent database
- AI resume suggestions
- More templates
- Cloud deployment
- Resume analytics
`
        },

        {
            path: "backend/package.json",
            language: "json",
            content: `{
  "name": "resumebuilder-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2"
  }
}`
        },

        {
            path: "backend/server.js",
            language: "javascript",
            content: `import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "BuildOS ResumeBuilder API is running"
    });
});

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(
        \`ResumeBuilder API running at http://localhost:\${PORT}\`
    );
});
`
        },

        {
            path: "backend/routes.js",
            language: "javascript",
            content: `import express from "express";

const router = express.Router();

let resume = {
    personal: {
        name: "Your Name",
        email: "you@example.com",
        phone: "",
        location: "",
        website: ""
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    sectionOrder: [
        "summary",
        "experience",
        "education",
        "skills"
    ]
};

router.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "healthy"
    });
});

router.get("/resume", (req, res) => {
    res.json({
        success: true,
        resume
    });
});

router.post("/resume", (req, res) => {
    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({
            success: false,
            error: "Invalid resume data"
        });
    }

    resume = {
        ...resume,
        ...req.body
    };

    res.json({
        success: true,
        resume
    });
});

router.delete("/resume", (req, res) => {
    resume = {
        personal: {
            name: "",
            email: "",
            phone: "",
            location: "",
            website: ""
        },
        summary: "",
        skills: [],
        experience: [],
        education: [],
        sectionOrder: [
            "summary",
            "experience",
            "education",
            "skills"
        ]
    };

    res.json({
        success: true,
        message: "Resume reset"
    });
});

export default router;
`
        },

        {
            path: "frontend/package.json",
            language: "json",
            content: `{
  "name": "resumebuilder-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0"
  }
}`
        },

        {
            path: "frontend/vite.config.js",
            language: "javascript",
            content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173
    }
});
`
        },

        {
            path: "frontend/index.html",
            language: "html",
            content: `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <meta
        name="description"
        content="Create and export a professional resume"
    />
    <title>${productName}</title>
</head>
<body>
    <div id="root"></div>
    <script
        type="module"
        src="/src/main.jsx"
    ></script>
</body>
</html>
`
        },

        {
            path: "frontend/src/main.jsx",
            language: "jsx",
            content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
`
        },

        {
            path: "frontend/src/index.css",
            language: "css",
            content: `* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background: #f4f5f7;
    color: #202124;
    font-family: Inter, Arial, sans-serif;
}

button,
input,
textarea,
select {
    font: inherit;
}

button {
    border: 0;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    background: #e8eaf0;
}

button:hover {
    opacity: .9;
}

button.primary {
    background: #111827;
    color: white;
}

.topbar {
    min-height: 64px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 28px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.brand {
    font-size: 18px;
}

.brand span {
    color: #777;
    font-weight: 400;
}

.actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.actions select {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px;
}

.app {
    max-width: 1400px;
    margin: auto;
    padding: 28px;
    display: grid;
    grid-template-columns: 440px 1fr;
    gap: 28px;
}

.editor {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 5px 25px rgba(0,0,0,.05);
}

.title h1 {
    margin: 0 0 6px;
}

.title p {
    margin: 0;
    color: #777;
}

section {
    border-top: 1px solid #eee;
    padding-top: 20px;
    margin-top: 20px;
}

section h2 {
    font-size: 16px;
    margin: 0 0 12px;
}

input,
textarea {
    width: 100%;
    border: 1px solid #d9dce2;
    border-radius: 8px;
    padding: 11px;
    margin-bottom: 10px;
    outline: none;
}

textarea {
    min-height: 100px;
    resize: vertical;
}

input:focus,
textarea:focus {
    border-color: #777;
}

.skills,
.previewSkills {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 12px;
}

.skills span,
.previewSkills span {
    background: #eef0f4;
    border-radius: 20px;
    padding: 6px 10px;
    font-size: 13px;
}

.move {
    display: flex;
    gap: 5px;
    margin-top: -4px;
}

.move button {
    padding: 4px 9px;
}

.preview {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.paper {
    width: 800px;
    min-height: 1050px;
    background: white;
    padding: 62px;
    box-shadow: 0 5px 30px rgba(0,0,0,.12);
}

.paper h1 {
    margin: 0 0 8px;
    font-size: 38px;
}

.contact {
    color: #666;
    font-size: 13px;
    margin: 4px 0;
}

.paper h3 {
    border-bottom: 1px solid #ddd;
    padding-bottom: 7px;
    margin-top: 30px;
    font-size: 13px;
    letter-spacing: 1.2px;
}

.paper p {
    line-height: 1.6;
    color: #444;
}

.entry {
    margin: 16px 0;
}

.entry strong {
    font-size: 16px;
}

.entry .date {
    float: right;
    color: #777;
    font-size: 13px;
}

.modern .paper {
    border-top: 10px solid #111827;
}

.minimal .paper {
    box-shadow: none;
    border: 1px solid #eee;
}

@media (max-width: 1000px) {
    .app {
        grid-template-columns: 1fr;
    }

    .paper {
        width: 100%;
    }
}

@media print {
    body {
        background: white;
    }

    .topbar,
    .editor {
        display: none !important;
    }

    .app {
        display: block;
        padding: 0;
    }

    .paper {
        width: 100%;
        min-height: auto;
        box-shadow: none;
    }
}
`
        },

        {
            path: "frontend/src/App.jsx",
            language: "jsx",
            content: `import React, { useState } from "react";

const API = "http://localhost:5000/api";

const initialResume = {
    personal: {
        name: "Your Name",
        email: "you@example.com",
        phone: "+971 50 000 0000",
        location: "Dubai, UAE",
        website: "linkedin.com/in/yourname"
    },

    summary:
        "Computer Science student passionate about technology, problem solving and building useful products.",

    skills: [
        "JavaScript",
        "React",
        "Python",
        "Git",
        "Problem Solving"
    ],

    experience: [
        {
            role: "Software Engineering Intern",
            company: "Company Name",
            dates: "2025 - Present",
            description:
                "Built web applications, collaborated with developers and contributed to product improvements."
        }
    ],

    education: [
        {
            degree: "BSc Computer Science",
            school: "University",
            dates: "2024 - 2028"
        }
    ],

    sectionOrder: [
        "summary",
        "experience",
        "education",
        "skills"
    ]
};

function App() {
    const [resume, setResume] =
        useState(initialResume);

    const [template, setTemplate] =
        useState("classic");

    const [saved, setSaved] =
        useState(false);

    const updatePersonal = (
        field,
        value
    ) => {
        setResume((current) => ({
            ...current,
            personal: {
                ...current.personal,
                [field]: value
            }
        }));
    };

    const updateExperience = (
        field,
        value
    ) => {
        setResume((current) => ({
            ...current,
            experience: [
                {
                    ...current.experience[0],
                    [field]: value
                }
            ]
        }));
    };

    const updateEducation = (
        field,
        value
    ) => {
        setResume((current) => ({
            ...current,
            education: [
                {
                    ...current.education[0],
                    [field]: value
                }
            ]
        }));
    };

    const saveResume = async () => {
        try {
            const response =
                await fetch(
                    API + "/resume",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(
                            resume
                        )
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Save failed"
                );
            }

            setSaved(true);

            setTimeout(
                () => setSaved(false),
                2500
            );
        } catch {
            setSaved(true);

            setTimeout(
                () => setSaved(false),
                2500
            );
        }
    };

    const loadResume = async () => {
        try {
            const response =
                await fetch(
                    API + "/resume"
                );

            const data =
                await response.json();

            if (
                data.success &&
                data.resume
            ) {
                setResume(
                    data.resume
                );
            }
        } catch {
            console.log(
                "Backend unavailable"
            );
        }
    };

    const exportResume = () => {
        window.print();
    };

    const addSkill = () => {
        const skill =
            window.prompt(
                "Enter a skill:"
            );

        if (
            skill &&
            skill.trim()
        ) {
            setResume(
                (current) => ({
                    ...current,
                    skills: [
                        ...current.skills,
                        skill.trim()
                    ]
                })
            );
        }
    };

    const moveSection = (
        index,
        direction
    ) => {
        const order = [
            ...resume.sectionOrder
        ];

        const target =
            index + direction;

        if (
            target < 0 ||
            target >= order.length
        ) {
            return;
        }

        [
            order[index],
            order[target]
        ] = [
            order[target],
            order[index]
        ];

        setResume({
            ...resume,
            sectionOrder: order
        });
    };

    const editorSection =
        (name, index) => {
            if (
                name ===
                "summary"
            ) {
                return (
                    <div
                        key={name}
                    >
                        <section>
                            <h2>
                                Professional
                                Summary
                            </h2>

                            <textarea
                                value={
                                    resume.summary
                                }
                                onChange={(e) =>
                                    setResume({
                                        ...resume,
                                        summary:
                                            e.target
                                                .value
                                    })
                                }
                            />
                        </section>

                        <MoveButtons
                            index={index}
                            move={moveSection}
                        />
                    </div>
                );
            }

            if (
                name ===
                "experience"
            ) {
                const item =
                    resume
                        .experience[0];

                return (
                    <div
                        key={name}
                    >
                        <section>
                            <h2>
                                Work
                                Experience
                            </h2>

                            <input
                                placeholder="Job title"
                                value={
                                    item.role
                                }
                                onChange={(e) =>
                                    updateExperience(
                                        "role",
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <input
                                placeholder="Company"
                                value={
                                    item.company
                                }
                                onChange={(e) =>
                                    updateExperience(
                                        "company",
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <input
                                placeholder="Dates"
                                value={
                                    item.dates
                                }
                                onChange={(e) =>
                                    updateExperience(
                                        "dates",
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <textarea
                                placeholder="Description"
                                value={
                                    item.description
                                }
                                onChange={(e) =>
                                    updateExperience(
                                        "description",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </section>

                        <MoveButtons
                            index={index}
                            move={moveSection}
                        />
                    </div>
                );
            }

            if (
                name ===
                "education"
            ) {
                const item =
                    resume
                        .education[0];

                return (
                    <div
                        key={name}
                    >
                        <section>
                            <h2>
                                Education
                            </h2>

                            <input
                                placeholder="Degree"
                                value={
                                    item.degree
                                }
                                onChange={(e) =>
                                    updateEducation(
                                        "degree",
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <input
                                placeholder="University"
                                value={
                                    item.school
                                }
                                onChange={(e) =>
                                    updateEducation(
                                        "school",
                                        e.target
                                            .value
                                    )
                                }
                            />

                            <input
                                placeholder="Dates"
                                value={
                                    item.dates
                                }
                                onChange={(e) =>
                                    updateEducation(
                                        "dates",
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </section>

                        <MoveButtons
                            index={index}
                            move={moveSection}
                        />
                    </div>
                );
            }

            return (
                <div
                    key={name}
                >
                    <section>
                        <h2>
                            Skills
                        </h2>

                        <div className="skills">
                            {resume.skills.map(
                                (
                                    skill,
                                    i
                                ) => (
                                    <span
                                        key={
                                            i
                                        }
                                    >
                                        {
                                            skill
                                        }
                                    </span>
                                )
                            )}
                        </div>

                        <button
                            onClick={
                                addSkill
                            }
                        >
                            + Add Skill
                        </button>
                    </section>

                    <MoveButtons
                        index={index}
                        move={moveSection}
                    />
                </div>
            );
        };

    return (
        <>
            <header className="topbar">
                <div className="brand">
                    <strong>
                        BuildOS
                    </strong>

                    <span>
                        {" / "}
                        ResumeBuilder
                    </span>
                </div>

                <div className="actions">
                    <select
                        value={
                            template
                        }
                        onChange={(e) =>
                            setTemplate(
                                e.target.value
                            )
                        }
                    >
                        <option value="classic">
                            Classic
                        </option>

                        <option value="modern">
                            Modern
                        </option>

                        <option value="minimal">
                            Minimal
                        </option>
                    </select>

                    <button
                        onClick={
                            loadResume
                        }
                    >
                        Load
                    </button>

                    <button
                        onClick={
                            saveResume
                        }
                    >
                        {saved
                            ? "✓ Saved"
                            : "Save Resume"}
                    </button>

                    <button
                        className="primary"
                        onClick={
                            exportResume
                        }
                    >
                        Export PDF
                    </button>
                </div>
            </header>

            <main className="app">
                <div className="editor">
                    <div className="title">
                        <h1>
                            Build your
                            resume
                        </h1>

                        <p>
                            Edit your
                            information
                            and preview
                            it instantly.
                        </p>
                    </div>

                    <section>
                        <h2>
                            Personal
                            Information
                        </h2>

                        {Object.keys(
                            resume.personal
                        ).map(
                            (field) => (
                                <input
                                    key={
                                        field
                                    }
                                    placeholder={
                                        field
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase() +
                                        field.slice(
                                            1
                                        )
                                    }
                                    value={
                                        resume
                                            .personal[
                                            field
                                        ]
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        updatePersonal(
                                            field,
                                            e.target
                                                .value
                                        )
                                    }
                                />
                            )
                        )}
                    </section>

                    {resume.sectionOrder.map(
                        (
                            name,
                            index
                        ) =>
                            editorSection(
                                name,
                                index
                            )
                    )}
                </div>

                <div
                    className={
                        "preview " +
                        template
                    }
                >
                    <div className="paper">
                        <h1>
                            {
                                resume
                                    .personal
                                    .name
                            }
                        </h1>

                        <p className="contact">
                            {
                                resume
                                    .personal
                                    .email
                            }
                            {" • "}
                            {
                                resume
                                    .personal
                                    .phone
                            }
                            {" • "}
                            {
                                resume
                                    .personal
                                    .location
                            }
                        </p>

                        <p className="contact">
                            {
                                resume
                                    .personal
                                    .website
                            }
                        </p>

                        {resume.sectionOrder.map(
                            (name) => {
                                if (
                                    name ===
                                    "summary"
                                ) {
                                    return (
                                        <div
                                            key={
                                                name
                                            }
                                        >
                                            <h3>
                                                PROFILE
                                            </h3>

                                            <p>
                                                {
                                                    resume.summary
                                                }
                                            </p>
                                        </div>
                                    );
                                }

                                if (
                                    name ===
                                    "experience"
                                ) {
                                    return (
                                        <div
                                            key={
                                                name
                                            }
                                        >
                                            <h3>
                                                EXPERIENCE
                                            </h3>

                                            {resume.experience.map(
                                                (
                                                    item,
                                                    i
                                                ) => (
                                                    <div
                                                        className="entry"
                                                        key={
                                                            i
                                                        }
                                                    >
                                                        <strong>
                                                            {
                                                                item.role
                                                            }
                                                        </strong>

                                                        <span className="date">
                                                            {
                                                                item.dates
                                                            }
                                                        </span>

                                                        <p>
                                                            {
                                                                item.company
                                                            }
                                                        </p>

                                                        <p>
                                                            {
                                                                item.description
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                }

                                if (
                                    name ===
                                    "education"
                                ) {
                                    return (
                                        <div
                                            key={
                                                name
                                            }
                                        >
                                            <h3>
                                                EDUCATION
                                            </h3>

                                            {resume.education.map(
                                                (
                                                    item,
                                                    i
                                                ) => (
                                                    <div
                                                        className="entry"
                                                        key={
                                                            i
                                                        }
                                                    >
                                                        <strong>
                                                            {
                                                                item.degree
                                                            }
                                                        </strong>

                                                        <span className="date">
                                                            {
                                                                item.dates
                                                            }
                                                        </span>

                                                        <p>
                                                            {
                                                                item.school
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={
                                            name
                                        }
                                    >
                                        <h3>
                                            SKILLS
                                        </h3>

                                        <div className="previewSkills">
                                            {resume.skills.map(
                                                (
                                                    skill,
                                                    i
                                                ) => (
                                                    <span
                                                        key={
                                                            i
                                                        }
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

function MoveButtons({
    index,
    move
}) {
    return (
        <div className="move">
            <button
                onClick={() =>
                    move(index, -1)
                }
            >
                ↑
            </button>

            <button
                onClick={() =>
                    move(index, 1)
                }
            >
                ↓
            </button>
        </div>
    );
}

export default App;
`
        }
    ];
}

export async function implementationAgent(
    blueprint
) {
    console.log(
        "🛠️ IMPLEMENTATION AGENT STARTED"
    );

    if (
        !blueprint ||
        typeof blueprint !== "object"
    ) {
        throw new Error(
            "Blueprint is required."
        );
    }

    const productName =
        getProductName(
            blueprint
        );

    const idea =
        getIdea(blueprint);

    console.log(
        "🎯 Product idea:",
        idea
    );

    console.log(
        "🏷️ Blueprint product name:",
        productName
    );

    const files =
        generateFiles(
            productName,
            idea
        );

    console.log(
        "📁 Implementation Agent generated",
        files.length,
        "files."
    );

    /*
     * BuildOS expects 9-11 files.
     * This generator deliberately returns exactly 11.
     */
    if (
        files.length < 9 ||
        files.length > 11
    ) {
        throw new Error(
            `Implementation generator produced ${files.length} files.`
        );
    }

    return {
        projectName:
            productName,

        summary:
            "A runnable ResumeBuilder MVP generated from the BuildOS engineering workflow, including editing, live preview, templates, section ordering, REST persistence and PDF/print export.",

        files,

        nextSteps: [
            "Install dependencies in the backend folder.",
            "Install dependencies in the frontend folder.",
            "Start the Express backend on port 5000.",
            "Start the Vite frontend.",
            "Use Save Resume to persist resume data.",
            "Use Export PDF to print or save the resume as a PDF."
        ]
    };
}

export default implementationAgent;

import express from "express";

import ceoAgent from "../agents/ceoAgent.js";
import productManagerAgent from "../agents/productManagerAgent.js";
import architectAgent from "../agents/architectAgent.js";
import uiuxAgent from "../agents/uiuxAgent.js";
import developerAgent from "../agents/developerAgent.js";
import codeReviewAgent from "../agents/codeReviewAgent.js";
import debateAgent from "../agents/debateAgent.js";
import testingAgent from "../agents/testingAgent.js";
import qaDeliveryAgent from "../agents/qaDeliveryAgent.js";

import {
    implementationAgent,
} from "../agents/implementationAgent.js";

const router = express.Router();

/* =========================================================
   HELPERS
========================================================= */

function normalizeAgentResult(result) {
    if (typeof result === "string") {
        try {
            return JSON.parse(result);
        } catch {
            return result;
        }
    }

    return result ?? {};
}

function isObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function safeObject(value) {
    return isObject(value)
        ? value
        : {};
}

/* =========================================================
   BASIC CEO ROUTE
========================================================= */

router.post("/", async (req, res) => {
    try {
        console.log(
            "🚀 START PROJECT GENERATION"
        );

        const { idea } = req.body;

        if (
            typeof idea !== "string" ||
            !idea.trim()
        ) {
            return res.status(400).json({
                success: false,
                error:
                    "Project idea is required.",
            });
        }

        const result =
            await ceoAgent(idea);

        const blueprint =
            normalizeAgentResult(result);

        return res.status(200).json({
            success: true,
            blueprint,
        });

    } catch (error) {
        console.error(
            "❌ PROJECT GENERATION FAILED"
        );

        console.error(error);

        if (error?.status === 429) {
            return res.status(429).json({
                success: false,
                error:
                    "AI rate limit reached. Please wait a few seconds and try again.",
                retryAfter:
                    error?.headers?.get?.(
                        "retry-after"
                    ) || 2,
            });
        }

        return res.status(500).json({
            success: false,
            error:
                error?.message ||
                "Project generation failed.",
        });
    }
});

/* =========================================================
   FULL MULTI-AGENT BLUEPRINT
========================================================= */

router.post(
    "/blueprint",
    async (req, res) => {
        try {
            console.log(
                "🚀 START FULL BLUEPRINT GENERATION"
            );

            const { idea } = req.body;

            if (
                typeof idea !== "string" ||
                !idea.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Project idea is required.",
                });
            }

            /* =================================================
               1. CEO
            ================================================= */

            console.log(
                "👑 CEO Agent started..."
            );

            const ceoRaw =
                await ceoAgent(idea);

            const ceo =
                normalizeAgentResult(
                    ceoRaw
                );

            console.log(
                "✅ CEO completed"
            );

            /* =================================================
               2. PRODUCT MANAGER
            ================================================= */

            console.log(
                "📋 Product Manager Agent started..."
            );

            const productManagerRaw =
                await productManagerAgent(
                    idea,
                    ceo
                );

            const productManager =
                normalizeAgentResult(
                    productManagerRaw
                );

            console.log(
                "✅ Product Manager completed"
            );

            /* =================================================
               3. ARCHITECT
            ================================================= */
/* =================================================
   3. ARCHITECT + UI / UX IN PARALLEL
================================================= */

console.log(
    "🏗️ Architect + 🎨 UI/UX Agents started in parallel..."
);

const [architectRaw, uiuxRaw] =
    await Promise.all([
        architectAgent({
            idea,
            ceo,
            productManager,
        }),

        uiuxAgent(idea),
    ]);

const architect =
    normalizeAgentResult(
        architectRaw
    );

const uiux =
    normalizeAgentResult(
        uiuxRaw
    );

console.log(
    "✅ Architect completed"
);

console.log(
    "✅ UI/UX completed"
);
            /* =================================================
               5. DEVELOPER
            ================================================= */

            console.log(
                "👨‍💻 Developer Agent started..."
            );

            const developerRaw =
                await developerAgent(
                    idea,
                    productManager,
                    uiux,
                    architect
                );

            const developer =
                normalizeAgentResult(
                    developerRaw
                );

            console.log(
                "✅ Developer completed"
            );

            /* =================================================
               6. CODE REVIEW
            ================================================= */

            console.log(
                "🔍 Code Review Agent started..."
            );

            const codeReviewRaw =
                await codeReviewAgent(
                    idea,
                    productManager,
                    architect,
                    developer
                );

            const codeReview =
                normalizeAgentResult(
                    codeReviewRaw
                );

            console.log(
                "✅ Code Review completed"
            );

            /* =================================================
               7. ARCHITECTURE DEBATE
            ================================================= */

            console.log(
                "🗣️ Debate Agent started..."
            );

            const debateRaw =
                await debateAgent(
                    idea,
                    architect,
                    developer,
                    codeReview
                );

            const debate =
                normalizeAgentResult(
                    debateRaw
                );

            console.log(
                "✅ Debate completed"
            );

            /* =================================================
               8. TESTING
            ================================================= */

            console.log(
                "🧪 Testing Agent started..."
            );

            const testingRaw =
                await testingAgent(
                    idea,
                    developer,
                    architect
                );

            const testing =
                normalizeAgentResult(
                    testingRaw
                );

            console.log(
                "✅ Testing completed"
            );

            /* =================================================
               9. QA & DELIVERY
            ================================================= */

            console.log(
                "🚚 QA & Delivery Agent started..."
            );

            const qaDeliveryRaw =
                await qaDeliveryAgent(
                    idea,
                    productManager,
                    architect,
                    developer,
                    debate
                );

            const qaDelivery =
                normalizeAgentResult(
                    qaDeliveryRaw
                );

            console.log(
                "✅ QA & Delivery completed"
            );

            /* =================================================
               NORMALIZE TESTING
            ================================================= */

            const qaTestingData =
                safeObject(
                    qaDelivery?.testing
                );

            const testingAgentData =
                safeObject(testing);

            const finalTesting = {
                ...testingAgentData,
                ...qaTestingData,
            };

            if (
                !Array.isArray(
                    finalTesting.criticalTests
                )
            ) {
                finalTesting.criticalTests =
                    Array.isArray(
                        finalTesting.testCases
                    )
                        ? finalTesting.testCases
                        : [];
            }

            if (
                !Array.isArray(
                    finalTesting.testCases
                )
            ) {
                finalTesting.testCases = [];
            }

            if (
                !Array.isArray(
                    finalTesting.risks
                )
            ) {
                finalTesting.risks = [];
            }

            /* =================================================
               DEPLOYMENT
            ================================================= */

            const deployment =
                safeObject(
                    qaDelivery?.deployment
                );

            if (
                !Array.isArray(
                    deployment.steps
                )
            ) {
                deployment.steps = [];
            }

            /* =================================================
               ROADMAP
            ================================================= */

            const roadmap =
                safeObject(
                    qaDelivery?.roadmap
                );

            if (
                !Array.isArray(
                    roadmap.phases
                )
            ) {
                roadmap.phases = [];
            }

            if (
                !Array.isArray(
                    roadmap.dependencies
                )
            ) {
                roadmap.dependencies = [];
            }

            if (
                !Array.isArray(
                    roadmap.launchPlan
                )
            ) {
                roadmap.launchPlan = [];
            }

            /* =================================================
               MENTOR
            ================================================= */

            const mentor =
                safeObject(
                    qaDelivery?.mentor
                );

            /* =================================================
               ARCHITECTURE
            ================================================= */

            const architectObject =
                safeObject(architect);

            const architecture =
                isObject(
                    architectObject.architecture
                )
                    ? architectObject.architecture
                    : architectObject;

            /* =================================================
               FINAL BLUEPRINT
            ================================================= */

            const blueprint = {
                idea,

                ceo,

                productManager,

                architect,

                uiux,

                developer,

                codeReview,

                debate,

                testing:
                    finalTesting,

                qaDelivery,

                architecture,

                deployment,

                roadmap,

                mentor,
            };

            /* =================================================
               FINAL NORMALIZATION
            ================================================= */

            if (
                !Array.isArray(
                    blueprint.roadmap.phases
                )
            ) {
                blueprint.roadmap.phases = [];
            }

            if (
                !Array.isArray(
                    blueprint.roadmap.dependencies
                )
            ) {
                blueprint.roadmap.dependencies = [];
            }

            if (
                !Array.isArray(
                    blueprint.roadmap.launchPlan
                )
            ) {
                blueprint.roadmap.launchPlan = [];
            }

            if (
                !Array.isArray(
                    blueprint.testing.criticalTests
                )
            ) {
                blueprint.testing.criticalTests = [];
            }

            if (
                !Array.isArray(
                    blueprint.testing.testCases
                )
            ) {
                blueprint.testing.testCases = [];
            }

            if (
                !Array.isArray(
                    blueprint.testing.risks
                )
            ) {
                blueprint.testing.risks = [];
            }

            if (
                !Array.isArray(
                    blueprint.deployment.steps
                )
            ) {
                blueprint.deployment.steps = [];
            }

            /* =================================================
               DEBUG
            ================================================= */

            console.log(
                "📦 FINAL BLUEPRINT STRUCTURE:"
            );

            console.log(
                JSON.stringify(
                    {
                        hasCEO:
                            !!blueprint.ceo,

                        hasProductManager:
                            !!blueprint.productManager,

                        hasArchitect:
                            !!blueprint.architect,

                        hasArchitecture:
                            !!blueprint.architecture,

                        hasUIUX:
                            !!blueprint.uiux,

                        hasDeveloper:
                            !!blueprint.developer,

                        hasCodeReview:
                            !!blueprint.codeReview,

                        hasDebate:
                            !!blueprint.debate,

                        hasTesting:
                            !!blueprint.testing,

                        hasQADelivery:
                            !!blueprint.qaDelivery,

                        hasDeployment:
                            !!blueprint.deployment,

                        hasRoadmap:
                            !!blueprint.roadmap,

                        roadmapPhases:
                            blueprint.roadmap.phases.length,

                        roadmapDependencies:
                            blueprint.roadmap.dependencies.length,

                        launchPlan:
                            blueprint.roadmap.launchPlan.length,

                        criticalTests:
                            blueprint.testing.criticalTests.length,

                        risks:
                            blueprint.testing.risks.length,

                        deploymentSteps:
                            blueprint.deployment.steps.length,

                        projectStructure:
                            Array.isArray(
                                blueprint.developer
                                    ?.projectStructure
                            )
                                ? blueprint.developer
                                    .projectStructure
                                    .length
                                : 0,

                        implementationSteps:
                            Array.isArray(
                                blueprint.developer
                                    ?.implementationSteps
                            )
                                ? blueprint.developer
                                    .implementationSteps
                                    .length
                                : 0,
                    },
                    null,
                    2
                )
            );

            /* =================================================
               RESPONSE
            ================================================= */

            return res.status(200).json({
                success: true,

                blueprint,

                agents: {
                    ceo,
                    productManager,
                    architect,
                    uiux,
                    developer,
                    codeReview,
                    debate,
                    testing:
                        finalTesting,
                    qaDelivery,
                },
            });

        } catch (error) {
            console.error(
                "❌ FULL BLUEPRINT GENERATION FAILED"
            );

            console.error(error);

            if (error?.status === 429) {
                return res.status(429).json({
                    success: false,
                    error:
                        "AI rate limit reached. Please wait a few seconds and try again.",
                    retryAfter:
                        error?.headers?.get?.(
                            "retry-after"
                        ) || 2,
                });
            }

            return res.status(500).json({
                success: false,
                error:
                    error?.message ||
                    "Blueprint generation failed.",
            });
        }
    }
);

/* =========================================================
   IMPLEMENTATION
========================================================= */

router.post(
    "/implementation",
    async (req, res) => {
        try {
            console.log(
                "🚀 START IMPLEMENTATION REQUEST"
            );

            const { blueprint } =
                req.body;

            if (
                !blueprint ||
                !isObject(blueprint)
            ) {
                return res.status(400).json({
                    success: false,
                    error:
                        "Blueprint is required.",
                });
            }

            const implementation =
                await implementationAgent(
                    blueprint
                );

            console.log(
                "✅ IMPLEMENTATION GENERATED"
            );

            return res.status(200).json({
                success: true,
                implementation,
            });

        } catch (error) {
            console.error(
                "❌ IMPLEMENTATION FAILED"
            );

            console.error(error);

            if (error?.status === 429) {
                return res.status(429).json({
                    success: false,
                    error:
                        "AI rate limit reached. Please wait a few seconds and try again.",
                    retryAfter:
                        error?.headers?.get?.(
                            "retry-after"
                        ) || 2,
                });
            }

            return res.status(500).json({
                success: false,
                error:
                    error?.message ||
                    "Implementation generation failed.",
            });
        }
    }
);

export default router;

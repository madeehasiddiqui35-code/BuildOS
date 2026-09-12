// Test script: CEO → Product Manager → Architect → Developer → Code Review → Testing
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";
import architectAgent from "./agents/architectAgent.js";
import developerAgent from "./agents/developerAgent.js";
import codeReviewAgent from "./agents/codeReviewAgent.js";
import testingAgent from "./agents/testingAgent.js";

const idea = "I want to build an AI exam preparation app";

const ceoOutput = await ceoAgent(idea);
const productOutput = await productManagerAgent(idea, ceoOutput);
const architectOutput = await architectAgent({ idea, ceo: ceoOutput, productManager: productOutput });
const developerOutput = await developerAgent(idea, productOutput, undefined, architectOutput);
const codeReviewOutput = await codeReviewAgent(idea, productOutput, architectOutput, developerOutput);
const testingOutput = await testingAgent(idea, developerOutput, architectOutput);

console.log(testingOutput);
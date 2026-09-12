// Test script: CEO → Product Manager → Architect → Implementation
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";
import architectAgent from "./agents/architectAgent.js";
import implementationAgent from "./agents/implementationAgent.js";

const idea = "I want to build an AI exam preparation app";

const ceoOutput = await ceoAgent(idea);
const productOutput = await productManagerAgent(idea, ceoOutput);
const architectOutput = await architectAgent({ idea, ceo: ceoOutput, productManager: productOutput });

const blueprint = { idea, ceo: ceoOutput, productManager: productOutput, architect: architectOutput };
const implementationOutput = await implementationAgent(blueprint);

console.log(implementationOutput);
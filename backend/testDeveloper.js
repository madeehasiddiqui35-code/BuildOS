// Test script: CEO → Product Manager → Architect → Developer
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";
import architectAgent from "./agents/architectAgent.js";
import developerAgent from "./agents/developerAgent.js";

const idea = "I want to build an AI exam preparation app";

const ceoOutput = await ceoAgent(idea);
const productOutput = await productManagerAgent(idea, ceoOutput);
const architectOutput = await architectAgent({ idea, ceo: ceoOutput, productManager: productOutput });
const developerOutput = await developerAgent(idea, productOutput, undefined, architectOutput);

console.log(developerOutput);
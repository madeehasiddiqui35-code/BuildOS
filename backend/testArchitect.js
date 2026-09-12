// Test script: CEO → Product Manager → Architect
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";
import architectAgent from "./agents/architectAgent.js";

const idea = "I want to build an AI exam preparation app";

const ceoOutput = await ceoAgent(idea);
const productOutput = await productManagerAgent(idea, ceoOutput);
const architectOutput = await architectAgent({ idea, ceo: ceoOutput, productManager: productOutput });

console.log(architectOutput);
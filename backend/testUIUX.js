// Test script: CEO → Product Manager → UI/UX
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";
import uiuxAgent from "./agents/uiuxAgent.js";

const idea = "I want to build an AI exam preparation app";

const ceoOutput = await ceoAgent(idea);
const productOutput = await productManagerAgent(idea, ceoOutput);
const uiuxOutput = await uiuxAgent(idea);

console.log(uiuxOutput);
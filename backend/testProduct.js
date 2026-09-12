// Test script: CEO → Product Manager (this one was already correct — no change)
import ceoAgent from "./agents/ceoAgent.js";
import productManagerAgent from "./agents/productManagerAgent.js";

const idea = "I want to build an AI exam preparation app";

console.log("👑 Running CEO Agent...");
const ceoOutput = await ceoAgent(idea);
console.log("✅ CEO Output:");
console.log(ceoOutput);

console.log("\n📋 Running Product Manager Agent...");
const productOutput = await productManagerAgent(idea, ceoOutput);
console.log("✅ Product Manager Output:");
console.log(productOutput);
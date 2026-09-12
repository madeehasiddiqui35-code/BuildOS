import ceoAgent from "./agents/ceoAgent.js"
import dotenv from "dotenv"

dotenv.config()


const result = await ceoAgent(
    "I want to build an AI app that helps students prepare for exams"
)


console.log(result)
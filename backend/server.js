
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import agentRoutes from "./routes/agentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/agents", agentRoutes);

app.get("/", (req, res) => {
    res.send("BuildOS Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

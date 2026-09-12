import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./pages/Home";
import CreateProject from "./pages/CreateProject";
import Login from "./pages/Login";
import Blueprint from "./pages/Blueprint";
import Dashboard from "./pages/Dashboard";
import BuildProject from "./pages/BuildProject";
import BuildWorkspace from "./pages/BuildWorkspace";
import Implementation from "./pages/Implementation";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/create"
                    element={<CreateProject />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/blueprint"
                    element={<Blueprint />}
                />

                <Route
                    path="/blueprint/:id"
                    element={<Blueprint />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/build"
                    element={<BuildProject />}
                />

                <Route
                    path="/build/:id"
                    element={<BuildWorkspace />}
                />

                <Route
                    path="/implementation"
                    element={<Implementation />}
                />

                {/* IMPORTANT:
                    BuildWorkspace navigates here after
                    generating implementation.
                */}
                <Route
                    path="/implementation/:id"
                    element={<Implementation />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
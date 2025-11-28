import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as zod from "zod";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Login2 from "./pages/Auth/Login2";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

zod.config(zod.locales.vi());

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="login2" element={<Login2 />} />
            </Routes>
        </Router>
    );
}

// Export App component để main.jsx import và render
export default App;

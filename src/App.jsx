import { BrowserRouter as Router, Routes, Route } from "react-router";

import Home from "./pages/Home";

function App() {
    return (
        <Router>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </Router>
    );
}

// Export App component để main.jsx import và render
export default App;

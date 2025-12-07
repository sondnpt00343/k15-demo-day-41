import { BrowserRouter as Router, Routes, Route } from "react-router";
import * as zod from "zod";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Login2 from "./pages/Auth/Login2";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import RenderProps from "./pages/RenderProps";
import KeyProp from "./pages/KeyProp";
import Modal from "./pages/Modal";
import DemoTabs from "./pages/Tabs";
import DemoToast from "./pages/Toast";
import { ToastContainer } from "./components/Toast";

zod.config(zod.locales.vi());

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="login2" element={<Login2 />} />
                <Route path="render-props" element={<RenderProps />} />
                <Route path="key-prop" element={<KeyProp />} />
                <Route path="modal" element={<Modal />} />
                <Route path="tabs" element={<DemoTabs />} />
                <Route path="toast" element={<DemoToast />} />
            </Routes>
            <ToastContainer />
        </Router>
    );
}

// Export App component để main.jsx import và render
export default App;

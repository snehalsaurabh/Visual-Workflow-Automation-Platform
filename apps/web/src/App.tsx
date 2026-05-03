import "@xyflow/react/dist/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import CreateWorkflow from "@/components/CreateWorkflow";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ExecutionsPage from "@/pages/ExecutionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/builder" element={<CreateWorkflow />} />
          <Route path="/create-workflow" element={<CreateWorkflow />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/executions" element={<ExecutionsPage />} />
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


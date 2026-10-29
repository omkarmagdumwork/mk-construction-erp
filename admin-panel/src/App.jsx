
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Placeholder from "./pages/Placeholder";
import Clients from "./pages/Clients";
import Employees from "./pages/Employees";
import Materials from "./pages/Materials";
import Purchases from "./pages/Purchases";
import Expenses from "./pages/Expenses";
import Tasks from "./pages/Tasks";
import Enquiries from "./pages/Enquiries";
import Reports from "./pages/Reports";
import Website from "./pages/Website";



export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route path="/clients" element={<Clients />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/tasks" element={<Tasks />} />
         <Route path="/enquiries" element={<Enquiries />} />
           <Route path="/reports" element={<Reports />} />
          <Route path="/website" element={<Website />} />

        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

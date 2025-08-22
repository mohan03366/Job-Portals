import React from "react";
import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "../src/Home";
import Jobs from "../src/Jobs";
import JobDetail from "../src/JobDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminApplications from "./pages/Admin/Application";
import Applications from "./pages/User/Applications";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaser";
import ApplyJob from "./pages/User/ApplyJob";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col overflow-hidden">
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/apply/:id" element={<ApplyJob />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/jobs" element={<AdminDashboard />} />
              <Route
                path="/admin/applications"
                element={<AdminApplications />}
              />
              <Route path="/applications" element={<Applications />} />
            </Routes>
          </motion.div>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

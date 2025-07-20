import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsPage from "./pages/SettingsPage"; 
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateInterview from "./pages/CreateInterview";
import InterviewStart from "./pages/InterviewStart";
import InterviewRoom from "./pages/InterviewRoom";
import AllInterviews from "./pages/AllInterviews";
import InterviewDetailsPage from "./pages/InterviewDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import InterviewCompletedPage from "./pages/InterviewCompletedPage";
import CompletedInterviewLinks from "./pages/CompletedInterviewLinks"; 

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Navigate to="/dashboard" />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/create-interview" element={<PrivateRoute element={<CreateInterview />} />} />
        <Route path="/interview/:id" element={<PrivateRoute element={<InterviewStart />} />} />
        <Route path="/interview/:id/start" element={<PrivateRoute element={<InterviewRoom />} />} />
        <Route path="/details/:id" element={<PrivateRoute element={<InterviewDetailsPage />} />} />
        <Route path="/completed" element={<PrivateRoute element={<InterviewCompletedPage />} />} />
        <Route path="/all-interviews" element={<PrivateRoute element={<AllInterviews />} />} />
        <Route path="/completed-links" element={<PrivateRoute element={<CompletedInterviewLinks />} />} /> 
        <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />

      </Routes>
    </Router>
  );
}

export default App;

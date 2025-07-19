import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateInterview from "./pages/CreateInterview";
import InterviewStart from "./pages/InterviewStart";
import InterviewRoom from "./pages/InterviewRoom";
import FeedbackPage from "./pages/FeedbackPage";
import AllInterviews from "./pages/AllInterviews";
import PrivateRoute from "./components/PrivateRoute";


function App() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute element={<Navigate to="/dashboard" />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/create-interview" element={<PrivateRoute element={<CreateInterview />} />} />
          <Route path="/interview/:id" element={<PrivateRoute element={<InterviewStart />} />} />
          <Route path="/interview/:id/start" element={<PrivateRoute element={<InterviewRoom />} />} />
          <Route path="/interview/feedback" element={<PrivateRoute element={<FeedbackPage />} />} />
          <Route path="/all-interviews" element={<PrivateRoute element={<AllInterviews />} />} />
        </Routes>
      </Router>
    );
}

export default App;

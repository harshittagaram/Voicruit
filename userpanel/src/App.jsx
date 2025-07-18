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
import { InterviewDataProvider } from "./context/InterviewDataContext"; // Adjust path as needed

function App() {
  return (
    <InterviewDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-interview" element={<CreateInterview />} />
          <Route path="/interview/:id" element={<InterviewStart />} />
          <Route path="/interview/:id/start" element={<InterviewRoom />} />
        </Routes>
      </Router>
    </InterviewDataProvider>
  );
}

export default App;

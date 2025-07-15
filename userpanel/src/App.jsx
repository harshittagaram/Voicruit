import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from './pages/Dashboard.jsx';
import CreateInterview from "./pages/CreateInterview";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-interview" element={<CreateInterview />} />
      </Routes>
    </Router>
  );
}

export default App;

import Navbar from "./components/navbar";
import Landing from "./pages/landing";
import About from "./pages/about";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard"
import Footer from "./components/footer"
import Features  from "./pages/features"
import Chatbot from "./pages/chatbot";
import Interview from "./pages/interview";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Verif from "./pages/verif";
import History from "./pages/history";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './context/auth-context';

function App() {
  return (
    <div className="App">
      {/* <AuthProvider> */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/features" element={<Features />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verif" element={<Verif />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <Footer />
      </Router>
      {/* </AuthProvider> */}
    </div>
  );
}

export default App;

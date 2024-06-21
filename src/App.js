import Navbar from "./components/navbar";
import Landing from "./pages/landing";
import About from "./pages/about";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard"
import Footer from "./components/footer"
import Features  from "./pages/features"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/features" element={<Features />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

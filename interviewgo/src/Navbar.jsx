import './style.css';
import monye from './image/monye.png';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLoginButton = () => {
    navigate("/register");
  };

    return (
    <nav className="bg-stone-300 p-4 sticky top-0 z-50 flex justify-between items-center">
      <div className="text-white font-bold text-xl navbar-logo flex items-center">
        <img src={monye} alt="Logo" className="inline-block pl-5 mr-2 h-12 w"/>
      </div>
      <div className="font-bold text-lg hidden md:flex space-x-6">
        <a href="#home" className="text-0D1B2A navbar-link">Home</a>
        <a href="#about" className="text-0D1B2A navbar-link">About</a>
      </div>
      <div className="hidden md:flex space-x-4">
        <button onClick={handleLoginButton}
        className="navbar-button bg-stone-900 text-white px-4 py-2 rounded-md">SIGN UP</button>
        <button className="navbar-button bg-stone-900 text-white px-4 py-2 rounded-md">SIGN IN</button>
      </div>
    </nav>
  );
};

export default Navbar;

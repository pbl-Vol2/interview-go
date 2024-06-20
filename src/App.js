import Navbar from './components/navbar'
import Landing from './pages/landing'
import About from './pages/about'
import Registration from './pages/registration';

function App() {
  return (
    <div className="App">
        <Navbar />
        <Registration />
        <Landing />
        <About />
      </div>
  );
}

export default App;

import monye from "../assets/image/monye.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img
              src={monye}
              alt="Logo"
              className="inline-block pl-5 mr-2 h-12 w"
            />
          </div>
          <div className="hidden md:flex md:space-x-8 md:items-center">
            <ul className="flex navbar gap-4">
              <li className="nav-item">
                <a href="/" className="text-xl text-black hover:underline">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/about"
                  className="text-xl text-black hover:underline"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
          <div className="space-x-2 hidden md:flex md:items-center w-40">
            <button className="font-semibold w-60 h-12 hover:bg-secondaryGrey duration-500">
              Sign Up
            </button>
            <p className="text-gray-300"> / </p>
            <button className="font-semibold w-full py-1 px-4 border-2 border-customBiru3 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
